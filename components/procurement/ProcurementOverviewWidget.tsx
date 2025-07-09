"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  Building2,
  Calendar,
  FileText,
  ArrowUpRight,
  Zap,
  RefreshCw,
  Eye,
  Plus,
} from "lucide-react"

interface ProcurementMetrics {
  totalValue: number
  activeRecords: number
  pendingApprovals: number
  completionRate: number
  averageCycleTime: number
  vendorCount: number
  complianceRate: number
  costSavings: number
  savingsPercent: number
  procoreSyncStatus: "synced" | "pending" | "error"
  lastSyncDate: string
}

interface RecentActivity {
  id: string
  type: "approval" | "execution" | "sync" | "completion" | "change_order"
  title: string
  description: string
  timestamp: string
  status: "success" | "warning" | "error" | "info"
  procoreId?: string
}

interface ProcurementOverviewWidgetProps {
  projectId?: string
  onViewAll?: () => void
  onSyncProcore?: () => void
  onNewRecord?: () => void
  compactMode?: boolean
}

export function ProcurementOverviewWidget({
  projectId,
  onViewAll,
  onSyncProcore,
  onNewRecord,
  compactMode = false,
}: ProcurementOverviewWidgetProps) {
  const [metrics, setMetrics] = useState<ProcurementMetrics | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      // Mock procurement metrics
      const mockMetrics: ProcurementMetrics = {
        totalValue: 12450000,
        activeRecords: 24,
        pendingApprovals: 8,
        completionRate: 68,
        averageCycleTime: 14,
        vendorCount: 18,
        complianceRate: 95,
        costSavings: 745000,
        savingsPercent: 6.4,
        procoreSyncStatus: "synced",
        lastSyncDate: "2024-12-20T10:30:00Z",
      }

      const mockActivity: RecentActivity[] = [
        {
          id: "act-001",
          type: "approval",
          title: "Structural Steel PO Approved",
          description: "ABC Steel Works - $2.65M commitment approved",
          timestamp: "2024-12-20T09:30:00Z",
          status: "success",
          procoreId: "PCR-2024-001",
        },
        {
          id: "act-002",
          type: "sync",
          title: "Procore Sync Completed",
          description: "12 commitments synchronized successfully",
          timestamp: "2024-12-20T08:45:00Z",
          status: "success",
        },
        {
          id: "act-003",
          type: "execution",
          title: "MEP Contract Executed",
          description: "Advanced MEP Solutions - Contract signed",
          timestamp: "2024-12-20T08:15:00Z",
          status: "info",
          procoreId: "PCR-2024-002",
        },
        {
          id: "act-004",
          type: "change_order",
          title: "Change Order #3 Submitted",
          description: "Concrete package - Additional reinforcement",
          timestamp: "2024-12-19T16:22:00Z",
          status: "warning",
          procoreId: "PCR-2024-003",
        },
        {
          id: "act-005",
          type: "completion",
          title: "Finishes Package Updated",
          description: "Progress updated to 85% complete",
          timestamp: "2024-12-19T14:30:00Z",
          status: "info",
          procoreId: "PCR-2024-004",
        },
      ]

      setMetrics(mockMetrics)
      setRecentActivity(mockActivity)
      setLoading(false)
    }, 600)

    return () => clearTimeout(timer)
  }, [projectId])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`
    } else if (diffInHours < 48) {
      return "1 day ago"
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      })
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "approval":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "execution":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "sync":
        return <Zap className="h-4 w-4 text-purple-500" />
      case "completion":
        return <Activity className="h-4 w-4 text-indigo-500" />
      case "change_order":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      default:
        return <Package className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "info":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSyncStatusBadge = (syncStatus: string) => {
    const syncConfig: { [key: string]: { color: string; label: string; icon: React.ReactNode } } = {
      synced: {
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Synced",
        icon: <CheckCircle className="h-3 w-3" />,
      },
      pending: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        label: "Pending",
        icon: <Clock className="h-3 w-3" />,
      },
      error: {
        color: "bg-red-100 text-red-800 border-red-200",
        label: "Error",
        icon: <AlertTriangle className="h-3 w-3" />,
      },
    }
    const config = syncConfig[syncStatus] || syncConfig.pending
    return (
      <Badge variant="outline" className={config.color}>
        {config.icon}
        <span className="ml-1">{config.label}</span>
      </Badge>
    )
  }

  const handleSync = async () => {
    setSyncing(true)
    // Simulate Procore sync
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setSyncing(false)
    if (onSyncProcore) onSyncProcore()
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!metrics) return null

  return (
    <div className="space-y-6">
      {/* Main Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Procurement Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-[#FF6B35]" />
              Procurement Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Value</p>
                  <p className="font-medium text-lg text-foreground">{formatCurrency(metrics.totalValue)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Active Records</p>
                  <p className="font-medium text-lg text-foreground">{metrics.activeRecords}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Pending Approvals</p>
                  <p className="font-medium text-lg text-foreground">{metrics.pendingApprovals}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Completion Rate</p>
                  <p className="font-medium text-lg text-foreground">{metrics.completionRate}%</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Overall Progress</span>
                  <span className="text-sm font-medium">{metrics.completionRate}%</span>
                </div>
                <Progress value={metrics.completionRate} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#FF6B35]" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Cost Savings</p>
                  <p className="font-medium text-lg text-green-600">{formatCurrency(metrics.costSavings)}</p>
                  <p className="text-xs text-green-600">{metrics.savingsPercent}% below budget</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Avg Cycle Time</p>
                  <p className="font-medium text-lg text-foreground">{metrics.averageCycleTime} days</p>
                  <p className="text-xs text-green-600">3 days faster than target</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Vendor Count</p>
                  <p className="font-medium text-lg text-foreground">{metrics.vendorCount}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Compliance Rate</p>
                  <p className="font-medium text-lg text-foreground">{metrics.complianceRate}%</p>
                </div>
              </div>

              {/* Compliance Progress */}
              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Compliance Status</span>
                  <span className="text-sm font-medium">{metrics.complianceRate}%</span>
                </div>
                <Progress value={metrics.complianceRate} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Procore Sync */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-[#FF6B35]" />
                Recent Activity
              </CardTitle>
              {onViewAll && (
                <Button variant="outline" size="sm" onClick={onViewAll}>
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.slice(0, compactMode ? 3 : 5).map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{activity.title}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{formatDate(activity.timestamp)}</span>
                        {activity.procoreId && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 px-2"
                            onClick={() =>
                              window.open(`https://app.procore.com/commitments/${activity.procoreId}`, "_blank")
                            }
                          >
                            <ArrowUpRight className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Procore Integration Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-[#FF6B35]" />
              Procore Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="mb-2">{getSyncStatusBadge(metrics.procoreSyncStatus)}</div>
                <p className="text-sm text-muted-foreground">Last sync: {formatDate(metrics.lastSyncDate)}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Commitments</span>
                  <Badge variant="outline">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {metrics.activeRecords}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Vendors</span>
                  <Badge variant="outline">
                    <Users className="h-3 w-3 mr-1" />
                    {metrics.vendorCount}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Compliance</span>
                  <Badge variant="outline">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {metrics.complianceRate}%
                  </Badge>
                </div>
              </div>

              <div className="pt-3 border-t">
                <Button variant="outline" size="sm" className="w-full" onClick={handleSync} disabled={syncing}>
                  {syncing ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Sync Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-[#FF6B35]" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Button variant="outline" className="justify-start" onClick={onNewRecord}>
              <Plus className="h-4 w-4 mr-2" />
              New Commitment
            </Button>
            <Button variant="outline" className="justify-start" onClick={handleSync} disabled={syncing}>
              {syncing ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Sync Procore
            </Button>
            <Button variant="outline" className="justify-start" onClick={onViewAll}>
              <TrendingUp className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => window.open("https://app.procore.com/commitments", "_blank")}
            >
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Open Procore
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
