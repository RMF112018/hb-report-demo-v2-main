/**
 * @fileoverview Fragnet Builder Component
 * @module FragnetBuilder
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Mini-Gantt component for building fragnet sequences:
 * - Visual activity sequencing
 * - Drag-and-drop relationship building
 * - Logic tie creation and editing
 * - Sequence validation
 * - Export fragnet for integration
 */

"use client"

import React, { useState, useCallback, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import {
  GitBranch,
  Plus,
  Trash2,
  Save,
  X,
  ArrowRight,
  ArrowDown,
  Calendar,
  Clock,
  Target,
  Diamond,
  Move,
  Link,
  Unlink,
  AlertTriangle,
  CheckCircle,
  Settings,
  Download,
  Upload,
  Sparkles,
  Zap,
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

interface FragnetActivity {
  id: string
  activity_id: string
  description: string
  type: "Milestone" | "Task"
  duration: number
  start_date: string
  finish_date: string
  predecessors: string[]
  successors: string[]
  position: { x: number; y: number }
  selected: boolean
}

interface FragnetLink {
  id: string
  from: string
  to: string
  type: "FS" | "SS" | "FF" | "SF" // Finish-Start, Start-Start, Finish-Finish, Start-Finish
  lag: number
  description?: string
}

interface FragnetBuilderProps {
  activities: UpdateActivity[]
  onClose: () => void
  onFragnetUpdate: (fragnet: { activities: FragnetActivity[]; links: FragnetLink[] }) => void
}

const linkTypes = [
  { value: "FS", label: "Finish-to-Start", icon: ArrowRight },
  { value: "SS", label: "Start-to-Start", icon: ArrowDown },
  { value: "FF", label: "Finish-to-Finish", icon: ArrowRight },
  { value: "SF", label: "Start-to-Finish", icon: ArrowDown },
]

export const FragnetBuilder: React.FC<FragnetBuilderProps> = ({ activities, onClose, onFragnetUpdate }) => {
  const [fragnetActivities, setFragnetActivities] = useState<FragnetActivity[]>([])
  const [fragnetLinks, setFragnetLinks] = useState<FragnetLink[]>([])
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null)
  const [selectedLink, setSelectedLink] = useState<string | null>(null)
  const [linkingMode, setLinkingMode] = useState(false)
  const [linkingFrom, setLinkingFrom] = useState<string | null>(null)
  const [newLinkType, setNewLinkType] = useState<"FS" | "SS" | "FF" | "SF">("FS")
  const [newLinkLag, setNewLinkLag] = useState(0)
  const [draggedActivity, setDraggedActivity] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const canvasRef = useRef<HTMLDivElement>(null)

  // Initialize fragnet with existing activities
  useEffect(() => {
    const initialFragnet = activities.map((activity, index) => ({
      id: `fragnet-${activity.activity_id}`,
      activity_id: activity.activity_id,
      description: activity.description,
      type: activity.type,
      duration: calculateDuration(activity.current_start, activity.current_finish),
      start_date: activity.current_start,
      finish_date: activity.current_finish,
      predecessors: [],
      successors: [],
      position: { x: 50 + (index % 3) * 200, y: 50 + Math.floor(index / 3) * 100 },
      selected: false,
    }))
    setFragnetActivities(initialFragnet)
  }, [activities])

  // Calculate duration between dates
  const calculateDuration = useCallback((start: string, finish: string) => {
    const startDate = new Date(start)
    const finishDate = new Date(finish)
    const diffTime = finishDate.getTime() - startDate.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }, [])

  // Handle activity selection
  const handleActivitySelect = useCallback(
    (activityId: string) => {
      if (linkingMode && linkingFrom && linkingFrom !== activityId) {
        // Create new link
        const newLink: FragnetLink = {
          id: `link-${Date.now()}`,
          from: linkingFrom,
          to: activityId,
          type: newLinkType,
          lag: newLinkLag,
          description: `${newLinkType} link with ${newLinkLag} day lag`,
        }

        setFragnetLinks((prev) => [...prev, newLink])
        setLinkingMode(false)
        setLinkingFrom(null)

        // Update predecessors and successors
        setFragnetActivities((prev) =>
          prev.map((activity) => {
            if (activity.id === linkingFrom) {
              return { ...activity, successors: [...activity.successors, activityId] }
            }
            if (activity.id === activityId) {
              return { ...activity, predecessors: [...activity.predecessors, linkingFrom] }
            }
            return activity
          })
        )
      } else {
        setSelectedActivity(activityId)
        setFragnetActivities((prev) =>
          prev.map((activity) => ({
            ...activity,
            selected: activity.id === activityId,
          }))
        )
      }
    },
    [linkingMode, linkingFrom, newLinkType, newLinkLag]
  )

  // Handle drag start
  const handleDragStart = useCallback((activityId: string, event: React.DragEvent) => {
    setDraggedActivity(activityId)
    event.dataTransfer.effectAllowed = "move"
  }, [])

  // Handle drop
  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      if (draggedActivity && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top

        setFragnetActivities((prev) =>
          prev.map((activity) => (activity.id === draggedActivity ? { ...activity, position: { x, y } } : activity))
        )
        setDraggedActivity(null)
      }
    },
    [draggedActivity]
  )

  // Start linking mode
  const startLinking = useCallback((activityId: string) => {
    setLinkingMode(true)
    setLinkingFrom(activityId)
  }, [])

  // Add new activity
  const addNewActivity = useCallback(() => {
    const newActivity: FragnetActivity = {
      id: `new-activity-${Date.now()}`,
      activity_id: `NEW-${Date.now()}`,
      description: "New Activity",
      type: "Task",
      duration: 5,
      start_date: format(new Date(), "yyyy-MM-dd"),
      finish_date: format(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
      predecessors: [],
      successors: [],
      position: { x: 100, y: 100 },
      selected: false,
    }
    setFragnetActivities((prev) => [...prev, newActivity])
  }, [])

  // Delete activity
  const deleteActivity = useCallback((activityId: string) => {
    setFragnetActivities((prev) => prev.filter((activity) => activity.id !== activityId))
    setFragnetLinks((prev) => prev.filter((link) => link.from !== activityId && link.to !== activityId))
  }, [])

  // Delete link
  const deleteLink = useCallback(
    (linkId: string) => {
      const link = fragnetLinks.find((l) => l.id === linkId)
      if (link) {
        setFragnetLinks((prev) => prev.filter((l) => l.id !== linkId))
        setFragnetActivities((prev) =>
          prev.map((activity) => {
            if (activity.id === link.from) {
              return { ...activity, successors: activity.successors.filter((s) => s !== link.to) }
            }
            if (activity.id === link.to) {
              return { ...activity, predecessors: activity.predecessors.filter((p) => p !== link.from) }
            }
            return activity
          })
        )
      }
    },
    [fragnetLinks]
  )

  // Validate fragnet
  const validateFragnet = useCallback(() => {
    const errors: string[] = []

    // Check for circular dependencies
    const visited = new Set<string>()
    const recursionStack = new Set<string>()

    const hasCycle = (activityId: string): boolean => {
      if (recursionStack.has(activityId)) return true
      if (visited.has(activityId)) return false

      visited.add(activityId)
      recursionStack.add(activityId)

      const activity = fragnetActivities.find((a) => a.id === activityId)
      if (activity) {
        for (const successor of activity.successors) {
          if (hasCycle(successor)) return true
        }
      }

      recursionStack.delete(activityId)
      return false
    }

    for (const activity of fragnetActivities) {
      if (hasCycle(activity.id)) {
        errors.push(`Circular dependency detected involving ${activity.description}`)
        break
      }
    }

    // Check for orphaned activities
    const orphanedActivities = fragnetActivities.filter(
      (activity) => activity.predecessors.length === 0 && activity.successors.length === 0
    )
    if (orphanedActivities.length > 0) {
      errors.push(`${orphanedActivities.length} orphaned activities found`)
    }

    setValidationErrors(errors)
    return errors.length === 0
  }, [fragnetActivities])

  // Save fragnet
  const saveFragnet = useCallback(() => {
    if (validateFragnet()) {
      onFragnetUpdate({ activities: fragnetActivities, links: fragnetLinks })
      onClose()
    }
  }, [fragnetActivities, fragnetLinks, validateFragnet, onFragnetUpdate, onClose])

  // Render activity node
  const renderActivityNode = useCallback(
    (activity: FragnetActivity) => {
      const isSelected = activity.selected
      const isLinking = linkingMode && linkingFrom === activity.id

      return (
        <div
          key={activity.id}
          className={cn(
            "absolute cursor-pointer border-2 rounded-lg p-3 bg-background shadow-sm transition-all",
            isSelected && "border-primary shadow-md",
            isLinking && "border-green-500 dark:border-green-400 shadow-lg",
            activity.type === "Milestone"
              ? "border-orange-400 dark:border-orange-500"
              : "border-blue-400 dark:border-blue-500"
          )}
          style={{
            left: activity.position.x,
            top: activity.position.y,
            width: 180,
            minHeight: 80,
          }}
          draggable
          onDragStart={(e) => handleDragStart(activity.id, e)}
          onClick={() => handleActivitySelect(activity.id)}
        >
          <div className="flex items-center gap-2 mb-2">
            {activity.type === "Milestone" ? (
              <Diamond className="h-4 w-4 text-orange-500 dark:text-orange-400" />
            ) : (
              <Target className="h-4 w-4 text-blue-500 dark:text-blue-400" />
            )}
            <div className="text-xs font-medium text-muted-foreground">{activity.activity_id}</div>
          </div>
          <div className="text-sm font-medium mb-1 line-clamp-2">{activity.description}</div>
          <div className="text-xs text-muted-foreground">{activity.duration} days</div>

          {/* Action buttons */}
          <div className="flex gap-1 mt-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation()
                startLinking(activity.id)
              }}
              className="h-6 w-6 p-0"
            >
              <Link className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation()
                deleteActivity(activity.id)
              }}
              className="h-6 w-6 p-0 text-red-500 dark:text-red-400"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )
    },
    [linkingMode, linkingFrom, handleActivitySelect, handleDragStart, startLinking, deleteActivity]
  )

  // Render link arrow
  const renderLink = useCallback(
    (link: FragnetLink) => {
      const fromActivity = fragnetActivities.find((a) => a.id === link.from)
      const toActivity = fragnetActivities.find((a) => a.id === link.to)

      if (!fromActivity || !toActivity) return null

      const fromX = fromActivity.position.x + 90
      const fromY = fromActivity.position.y + 40
      const toX = toActivity.position.x + 90
      const toY = toActivity.position.y + 40

      return (
        <svg
          key={link.id}
          className="absolute pointer-events-none"
          style={{
            left: Math.min(fromX, toX) - 5,
            top: Math.min(fromY, toY) - 5,
            width: Math.abs(toX - fromX) + 10,
            height: Math.abs(toY - fromY) + 10,
          }}
        >
          <defs>
            <marker id={`arrowhead-${link.id}`} markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--primary))" />
            </marker>
          </defs>
          <line
            x1={fromX - Math.min(fromX, toX) + 5}
            y1={fromY - Math.min(fromY, toY) + 5}
            x2={toX - Math.min(fromX, toX) + 5}
            y2={toY - Math.min(fromY, toY) + 5}
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            markerEnd={`url(#arrowhead-${link.id})`}
          />
          <text
            x={(fromX + toX) / 2 - Math.min(fromX, toX) + 5}
            y={(fromY + toY) / 2 - Math.min(fromY, toY) + 5}
            className="text-xs fill-primary font-medium"
            textAnchor="middle"
          >
            {link.type}
          </text>
        </svg>
      )
    },
    [fragnetActivities]
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Fragnet Builder
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={addNewActivity}>
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <ul className="space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Linking Controls */}
        {linkingMode && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium text-green-800 dark:text-green-200">
                Linking Mode: Select target activity
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm">Type:</Label>
                <Select value={newLinkType} onValueChange={(value: any) => setNewLinkType(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {linkTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm">Lag:</Label>
                <Input
                  type="number"
                  value={newLinkLag}
                  onChange={(e) => setNewLinkLag(parseInt(e.target.value) || 0)}
                  className="w-20"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setLinkingMode(false)
                  setLinkingFrom(null)
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Canvas */}
        <div className="relative border rounded-lg bg-muted/50 overflow-hidden">
          <ScrollArea className="h-96">
            <div
              ref={canvasRef}
              className="relative w-full h-full min-w-[800px] min-h-[600px]"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              {/* Render links */}
              {fragnetLinks.map(renderLink)}

              {/* Render activities */}
              {fragnetActivities.map(renderActivityNode)}
            </div>
          </ScrollArea>
        </div>

        {/* Statistics */}
        <div className="mt-4 grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{fragnetActivities.length}</div>
            <div className="text-sm text-muted-foreground">Activities</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{fragnetLinks.length}</div>
            <div className="text-sm text-muted-foreground">Links</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {fragnetActivities.filter((a) => a.type === "Milestone").length}
            </div>
            <div className="text-sm text-muted-foreground">Milestones</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{validationErrors.length}</div>
            <div className="text-sm text-muted-foreground">Errors</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setFragnetActivities(
                  activities.map((activity, index) => ({
                    id: `fragnet-${activity.activity_id}`,
                    activity_id: activity.activity_id,
                    description: activity.description,
                    type: activity.type,
                    duration: calculateDuration(activity.current_start, activity.current_finish),
                    start_date: activity.current_start,
                    finish_date: activity.current_finish,
                    predecessors: [],
                    successors: [],
                    position: { x: 50 + (index % 3) * 200, y: 50 + Math.floor(index / 3) * 100 },
                    selected: false,
                  }))
                )
              }
            >
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={() => validateFragnet()}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Validate
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={saveFragnet} disabled={validationErrors.length > 0}>
              <Save className="h-4 w-4 mr-2" />
              Save Fragnet
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
