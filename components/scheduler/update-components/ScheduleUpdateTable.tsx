/**
 * @fileoverview Schedule Update Table Component
 * @module ScheduleUpdateTable
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Interactive table for editing schedule activities with:
 * - Inline editing for dates, reasons, and notes
 * - Validation feedback and error highlighting
 * - Side-by-side comparison of original vs. modified values
 * - Row expansion for detailed diff view
 * - Virtualization for performance with large datasets
 */

"use client"

import React, { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import {
  Clock,
  Edit3,
  Check,
  X,
  AlertTriangle,
  Diamond,
  ChevronDown,
  ChevronRight,
  GitBranch,
  Eye,
  Activity,
  Save,
  Undo,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
} from "lucide-react"
import { format } from "date-fns"
import { ProtectedGrid, createGridWithTotalsAndSticky, ProtectedColDef } from "@/components/ui/protected-grid"

interface UpdateActivity {
  activity_id: string
  description: string
  type: "Milestone" | "Task"
  baseline_start: string
  baseline_finish: string
  current_start: string
  current_finish: string
  actual_start?: string
  actual_finish?: string
  delay_reason?: string
  notes?: string
  change_type?: "delay" | "resequence" | "acceleration" | "no_change"
  is_critical: boolean
  float_days: number
  percent_complete: number
  modified: boolean
  validation_errors: string[]
}

interface ScheduleUpdateTableProps {
  activities: UpdateActivity[]
  onActivityUpdate: (activityId: string, updates: Partial<UpdateActivity>) => void
  validationErrors: string[]
  isLoading: boolean
  onResetChanges: () => void
  onSubmitUpdate: () => void
  isSubmitting: boolean
}

const delayReasons = [
  { value: "weather", label: "Weather Conditions" },
  { value: "permit", label: "Permit Delays" },
  { value: "equipment", label: "Equipment Issues" },
  { value: "material", label: "Material Delays" },
  { value: "labor", label: "Labor Shortage" },
  { value: "design", label: "Design Changes" },
  { value: "coordination", label: "Coordination Issues" },
  { value: "other", label: "Other" },
]

const changeTypes = [
  { value: "no_change", label: "No Change" },
  { value: "delay", label: "Delay" },
  { value: "resequence", label: "Resequence" },
  { value: "acceleration", label: "Acceleration" },
]

export const ScheduleUpdateTable: React.FC<ScheduleUpdateTableProps> = ({
  activities,
  onActivityUpdate,
  validationErrors,
  isLoading,
  onResetChanges,
  onSubmitUpdate,
  isSubmitting,
}) => {
  // Get variance in days
  const getVarianceDays = useCallback((baseline: string, current: string) => {
    const baselineDate = new Date(baseline)
    const currentDate = new Date(current)
    const diffTime = currentDate.getTime() - baselineDate.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }, [])

  // Transform activities data for grid
  const transformedActivities = useMemo(() => {
    return activities.map((activity) => ({
      id: activity.activity_id,
      activity_id: activity.activity_id,
      description: activity.description,
      type: activity.type,
      baseline_start: activity.baseline_start,
      baseline_finish: activity.baseline_finish,
      current_start: activity.current_start,
      current_finish: activity.current_finish,
      actual_start: activity.actual_start,
      actual_finish: activity.actual_finish,
      delay_reason: activity.delay_reason,
      notes: activity.notes,
      change_type: activity.change_type,
      is_critical: activity.is_critical,
      float_days: activity.float_days,
      percent_complete: activity.percent_complete,
      modified: activity.modified,
      validation_errors: activity.validation_errors,
      status:
        activity.percent_complete === 100 ? "Complete" : activity.percent_complete > 0 ? "In Progress" : "Not Started",
      start_variance: getVarianceDays(activity.baseline_start, activity.current_start),
      finish_variance: getVarianceDays(activity.baseline_finish, activity.current_finish),
    }))
  }, [activities, getVarianceDays])

  // Column definitions for schedule update grid
  const scheduleColumns: ProtectedColDef[] = [
    {
      field: "activity_id",
      headerName: "Activity ID",
      width: 150,
      pinned: "left",
      cellRenderer: (params: any) => (
        <div className="space-y-0.5">
          <div className="text-sm font-medium">{params.value}</div>
          <div className="text-xs text-muted-foreground line-clamp-2">{params.data.description}</div>
        </div>
      ),
    },
    {
      field: "type",
      headerName: "Type",
      width: 90,
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-1">
          {params.value === "Milestone" ? (
            <Diamond className="h-3 w-3 text-orange-500 dark:text-orange-400" />
          ) : (
            <Target className="h-3 w-3 text-blue-500 dark:text-blue-400" />
          )}
          <span className="text-xs">{params.value}</span>
        </div>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 110,
      cellRenderer: (params: any) => (
        <Badge
          variant="outline"
          className={cn(
            "text-xs h-5",
            params.value === "Complete"
              ? "bg-green-100 text-green-800"
              : params.value === "In Progress"
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-800"
          )}
        >
          {params.value}
        </Badge>
      ),
    },
    {
      field: "percent_complete",
      headerName: "Progress",
      width: 100,
      cellRenderer: (params: any) => (
        <div className="space-y-0.5">
          <Progress value={params.value} className="w-12 h-2" />
          <div className="text-xs text-muted-foreground text-center">{params.value}%</div>
        </div>
      ),
    },
    {
      field: "actual_start",
      headerName: "Actual Start",
      width: 130,
      editable: true,
      cellRenderer: (params: any) => (
        <div className="text-xs">{params.value ? format(new Date(params.value), "MM/dd/yyyy") : "Click to set"}</div>
      ),
    },
    {
      field: "actual_finish",
      headerName: "Actual Finish",
      width: 130,
      editable: true,
      cellRenderer: (params: any) => (
        <div className="text-xs">{params.value ? format(new Date(params.value), "MM/dd/yyyy") : "Click to set"}</div>
      ),
    },
    {
      field: "delay_reason",
      headerName: "Delay Reason",
      width: 150,
      editable: true,
      cellRenderer: (params: any) => (
        <div className="text-xs">
          {params.value ? delayReasons.find((r) => r.value === params.value)?.label : "Select reason"}
        </div>
      ),
    },
    {
      field: "change_type",
      headerName: "Change Type",
      width: 120,
      editable: true,
      cellRenderer: (params: any) => (
        <Badge variant="outline" className="text-xs">
          {changeTypes.find((c) => c.value === params.value)?.label || "No Change"}
        </Badge>
      ),
    },
    {
      field: "notes",
      headerName: "Notes",
      width: 200,
      editable: true,
      cellRenderer: (params: any) => (
        <div className="text-xs truncate" title={params.value}>
          {params.value || "Click to add notes"}
        </div>
      ),
    },
    {
      field: "is_critical",
      headerName: "Critical Path",
      width: 110,
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-1">
          {params.value && <GitBranch className="h-3 w-3 text-red-500 dark:text-red-400" />}
          <Badge variant={params.value ? "destructive" : "secondary"} className="text-xs h-5">
            {params.value ? "Critical" : "Normal"}
          </Badge>
        </div>
      ),
    },
    {
      field: "start_variance",
      headerName: "Start Variance",
      width: 120,
      cellRenderer: (params: any) => (
        <div className="text-xs">
          {params.value !== 0 && (
            <Badge variant={params.value > 0 ? "destructive" : "default"} className="text-xs h-4">
              {params.value > 0 ? "+" : ""}
              {params.value}d
            </Badge>
          )}
        </div>
      ),
    },
    {
      field: "finish_variance",
      headerName: "Finish Variance",
      width: 120,
      cellRenderer: (params: any) => (
        <div className="text-xs">
          {params.value !== 0 && (
            <Badge variant={params.value > 0 ? "destructive" : "default"} className="text-xs h-4">
              {params.value > 0 ? "+" : ""}
              {params.value}d
            </Badge>
          )}
        </div>
      ),
    },
  ]

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Schedule Update Table</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-4 w-4" />
              Schedule Update Table
            </CardTitle>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
              <div>Total: {activities.length}</div>
              <div>Modified: {activities.filter((a) => a.modified).length}</div>
              <div>Critical: {activities.filter((a) => a.is_critical).length}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">
              {activities.filter((a) => a.modified).length} modified activities
            </div>
            {validationErrors.length > 0 && (
              <Badge variant="destructive">{validationErrors.length} validation errors</Badge>
            )}
            <Button variant="outline" size="sm" onClick={onResetChanges}>
              <Undo className="h-4 w-4 mr-2" />
              Reset Changes
            </Button>
            <Button
              size="sm"
              onClick={onSubmitUpdate}
              disabled={isSubmitting || activities.filter((a) => a.modified).length === 0}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Update
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {validationErrors.length > 0 && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                {validationErrors.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="min-w-0 max-w-full overflow-hidden">
          <ProtectedGrid
            columnDefs={scheduleColumns}
            rowData={transformedActivities}
            config={createGridWithTotalsAndSticky(1, false, {
              allowExport: true,
              allowRowSelection: true,
              allowColumnResizing: true,
              allowSorting: true,
              allowFiltering: true,
              allowCellEditing: true,
              showToolbar: true,
              showStatusBar: true,
              protectionEnabled: false,
            })}
            height="600px"
            enableSearch={true}
            title=""
            events={{
              onCellValueChanged: (event) => {
                onActivityUpdate(event.data.activity_id, {
                  [event.column.getColId()]: event.newValue,
                })
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
