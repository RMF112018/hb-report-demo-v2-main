"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Zap,
  CheckCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  Settings,
  ArrowUpRight,
  Activity,
  Database,
  Link,
  Shield,
  Users,
  Building2,
  Package,
  DollarSign,
  FileText,
  Calendar,
  TrendingUp,
  Eye,
  Download,
  Upload,
  WifiOff,
  Wifi,
} from "lucide-react"

interface ProcoreConnectionStatus {
  status: "connected" | "disconnected" | "error" | "syncing"
  lastSync: string
  apiVersion: string
  projectId: string
  projectName: string
  userPermissions: string[]
  syncStatistics: {
    totalRecords: number
    syncedRecords: number
    pendingRecords: number
    errorRecords: number
    lastSyncDuration: number
  }
  endpoints: {
    commitments: { status: "active" | "error"; lastSync: string; recordCount: number }
    vendors: { status: "active" | "error"; lastSync: string; recordCount: number }
    changeOrders: { status: "active" | "error"; lastSync: string; recordCount: number }
    invoices: { status: "active" | "error"; lastSync: string; recordCount: number }
  }
}

interface SyncActivity {
  id: string
  type: "sync" | "error" | "success" | "warning"
  endpoint: string
  message: string
  timestamp: string
  duration?: number
  recordsAffected?: number
}

interface ProcoreIntegrationPanelProps {
  projectId?: string
  onSyncTriggered?: () => void
  onViewInProcore?: () => void
  compactMode?: boolean
}

