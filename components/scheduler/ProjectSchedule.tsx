/**
 * @fileoverview Project Schedule Gantt View Component
 * @module ProjectSchedule
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Professional Gantt-style view with schedule updates, critical path visualization,
 * filtering, export options, and AI support for project schedule management.
 */

"use client"

import React, { useState, useMemo, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Toggle } from "@/components/ui/toggle"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import {
  Calendar,
  Clock,
  Filter,
  Download,
  GitBranch,
  Eye,
  EyeOff,
  Diamond,
  BarChart3,
  Zap,
  AlertTriangle,
  Target,
  TrendingUp,
  TrendingDown,
  Brain,
  MessageSquare,
  RefreshCw,
  FileText,
  Share2,
  Settings,
  ChevronRight,
  ChevronDown,
  Info,
  Sparkles,
} from "lucide-react"

// TypeScript interfaces for schedule data
interface ScheduleUpdate {
  update_id: string
  start: string
  finish: string
}

interface ScheduleActivity {
  activity_id: string
  description: string
  type: "Milestone" | "Task"
  baseline_start: string
  baseline_finish: string
  updates: ScheduleUpdate[]
}

interface ScheduleData {
  activities: ScheduleActivity[]
  criticalPath: string[]
  aiInsights: AIInsight[]
}

interface AIInsight {
  id: string
  type: "alert" | "opportunity" | "risk" | "forecast"
  severity: "low" | "medium" | "high"
  title: string
  description: string
  confidence: number
  relatedActivities: string[]
  suggestedActions: string[]
}

interface ActivityBar {
  activity: ScheduleActivity
  currentUpdate: ScheduleUpdate
  baselineUpdate: ScheduleUpdate
  isOnCriticalPath: boolean
  durationDays: number
  variance: number
  position: {
    start: number
    width: number
  }
}

interface ProjectScheduleProps {
  userRole: string
  projectData: any
  projectId?: string
}

