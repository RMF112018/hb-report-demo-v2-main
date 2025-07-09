/**
 * @fileoverview Subtask Timeline Component
 * @module SubtaskTimeline
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Visual mini-schedule showing step durations within the activity window
 */

"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  PlayCircle,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
} from "lucide-react"

interface SubStep {
  id: string
  description: string
  startDate: Date
  endDate: Date
  assignedParty: string
  crewSize: number
  estimatedHours: number
  notes: string
  constraints: string[]
  status: "not-started" | "in-progress" | "completed"
  actualStartDate?: Date
  actualEndDate?: Date
  actualHours?: number
}

interface SubtaskTimelineProps {
  subSteps: SubStep[]
  window: { startDate: Date; endDate: Date; weeks: any[] }
  onSubStepClick?: (subStep: SubStep) => void
  onSubStepEdit?: (subStep: SubStep) => void
  className?: string
}

const SubtaskTimeline: React.FC<SubtaskTimelineProps> = ({
  subSteps,
  window,
  onSubStepClick,
  onSubStepEdit,
  className = "",
}) => {
  const [viewMode, setViewMode] = useState<"weeks" | "days">("weeks")
  const [isExpanded, setIsExpanded] = useState(false)

  // Calculate timeline dimensions
  const totalDays = Math.ceil((window.endDate.getTime() - window.startDate.getTime()) / (1000 * 60 * 60 * 24))
  const dayWidth = viewMode === "weeks" ? 20 : 40
  const timelineWidth = totalDays * dayWidth

  const getStatusColor = (status: string) => {
    switch (status) {
      case "not-started":
        return "bg-gray-200 border-gray-300"
      case "in-progress":
        return "bg-blue-200 border-blue-300"
      case "completed":
        return "bg-green-200 border-green-300"
      default:
        return "bg-gray-200 border-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "not-started":
        return <PlayCircle className="h-3 w-3" />
      case "in-progress":
        return <Clock className="h-3 w-3" />
      case "completed":
        return <CheckCircle className="h-3 w-3" />
      default:
        return <PlayCircle className="h-3 w-3" />
    }
  }

  const calculatePosition = (date: Date): number => {
    const diffTime = date.getTime() - window.startDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays * dayWidth)
  }

  const calculateWidth = (startDate: Date, endDate: Date): number => {
    const diffTime = endDate.getTime() - startDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(dayWidth, diffDays * dayWidth)
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const generateTimeScale = () => {
    const scale = []
    const currentDate = new Date(window.startDate)

    while (currentDate <= window.endDate) {
      scale.push(new Date(currentDate))
      if (viewMode === "weeks") {
        currentDate.setDate(currentDate.getDate() + 7)
      } else {
        currentDate.setDate(currentDate.getDate() + 1)
      }
    }

    return scale
  }

  const timeScale = generateTimeScale()

  const checkForConflicts = (subStep: SubStep): boolean => {
    return subSteps.some(
      (other) =>
        other.id !== subStep.id &&
        other.assignedParty === subStep.assignedParty &&
        ((subStep.startDate >= other.startDate && subStep.startDate <= other.endDate) ||
          (subStep.endDate >= other.startDate && subStep.endDate <= other.endDate))
    )
  }

  const getCrewUtilization = () => {
    const crewMap: Record<string, number> = {}
    subSteps.forEach((subStep) => {
      if (!crewMap[subStep.assignedParty]) {
        crewMap[subStep.assignedParty] = 0
      }
      crewMap[subStep.assignedParty] += subStep.crewSize
    })
    return crewMap
  }

  const crewUtilization = getCrewUtilization()

  return (
    <Card className={`border-border ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-semibold">Subtask Timeline</span>
            <Badge variant="outline" className="ml-2">
              {subSteps.length} steps
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === "weeks" ? "days" : "weeks")}
              className="h-8 px-3 text-xs"
            >
              {viewMode === "weeks" ? <ZoomIn className="h-3 w-3 mr-1" /> : <ZoomOut className="h-3 w-3 mr-1" />}
              {viewMode === "weeks" ? "Days" : "Weeks"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="h-8 px-3 text-xs">
              {isExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Timeline Header */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Timeline</span>
            <span className="text-xs text-muted-foreground">
              {formatDate(window.startDate)} - {formatDate(window.endDate)}
            </span>
          </div>

          {/* Time Scale */}
          <div className="relative mb-4" style={{ width: timelineWidth }}>
            <div className="h-8 relative border-b border-border">
              {timeScale.map((date, index) => (
                <div
                  key={index}
                  className="absolute border-l border-border h-full"
                  style={{ left: calculatePosition(date) }}
                >
                  <div className="text-xs text-muted-foreground mt-1 -ml-6">{formatDate(date)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Bars */}
          <div className="space-y-2">
            {subSteps.map((subStep, index) => {
              const left = calculatePosition(subStep.startDate)
              const width = calculateWidth(subStep.startDate, subStep.endDate)
              const hasConflict = checkForConflicts(subStep)

              return (
                <div key={subStep.id} className="relative">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 flex items-center justify-center">{getStatusIcon(subStep.status)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">{subStep.description}</span>
                        <Badge variant="outline" className="text-xs">
                          {subStep.assignedParty}
                        </Badge>
                        {hasConflict && <AlertTriangle className="h-3 w-3 text-amber-500" />}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {subStep.crewSize} crew • {subStep.estimatedHours}h
                      </div>
                    </div>
                  </div>

                  {/* Timeline Bar */}
                  <div className="relative h-8 mb-2">
                    <div
                      className={`absolute top-1 h-6 rounded border cursor-pointer transition-all hover:opacity-80 ${getStatusColor(
                        subStep.status
                      )} ${hasConflict ? "border-amber-500" : ""}`}
                      style={{ left: `${left}px`, width: `${width}px` }}
                      onClick={() => onSubStepClick && onSubStepClick(subStep)}
                    >
                      <div className="p-1 text-xs font-medium truncate">{subStep.description}</div>
                      {subStep.status === "in-progress" && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-b"></div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Crew Utilization Summary */}
        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-3">Crew Utilization</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(crewUtilization).map(([crew, size]) => (
              <div key={crew} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">{crew}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {size} crew
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Statistics */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">{subSteps.length}</div>
              <div className="text-xs text-muted-foreground">Total Steps</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">
                {subSteps.filter((s) => s.status === "completed").length}
              </div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-amber-600">
                {subSteps.filter((s) => checkForConflicts(s)).length}
              </div>
              <div className="text-xs text-muted-foreground">Conflicts</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-purple-600">
                {subSteps.reduce((sum, s) => sum + s.estimatedHours, 0)}h
              </div>
              <div className="text-xs text-muted-foreground">Total Hours</div>
            </div>
          </div>
        </div>

        {/* Conflicts Warning */}
        {subSteps.some((s) => checkForConflicts(s)) && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Resource Conflicts Detected
              </span>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
              Multiple tasks are assigned to the same crew during overlapping time periods.
            </p>
          </div>
        )}

        {subSteps.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No subtasks to display</p>
            <p className="text-sm">Add subtasks to see the timeline</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default SubtaskTimeline
