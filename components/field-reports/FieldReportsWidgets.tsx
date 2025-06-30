"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Users, 
  Shield, 
  CheckCircle, 
  BarChart3,
  AlertTriangle,
  TrendingUp,
  Clock,
  Target,
  Building
} from "lucide-react"

export interface FieldReportsStats {
  totalLogs: number
  logComplianceRate: number
  expectedLogs: number
  completedLogs: number
  totalWorkers: number
  averageEfficiency: number
  safetyViolations: number
  safetyComplianceRate: number
  qualityDefects: number
  qualityPassRate: number
  totalInspections: number
  atRiskSafetyItems: number
  businessDaysInMonth: number
  businessDaysToDate: number
}

interface FieldReportsWidgetsProps {
  stats: FieldReportsStats
}

export function FieldReportsWidgets({ stats }: FieldReportsWidgetsProps) {
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getStatusColor = (status: string, value: number) => {
    switch (status) {
      case "compliance":
        return value >= 95 ? "text-green-600" : value >= 85 ? "text-yellow-600" : "text-red-600"
      case "safety":
        return value >= 95 ? "text-green-600" : value >= 90 ? "text-yellow-600" : "text-red-600"
      case "quality":
        return value >= 90 ? "text-green-600" : value >= 80 ? "text-yellow-600" : "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusIcon = (status: string, value: number) => {
    switch (status) {
      case "compliance":
        return value >= 95 ? (
          <CheckCircle className="h-3 w-3 text-green-500" />
        ) : value >= 85 ? (
          <Clock className="h-3 w-3 text-yellow-500" />
        ) : (
          <AlertTriangle className="h-3 w-3 text-red-500" />
        )
      case "safety":
        return value >= 95 ? (
          <Shield className="h-3 w-3 text-green-500" />
        ) : value >= 90 ? (
          <Clock className="h-3 w-3 text-yellow-500" />
        ) : (
          <AlertTriangle className="h-3 w-3 text-red-500" />
        )
      case "quality":
        return value >= 90 ? (
          <CheckCircle className="h-3 w-3 text-green-500" />
        ) : value >= 80 ? (
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
      {/* Log Compliance */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 dark:from-blue-950 dark:to-indigo-950 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Log Compliance</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {formatPercentage(stats.logComplianceRate)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {getStatusIcon("compliance", stats.logComplianceRate)}
                <span className="text-xs text-blue-700 dark:text-blue-300">
                  {stats.completedLogs} of {stats.expectedLogs} logs
                </span>
              </div>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety Score */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 dark:from-green-950 dark:to-emerald-950 dark:border-green-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Safety Score</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                {formatPercentage(stats.safetyComplianceRate)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {getStatusIcon("safety", stats.safetyComplianceRate)}
                <span className="text-xs text-green-700 dark:text-green-300">
                  {stats.safetyViolations} violations
                </span>
              </div>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
              <Shield className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quality Pass Rate */}
      <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 dark:from-purple-950 dark:to-violet-950 dark:border-purple-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Quality Pass Rate</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {formatPercentage(stats.qualityPassRate)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {getStatusIcon("quality", stats.qualityPassRate)}
                <span className="text-xs text-purple-700 dark:text-purple-300">
                  {stats.qualityDefects} defects found
                </span>
              </div>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
              <CheckCircle className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Workforce */}
      <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 dark:from-orange-950 dark:to-amber-950 dark:border-orange-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Total Workforce</p>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                {stats.totalWorkers}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-800 dark:text-orange-200 dark:border-orange-600">
                  {formatPercentage(stats.averageEfficiency)} efficiency
                </Badge>
              </div>
            </div>
            <div className="p-2 bg-orange-100 dark:bg-orange-800 rounded-lg">
              <Users className="h-6 w-6 text-orange-600 dark:text-orange-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* At-Risk Items */}
      <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200 dark:from-red-950 dark:to-rose-950 dark:border-red-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600 dark:text-red-400">At-Risk Items</p>
              <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                {stats.atRiskSafetyItems}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {stats.atRiskSafetyItems > 0 ? (
                  <AlertTriangle className="h-3 w-3 text-red-500" />
                ) : (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                )}
                <span className="text-xs text-red-700 dark:text-red-300">
                  Require attention
                </span>
              </div>
            </div>
            <div className="p-2 bg-red-100 dark:bg-red-800 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-300" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 