"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  CheckCircle,
  AlertTriangle,
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
  Star,
  XCircle,
} from "lucide-react"
import { format, differenceInDays, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend } from "date-fns"
import { QualityControlTable } from "./QualityControlTable"
import { useToast } from "@/hooks/use-toast"
import type { QualityInspection } from "@/types/field-reports"

interface QualityControlSubTabProps {
  data: {
    qualityInspections: QualityInspection[]
  }
  stats?: {
    totalInspections?: number
    qualityPassRate?: number
    qualityDefects?: number
    averageQualityScore?: number
    businessDaysInMonth?: number
    businessDaysToDate?: number
  }
  userRole?: string
  onRefresh?: () => void
}

export const QualityControlSubTab: React.FC<QualityControlSubTabProps> = ({
  data,
  stats = {},
  userRole = "project_manager",
  onRefresh,
}) => {
  const { toast } = useToast()
  const [selectedInspection, setSelectedInspection] = useState<QualityInspection | null>(null)
  const [viewMode, setViewMode] = useState<"table" | "calendar">("table")
  const [filterPeriod, setFilterPeriod] = useState("this-month")
  const [searchTerm, setSearchTerm] = useState("")

  // Calculate quality statistics
  const qualityStats = useMemo(() => {
    const inspections = data.qualityInspections || []
    const totalInspections = inspections.length
    const passedInspections = inspections.filter((inspection) => inspection.status === "pass").length
    const failedInspections = inspections.filter((inspection) => inspection.status === "fail").length
    const pendingInspections = inspections.filter((inspection) => inspection.status === "pending").length

    const totalDefects = inspections.reduce((sum, inspection) => sum + (inspection.defects || 0), 0)
    const totalIssues = inspections.reduce((sum, inspection) => sum + (inspection.issues?.length || 0), 0)

    const qualityPassRate = totalInspections > 0 ? (passedInspections / totalInspections) * 100 : 100

    // Calculate average quality score based on defects (fewer defects = higher score)
    const averageQualityScore =
      totalInspections > 0
        ? Math.max(0, 100 - (totalDefects / totalInspections) * 10) // Each defect reduces score by 10 points on average
        : 100

    // Calculate trends
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const recentInspections = inspections.filter((inspection) => new Date(inspection.date) >= thirtyDaysAgo)
    const recentPassRate =
      recentInspections.length > 0
        ? (recentInspections.filter((inspection) => inspection.status === "pass").length / recentInspections.length) *
          100
        : 100

    return {
      totalInspections,
      passedInspections,
      failedInspections,
      pendingInspections,
      totalDefects,
      totalIssues,
      qualityPassRate: Math.round(qualityPassRate),
      averageQualityScore: Math.round(averageQualityScore),
      recentPassRate: Math.round(recentPassRate),
      expectedInspections: stats.businessDaysToDate || 15,
      businessDaysInMonth: stats.businessDaysInMonth || 22,
      businessDaysToDate: stats.businessDaysToDate || 15,
    }
  }, [data.qualityInspections, stats])

  // Handle inspection selection
  const handleInspectionSelect = (inspection: QualityInspection) => {
    setSelectedInspection(inspection)
  }

  // Handle export
  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Quality control data is being exported...",
    })
    // Export logic would go here
  }

  // Get quality trend icon and color
  const getQualityTrend = () => {
    if (qualityStats.qualityPassRate >= 95) {
      return { icon: TrendingUp, color: "text-green-600", bgColor: "bg-green-100 dark:bg-green-900" }
    } else if (qualityStats.qualityPassRate >= 85) {
      return { icon: TrendingUp, color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900" }
    } else if (qualityStats.qualityPassRate >= 75) {
      return { icon: TrendingDown, color: "text-yellow-600", bgColor: "bg-yellow-100 dark:bg-yellow-900" }
    } else {
      return { icon: TrendingDown, color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900" }
    }
  }

  const qualityTrend = getQualityTrend()
  const TrendIcon = qualityTrend.icon

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inspections */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Inspections</p>
                <p className="text-2xl font-bold">{qualityStats.totalInspections}</p>
                <p className="text-xs text-muted-foreground mt-1">{qualityStats.expectedInspections} expected</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quality Pass Rate */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pass Rate</p>
                <p className="text-2xl font-bold">{qualityStats.qualityPassRate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendIcon className={`h-3 w-3 ${qualityTrend.color}`} />
                  <p className="text-xs text-muted-foreground">Target: 95%</p>
                </div>
              </div>
              <div className={`p-3 ${qualityTrend.bgColor} rounded-lg`}>
                <Target className={`h-6 w-6 ${qualityTrend.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quality Defects */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Defects</p>
                <p className="text-2xl font-bold text-red-600">{qualityStats.totalDefects}</p>
                <p className="text-xs text-muted-foreground mt-1">{qualityStats.totalIssues} issues</p>
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
                <p className="text-2xl font-bold">{qualityStats.averageQualityScore}%</p>
                <p className="text-xs text-muted-foreground mt-1">Quality rating</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <Star className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quality Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Quality Performance Overview
            </CardTitle>
            <CardDescription>Current quality control performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Passed</span>
                  <span className="font-medium text-green-600">{qualityStats.passedInspections}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${
                        qualityStats.totalInspections > 0
                          ? (qualityStats.passedInspections / qualityStats.totalInspections) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Failed</span>
                  <span className="font-medium text-red-600">{qualityStats.failedInspections}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{
                      width: `${
                        qualityStats.totalInspections > 0
                          ? (qualityStats.failedInspections / qualityStats.totalInspections) * 100
                          : 0
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
                  <span className="font-medium text-yellow-600">{qualityStats.pendingInspections}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-yellow-600 h-2 rounded-full"
                    style={{
                      width: `${
                        qualityStats.totalInspections > 0
                          ? (qualityStats.pendingInspections / qualityStats.totalInspections) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Quality</span>
                  <span className="font-medium">{qualityStats.averageQualityScore}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${qualityStats.averageQualityScore}%` }}
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
            <CardDescription>Latest quality control updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.qualityInspections.slice(0, 4).map((inspection) => (
                <div key={inspection.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      inspection.status === "pass"
                        ? "bg-green-500"
                        : inspection.status === "fail"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{inspection.type}</p>
                    <p className="text-xs text-muted-foreground">{inspection.location}</p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        inspection.status === "pass"
                          ? "default"
                          : inspection.status === "fail"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {inspection.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{format(new Date(inspection.date), "MMM d")}</p>
                  </div>
                </div>
              ))}
              {data.qualityInspections.length === 0 && (
                <div className="text-center py-6">
                  <CheckCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No recent quality inspections</p>
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

      {/* Quality Control Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Quality Control Records</h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{data.qualityInspections.length} total inspections</Badge>
          </div>
        </div>

        <QualityControlTable
          qualityInspections={data.qualityInspections}
          userRole={userRole}
          onInspectionSelect={handleInspectionSelect}
          onExport={handleExport}
        />
      </div>

      {/* Inspection Details Modal would go here */}
      {selectedInspection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Quality Inspection Details</CardTitle>
                <Button variant="ghost" onClick={() => setSelectedInspection(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Date</p>
                    <p className="font-medium">{format(new Date(selectedInspection.date), "PPP")}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Type</p>
                    <p className="font-medium">{selectedInspection.type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Location</p>
                    <p className="font-medium">{selectedInspection.location}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge>{selectedInspection.status}</Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                  <p className="text-sm">{selectedInspection.description}</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Trade</p>
                    <p className="text-lg font-bold">{selectedInspection.trade}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Defects</p>
                    <p className="text-lg font-bold text-red-600">{selectedInspection.defects}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Issues</p>
                    <p className="text-lg font-bold text-yellow-600">{selectedInspection.issues?.length || 0}</p>
                  </div>
                </div>
                {selectedInspection.issues && selectedInspection.issues.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Issues Found</p>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedInspection.issues.map((issue, index) => (
                        <li key={index} className="text-sm">
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