// Complete mock dataset with 20 activities (7 milestones, 13 tasks)
const mockScheduleData: ScheduleData = {
  activities: [
    {
      activity_id: "A001",
      description: "Milestone - Project Kickoff",
      type: "Milestone",
      baseline_start: "2025-09-08",
      baseline_finish: "2025-09-08",
      updates: [
        { update_id: "Update_1", start: "2025-09-07", finish: "2025-09-07" },
        { update_id: "Update_2", start: "2025-09-14", finish: "2025-09-14" },
        { update_id: "Update_3", start: "2025-09-08", finish: "2025-09-08" },
        { update_id: "Update_4", start: "2025-09-11", finish: "2025-09-11" },
      ],
    },
    {
      activity_id: "A002",
      description: "Milestone - Design Approval",
      type: "Milestone",
      baseline_start: "2025-09-02",
      baseline_finish: "2025-09-02",
      updates: [
        { update_id: "Update_1", start: "2025-09-05", finish: "2025-09-05" },
        { update_id: "Update_2", start: "2025-09-06", finish: "2025-09-06" },
        { update_id: "Update_3", start: "2025-09-08", finish: "2025-09-08" },
        { update_id: "Update_4", start: "2025-09-06", finish: "2025-09-06" },
      ],
    },
    {
      activity_id: "A003",
      description: "Milestone - Foundation Complete",
      type: "Milestone",
      baseline_start: "2025-09-12",
      baseline_finish: "2025-09-12",
      updates: [
        { update_id: "Update_1", start: "2025-09-13", finish: "2025-09-13" },
        { update_id: "Update_2", start: "2025-09-17", finish: "2025-09-17" },
        { update_id: "Update_3", start: "2025-09-15", finish: "2025-09-15" },
        { update_id: "Update_4", start: "2025-09-18", finish: "2025-09-18" },
      ],
    },
    {
      activity_id: "A004",
      description: "Task - Site Preparation",
      type: "Task",
      baseline_start: "2025-09-05",
      baseline_finish: "2025-09-19",
      updates: [
        { update_id: "Update_1", start: "2025-09-04", finish: "2025-09-18" },
        { update_id: "Update_2", start: "2025-09-06", finish: "2025-09-20" },
        { update_id: "Update_3", start: "2025-09-07", finish: "2025-09-21" },
        { update_id: "Update_4", start: "2025-09-06", finish: "2025-09-19" },
      ],
    },
    {
      activity_id: "A005",
      description: "Task - Excavation Work",
      type: "Task",
      baseline_start: "2025-09-10",
      baseline_finish: "2025-09-24",
      updates: [
        { update_id: "Update_1", start: "2025-09-12", finish: "2025-09-26" },
        { update_id: "Update_2", start: "2025-09-11", finish: "2025-09-25" },
        { update_id: "Update_3", start: "2025-09-13", finish: "2025-09-27" },
        { update_id: "Update_4", start: "2025-09-12", finish: "2025-09-26" },
      ],
    },
    {
      activity_id: "A006",
      description: "Milestone - Permit Approval",
      type: "Milestone",
      baseline_start: "2025-09-15",
      baseline_finish: "2025-09-15",
      updates: [
        { update_id: "Update_1", start: "2025-09-16", finish: "2025-09-16" },
        { update_id: "Update_2", start: "2025-09-18", finish: "2025-09-18" },
        { update_id: "Update_3", start: "2025-09-17", finish: "2025-09-17" },
        { update_id: "Update_4", start: "2025-09-19", finish: "2025-09-19" },
      ],
    },
    {
      activity_id: "A007",
      description: "Task - Foundation Pour",
      type: "Task",
      baseline_start: "2025-09-20",
      baseline_finish: "2025-10-05",
      updates: [
        { update_id: "Update_1", start: "2025-09-22", finish: "2025-10-07" },
        { update_id: "Update_2", start: "2025-09-21", finish: "2025-10-06" },
        { update_id: "Update_3", start: "2025-09-23", finish: "2025-10-08" },
        { update_id: "Update_4", start: "2025-09-22", finish: "2025-10-07" },
      ],
    },
    {
      activity_id: "A008",
      description: "Task - Structural Steel",
      type: "Task",
      baseline_start: "2025-10-08",
      baseline_finish: "2025-10-30",
      updates: [
        { update_id: "Update_1", start: "2025-10-10", finish: "2025-11-01" },
        { update_id: "Update_2", start: "2025-10-09", finish: "2025-10-31" },
        { update_id: "Update_3", start: "2025-10-11", finish: "2025-11-02" },
        { update_id: "Update_4", start: "2025-10-10", finish: "2025-11-01" },
      ],
    },
    {
      activity_id: "A009",
      description: "Milestone - Structure Complete",
      type: "Milestone",
      baseline_start: "2025-11-05",
      baseline_finish: "2025-11-05",
      updates: [
        { update_id: "Update_1", start: "2025-11-07", finish: "2025-11-07" },
        { update_id: "Update_2", start: "2025-11-06", finish: "2025-11-06" },
        { update_id: "Update_3", start: "2025-11-08", finish: "2025-11-08" },
        { update_id: "Update_4", start: "2025-11-07", finish: "2025-11-07" },
      ],
    },
    {
      activity_id: "A010",
      description: "Task - MEP Rough-In",
      type: "Task",
      baseline_start: "2025-11-10",
      baseline_finish: "2025-12-15",
      updates: [
        { update_id: "Update_1", start: "2025-11-12", finish: "2025-12-17" },
        { update_id: "Update_2", start: "2025-11-11", finish: "2025-12-16" },
        { update_id: "Update_3", start: "2025-11-13", finish: "2025-12-18" },
        { update_id: "Update_4", start: "2025-11-12", finish: "2025-12-17" },
      ],
    },
    {
      activity_id: "A011",
      description: "Task - Drywall Installation",
      type: "Task",
      baseline_start: "2025-12-18",
      baseline_finish: "2026-01-20",
      updates: [
        { update_id: "Update_1", start: "2025-12-20", finish: "2026-01-22" },
        { update_id: "Update_2", start: "2025-12-19", finish: "2026-01-21" },
        { update_id: "Update_3", start: "2025-12-21", finish: "2026-01-23" },
        { update_id: "Update_4", start: "2025-12-20", finish: "2026-01-22" },
      ],
    },
    {
      activity_id: "A012",
      description: "Milestone - MEP Complete",
      type: "Milestone",
      baseline_start: "2026-01-25",
      baseline_finish: "2026-01-25",
      updates: [
        { update_id: "Update_1", start: "2026-01-27", finish: "2026-01-27" },
        { update_id: "Update_2", start: "2026-01-26", finish: "2026-01-26" },
        { update_id: "Update_3", start: "2026-01-28", finish: "2026-01-28" },
        { update_id: "Update_4", start: "2026-01-27", finish: "2026-01-27" },
      ],
    },
    {
      activity_id: "A013",
      description: "Task - Flooring Installation",
      type: "Task",
      baseline_start: "2026-01-30",
      baseline_finish: "2026-02-25",
      updates: [
        { update_id: "Update_1", start: "2026-02-01", finish: "2026-02-27" },
        { update_id: "Update_2", start: "2026-01-31", finish: "2026-02-26" },
        { update_id: "Update_3", start: "2026-02-02", finish: "2026-02-28" },
        { update_id: "Update_4", start: "2026-02-01", finish: "2026-02-27" },
      ],
    },
    {
      activity_id: "A014",
      description: "Task - Painting & Finishes",
      type: "Task",
      baseline_start: "2026-02-28",
      baseline_finish: "2026-03-20",
      updates: [
        { update_id: "Update_1", start: "2026-03-02", finish: "2026-03-22" },
        { update_id: "Update_2", start: "2026-03-01", finish: "2026-03-21" },
        { update_id: "Update_3", start: "2026-03-03", finish: "2026-03-23" },
        { update_id: "Update_4", start: "2026-03-02", finish: "2026-03-22" },
      ],
    },
    {
      activity_id: "A015",
      description: "Milestone - Interior Complete",
      type: "Milestone",
      baseline_start: "2026-03-25",
      baseline_finish: "2026-03-25",
      updates: [
        { update_id: "Update_1", start: "2026-03-27", finish: "2026-03-27" },
        { update_id: "Update_2", start: "2026-03-26", finish: "2026-03-26" },
        { update_id: "Update_3", start: "2026-03-28", finish: "2026-03-28" },
        { update_id: "Update_4", start: "2026-03-27", finish: "2026-03-27" },
      ],
    },
    {
      activity_id: "A016",
      description: "Task - Final Inspections",
      type: "Task",
      baseline_start: "2026-03-28",
      baseline_finish: "2026-04-10",
      updates: [
        { update_id: "Update_1", start: "2026-03-30", finish: "2026-04-12" },
        { update_id: "Update_2", start: "2026-03-29", finish: "2026-04-11" },
        { update_id: "Update_3", start: "2026-03-31", finish: "2026-04-13" },
        { update_id: "Update_4", start: "2026-03-30", finish: "2026-04-12" },
      ],
    },
    {
      activity_id: "A017",
      description: "Task - Commissioning",
      type: "Task",
      baseline_start: "2026-04-13",
      baseline_finish: "2026-04-25",
      updates: [
        { update_id: "Update_1", start: "2026-04-15", finish: "2026-04-27" },
        { update_id: "Update_2", start: "2026-04-14", finish: "2026-04-26" },
        { update_id: "Update_3", start: "2026-04-16", finish: "2026-04-28" },
        { update_id: "Update_4", start: "2026-04-15", finish: "2026-04-27" },
      ],
    },
    {
      activity_id: "A018",
      description: "Milestone - Substantial Completion",
      type: "Milestone",
      baseline_start: "2026-04-30",
      baseline_finish: "2026-04-30",
      updates: [
        { update_id: "Update_1", start: "2026-05-02", finish: "2026-05-02" },
        { update_id: "Update_2", start: "2026-05-01", finish: "2026-05-01" },
        { update_id: "Update_3", start: "2026-05-03", finish: "2026-05-03" },
        { update_id: "Update_4", start: "2026-05-02", finish: "2026-05-02" },
      ],
    },
    {
      activity_id: "A019",
      description: "Task - Punch List",
      type: "Task",
      baseline_start: "2026-05-03",
      baseline_finish: "2026-05-15",
      updates: [
        { update_id: "Update_1", start: "2026-05-05", finish: "2026-05-17" },
        { update_id: "Update_2", start: "2026-05-04", finish: "2026-05-16" },
        { update_id: "Update_3", start: "2026-05-06", finish: "2026-05-18" },
        { update_id: "Update_4", start: "2026-05-05", finish: "2026-05-17" },
      ],
    },
    {
      activity_id: "A020",
      description: "Milestone - Final Completion",
      type: "Milestone",
      baseline_start: "2026-05-18",
      baseline_finish: "2026-05-18",
      updates: [
        { update_id: "Update_1", start: "2026-05-20", finish: "2026-05-20" },
        { update_id: "Update_2", start: "2026-05-19", finish: "2026-05-19" },
        { update_id: "Update_3", start: "2026-05-21", finish: "2026-05-21" },
        { update_id: "Update_4", start: "2026-05-20", finish: "2026-05-20" },
      ],
    },
  ],
  criticalPath: ["A001", "A002", "A004", "A007", "A008", "A009", "A010", "A012", "A018", "A020"],
  aiInsights: [
    {
      id: "insight-1",
      type: "alert",
      severity: "high",
      title: "Foundation Milestone Delayed",
      description:
        "Foundation completion milestone (A003) has shifted 6 days beyond baseline due to weather delays and permit issues.",
      confidence: 94,
      relatedActivities: ["A003", "A006", "A007"],
      suggestedActions: [
        "Expedite permit approval process",
        "Implement weather protection measures",
        "Consider overtime work to recover schedule",
      ],
    },
    {
      id: "insight-2",
      type: "opportunity",
      severity: "medium",
      title: "Parallel MEP Activities",
      description: "MEP rough-in activities show potential for 3-day acceleration through parallel execution.",
      confidence: 87,
      relatedActivities: ["A010", "A011"],
      suggestedActions: [
        "Coordinate MEP and drywall crews",
        "Implement zone-based scheduling",
        "Add MEP coordination support",
      ],
    },
    {
      id: "insight-3",
      type: "risk",
      severity: "high",
      title: "Critical Path Extension",
      description:
        "Current schedule shows 2-day extension to critical path, impacting substantial completion milestone.",
      confidence: 91,
      relatedActivities: ["A018", "A020"],
      suggestedActions: ["Review resource allocation", "Identify crash opportunities", "Accelerate final inspections"],
    },
  ],
}

