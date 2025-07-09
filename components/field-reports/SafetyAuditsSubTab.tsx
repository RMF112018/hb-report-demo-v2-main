"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Target,
  Activity,
  Users,
  Building,
  BarChart3,
  Calendar,
  FileText,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Clock,
} from "lucide-react"
import { format, differenceInDays, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend } from "date-fns"
import { SafetyAuditsTable } from "./SafetyAuditsTable"
import { useToast } from "@/hooks/use-toast"
import type { SafetyAudit } from "@/types/field-reports"

interface SafetyAuditsSubTabProps {
  data: {
    safetyAudits: SafetyAudit[]
  }
  stats?: {
    totalAudits?: number
    safetyComplianceRate?: number
    safetyViolations?: number
    atRiskSafetyItems?: number
    averageComplianceScore?: number
    businessDaysInMonth?: number
    businessDaysToDate?: number
  }
  userRole?: string
  onRefresh?: () => void
}

export const SafetyAuditsSubTab: React.FC<SafetyAuditsSubTabProps> = ({
  data,
  stats = {},
  userRole = "project_manager",
  onRefresh,
}) => {
  const { toast } = useToast()
  const [selectedAudit, setSelectedAudit] = useState<SafetyAudit | null>(null)
  const [viewMode, setViewMode] = useState<"table" | "calendar">("table")
  const [filterPeriod, setFilterPeriod] = useState("this-month")
  const [searchTerm, setSearchTerm] = useState("")

  // Calculate safety statistics
  const safetyStats = useMemo(() => {
    const audits = data.safetyAudits || []
    const totalAudits = audits.length
    const passedAudits = audits.filter((audit) => audit.status === "pass").length
    const failedAudits = audits.filter((audit) => audit.status === "fail").length
    const pendingAudits = audits.filter((audit) => audit.status === "pending").length

    const totalViolations = audits.reduce((sum, audit) => sum + (audit.violations || 0), 0)
    const totalAtRisk = audits.reduce((sum, audit) => sum + (audit.atRiskItems || 0), 0)

    const complianceScores = audits.map((audit) => audit.complianceScore || 0)
    const averageCompliance =
      complianceScores.length > 0
        ? complianceScores.reduce((sum, score) => sum + score, 0) / complianceScores.length
        : 0

    const safetyComplianceRate = totalAudits > 0 ? (passedAudits / totalAudits) * 100 : 100

    // Calculate trends
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const recentAudits = audits.filter((audit) => new Date(audit.date) >= thirtyDaysAgo)
    const recentPassRate =
      recentAudits.length > 0
        ? (recentAudits.filter((audit) => audit.status === "pass").length / recentAudits.length) * 100
        : 100

    return {
      totalAudits,
      passedAudits,
      failedAudits,
      pendingAudits,
      totalViolations,
      totalAtRisk,
      averageCompliance: Math.round(averageCompliance),
      safetyComplianceRate: Math.round(safetyComplianceRate),
      recentPassRate: Math.round(recentPassRate),
      expectedAudits: stats.businessDaysToDate || 15,
      businessDaysInMonth: stats.businessDaysInMonth || 22,
      businessDaysToDate: stats.businessDaysToDate || 15,
    }
  }, [data.safetyAudits, stats])

  // Handle audit selection
  const handleAuditSelect = (audit: SafetyAudit) => {
    setSelectedAudit(audit)
  }

  // Handle export
  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Safety audit data is being exported...",
    })
    // Export logic would go here
  }

  // Get compliance trend icon and color
  const getComplianceTrend = () => {
    if (safetyStats.safetyComplianceRate >= 95) {
      return { icon: TrendingUp, color: "text-green-600", bgColor: "bg-green-100 dark:bg-green-900" }
    } else if (safetyStats.safetyComplianceRate >= 85) {
      return { icon: TrendingUp, color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900" }
    } else if (safetyStats.safetyComplianceRate >= 75) {
      return { icon: TrendingDown, color: "text-yellow-600", bgColor: "bg-yellow-100 dark:bg-yellow-900" }
    } else {
      return { icon: TrendingDown, color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900" }
    }
  }

  const complianceTrend = getComplianceTrend()
  const TrendIcon = complianceTrend.icon

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Audits */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Audits</p>
                <p className="text-2xl font-bold">{safetyStats.totalAudits}</p>
                <p className="text-xs text-muted-foreground mt-1">{safetyStats.expectedAudits} expected</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Safety Compliance Rate */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Compliance Rate</p>
                <p className="text-2xl font-bold">{safetyStats.safetyComplianceRate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendIcon className={`h-3 w-3 ${complianceTrend.color}`} />
                  <p className="text-xs text-muted-foreground">Target: 95%</p>
                </div>
              </div>
              <div className={`p-3 ${complianceTrend.bgColor} rounded-lg`}>
                <Target className={`h-6 w-6 ${complianceTrend.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Safety Violations */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Violations</p>
                <p className="text-2xl font-bold text-red-600">{safetyStats.totalViolations}</p>
                <p className="text-xs text-muted-foreground mt-1">{safetyStats.totalAtRisk} at-risk items</p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average Score */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Score</p>
                <p className="text-2xl font-bold">{safetyStats.averageCompliance}%</p>
                <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Safety Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Safety Performance Overview
            </CardTitle>
            <CardDescription>Current safety audit performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Passed</span>
                  <span className="font-medium text-green-600">{safetyStats.passedAudits}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${
                        safetyStats.totalAudits > 0 ? (safetyStats.passedAudits / safetyStats.totalAudits) * 100 : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Failed</span>
                  <span className="font-medium text-red-600">{safetyStats.failedAudits}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{
                      width: `${
                        safetyStats.totalAudits > 0 ? (safetyStats.failedAudits / safetyStats.totalAudits) * 100 : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pending</span>
                  <span className="font-medium text-yellow-600">{safetyStats.pendingAudits}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-yellow-600 h-2 rounded-full"
                    style={{
                      width: `${
                        safetyStats.totalAudits > 0 ? (safetyStats.pendingAudits / safetyStats.totalAudits) * 100 : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Compliance</span>
                  <span className="font-medium">{safetyStats.safetyComplianceRate}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${safetyStats.safetyComplianceRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest safety audit updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.safetyAudits.slice(0, 4).map((audit) => (
                <div key={audit.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      audit.status === "pass"
                        ? "bg-green-500"
                        : audit.status === "fail"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{audit.type}</p>
                    <p className="text-xs text-muted-foreground">{audit.location}</p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        audit.status === "pass" ? "default" : audit.status === "fail" ? "destructive" : "secondary"
                      }
                    >
                      {audit.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{format(new Date(audit.date), "MMM d")}</p>
                  </div>
                </div>
              ))}
              {data.safetyAudits.length === 0 && (
                <div className="text-center py-6">
                  <Shield className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No recent safety audits</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={viewMode} onValueChange={(value: "table" | "calendar") => setViewMode(value)}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="View mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="table">Table View</SelectItem>
              <SelectItem value="calendar">Calendar View</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterPeriod} onValueChange={setFilterPeriod}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-30">Last 30 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          {onRefresh && (
            <Button variant="outline" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          )}
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Safety Audits Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Safety Audit Records</h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{data.safetyAudits.length} total audits</Badge>
          </div>
        </div>

        <SafetyAuditsTable
          safetyAudits={data.safetyAudits}
          userRole={userRole}
          onAuditSelect={handleAuditSelect}
          onExport={handleExport}
        />
      </div>

      {/* Audit Details Modal would go here */}
      {selectedAudit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Safety Audit Details</CardTitle>
                <Button variant="ghost" onClick={() => setSelectedAudit(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Date</p>
                    <p className="font-medium">{format(new Date(selectedAudit.date), "PPP")}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Type</p>
                    <p className="font-medium">{selectedAudit.type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Location</p>
                    <p className="font-medium">{selectedAudit.location}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge>{selectedAudit.status}</Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                  <p className="text-sm">{selectedAudit.description}</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Compliance Score</p>
                    <p className="text-lg font-bold">{selectedAudit.complianceScore}%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Violations</p>
                    <p className="text-lg font-bold text-red-600">{selectedAudit.violations}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">At-Risk Items</p>
                    <p className="text-lg font-bold text-yellow-600">{selectedAudit.atRiskItems}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
