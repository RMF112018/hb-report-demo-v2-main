"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertTriangle,
  Clock,
  Zap,
  X,
  Eye,
  TrendingDown,
  Target,
  Users,
  DollarSign,
  Activity,
  RefreshCw,
  Bell,
} from "lucide-react"

interface BDAlert {
  id: string
  title: string
  message: string
  type: "urgent" | "attention" | "info"
  icon: React.ComponentType<{ className?: string }>
  timestamp: string
  action?: string
  dismissed?: boolean
}

interface BetaBDAlertsPanelProps {
  alerts?: BDAlert[]
  className?: string
}

export function BetaBDAlertsPanel({ alerts = [], className = "" }: BetaBDAlertsPanelProps) {
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())
  const [refreshing, setRefreshing] = useState(false)

  // Mock alerts based on BD metrics
  const defaultAlerts: BDAlert[] = [
    {
      id: "alert-001",
      title: "Lead Backlog Low",
      message: "Healthcare sector lead backlog is below target threshold",
      type: "urgent",
      icon: Target,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      action: "View Healthcare Pipeline",
    },
    {
      id: "alert-002",
      title: "High-Value Pursuits Need Follow-up",
      message: "3 high-value pursuits missing scheduled follow-up activities",
      type: "attention",
      icon: Clock,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      action: "View Pursuit List",
    },
    {
      id: "alert-003",
      title: "BD Activity Decline",
      message: "Business development activity dropped 18% vs last month",
      type: "info",
      icon: TrendingDown,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      action: "View Activity Report",
    },
    {
      id: "alert-004",
      title: "Pipeline Velocity Alert",
      message: "Average lead-to-proposal time increased by 5 days",
      type: "attention",
      icon: Activity,
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      action: "Review Process",
    },
    {
      id: "alert-005",
      title: "Market Opportunity",
      message: "New healthcare RFP opportunities detected in Tampa region",
      type: "info",
      icon: Zap,
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      action: "View Opportunities",
    },
  ]

  const alertData = alerts.length > 0 ? alerts : defaultAlerts

  // Filter out dismissed alerts
  const activeAlerts = useMemo(() => {
    return alertData.filter((alert) => !dismissedAlerts.has(alert.id))
  }, [alertData, dismissedAlerts])

  // Get alert styling based on type
  const getAlertStyle = (type: string) => {
    switch (type) {
      case "urgent":
        return {
          borderColor: "border-red-200 dark:border-red-800",
          bgColor: "bg-red-50 dark:bg-red-950",
          textColor: "text-red-800 dark:text-red-200",
          iconColor: "text-red-600",
          badgeColor: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
        }
      case "attention":
        return {
          borderColor: "border-yellow-200 dark:border-yellow-800",
          bgColor: "bg-yellow-50 dark:bg-yellow-950",
          textColor: "text-yellow-800 dark:text-yellow-200",
          iconColor: "text-yellow-600",
          badgeColor: "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300",
        }
      case "info":
        return {
          borderColor: "border-blue-200 dark:border-blue-800",
          bgColor: "bg-blue-50 dark:bg-blue-950",
          textColor: "text-blue-800 dark:text-blue-200",
          iconColor: "text-blue-600",
          badgeColor: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
        }
      default:
        return {
          borderColor: "border-gray-200 dark:border-gray-800",
          bgColor: "bg-gray-50 dark:bg-gray-950",
          textColor: "text-gray-800 dark:text-gray-200",
          iconColor: "text-gray-600",
          badgeColor: "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300",
        }
    }
  }

  // Format time ago
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return time.toLocaleDateString()
  }

  const handleDismiss = (alertId: string) => {
    setDismissedAlerts((prev) => new Set([...prev, alertId]))
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  const handleViewDetail = (action: string) => {
    console.log(`View detail for: ${action}`)
    // In a real implementation, this would navigate to the specific view
  }

  return (
    <Card
      className={`bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 border-slate-200 dark:border-slate-800 ${className}`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
              <Bell className="h-5 w-5" />
              BD Alerts & Notifications
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Real-time business development insights and alerts
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {activeAlerts.length} active
            </Badge>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing} className="h-8 px-2">
              <RefreshCw className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {activeAlerts.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {activeAlerts.map((alert) => {
              const style = getAlertStyle(alert.type)
              const IconComponent = alert.icon

              return (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border ${style.borderColor} ${style.bgColor} transition-all duration-200 hover:shadow-sm`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 rounded-full ${style.bgColor}`}>
                        <IconComponent className={`h-4 w-4 ${style.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-medium text-sm ${style.textColor}`}>{alert.title}</h4>
                          <Badge variant="outline" className={`text-xs ${style.badgeColor}`}>
                            {alert.type === "urgent" ? "Urgent" : alert.type === "attention" ? "Attention" : "Info"}
                          </Badge>
                        </div>
                        <p className={`text-sm ${style.textColor} opacity-80 mb-2`}>{alert.message}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {formatTimeAgo(alert.timestamp)}
                          </span>
                          {alert.action && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetail(alert.action!)}
                              className="h-6 px-2 text-xs"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              {alert.action}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDismiss(alert.id)}
                      className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No active alerts</p>
            <p className="text-xs mt-1">All clear! No immediate action required.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