// Gantt Chart Time Scale Component
const TimeScale: React.FC<{ startDate: Date; endDate: Date; timelineWidth: number }> = React.memo(
  ({ startDate, endDate, timelineWidth }) => {
    const timeScale = useMemo(() => {
      const periods: Array<{ label: string; position: number; width: number; isMonth: boolean }> = []
      const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

      // Create unique month-year periods
      const current = new Date(startDate)
      current.setDate(1) // Start from the first day of the month
      let cumulativeDays = 0

      const uniqueMonths = new Set<string>()

      while (current <= endDate) {
        const monthYear = `${current.toLocaleDateString("en-US", {
          month: "short",
        })}-${current.getFullYear().toString().slice(-2)}`

        // Skip if we already processed this month-year combination
        if (uniqueMonths.has(monthYear)) {
          current.setMonth(current.getMonth() + 1)
          continue
        }

        uniqueMonths.add(monthYear)

        // Calculate the period for this month
        const monthStart = new Date(current)
        const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0) // Last day of the month

        // Adjust for timeline boundaries
        const effectiveStart = monthStart < startDate ? startDate : monthStart
        const effectiveEnd = monthEnd > endDate ? endDate : monthEnd

        // Calculate days in this period
        const periodDays = Math.ceil((effectiveEnd.getTime() - effectiveStart.getTime()) / (1000 * 60 * 60 * 24)) + 1

        // Calculate position based on days from timeline start
        const daysFromStart = Math.floor((effectiveStart.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        const position = (daysFromStart / totalDays) * timelineWidth
        const width = (periodDays / totalDays) * timelineWidth

        periods.push({
          label: monthYear,
          position,
          width,
          isMonth: true,
        })

        // Move to next month
        current.setMonth(current.getMonth() + 1)
      }

      return periods
    }, [startDate, endDate, timelineWidth])

    return (
      <div className="relative border-b border-border bg-muted h-12">
        {timeScale.map((period, index) => (
          <div
            key={index}
            className="absolute top-0 h-full border-r border-border flex items-center justify-center text-xs font-medium text-muted-foreground"
            style={{
              left: `${period.position}px`,
              width: `${period.width}px`,
            }}
          >
            {period.label}
          </div>
        ))}
      </div>
    )
  }
)

// Activity Row Component
const ActivityRow: React.FC<{
  activity: ScheduleActivity
  currentUpdate: ScheduleUpdate
  baselineUpdate: ScheduleUpdate
  isOnCriticalPath: boolean
  showCriticalPath: boolean
  showDifferences: boolean
  comparisonMode: string
  timelineStart: Date
  timelineEnd: Date
  timelineWidth: number
  onActivityClick: (activity: ScheduleActivity) => void
}> = React.memo(
  ({
    activity,
    currentUpdate,
    baselineUpdate,
    isOnCriticalPath,
    showCriticalPath,
    showDifferences,
    comparisonMode,
    timelineStart,
    timelineEnd,
    timelineWidth,
    onActivityClick,
  }) => {
    const activityBar = useMemo(() => {
      const totalDays = Math.ceil((timelineEnd.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24))
      const currentStart = new Date(currentUpdate.start)
      const currentEnd = new Date(currentUpdate.finish)
      const baselineStart = new Date(baselineUpdate.start)
      const baselineEnd = new Date(baselineUpdate.finish)

      const currentStartDay = Math.floor((currentStart.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24))
      const currentDuration = Math.ceil((currentEnd.getTime() - currentStart.getTime()) / (1000 * 60 * 60 * 24)) + 1
      const baselineStartDay = Math.floor((baselineStart.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24))
      const baselineDuration = Math.ceil((baselineEnd.getTime() - baselineStart.getTime()) / (1000 * 60 * 60 * 24)) + 1

      const currentPosition = (currentStartDay / totalDays) * timelineWidth
      const currentWidth = (currentDuration / totalDays) * timelineWidth
      const baselinePosition = (baselineStartDay / totalDays) * timelineWidth
      const baselineWidth = (baselineDuration / totalDays) * timelineWidth

      const variance = Math.ceil((currentEnd.getTime() - baselineEnd.getTime()) / (1000 * 60 * 60 * 24))

      return {
        current: { position: currentPosition, width: currentWidth },
        baseline: { position: baselinePosition, width: baselineWidth },
        variance,
      }
    }, [currentUpdate, baselineUpdate, timelineStart, timelineEnd, timelineWidth])

    const getActivityIcon = () => {
      return activity.type === "Milestone" ? (
        <Diamond className="h-4 w-4 text-primary" />
      ) : (
        <BarChart3 className="h-4 w-4 text-muted-foreground" />
      )
    }

    const getVarianceColor = (variance: number) => {
      if (variance === 0) return "text-muted-foreground"
      return variance > 0 ? "text-destructive" : "text-green-600 dark:text-green-400"
    }

    const getVarianceIcon = (variance: number) => {
      if (variance === 0) return null
      return variance > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />
    }

    return (
      <TooltipProvider>
        <div className="h-10 flex items-center border-b border-border hover:bg-muted/50 transition-colors">
          {/* Gantt Timeline */}
          <div className="flex-1 relative h-6 bg-background">
            {/* Baseline bar (if showing differences) */}
            {showDifferences && (
              <div
                className="absolute top-2 h-2 bg-gray-300 rounded opacity-60"
                style={{
                  left: `${activityBar.baseline.position}px`,
                  width: `${Math.max(activityBar.baseline.width, 2)}px`,
                }}
              />
            )}

            {/* Current bar */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "absolute top-2 h-2 cursor-pointer transition-all hover:brightness-110",
                    activity.type === "Milestone"
                      ? "bg-blue-600 transform rotate-45 w-2 h-2"
                      : isOnCriticalPath && showCriticalPath
                      ? "bg-red-500"
                      : activity.description.includes("Milestone")
                      ? "bg-blue-600"
                      : "bg-orange-500"
                  )}
                  style={{
                    left: `${activityBar.current.position}px`,
                    width: activity.type === "Milestone" ? "8px" : `${Math.max(activityBar.current.width, 2)}px`,
                  }}
                  onClick={() => onActivityClick(activity)}
                />
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">
                  <div className="font-medium">{activity.description}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    <div>
                      Current: {currentUpdate.start} - {currentUpdate.finish}
                    </div>
                    <div>
                      Baseline: {baselineUpdate.start} - {baselineUpdate.finish}
                    </div>
                    <div>
                      Variance: {activityBar.variance > 0 ? "+" : ""}
                      {activityBar.variance} days
                    </div>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>
    )
  }
)

