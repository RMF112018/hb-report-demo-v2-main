"use client"

import React, { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { useTour } from "@/context/tour-context"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { DashboardProvider, useDashboardContext } from "@/context/dashboard-context"
import { ITModuleNavigation } from "@/components/layout/ITModuleNavigation"
import { AppHeader } from "@/components/layout/app-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  Home,
  Activity,
  Users,
  AlertTriangle,
  Database,
  Monitor,
  Brain,
  Settings,
  RefreshCw,
  Download,
  Plus,
  FileText,
  Eye,
  Zap,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Mail,
  Package,
  UserCheck,
  Key,
  Server,
  Wifi,
  HardDrive,
  Cpu,
  MemoryStick,
  ArrowRight,
} from "lucide-react"
import type { DashboardCard } from "@/types/dashboard"

/**
 * IT Command Center Page with Module-Based Sidebar Layout
 * -------------------------------------------------------
 * Central hub for IT operations and system monitoring
 * Features:
 * - Module-based navigation aligned with dashboard pattern
 * - Left sidebar with IT-specific metrics and quick actions
 * - Right side with IT dashboard cards
 * - Consistent styling with colored left borders
 * - Real-time system health monitoring
 */

function ITCommandCenterContent({ user }: { user: any }) {
  const { dashboards, currentDashboardId, updateDashboard, loading } = useDashboardContext()
  const { startTour, isTourAvailable } = useTour()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [layoutDensity, setLayoutDensity] = useState<"compact" | "normal" | "spacious">("normal")
  const [isFullscreen, setIsFullscreen] = useState(false)

  const currentDashboard = dashboards.find((d) => d.id === currentDashboardId)

  // Mock IT system metrics
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

  // Recent IT activities
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
      icon: UserCheck,
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

  // Critical IT metrics for sidebar
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

  // Dashboard handlers
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

    // Optimized size mappings for IT dashboard cards
    const sizeToSpan = {
      compact: { cols: 3, rows: 2 },
      small: { cols: 3, rows: 3 },
      medium: { cols: 4, rows: 3 },
      standard: { cols: 4, rows: 4 },
      large: { cols: 6, rows: 4 },
      wide: { cols: 8, rows: 3 },
      tall: { cols: 4, rows: 6 },
      "extra-wide": { cols: 12, rows: 3 },
      "extra-large": { cols: 6, rows: 6 },
    }

    // Get card type specific optimal sizing
    const getOptimalSizeForCardType = (cardType: string) => {
      switch (cardType) {
        case "hb-intel-management":
        case "infrastructure-monitor":
          return { cols: 6, rows: 4 }
        case "user-access-summary":
        case "siem-log-overview":
        case "endpoint-health":
          return { cols: 4, rows: 3 }
        case "system-logs":
        case "email-security-health":
        case "backup-restore-status":
          return { cols: 4, rows: 4 }
        case "asset-tracker":
          return { cols: 6, rows: 3 }
        case "ai-pipeline-status":
        case "consultant-dashboard":
          return { cols: 3, rows: 3 }
        case "change-governance-panel":
          return { cols: 12, rows: 3 }
        default:
          return { cols: 4, rows: 3 }
      }
    }

    const card = currentDashboard.cards.find((c) => c.id === cardId)
    let newSpan = sizeToSpan[size as keyof typeof sizeToSpan]

    // If size is "optimal", use card type specific sizing
    if (size === "optimal" && card) {
      newSpan = getOptimalSizeForCardType(card.type)
    }

    // Fallback to medium if no span found
    if (!newSpan) {
      newSpan = { cols: 4, rows: 3 }
    }

    const updatedCards = currentDashboard.cards.map((card) =>
      card.id === cardId
        ? {
            ...card,
            size: size as any,
            span: newSpan,
          }
        : card
    )

    updateDashboard({
      ...currentDashboard,
      cards: updatedCards,
    })
  }

  const handleCardAdd = () => {
    if (!currentDashboard) return

    // Find the next available position for the new card
    const findNextPosition = () => {
      let maxY = 0
      currentDashboard.cards.forEach((card) => {
        if (card.position && card.span) {
          maxY = Math.max(maxY, card.position.y + card.span.rows)
        }
      })
      return { x: 0, y: maxY }
    }

    const newCard: DashboardCard = {
      id: `it-card-${Date.now()}`,
      type: "placeholder",
      title: "New IT Widget",
      size: "medium",
      position: findNextPosition(),
      span: { cols: 4, rows: 3 }, // Optimized default size
      visible: true,
    }
    updateDashboard({
      ...currentDashboard,
      cards: [...currentDashboard.cards, newCard],
    })
  }

  const handleSave = () => {
    console.log("Saving IT dashboard changes...")
    setIsEditing(false)
  }

  const handleReset = () => {
    console.log("Reset functionality not implemented for IT Command Center")
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
      case "operational":
      case "compliant":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "critical":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getActivityColor = (color: string) => {
    const colors = {
      green: "bg-green-100 dark:bg-green-900/20 text-green-600",
      blue: "bg-blue-100 dark:bg-blue-900/20 text-blue-600",
      purple: "bg-purple-100 dark:bg-purple-900/20 text-purple-600",
      yellow: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600",
      red: "bg-red-100 dark:bg-red-900/20 text-red-600",
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  if (loading) {
    return (
      <>
        <AppHeader />
        <div className="fixed inset-0 top-[80px] flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
          <div className="flex flex-col items-center justify-center text-center p-8 bg-background/95 rounded-lg shadow-lg border border-border">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-foreground font-medium">Loading IT Command Center...</p>
            <p className="text-muted-foreground text-sm mt-1">Please wait while we prepare your dashboard</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <AppHeader />
      <div className="space-y-3 p-6">
        {/* Breadcrumb Navigation */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="flex items-center gap-1">
                <Home className="h-3 w-3" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>IT Command Center</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header Section - Made Sticky */}
        <div className="sticky top-20 z-40 bg-white dark:bg-gray-950 border-b border-border/40 -mx-6 px-6 pb-4 backdrop-blur-sm">
          <div className="flex flex-col gap-4 pt-3" data-tour="it-command-center-header">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-950/30 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">IT Command Center</h1>
                  <p className="text-muted-foreground mt-1">
                    System monitoring, security oversight, and infrastructure management
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                    All Systems Operational
                  </span>
                </div>
                <Button variant="outline" onClick={toggleFullscreen} data-tour="it-fullscreen-button">
                  {isFullscreen ? <></> : <></>}
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Module Navigation Row */}
            <div
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              data-tour="it-module-navigation"
            >
              <ITModuleNavigation />

              {/* Edit Mode Controls */}
              {isEditing && (
                <div className="flex items-center gap-3" data-tour="it-edit-controls">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSave}
                    className="text-green-600 dark:text-green-400 border-green-300 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950"
                  >
                    Reset Layout
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCardAdd}
                    className="text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Widget
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content with Sidebar Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
          {/* Sidebar - Hidden on mobile, shown on xl+ */}
          <div
            className={`hidden xl:block xl:col-span-3 space-y-4 ${isFullscreen ? "opacity-20" : ""}`}
            data-tour="it-sidebar"
          >
            {/* System Overview */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  System Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Users</span>
                  <span className="font-semibold">{itSystemMetrics.totalUsers}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Active Users</span>
                  <span className="font-semibold text-green-600">{itSystemMetrics.activeUsers}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">System Uptime</span>
                  <span className="font-semibold text-green-600">{itSystemMetrics.systemUptime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Managed Devices</span>
                  <span className="font-semibold">
                    {itSystemMetrics.managedDevices}/{itSystemMetrics.totalDevices}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-green-600 dark:text-green-400" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => router.push("/it/command-center/management")}
                >
                  <Users className="h-4 w-4 mr-2" />
                  HB Intel Management
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => router.push("/it/command-center/infrastructure")}
                >
                  <Server className="h-4 w-4 mr-2" />
                  Infrastructure
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => router.push("/it/command-center/siem")}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  SIEM & Security
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => router.push("/it/command-center/backup")}
                >
                  <Database className="h-4 w-4 mr-2" />
                  Backup & Recovery
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => router.push("/it/command-center/assets")}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Asset Management
                </Button>
              </CardContent>
            </Card>

            {/* Critical Metrics */}
            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  Critical Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {criticalMetrics.map((metric, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{metric.label}</span>
                    <span className={`font-semibold ${getStatusColor(metric.status)}`}>{metric.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">CPU Usage</span>
                  <span className="font-semibold text-green-600">{itSystemMetrics.cpuUsage}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Memory Usage</span>
                  <span className="font-semibold text-yellow-600">{itSystemMetrics.memoryUsage}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Storage Used</span>
                  <span className="font-semibold">{itSystemMetrics.storageUsed}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Network Latency</span>
                  <span className="font-semibold text-green-600">{itSystemMetrics.networkLatency}</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentItActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`p-1 rounded ${getActivityColor(activity.color)}`}>
                      <activity.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content - IT Dashboard Cards */}
          <div className={`xl:col-span-9 ${isFullscreen ? "relative" : ""}`} data-tour="it-dashboard-content">
            {currentDashboard ? (
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
            ) : (
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6">
                <div className="text-center py-12">
                  <div className="mb-4">
                    <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-950/30 rounded-full flex items-center justify-center">
                      <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">IT Command Center</h2>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    No IT dashboard layout found. Please contact your administrator to configure the IT Command Center
                    dashboard.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fullscreen Dashboard Overlay */}
        {isFullscreen && (
          <div
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm animate-in fade-in-0 duration-300"
            style={{ top: "80px" }}
          >
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/40 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">IT Command Center - Fullscreen View</h2>
                  <p className="text-sm text-muted-foreground">
                    System monitoring, security oversight, and infrastructure management
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" onClick={toggleFullscreen} className="flex items-center gap-2">
                    Exit Fullscreen
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-6 overflow-auto" style={{ height: "calc(100vh - 80px - 80px)" }}>
              {currentDashboard && (
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
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default function ITCommandCenterPage() {
  const { user } = useAuth()

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
    <DashboardProvider userId={user.id} role={user.role}>
      <ITCommandCenterContent user={user} />
    </DashboardProvider>
  )
}
