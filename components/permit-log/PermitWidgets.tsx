"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Calendar,
  Shield,
  BarChart3,
  TrendingUp,
  Building,
  Users
} from "lucide-react"

export interface PermitStats {
  totalPermits: number
  approvedPermits: number
  pendingPermits: number
  expiredPermits: number
  rejectedPermits: number
  expiringPermits: number
  totalInspections: number
  passedInspections: number
  failedInspections: number
  pendingInspections: number
  approvalRate: number
  inspectionPassRate: number
  byType: Record<string, number>
  byAuthority: Record<string, number>
  byStatus: Record<string, number>
}

interface PermitWidgetsProps {
  stats: PermitStats
}

export function PermitWidgets({ stats }: PermitWidgetsProps) {
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getStatusColor = (status: string, value: number) => {
    switch (status) {
      case "approval":
        return value >= 90 ? "text-green-600" : value >= 75 ? "text-yellow-600" : "text-red-600"
      case "inspection":
        return value >= 85 ? "text-green-600" : value >= 70 ? "text-yellow-600" : "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusIcon = (status: string, value: number) => {
    switch (status) {
      case "approval":
        return value >= 90 ? (
          <CheckCircle className="h-3 w-3 text-green-500" />
        ) : value >= 75 ? (
          <Clock className="h-3 w-3 text-yellow-500" />
        ) : (
          <AlertTriangle className="h-3 w-3 text-red-500" />
        )
      case "inspection":
        return value >= 85 ? (
          <CheckCircle className="h-3 w-3 text-green-500" />
        ) : value >= 70 ? (
          <Clock className="h-3 w-3 text-yellow-500" />
        ) : (
          <AlertTriangle className="h-3 w-3 text-red-500" />
        )
      default:
        return null
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Total Permits */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 dark:from-blue-950 dark:to-indigo-950 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Permits</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {stats.totalPermits}
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Active portfolio
              </p>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Approval Rate */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 dark:from-green-950 dark:to-emerald-950 dark:border-green-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Approval Rate</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                {formatPercentage(stats.approvalRate)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {getStatusIcon("approval", stats.approvalRate)}
                <span className="text-xs text-green-700 dark:text-green-300">
                  {stats.approvedPermits} of {stats.totalPermits}
                </span>
              </div>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inspection Pass Rate */}
      <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 dark:from-purple-950 dark:to-violet-950 dark:border-purple-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Inspection Pass</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {formatPercentage(stats.inspectionPassRate)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {getStatusIcon("inspection", stats.inspectionPassRate)}
                <span className="text-xs text-purple-700 dark:text-purple-300">
                  {stats.passedInspections} of {stats.totalInspections}
                </span>
              </div>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
              <Shield className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Actions */}
      <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 dark:from-orange-950 dark:to-amber-950 dark:border-orange-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Pending Actions</p>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                {stats.pendingPermits + stats.pendingInspections}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-800 dark:text-orange-200 dark:border-orange-600">
                  {stats.pendingPermits} permits
                </Badge>
                <Badge variant="outline" className="text-xs bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-800 dark:text-orange-200 dark:border-orange-600">
                  {stats.pendingInspections} inspections
                </Badge>
              </div>
            </div>
            <div className="p-2 bg-orange-100 dark:bg-orange-800 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600 dark:text-orange-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expiring Soon */}
      <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200 dark:from-red-950 dark:to-rose-950 dark:border-red-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600 dark:text-red-400">Expiring Soon</p>
              <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                {stats.expiringPermits}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {stats.expiringPermits > 0 ? (
                  <AlertTriangle className="h-3 w-3 text-red-500" />
                ) : (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                )}
                <span className="text-xs text-red-700 dark:text-red-300">
                  Within 30 days
                </span>
              </div>
            </div>
            <div className="p-2 bg-red-100 dark:bg-red-800 rounded-lg">
              <Calendar className="h-6 w-6 text-red-600 dark:text-red-300" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 