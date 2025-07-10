/**
 * @fileoverview Look Ahead Activity Panel Component
 * @module LookAheadActivityPanel
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Expandable list of activities from the schedule that fall within the window
 */

"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  Users,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  PlayCircle,
  Plus,
  Edit,
  Eye,
} from "lucide-react"

interface ScheduleActivity {
  id: string
  activityId: string
  name: string
  description: string
  startDate: Date
  endDate: Date
  duration: number
  progress: number
  status: "not-started" | "in-progress" | "completed" | "delayed"
  priority: "low" | "medium" | "high"
  location: string
  crew: string
  predecessors: string[]
  successors: string[]
  constraints: string[]
  lookAheadEntries?: LookAheadEntry[]
}

interface LookAheadEntry {
  id: string
  activityId: string
  subSteps: SubStep[]
  createdBy: string
  createdDate: Date
  lastUpdated: Date
  week: number
  status: "draft" | "committed" | "completed"
}

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

interface LookAheadActivityPanelProps {
  activities: ScheduleActivity[]
  window: { startDate: Date; endDate: Date; weeks: any[] }
  onActivitySelect: (activity: ScheduleActivity) => void
  onCreateLookAhead: (activityId: string) => void
  onEditLookAhead: (activityId: string, entryId: string) => void
  selectedActivityId?: string
  className?: string
}

const LookAheadActivityPanel: React.FC<LookAheadActivityPanelProps> = ({
  activities,
  window,
  onActivitySelect,
  onCreateLookAhead,
  onEditLookAhead,
  selectedActivityId,
  className = "",
}) => {
  const [expandedActivities, setExpandedActivities] = useState<Set<string>>(new Set())

  const toggleActivity = (activityId: string) => {
    const newExpanded = new Set(expandedActivities)
    if (newExpanded.has(activityId)) {
      newExpanded.delete(activityId)
    } else {
      newExpanded.add(activityId)
    }
    setExpandedActivities(newExpanded)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "not-started":
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30"
      case "in-progress":
        return "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30"
      case "completed":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30"
      case "delayed":
        return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30"
      default:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30"
      case "medium":
        return "text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30"
      case "low":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30"
      default:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "not-started":
        return <PlayCircle className="h-4 w-4" />
      case "in-progress":
        return <Clock className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "delayed":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <PlayCircle className="h-4 w-4" />
    }
  }

  const formatDateRange = (start: Date, end: Date): string => {
    const startStr = start.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    const endStr = end.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    return `${startStr} - ${endStr}`
  }

  const getWeekForActivity = (activity: ScheduleActivity): number => {
    const activityStart = activity.startDate
    for (let i = 0; i < window.weeks.length; i++) {
      const week = window.weeks[i]
      if (activityStart >= week.startDate && activityStart <= week.endDate) {
        return i + 1
      }
    }
    return 0
  }

  const groupedActivities = activities.reduce((groups, activity) => {
    const week = getWeekForActivity(activity)
    if (week > 0) {
      if (!groups[week]) groups[week] = []
      groups[week].push(activity)
    }
    return groups
  }, {} as Record<number, ScheduleActivity[]>)

  return (
    <Card className={`border-border ${className}`}>
      <CardContent className="space-y-4">
        {Object.entries(groupedActivities).map(([week, weekActivities]) => (
          <div key={week} className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground border-b pb-1">
              Week {week} ({weekActivities.length} activities)
            </h4>

            {weekActivities.map((activity) => (
              <Collapsible key={activity.id} className="border rounded-lg">
                <CollapsibleTrigger asChild>
                  <div
                    className={`p-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedActivityId === activity.id ? "bg-blue-50 dark:bg-blue-950/30" : ""
                    }`}
                    onClick={() => {
                      onActivitySelect(activity)
                      toggleActivity(activity.id)
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(activity.status)}
                          {expandedActivities.has(activity.id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm">{activity.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {activity.activityId}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDateRange(activity.startDate, activity.endDate)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${getStatusColor(activity.status)}`}>
                          {activity.status.replace("-", " ")}
                        </Badge>
                        <Badge className={`text-xs ${getPriorityColor(activity.priority)}`}>{activity.priority}</Badge>
                        <div className="text-xs text-muted-foreground">{activity.progress}%</div>
                      </div>
                    </div>
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="px-3 pb-3 border-t bg-muted/20">
                    <div className="mt-3 space-y-3">
                      {/* Activity Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span>Location: {activity.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span>Crew: {activity.crew}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span>Duration: {activity.duration} days</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span>Week: {getWeekForActivity(activity)}</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Progress</span>
                          <span>{activity.progress}%</span>
                        </div>
                        <Progress value={activity.progress} className="h-2" />
                      </div>

                      {/* Description */}
                      <div className="text-xs text-muted-foreground">
                        <p>{activity.description}</p>
                      </div>

                      {/* Constraints */}
                      {activity.constraints.length > 0 && (
                        <div className="text-xs">
                          <p className="font-medium mb-1">Constraints:</p>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            {activity.constraints.map((constraint, index) => (
                              <li key={index}>{constraint}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Look Ahead Entries */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="text-xs">
                          {activity.lookAheadEntries?.length ? (
                            <span className="text-green-600">
                              {activity.lookAheadEntries.length} Look Ahead entries
                            </span>
                          ) : (
                            <span className="text-muted-foreground">No Look Ahead entries</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {activity.lookAheadEntries?.length ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                onEditLookAhead(activity.id, activity.lookAheadEntries![0].id)
                              }}
                              className="h-6 px-2 text-xs"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                onCreateLookAhead(activity.id)
                              }}
                              className="h-6 px-2 text-xs"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Create Look Ahead
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              onActivitySelect(activity)
                            }}
                            className="h-6 px-2 text-xs"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        ))}

        {Object.values(groupedActivities).flat().length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No activities found in the selected window</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default LookAheadActivityPanel
