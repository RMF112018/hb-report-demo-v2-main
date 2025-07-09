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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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

interface EditingCell {
  activityId: string
  field: string
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
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [tempValue, setTempValue] = useState<string>("")

  // Handle cell editing
  const handleCellEdit = useCallback((activityId: string, field: string, currentValue: string) => {
    setEditingCell({ activityId, field })
    setTempValue(currentValue || "")
  }, [])

  // Handle save cell edit
  const handleSaveEdit = useCallback(
    (activityId: string, field: string, value: string) => {
      onActivityUpdate(activityId, { [field]: value })
      setEditingCell(null)
      setTempValue("")
    },
    [onActivityUpdate]
  )

  // Handle cancel edit
  const handleCancelEdit = useCallback(() => {
    setEditingCell(null)
    setTempValue("")
  }, [])

  // Handle row expansion
  const toggleRowExpansion = useCallback((activityId: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(activityId)) {
        newSet.delete(activityId)
      } else {
        newSet.add(activityId)
      }
      return newSet
    })
  }, [])

  // Get activity status
  const getActivityStatus = useCallback((activity: UpdateActivity) => {
    if (activity.percent_complete === 100) return "Complete"
    if (activity.percent_complete > 0) return "In Progress"
    return "Not Started"
  }, [])

  // Get status color
  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "Complete":
        return "bg-green-100 text-green-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }, [])

  // Get variance in days
  const getVarianceDays = useCallback((baseline: string, current: string) => {
    const baselineDate = new Date(baseline)
    const currentDate = new Date(current)
    const diffTime = currentDate.getTime() - baselineDate.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }, [])

  // Render editable cell
  const renderEditableCell = useCallback(
    (
      activity: UpdateActivity,
      field: string,
      currentValue: string,
      cellType: "text" | "date" | "select" | "textarea" = "text"
    ) => {
      const isEditing = editingCell?.activityId === activity.activity_id && editingCell?.field === field
      const hasError = activity.validation_errors.some((error) => error.includes(field))

      if (isEditing) {
        if (cellType === "date") {
          return (
            <div className="flex items-center gap-1">
              <Input
                type="date"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="text-xs h-7"
                autoFocus
              />
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={() => handleSaveEdit(activity.activity_id, field, tempValue)}
              >
                <Check className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={handleCancelEdit}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          )
        } else if (cellType === "select") {
          const options = field === "delay_reason" ? delayReasons : changeTypes
          return (
            <div className="flex items-center gap-1">
              <Select value={tempValue} onValueChange={setTempValue}>
                <SelectTrigger className="h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-xs">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={() => handleSaveEdit(activity.activity_id, field, tempValue)}
              >
                <Check className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={handleCancelEdit}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          )
        } else if (cellType === "textarea") {
          return (
            <div className="space-y-1">
              <Textarea
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                placeholder="Add notes..."
                className="min-h-[60px] text-xs"
              />
              <div className="flex gap-1">
                <Button
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => handleSaveEdit(activity.activity_id, field, tempValue)}
                >
                  <Check className="h-3 w-3 mr-1" />
                  Save
                </Button>
                <Button size="sm" variant="outline" className="h-6 text-xs" onClick={handleCancelEdit}>
                  <X className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          )
        } else {
          return (
            <div className="flex items-center gap-1">
              <Input
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="text-xs h-7"
                autoFocus
              />
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={() => handleSaveEdit(activity.activity_id, field, tempValue)}
              >
                <Check className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={handleCancelEdit}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          )
        }
      }

      return (
        <div
          className={cn(
            "cursor-pointer hover:bg-muted p-1 rounded min-h-[1.5rem] flex items-center text-xs",
            hasError && "border-destructive bg-destructive/10",
            activity.modified && "bg-primary/10"
          )}
          onClick={() => handleCellEdit(activity.activity_id, field, currentValue)}
        >
          <span className="truncate">
            {currentValue || <span className="text-muted-foreground">Click to edit</span>}
          </span>
          <Edit3 className="h-3 w-3 ml-1 opacity-50 flex-shrink-0" />
        </div>
      )
    },
    [editingCell, tempValue, handleCellEdit, handleSaveEdit, handleCancelEdit]
  )

  // Render comparison view
  const renderComparisonView = useCallback(
    (activity: UpdateActivity) => {
      const startVariance = getVarianceDays(activity.baseline_start, activity.current_start)
      const finishVariance = getVarianceDays(activity.baseline_finish, activity.current_finish)

      return (
        <div className="p-3 bg-muted/50 rounded-lg space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Baseline vs Current */}
            <div>
              <h4 className="text-sm font-medium mb-1">Baseline</h4>
              <div className="space-y-1 text-xs">
                <div>Start: {format(new Date(activity.baseline_start), "MM/dd/yyyy")}</div>
                <div>Finish: {format(new Date(activity.baseline_finish), "MM/dd/yyyy")}</div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Current</h4>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-1">
                  Start: {format(new Date(activity.current_start), "MM/dd/yyyy")}
                  {startVariance !== 0 && (
                    <Badge variant={startVariance > 0 ? "destructive" : "default"} className="text-xs h-4">
                      {startVariance > 0 ? "+" : ""}
                      {startVariance}d
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  Finish: {format(new Date(activity.current_finish), "MM/dd/yyyy")}
                  {finishVariance !== 0 && (
                    <Badge variant={finishVariance > 0 ? "destructive" : "default"} className="text-xs h-4">
                      {finishVariance > 0 ? "+" : ""}
                      {finishVariance}d
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Actual</h4>
              <div className="space-y-1 text-xs">
                <div>
                  Start: {activity.actual_start ? format(new Date(activity.actual_start), "MM/dd/yyyy") : "TBD"}
                </div>
                <div>
                  Finish: {activity.actual_finish ? format(new Date(activity.actual_finish), "MM/dd/yyyy") : "TBD"}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          {(activity.delay_reason || activity.notes) && (
            <div className="border-t pt-2">
              <h4 className="text-sm font-medium mb-1">Update Details</h4>
              <div className="space-y-1 text-xs">
                {activity.delay_reason && (
                  <div>
                    <span className="font-medium">Delay Reason:</span>{" "}
                    {delayReasons.find((r) => r.value === activity.delay_reason)?.label}
                  </div>
                )}
                {activity.notes && (
                  <div>
                    <span className="font-medium">Notes:</span> {activity.notes}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )
    },
    [getVarianceDays]
  )

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

        <div className="overflow-x-auto">
          <Table className="min-w-[1200px]">
            <TableHeader>
              <TableRow className="h-10">
                <TableHead className="w-[40px] p-2"></TableHead>
                <TableHead className="w-[200px] p-2 text-xs">Activity</TableHead>
                <TableHead className="w-[80px] p-2 text-xs">Type</TableHead>
                <TableHead className="w-[90px] p-2 text-xs">Status</TableHead>
                <TableHead className="w-[80px] p-2 text-xs">Progress</TableHead>
                <TableHead className="w-[110px] p-2 text-xs">Actual Start</TableHead>
                <TableHead className="w-[110px] p-2 text-xs">Actual Finish</TableHead>
                <TableHead className="w-[110px] p-2 text-xs">Delay Reason</TableHead>
                <TableHead className="w-[100px] p-2 text-xs">Change Type</TableHead>
                <TableHead className="w-[150px] p-2 text-xs">Notes</TableHead>
                <TableHead className="w-[90px] p-2 text-xs">Critical</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => (
                <React.Fragment key={activity.activity_id}>
                  <TableRow
                    className={cn(
                      "cursor-pointer hover:bg-muted/50 h-12",
                      activity.modified && "bg-primary/5",
                      activity.validation_errors.length > 0 && "bg-destructive/5"
                    )}
                  >
                    <TableCell className="p-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => toggleRowExpansion(activity.activity_id)}
                      >
                        {expandedRows.has(activity.activity_id) ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronRight className="h-3 w-3" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="p-2">
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">{activity.activity_id}</div>
                        <div className="text-xs text-muted-foreground line-clamp-2">{activity.description}</div>
                      </div>
                    </TableCell>
                    <TableCell className="p-2">
                      <div className="flex items-center gap-1">
                        {activity.type === "Milestone" ? (
                          <Diamond className="h-3 w-3 text-orange-500 dark:text-orange-400" />
                        ) : (
                          <Target className="h-3 w-3 text-blue-500 dark:text-blue-400" />
                        )}
                        <span className="text-xs">{activity.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="p-2">
                      <Badge
                        variant="outline"
                        className={cn("text-xs h-5", getStatusColor(getActivityStatus(activity)))}
                      >
                        {getActivityStatus(activity)}
                      </Badge>
                    </TableCell>
                    <TableCell className="p-2">
                      <div className="space-y-0.5">
                        <Progress value={activity.percent_complete} className="w-12 h-2" />
                        <div className="text-xs text-muted-foreground text-center">{activity.percent_complete}%</div>
                      </div>
                    </TableCell>
                    <TableCell className="p-2">
                      {renderEditableCell(activity, "actual_start", activity.actual_start || "", "date")}
                    </TableCell>
                    <TableCell className="p-2">
                      {renderEditableCell(activity, "actual_finish", activity.actual_finish || "", "date")}
                    </TableCell>
                    <TableCell className="p-2">
                      {renderEditableCell(activity, "delay_reason", activity.delay_reason || "", "select")}
                    </TableCell>
                    <TableCell className="p-2">
                      {renderEditableCell(activity, "change_type", activity.change_type || "no_change", "select")}
                    </TableCell>
                    <TableCell className="p-2">
                      {renderEditableCell(activity, "notes", activity.notes || "", "textarea")}
                    </TableCell>
                    <TableCell className="p-2">
                      <div className="flex items-center gap-1">
                        {activity.is_critical && <GitBranch className="h-3 w-3 text-red-500 dark:text-red-400" />}
                        <Badge variant={activity.is_critical ? "destructive" : "secondary"} className="text-xs h-5">
                          {activity.is_critical ? "Critical" : "Normal"}
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedRows.has(activity.activity_id) && (
                    <TableRow>
                      <TableCell colSpan={11} className="p-2">
                        {renderComparisonView(activity)}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