// Main Project Schedule Component
const ProjectSchedule: React.FC<ProjectScheduleProps> = ({ userRole, projectData, projectId }) => {
  const [selectedUpdate, setSelectedUpdate] = useState<string>("Update_4")
  const [showCriticalPath, setShowCriticalPath] = useState<boolean>(false)
  const [showDifferences, setShowDifferences] = useState<boolean>(false)
  const [comparisonMode, setComparisonMode] = useState<string>("baseline")
  const [activityFilter, setActivityFilter] = useState<string>("all")
  const [highlightMilestones, setHighlightMilestones] = useState<boolean>(false)
  const [showPreviousUpdates, setShowPreviousUpdates] = useState<boolean>(false)
  const [selectedPreviousUpdate, setSelectedPreviousUpdate] = useState<string>("Update_3")
  const [aiPanelOpen, setAiPanelOpen] = useState<boolean>(false)
  const [aiQuery, setAiQuery] = useState<string>("")
  const [selectedActivity, setSelectedActivity] = useState<ScheduleActivity | null>(null)
  const ganttRef = useRef<HTMLDivElement>(null)
  const timelineScrollRef = useRef<HTMLDivElement>(null)

  // Scroll synchronization handlers
  const handleFixedScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    if (timelineScrollRef.current) {
      timelineScrollRef.current.scrollTop = target.scrollTop
    }
  }

  const handleTimelineScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    if (ganttRef.current) {
      ganttRef.current.scrollTop = target.scrollTop
    }
  }

  // Available updates for dropdown
  const availableUpdates = useMemo(
    () => [
      { id: "Update_1", label: "Update 1 - Sept 2024" },
      { id: "Update_2", label: "Update 2 - Oct 2024" },
      { id: "Update_3", label: "Update 3 - Nov 2024" },
      { id: "Update_4", label: "Update 4 - Dec 2024 (Current)" },
    ],
    []
  )

  // Filtered activities based on current filter
  const filteredActivities = useMemo(() => {
    let activities = mockScheduleData.activities

    if (activityFilter === "milestones") {
      activities = activities.filter((a) => a.type === "Milestone")
    } else if (activityFilter === "tasks") {
      activities = activities.filter((a) => a.type === "Task")
    } else if (activityFilter === "critical") {
      activities = activities.filter((a) => mockScheduleData.criticalPath.includes(a.activity_id))
    }

    return activities
  }, [activityFilter])

  // Timeline calculation
  const timelineData = useMemo(() => {
    const allDates = mockScheduleData.activities.flatMap((activity) => [
      new Date(activity.baseline_start),
      new Date(activity.baseline_finish),
      ...activity.updates.flatMap((update) => [new Date(update.start), new Date(update.finish)]),
    ])

    const startDate = new Date(Math.min(...allDates.map((d) => d.getTime())))
    const endDate = new Date(Math.max(...allDates.map((d) => d.getTime())))

    // Add padding
    startDate.setDate(startDate.getDate() - 7)
    endDate.setDate(endDate.getDate() + 7)

    // Calculate a responsive timeline width based on available space
    const maxAvailableWidth = Math.min(600, window?.innerWidth ? window.innerWidth - 600 : 600)
    return { startDate, endDate, timelineWidth: maxAvailableWidth }
  }, [])

  // Handle activity click
  const handleActivityClick = useCallback((activity: ScheduleActivity) => {
    setSelectedActivity(activity)
  }, [])

  // Handle export
  const handleExport = useCallback((format: string) => {
    console.log(`Exporting schedule in ${format} format`)
    // Implementation would go here
  }, [])

  // Handle AI query
  const handleAiQuery = useCallback((query: string) => {
    setAiQuery(query)
    // Implementation would process AI query
  }, [])

  // AI Insights Panel
  const AiInsightsPanel = useMemo(
    () => (
      <Card className="w-80 h-96 overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI Schedule Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="px-4 pb-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask about schedule..."
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                className="flex-1 px-3 py-2 border border-input rounded-md text-sm bg-background text-foreground"
              />
              <Button size="sm" onClick={() => handleAiQuery(aiQuery)}>
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="h-72 overflow-y-auto px-4">
            <div className="space-y-3">
              {mockScheduleData.aiInsights.map((insight) => (
                <div key={insight.id} className="p-3 bg-muted rounded-lg">
                  <div className="flex items-start gap-2 mb-2">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full mt-1.5",
                        insight.severity === "high"
                          ? "bg-destructive"
                          : insight.severity === "medium"
                          ? "bg-yellow-500 dark:bg-yellow-600"
                          : "bg-green-500 dark:bg-green-600"
                      )}
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">{insight.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">{insight.description}</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">Confidence: {insight.confidence}%</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    ),
    [aiQuery, handleAiQuery]
  )

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden" style={{ maxWidth: "calc(100vw - 4rem)" }}>
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 w-full max-w-full overflow-hidden min-w-0 pr-4">
        <div className="flex items-center gap-4">
          <Select value={selectedUpdate} onValueChange={setSelectedUpdate}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select Update View" />
            </SelectTrigger>
            <SelectContent>
              {availableUpdates.map((update) => (
                <SelectItem key={update.id} value={update.id}>
                  {update.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={activityFilter} onValueChange={setActivityFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter Activity Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              <SelectItem value="milestones">Milestones</SelectItem>
              <SelectItem value="tasks">Tasks</SelectItem>
              <SelectItem value="critical">Critical Path</SelectItem>
            </SelectContent>
          </Select>

          {showPreviousUpdates && (
            <Select value={selectedPreviousUpdate} onValueChange={setSelectedPreviousUpdate}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Previous Update" />
              </SelectTrigger>
              <SelectContent>
                {availableUpdates
                  .filter((update) => update.id !== selectedUpdate)
                  .map((update) => (
                    <SelectItem key={update.id} value={update.id}>
                      {update.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Display Options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Display Options
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Display Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowCriticalPath(!showCriticalPath)}>
                <div className="flex items-center justify-between w-full">
                  <span>Show Critical Path</span>
                  <Switch checked={showCriticalPath} onCheckedChange={setShowCriticalPath} />
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowDifferences(!showDifferences)}>
                <div className="flex items-center justify-between w-full">
                  <span>Show Differences</span>
                  <Switch checked={showDifferences} onCheckedChange={setShowDifferences} />
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowPreviousUpdates(!showPreviousUpdates)}>
                <div className="flex items-center justify-between w-full">
                  <span>Show Previous Updates</span>
                  <Switch checked={showPreviousUpdates} onCheckedChange={setShowPreviousUpdates} />
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Export Options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Export Formats</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {[
                { format: "xer", label: "XER Format" },
                { format: "mpp", label: "Microsoft Project (MPP)" },
                { format: "xml", label: "XML Format" },
                { format: "csv", label: "CSV (Comma Separated)" },
                { format: "pdf", label: "PDF Document" },
              ].map((export_option) => (
                <DropdownMenuItem key={export_option.format} onClick={() => handleExport(export_option.format)}>
                  <Download className="h-4 w-4 mr-2" />
                  {export_option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Popover open={aiPanelOpen} onOpenChange={setAiPanelOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Brain className="h-4 w-4 mr-2" />
                AI Insights
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              {AiInsightsPanel}
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Gantt Chart */}
      <Card className="w-full max-w-full overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Project Schedule - {availableUpdates.find((u) => u.id === selectedUpdate)?.label}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border rounded-lg bg-background overflow-hidden max-w-full">
            <div className="flex w-full max-w-full overflow-hidden">
              {/* Fixed Columns Section */}
              <div className="flex-shrink-0 border-r border-border bg-background">
                {/* Fixed Header */}
                <div className="border-b bg-muted p-3 h-12 flex items-center">
                  <div className="flex gap-2 text-xs font-semibold text-muted-foreground">
                    <div className="w-20">ID</div>
                    <div className="w-56">Activity</div>
                    <div className="w-24">BL Start</div>
                    <div className="w-24">BL Finish</div>
                    <div className="w-24">Start</div>
                    <div className="w-24">Finish</div>
                    {showPreviousUpdates && (
                      <>
                        <div className="w-24">{selectedPreviousUpdate.replace("Update_", "U")} Start</div>
                        <div className="w-24">{selectedPreviousUpdate.replace("Update_", "U")} Finish</div>
                      </>
                    )}
                  </div>
                </div>

                {/* Fixed Content - Activity Info */}
                <div className="divide-y max-h-96 overflow-y-auto" ref={ganttRef} onScroll={handleFixedScroll}>
                  {filteredActivities.map((activity) => {
                    const currentUpdate = activity.updates.find((u) => u.update_id === selectedUpdate)!
                    const previousUpdate = activity.updates.find((u) => u.update_id === selectedPreviousUpdate)!
                    const isOnCriticalPath = mockScheduleData.criticalPath.includes(activity.activity_id)

                    return (
                      <div
                        key={activity.activity_id}
                        className={cn(
                          "p-3 h-10 flex items-center group hover:bg-muted/50",
                          isOnCriticalPath && showCriticalPath ? "bg-red-50 dark:bg-red-900/10" : ""
                        )}
                      >
                        <div className="flex gap-2 items-center w-full text-xs">
                          <div className="w-20 font-medium">{activity.activity_id}</div>
                          <div className="w-56 flex items-center gap-1">
                            {activity.type === "Milestone" ? (
                              <Diamond className="h-3 w-3 text-primary flex-shrink-0" />
                            ) : (
                              <BarChart3 className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                            )}
                            <span className="truncate flex-1">{activity.description}</span>
                            {isOnCriticalPath && showCriticalPath && (
                              <Badge variant="destructive" className="text-[9px] px-1 py-0 h-3 flex-shrink-0">
                                Critical
                              </Badge>
                            )}
                          </div>
                          <div className="w-24 text-muted-foreground">
                            {new Date(activity.baseline_start).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          <div className="w-24 text-muted-foreground">
                            {new Date(activity.baseline_finish).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          <div className="w-24 text-muted-foreground">
                            {new Date(currentUpdate.start).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          <div className="w-24 text-muted-foreground">
                            {new Date(currentUpdate.finish).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          {showPreviousUpdates && (
                            <>
                              <div className="w-24 text-muted-foreground">
                                {new Date(previousUpdate.start).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </div>
                              <div className="w-24 text-muted-foreground">
                                {new Date(previousUpdate.finish).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Scrollable Timeline Section */}
              <div
                className="flex-1 overflow-x-auto overflow-y-hidden min-w-0 max-w-full"
                ref={timelineScrollRef}
                onScroll={handleTimelineScroll}
                style={{
                  scrollbarWidth: "auto",
                  msOverflowStyle: "scrollbar",
                  minWidth: 0,
                  maxWidth: "100%",
                }}
              >
                <div
                  className="w-full max-w-full"
                  style={{
                    width: `${Math.min(600, timelineData.timelineWidth)}px`,
                    minWidth: `${Math.min(400, timelineData.timelineWidth)}px`,
                    maxWidth: "100%",
                  }}
                >
                  {/* Timeline Header */}
                  <TimeScale
                    startDate={timelineData.startDate}
                    endDate={timelineData.endDate}
                    timelineWidth={timelineData.timelineWidth}
                  />

                  {/* Timeline Content */}
                  <div className="divide-y max-h-96 overflow-y-auto">
                    {filteredActivities.map((activity) => {
                      const currentUpdate = activity.updates.find((u) => u.update_id === selectedUpdate)!
                      const baselineUpdate = {
                        update_id: "baseline",
                        start: activity.baseline_start,
                        finish: activity.baseline_finish,
                      }
                      const isOnCriticalPath = mockScheduleData.criticalPath.includes(activity.activity_id)

                      return (
                        <ActivityRow
                          key={activity.activity_id}
                          activity={activity}
                          currentUpdate={currentUpdate}
                          baselineUpdate={baselineUpdate}
                          isOnCriticalPath={isOnCriticalPath}
                          showCriticalPath={showCriticalPath}
                          showDifferences={showDifferences}
                          comparisonMode={comparisonMode}
                          timelineStart={timelineData.startDate}
                          timelineEnd={timelineData.endDate}
                          timelineWidth={timelineData.timelineWidth}
                          onActivityClick={handleActivityClick}
                        />
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold text-foreground">{filteredActivities.length}</div>
                <div className="text-sm text-muted-foreground">Total Activities</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Diamond className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {filteredActivities.filter((a) => a.type === "Milestone").length}
                </div>
                <div className="text-sm text-muted-foreground">Milestones</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-destructive" />
              <div>
                <div className="text-2xl font-bold text-foreground">{mockScheduleData.criticalPath.length}</div>
                <div className="text-sm text-muted-foreground">Critical Activities</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <div>
                <div className="text-2xl font-bold text-foreground">+2d</div>
                <div className="text-sm text-muted-foreground">Schedule Variance</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ProjectSchedule