export function ProcoreIntegrationPanel({
  projectId,
  onSyncTriggered,
  onViewInProcore,
  compactMode = false,
}: ProcoreIntegrationPanelProps) {
  const [connectionStatus, setConnectionStatus] = useState<ProcoreConnectionStatus | null>(null)
  const [syncActivity, setSyncActivity] = useState<SyncActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [syncProgress, setSyncProgress] = useState(0)
  const [autoSync, setAutoSync] = useState(true)
  const [syncInterval, setSyncInterval] = useState("15")

  useEffect(() => {
    const timer = setTimeout(() => {
      // Mock Procore connection status
      const mockStatus: ProcoreConnectionStatus = {
        status: "connected",
        lastSync: "2024-12-20T10:30:00Z",
        apiVersion: "v1.0",
        projectId: projectId || "2525840",
        projectName: "Palm Beach Luxury Estate",
        userPermissions: ["read_commitments", "write_commitments", "read_vendors", "read_change_orders"],
        syncStatistics: {
          totalRecords: 156,
          syncedRecords: 148,
          pendingRecords: 6,
          errorRecords: 2,
          lastSyncDuration: 12.5,
        },
        endpoints: {
          commitments: { status: "active", lastSync: "2024-12-20T10:30:00Z", recordCount: 24 },
          vendors: { status: "active", lastSync: "2024-12-20T10:28:00Z", recordCount: 18 },
          changeOrders: { status: "active", lastSync: "2024-12-20T10:25:00Z", recordCount: 8 },
          invoices: { status: "error", lastSync: "2024-12-20T09:15:00Z", recordCount: 0 },
        },
      }

      const mockActivity: SyncActivity[] = [
        {
          id: "sync-001",
          type: "success",
          endpoint: "commitments",
          message: "Successfully synchronized 24 commitments",
          timestamp: "2024-12-20T10:30:00Z",
          duration: 8.2,
          recordsAffected: 24,
        },
        {
          id: "sync-002",
          type: "success",
          endpoint: "vendors",
          message: "Successfully synchronized 18 vendors",
          timestamp: "2024-12-20T10:28:00Z",
          duration: 3.1,
          recordsAffected: 18,
        },
        {
          id: "sync-003",
          type: "warning",
          endpoint: "changeOrders",
          message: "Synchronized 8 change orders with 2 warnings",
          timestamp: "2024-12-20T10:25:00Z",
          duration: 5.4,
          recordsAffected: 8,
        },
        {
          id: "sync-004",
          type: "error",
          endpoint: "invoices",
          message: "Failed to sync invoices - API endpoint unavailable",
          timestamp: "2024-12-20T09:15:00Z",
          duration: 1.2,
          recordsAffected: 0,
        },
      ]

      setConnectionStatus(mockStatus)
      setSyncActivity(mockActivity)
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [projectId])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) {
      return "Just now"
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { color: string; label: string; icon: React.ReactNode } } = {
      connected: {
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Connected",
        icon: <CheckCircle className="h-3 w-3" />,
      },
      disconnected: {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        label: "Disconnected",
        icon: <WifiOff className="h-3 w-3" />,
      },
      error: {
        color: "bg-red-100 text-red-800 border-red-200",
        label: "Error",
        icon: <AlertTriangle className="h-3 w-3" />,
      },
      syncing: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        label: "Syncing",
        icon: <RefreshCw className="h-3 w-3 animate-spin" />,
      },
    }
    const config = statusConfig[status] || statusConfig.disconnected
    return (
      <Badge variant="outline" className={config.color}>
        {config.icon}
        <span className="ml-1">{config.label}</span>
      </Badge>
    )
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "sync":
        return <RefreshCw className="h-4 w-4 text-blue-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getEndpointIcon = (endpoint: string) => {
    switch (endpoint) {
      case "commitments":
        return <Package className="h-4 w-4" />
      case "vendors":
        return <Users className="h-4 w-4" />
      case "changeOrders":
        return <FileText className="h-4 w-4" />
      case "invoices":
        return <DollarSign className="h-4 w-4" />
      default:
        return <Database className="h-4 w-4" />
    }
  }

  const handleManualSync = async () => {
    setSyncing(true)
    setSyncProgress(0)

    // Simulate sync progress
    const progressInterval = setInterval(() => {
      setSyncProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 10
      })
    }, 200)

    // Simulate sync completion
    await new Promise((resolve) => setTimeout(resolve, 2500))

    setSyncing(false)
    setSyncProgress(0)

    if (onSyncTriggered) onSyncTriggered()

    // Update last sync time
    if (connectionStatus) {
      setConnectionStatus({
        ...connectionStatus,
        lastSync: new Date().toISOString(),
        syncStatistics: {
          ...connectionStatus.syncStatistics,
          lastSyncDuration: 2.3,
        },
      })
    }
  }

  const getSyncHealthScore = () => {
    if (!connectionStatus) return 0
    const { syncedRecords, totalRecords } = connectionStatus.syncStatistics
    return Math.round((syncedRecords / totalRecords) * 100)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Connecting to Procore...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!connectionStatus) return null

  return (
    <div className="space-y-6">
      {/* Connection Status Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-[#FF6B35]" />
              Procore Integration
            </CardTitle>
            <div className="flex items-center gap-2">
              {getStatusBadge(connectionStatus.status)}
              <Button variant="outline" size="sm" onClick={() => window.open("https://app.procore.com", "_blank")}>
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Open Procore
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Connection Info */}
            <div className="space-y-3">
              <h4 className="font-medium">Connection Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Project:</span>
                  <span className="font-medium">{connectionStatus.projectName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Project ID:</span>
                  <span className="font-medium">{connectionStatus.projectId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">API Version:</span>
                  <span className="font-medium">{connectionStatus.apiVersion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Sync:</span>
                  <span className="font-medium">{formatDate(connectionStatus.lastSync)}</span>
                </div>
              </div>
            </div>

            {/* Sync Statistics */}
            <div className="space-y-3">
              <h4 className="font-medium">Sync Health</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Sync Score</span>
                  <span className="text-sm font-medium">{getSyncHealthScore()}%</span>
                </div>
                <Progress value={getSyncHealthScore()} className="h-2" />
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="font-medium text-green-700">{connectionStatus.syncStatistics.syncedRecords}</div>
                    <div className="text-green-600">Synced</div>
                  </div>
                  <div className="text-center p-2 bg-red-50 rounded">
                    <div className="font-medium text-red-700">{connectionStatus.syncStatistics.errorRecords}</div>
                    <div className="text-red-600">Errors</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sync Controls */}
            <div className="space-y-3">
              <h4 className="font-medium">Sync Controls</h4>
              <div className="space-y-3">
                <Button onClick={handleManualSync} disabled={syncing} className="w-full">
                  {syncing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Manual Sync
                    </>
                  )}
                </Button>

                {syncing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{syncProgress}%</span>
                    </div>
                    <Progress value={syncProgress} className="h-2" />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <label className="text-sm">Auto Sync</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={autoSync}
                      onChange={(e) => setAutoSync(e.target.checked)}
                      className="rounded"
                    />
                    <Select value={syncInterval} onValueChange={setSyncInterval}>
                      <SelectTrigger className="w-20 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5m</SelectItem>
                        <SelectItem value="15">15m</SelectItem>
                        <SelectItem value="30">30m</SelectItem>
                        <SelectItem value="60">1h</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Sync Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-[#FF6B35]" />
            Sync Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="endpoints" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
            </TabsList>

            <TabsContent value="endpoints" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(connectionStatus.endpoints).map(([endpoint, info]) => (
                  <Card key={endpoint}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getEndpointIcon(endpoint)}
                          <span className="font-medium capitalize">{endpoint}</span>
                        </div>
                        <Badge variant={info.status === "active" ? "default" : "destructive"}>{info.status}</Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Records:</span>
                          <span className="font-medium">{info.recordCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Sync:</span>
                          <span className="font-medium">{formatDate(info.lastSync)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <div className="space-y-3">
                {syncActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getEndpointIcon(activity.endpoint)}
                          <span className="font-medium capitalize">{activity.endpoint}</span>
                        </div>
                        <span className="text-xs text-gray-500">{formatDate(activity.timestamp)}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{activity.message}</p>
                      {activity.duration && (
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>Duration: {activity.duration}s</span>
                          {activity.recordsAffected !== undefined && <span>Records: {activity.recordsAffected}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="permissions" className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-medium">API Permissions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {connectionStatus.userPermissions.map((permission) => (
                    <div key={permission} className="flex items-center gap-2 p-2 border rounded">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{permission.replace(/_/g, " ").toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Your Procore integration has the necessary permissions to sync procurement data. If you need
                  additional permissions, contact your Procore administrator.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Error Alerts */}
      {connectionStatus.syncStatistics.errorRecords > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {connectionStatus.syncStatistics.errorRecords} records failed to sync. Check the activity log for details
            and retry synchronization.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
