"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DollarSign, FileText, CheckCircle, Clock, AlertTriangle, TrendingUp, TrendingDown, Link } from "lucide-react"
import type { ProcurementStats } from "@/types/procurement"

interface ProcurementStatsPanelProps {
  stats: ProcurementStats
}

export function ProcurementStatsPanel({ stats }: ProcurementStatsPanelProps) {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getCompletionRate = () => {
    return stats.totalRecords > 0 ? (stats.completedProcurements / stats.totalRecords) * 100 : 0
  }

  const getLinkageRate = () => {
    return stats.totalRecords > 0 ? (stats.linkedToBidTabs / stats.totalRecords) * 100 : 0
  }

  return (
    <div className="space-y-6">
      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-[#FF6B35]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Records</p>
                <p className="text-2xl font-bold">{stats.totalRecords}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Cycle Time</p>
                <p className="text-2xl font-bold">{stats.avgCycleTime}d</p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Compliance Rate</p>
                <p className="text-2xl font-bold">{formatPercent(stats.complianceRate)}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Tracking */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Procurement Status</CardTitle>
            <CardDescription>Current status distribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm">Completed</span>
              </div>
              <div className="text-sm font-medium">{stats.completedProcurements}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm">Active</span>
              </div>
              <div className="text-sm font-medium">{stats.activeProcurements}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-sm">Pending Approval</span>
              </div>
              <div className="text-sm font-medium">{stats.pendingApprovals}</div>
            </div>

            <div className="pt-2">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Completion Rate</span>
                <span>{formatPercent(getCompletionRate())}</span>
              </div>
              <Progress value={getCompletionRate()} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bid Tab Integration</CardTitle>
            <CardDescription>Estimating system linkage status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link className="h-4 w-4 text-green-500" />
                <span className="text-sm">Linked to Bid Tabs</span>
              </div>
              <div className="text-sm font-medium">{stats.linkedToBidTabs}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span className="text-sm">Not Linked</span>
              </div>
              <div className="text-sm font-medium">{stats.totalRecords - stats.linkedToBidTabs}</div>
            </div>

            <div className="pt-2">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Linkage Rate</span>
                <span>{formatPercent(getLinkageRate())}</span>
              </div>
              <Progress value={getLinkageRate()} className="h-2" />
            </div>

            <div className="pt-2">
              <Badge variant={getLinkageRate() >= 80 ? "default" : "secondary"} className="text-xs">
                {getLinkageRate() >= 80 ? "Good Integration" : "Needs Attention"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Indicators */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Indicators</CardTitle>
          <CardDescription>Key metrics and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Procurement Velocity</span>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold">
                {(stats.completedProcurements / Math.max(stats.avgCycleTime, 1)).toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">Completions per day</div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Value Efficiency</span>
                <DollarSign className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold">
                {formatCurrency(stats.totalValue / Math.max(stats.totalRecords, 1))}
              </div>
              <div className="text-xs text-muted-foreground">Average value per record</div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Risk Level</span>
                {stats.complianceRate >= 90 ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                )}
              </div>
              <div className="text-2xl font-bold">
                {stats.complianceRate >= 90 ? "Low" : stats.complianceRate >= 70 ? "Medium" : "High"}
              </div>
              <div className="text-xs text-muted-foreground">Based on compliance rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
