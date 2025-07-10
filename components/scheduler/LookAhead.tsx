/**
 * @fileoverview Look Ahead Planning Component - Excel-Style Format
 * @module LookAhead
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Excel-style look ahead schedule matching familiar spreadsheet format
 * with modern functionality and real schedule data integration
 */

"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import {
  CalendarIcon,
  Plus,
  Download,
  Brain,
  Edit3,
  Save,
  X,
  Users,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  PlayCircle,
  Diamond,
  BarChart3,
  Settings,
  Trash2,
  Copy,
  FileText,
  Zap,
} from "lucide-react"
import { format } from "date-fns"

interface LookAheadProps {
  userRole: string
  projectData: any
}

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
  lookAheadEntries: LookAheadEntry[]
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
}

interface TimelineCell {
  date: Date
  isWeekend: boolean
  isToday: boolean
  activities: {
    activityId: string
    subStepId?: string
    type: "activity" | "substep"
    status: "not-started" | "in-progress" | "completed"
    crew?: string
    notes?: string
  }[]
}

// Mock data from Project Schedule and Update components - comprehensive 20-activity dataset
const mockScheduleActivities: ScheduleActivity[] = [
  {
    id: "act-001",
    activityId: "A001",
    name: "Project Kickoff",
    description: "Project initiation milestone marking official start of construction activities",
    startDate: new Date("2025-09-11"),
    endDate: new Date("2025-09-11"),
    duration: 1,
    progress: 100,
    status: "completed",
    priority: "high",
    location: "Site Office",
    crew: "Project Management Team",
    predecessors: [],
    successors: ["A002", "A004"],
    constraints: ["Weather conditions", "Permit approvals"],
    lookAheadEntries: [
      {
        id: "la-001-1",
        activityId: "A001",
        subSteps: [
          {
            id: "ss-001-1",
            description: "Site mobilization setup",
            startDate: new Date("2025-09-11"),
            endDate: new Date("2025-09-11"),
            assignedParty: "Project Manager",
            crewSize: 3,
            estimatedHours: 8,
            notes: "Set up site office and initial safety protocols",
            constraints: ["Access permits"],
            status: "completed",
          },
        ],
        createdBy: "John Smith",
        createdDate: new Date("2025-09-01"),
        lastUpdated: new Date("2025-09-11"),
        week: 1,
        status: "completed",
      },
    ],
  },
  {
    id: "act-002",
    activityId: "A002",
    name: "Design Approval",
    description: "Final design approval and permit sign-off milestone",
    startDate: new Date("2025-09-06"),
    endDate: new Date("2025-09-06"),
    duration: 1,
    progress: 100,
    status: "completed",
    priority: "high",
    location: "Design Office",
    crew: "Design Team",
    predecessors: ["A001"],
    successors: ["A004", "A006"],
    constraints: ["City approval process", "Design review completion"],
    lookAheadEntries: [],
  },
  {
    id: "act-003",
    activityId: "A003",
    name: "Foundation Complete",
    description: "Foundation work completion milestone including all concrete work",
    startDate: new Date("2025-09-18"),
    endDate: new Date("2025-09-18"),
    duration: 1,
    progress: 0,
    status: "not-started",
    priority: "high",
    location: "Building Foundation Area",
    crew: "Concrete Crew",
    predecessors: ["A007"],
    successors: ["A008"],
    constraints: ["Foundation pour completion", "Curing time"],
    lookAheadEntries: [],
  },
  {
    id: "act-004",
    activityId: "A004",
    name: "Site Preparation",
    description: "Site clearing, grading, and preparation for construction activities",
    startDate: new Date("2025-09-06"),
    endDate: new Date("2025-09-19"),
    duration: 14,
    progress: 100,
    status: "completed",
    priority: "medium",
    location: "Entire Construction Site",
    crew: "Site Preparation Crew",
    predecessors: ["A001", "A002"],
    successors: ["A005"],
    constraints: ["Environmental clearance", "Utility marking"],
    lookAheadEntries: [
      {
        id: "la-004-1",
        activityId: "A004",
        subSteps: [
          {
            id: "ss-004-1",
            description: "Site clearing and debris removal",
            startDate: new Date("2025-09-06"),
            endDate: new Date("2025-09-10"),
            assignedParty: "Excavation Crew",
            crewSize: 5,
            estimatedHours: 40,
            notes: "Clear vegetation and remove existing structures",
            constraints: ["Environmental permits"],
            status: "completed",
          },
          {
            id: "ss-004-2",
            description: "Rough grading operations",
            startDate: new Date("2025-09-11"),
            endDate: new Date("2025-09-16"),
            assignedParty: "Grading Crew",
            crewSize: 3,
            estimatedHours: 48,
            notes: "Initial site grading to design specifications",
            constraints: ["Survey completion"],
            status: "completed",
          },
        ],
        createdBy: "Mike Davis",
        createdDate: new Date("2025-08-25"),
        lastUpdated: new Date("2025-09-19"),
        week: 1,
        status: "completed",
      },
    ],
  },
  {
    id: "act-005",
    activityId: "A005",
    name: "Excavation Work",
    description: "Foundation excavation and earthwork operations",
    startDate: new Date("2025-09-12"),
    endDate: new Date("2025-09-26"),
    duration: 15,
    progress: 75,
    status: "in-progress",
    priority: "high",
    location: "Foundation Area",
    crew: "Excavation Crew",
    predecessors: ["A004"],
    successors: ["A007"],
    constraints: ["Equipment breakdown delays", "Weather dependent"],
    lookAheadEntries: [
      {
        id: "la-005-1",
        activityId: "A005",
        subSteps: [
          {
            id: "ss-005-1",
            description: "Foundation excavation - Phase 1",
            startDate: new Date("2025-09-12"),
            endDate: new Date("2025-09-18"),
            assignedParty: "Lead Excavator Operator",
            crewSize: 4,
            estimatedHours: 56,
            notes: "North section foundation excavation",
            constraints: ["Underground utilities"],
            status: "completed",
          },
          {
            id: "ss-005-2",
            description: "Foundation excavation - Phase 2",
            startDate: new Date("2025-09-19"),
            endDate: new Date("2025-09-26"),
            assignedParty: "Lead Excavator Operator",
            crewSize: 4,
            estimatedHours: 64,
            notes: "South section foundation excavation",
            constraints: ["Equipment repair completion"],
            status: "in-progress",
          },
        ],
        createdBy: "Sarah Johnson",
        createdDate: new Date("2025-09-05"),
        lastUpdated: new Date("2025-09-20"),
        week: 2,
        status: "committed",
      },
    ],
  },
  {
    id: "act-006",
    activityId: "A006",
    name: "Permit Approval",
    description: "Building permit approval and inspection clearance milestone",
    startDate: new Date("2025-09-19"),
    endDate: new Date("2025-09-19"),
    duration: 1,
    progress: 0,
    status: "delayed",
    priority: "high",
    location: "City Planning Office",
    crew: "Permit Coordination Team",
    predecessors: ["A002"],
    successors: ["A007"],
    constraints: ["Extended city review process", "Additional documentation required"],
    lookAheadEntries: [],
  },
  {
    id: "act-007",
    activityId: "A007",
    name: "Foundation Pour",
    description: "Concrete foundation pour and finishing operations",
    startDate: new Date("2025-09-22"),
    endDate: new Date("2025-10-07"),
    duration: 16,
    progress: 0,
    status: "not-started",
    priority: "high",
    location: "Foundation Area",
    crew: "Concrete Crew",
    predecessors: ["A005", "A006"],
    successors: ["A003", "A008"],
    constraints: ["Excavation completion", "Permit approval", "Weather conditions"],
    lookAheadEntries: [
      {
        id: "la-007-1",
        activityId: "A007",
        subSteps: [
          {
            id: "ss-007-1",
            description: "Foundation reinforcement installation",
            startDate: new Date("2025-09-22"),
            endDate: new Date("2025-09-26"),
            assignedParty: "Rebar Crew",
            crewSize: 6,
            estimatedHours: 48,
            notes: "Install rebar grid per structural drawings",
            constraints: ["Material delivery", "Inspection required"],
            status: "not-started",
          },
          {
            id: "ss-007-2",
            description: "Concrete pour operations",
            startDate: new Date("2025-09-29"),
            endDate: new Date("2025-10-03"),
            assignedParty: "Concrete Crew",
            crewSize: 8,
            estimatedHours: 64,
            notes: "Continuous pour for foundation slab",
            constraints: ["Weather window", "Pump truck availability"],
            status: "not-started",
          },
        ],
        createdBy: "Robert Wilson",
        createdDate: new Date("2025-09-15"),
        lastUpdated: new Date("2025-09-20"),
        week: 3,
        status: "draft",
      },
    ],
  },
  {
    id: "act-008",
    activityId: "A008",
    name: "Structural Steel",
    description: "Structural steel erection and connection activities",
    startDate: new Date("2025-10-10"),
    endDate: new Date("2025-11-01"),
    duration: 22,
    progress: 0,
    status: "not-started",
    priority: "high",
    location: "Building Structure",
    crew: "Steel Erection Crew",
    predecessors: ["A003"],
    successors: ["A009", "A010"],
    constraints: ["Foundation completion", "Steel delivery", "Crane availability"],
    lookAheadEntries: [],
  },
]

export default function LookAhead({ userRole, projectData }: LookAheadProps) {
  const [currentWindow, setCurrentWindow] = useState<any>(null)
  const [showNewLookAheadDialog, setShowNewLookAheadDialog] = useState(false)
  const [showScheduleDetailDialog, setShowScheduleDetailDialog] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<ScheduleActivity | null>(null)
  const [newLookAheadStartDate, setNewLookAheadStartDate] = useState<string>("")
  const [newLookAheadWeeks, setNewLookAheadWeeks] = useState<string>("3")
  const [newSubStep, setNewSubStep] = useState<Partial<SubStep>>({})
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedSubStep, setSelectedSubStep] = useState<SubStep | null>(null)

  // Initialize window to show activities from September 2025
  useEffect(() => {
    const projectStartDate = new Date("2025-09-01")
    const monday = new Date(projectStartDate)
    const dayOfWeek = monday.getDay()
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    monday.setDate(monday.getDate() - daysToSubtract)

    const generateWindow = () => {
      const weeks = []
      for (let i = 0; i < 3; i++) {
        const weekStart = new Date(monday)
        weekStart.setDate(monday.getDate() + i * 7)
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6)

        weeks.push({
          weekNumber: i + 1,
          startDate: weekStart,
          endDate: weekEnd,
          label: `Week ${i + 1}`,
        })
      }

      return {
        startDate: weeks[0].startDate,
        endDate: weeks[2].endDate,
        weeks,
      }
    }

    setCurrentWindow(generateWindow())
    setNewLookAheadStartDate("2025-09-02")
  }, [])

  // Generate timeline grid dates
  const timelineGrid = useMemo(() => {
    if (!currentWindow) return []

    const dates: TimelineCell[] = []
    const current = new Date(currentWindow.startDate)
    const end = new Date(currentWindow.endDate)

    while (current <= end) {
      const dayOfWeek = current.getDay()
      const today = new Date()

      dates.push({
        date: new Date(current),
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        isToday: current.toDateString() === today.toDateString(),
        activities: [],
      })

      current.setDate(current.getDate() + 1)
    }

    return dates
  }, [currentWindow])

  // Filter activities within current window
  const getActivitiesInWindow = () => {
    if (!currentWindow) return []

    return mockScheduleActivities.filter((activity) => {
      const activityStart = activity.startDate
      const activityEnd = activity.endDate

      return (
        (activityStart >= currentWindow.startDate && activityStart <= currentWindow.endDate) ||
        (activityEnd >= currentWindow.startDate && activityEnd <= currentWindow.endDate) ||
        (activityStart <= currentWindow.startDate && activityEnd >= currentWindow.endDate)
      )
    })
  }

  const activitiesInWindow = getActivitiesInWindow()

  // Check if activity spans a specific date
  const isActivityOnDate = (activity: ScheduleActivity, date: Date): boolean => {
    const activityStart = new Date(activity.startDate)
    const activityEnd = new Date(activity.endDate)
    activityStart.setHours(0, 0, 0, 0)
    activityEnd.setHours(23, 59, 59, 999)

    return date >= activityStart && date <= activityEnd
  }

  // Check if substep spans a specific date
  const isSubStepOnDate = (subStep: SubStep, date: Date): boolean => {
    const subStepStart = new Date(subStep.startDate)
    const subStepEnd = new Date(subStep.endDate)
    subStepStart.setHours(0, 0, 0, 0)
    subStepEnd.setHours(23, 59, 59, 999)

    return date >= subStepStart && date <= subStepEnd
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-200 border-green-300"
      case "in-progress":
        return "bg-blue-200 border-blue-300"
      case "delayed":
        return "bg-red-200 border-red-300"
      case "not-started":
        return "bg-gray-100 border-gray-300"
      default:
        return "bg-gray-100 border-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-3 w-3 text-green-600" />
      case "in-progress":
        return <Clock className="h-3 w-3 text-blue-600" />
      case "delayed":
        return <AlertTriangle className="h-3 w-3 text-red-600" />
      case "not-started":
        return <PlayCircle className="h-3 w-3 text-gray-600" />
      default:
        return <PlayCircle className="h-3 w-3 text-gray-600" />
    }
  }

  const handleNewLookAhead = () => {
    setShowNewLookAheadDialog(true)
  }

  const handleAddScheduleDetail = (activity: ScheduleActivity) => {
    setSelectedActivity(activity)
    setIsEditMode(false)
    setSelectedSubStep(null)
    setNewSubStep({
      description: "",
      startDate: activity.startDate,
      endDate: activity.endDate,
      assignedParty: activity.crew,
      crewSize: 1,
      estimatedHours: 8,
      notes: "",
      constraints: [],
      status: "not-started",
    })
    setShowScheduleDetailDialog(true)
  }

  const handleEditScheduleDetail = (activity: ScheduleActivity, subStep: SubStep) => {
    setSelectedActivity(activity)
    setSelectedSubStep(subStep)
    setIsEditMode(true)
    setNewSubStep({
      id: subStep.id,
      description: subStep.description,
      startDate: subStep.startDate,
      endDate: subStep.endDate,
      assignedParty: subStep.assignedParty,
      crewSize: subStep.crewSize,
      estimatedHours: subStep.estimatedHours,
      notes: subStep.notes,
      constraints: subStep.constraints,
      status: subStep.status,
    })
    setShowScheduleDetailDialog(true)
  }

  const handleSaveSubStep = () => {
    if (selectedActivity && newSubStep.description) {
      // In a real implementation, this would save to the backend
      if (isEditMode) {
        console.log("Updating sub-step:", newSubStep)
      } else {
        console.log("Creating new sub-step:", newSubStep)
      }
      setShowScheduleDetailDialog(false)
      setNewSubStep({})
      setIsEditMode(false)
      setSelectedSubStep(null)
    }
  }

  const formatDateHeader = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "numeric",
      day: "numeric",
    })
  }

  const formatDateShort = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "2-digit",
    })
  }

  if (!currentWindow) return <div>Loading...</div>

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden" style={{ maxWidth: "calc(100vw - 4rem)" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Look Ahead Planning</h2>
          <p className="text-sm text-muted-foreground">
            {format(currentWindow.startDate, "MMM d")} - {format(currentWindow.endDate, "MMM d, yyyy")} •
            {activitiesInWindow.length} activities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleNewLookAhead} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Look Ahead
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Brain className="h-4 w-4 mr-2" />
            AI Coach
          </Button>
        </div>
      </div>

      {/* Excel-Style Schedule Grid */}
      <Card className="w-full max-w-full overflow-hidden">
        <CardContent className="p-0">
          <div className="border rounded-lg bg-background overflow-hidden max-w-full">
            <div className="flex w-full max-w-full overflow-hidden">
              {/* Fixed Left Columns */}
              <div className="flex-shrink-0 border-r">
                <Table className="relative">
                  <TableHeader>
                    <TableRow className="bg-muted">
                      <TableHead className="w-12 min-w-12 max-w-12 text-center font-semibold border-r text-xs whitespace-nowrap py-2">
                        ID
                      </TableHead>
                      <TableHead className="w-48 min-w-48 max-w-48 font-semibold border-r text-xs whitespace-nowrap py-2">
                        Activity
                      </TableHead>
                      <TableHead className="w-20 min-w-20 max-w-20 font-semibold border-r text-xs whitespace-nowrap py-2">
                        Responsible
                      </TableHead>
                      <TableHead className="w-12 min-w-12 max-w-12 font-semibold border-r text-xs whitespace-nowrap py-2">
                        Dur
                      </TableHead>
                      <TableHead className="w-20 min-w-20 max-w-20 font-semibold border-r text-xs whitespace-nowrap py-2">
                        Start Date
                      </TableHead>
                      <TableHead className="w-20 min-w-20 max-w-20 font-semibold border-r text-xs whitespace-nowrap py-2">
                        End Date
                      </TableHead>
                      <TableHead className="w-16 min-w-16 max-w-16 font-semibold border-r text-xs whitespace-nowrap py-2">
                        Status
                      </TableHead>
                      <TableHead className="w-32 min-w-32 max-w-32 font-semibold border-r text-xs whitespace-nowrap py-2">
                        Comments
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activitiesInWindow.map((activity) => (
                      <React.Fragment key={activity.id}>
                        {/* Main Activity Row */}
                        <TableRow className="hover:bg-muted/50">
                          <TableCell className="font-medium text-center border-r text-xs whitespace-nowrap py-1">
                            {activity.activityId}
                          </TableCell>
                          <TableCell className="border-r whitespace-nowrap py-1">
                            <div className="flex items-center gap-1 max-w-48">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAddScheduleDetail(activity)}
                                className="text-xs h-4 px-1 flex-shrink-0"
                              >
                                <Plus className="h-2.5 w-2.5" />
                              </Button>
                              {activity.name.includes("Milestone") ? (
                                <Diamond className="h-3 w-3 text-orange-500 flex-shrink-0" />
                              ) : (
                                <BarChart3 className="h-3 w-3 text-blue-500 flex-shrink-0" />
                              )}
                              <div className="text-xs font-medium truncate">{activity.name}</div>
                            </div>
                          </TableCell>
                          <TableCell className="border-r whitespace-nowrap py-1">
                            <div className="text-xs truncate">{activity.crew}</div>
                          </TableCell>
                          <TableCell className="text-center border-r text-xs whitespace-nowrap py-1">
                            {activity.duration}d
                          </TableCell>
                          <TableCell className="text-center border-r text-xs whitespace-nowrap py-1">
                            <div className="text-xs">{formatDateShort(activity.startDate)}</div>
                          </TableCell>
                          <TableCell className="text-center border-r text-xs whitespace-nowrap py-1">
                            <div className="text-xs">{formatDateShort(activity.endDate)}</div>
                          </TableCell>
                          <TableCell className="border-r whitespace-nowrap py-1">
                            <div className="flex items-center gap-1">
                              {getStatusIcon(activity.status)}
                              <Badge variant="outline" className="text-xs">
                                {activity.progress}%
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="border-r whitespace-nowrap py-1">
                            <div className="text-xs max-w-32 truncate">{activity.description || ""}</div>
                          </TableCell>
                        </TableRow>

                        {/* Sub-Steps Rows */}
                        {activity.lookAheadEntries.map((entry) =>
                          entry.subSteps.map((subStep, subIndex) => (
                            <TableRow key={`${activity.id}-${subStep.id}`} className="bg-muted/3 dark:bg-muted/5">
                              <TableCell className="bg-muted/3 dark:bg-muted/5 text-center text-xs text-muted-foreground border-r whitespace-nowrap py-1">
                                {subIndex + 1}
                              </TableCell>
                              <TableCell className="bg-muted/3 dark:bg-muted/5 border-r whitespace-nowrap py-1">
                                <div className="flex items-center gap-1 max-w-48">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditScheduleDetail(activity, subStep)}
                                    className="text-xs h-4 px-1 flex-shrink-0"
                                  >
                                    <Edit3 className="h-2.5 w-2.5" />
                                  </Button>
                                  <div className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0" />
                                  <div className="text-xs font-medium truncate">{subStep.description}</div>
                                </div>
                              </TableCell>
                              <TableCell className="bg-muted/3 dark:bg-muted/5 border-r whitespace-nowrap py-1">
                                <div className="text-xs truncate">{subStep.assignedParty}</div>
                                <div className="text-xs text-muted-foreground">{subStep.crewSize} crew</div>
                              </TableCell>
                              <TableCell className="bg-muted/3 dark:bg-muted/5 text-center border-r text-xs whitespace-nowrap py-1">
                                {Math.ceil(
                                  (subStep.endDate.getTime() - subStep.startDate.getTime()) / (1000 * 60 * 60 * 24)
                                )}
                                d
                              </TableCell>
                              <TableCell className="bg-muted/3 dark:bg-muted/5 text-center border-r text-xs whitespace-nowrap py-1">
                                <div className="text-xs">{formatDateShort(subStep.startDate)}</div>
                              </TableCell>
                              <TableCell className="bg-muted/3 dark:bg-muted/5 text-center border-r text-xs whitespace-nowrap py-1">
                                <div className="text-xs">{formatDateShort(subStep.endDate)}</div>
                              </TableCell>
                              <TableCell className="bg-muted/3 dark:bg-muted/5 border-r whitespace-nowrap py-1">
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(subStep.status)}
                                  <span className="text-xs">{subStep.estimatedHours}h</span>
                                </div>
                              </TableCell>
                              <TableCell className="bg-muted/3 dark:bg-muted/5 border-r whitespace-nowrap py-1">
                                <div className="text-xs max-w-32 truncate">{subStep.notes || ""}</div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Scrollable Timeline Section */}
              <div className="flex-1 overflow-x-auto overflow-y-hidden min-w-0 max-w-full">
                <div style={{ width: `${21 * 24}px`, minWidth: `${21 * 24}px` }}>
                  {/* Timeline Header */}
                  <div className="bg-muted h-10 border-b flex">
                    {timelineGrid.slice(0, 21).map((cell, index) => (
                      <div
                        key={index}
                        className={cn(
                          "h-10 flex items-center justify-center text-center text-xs border-l p-1 flex-shrink-0",
                          cell.isWeekend && "bg-muted/40 dark:bg-muted/60",
                          cell.isToday && "bg-primary/20 dark:bg-primary/30 font-semibold"
                        )}
                        style={{ width: "24px", minWidth: "24px" }}
                      >
                        <div className="flex flex-col items-center justify-center h-full py-1">
                          <div className="text-[9px] leading-none font-medium">{cell.date.getDate()}</div>
                          <div className="text-[7px] text-muted-foreground leading-none mt-0.5">
                            {cell.date.toLocaleDateString("en-US", { weekday: "short" })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Timeline Body */}
                  <div>
                    {activitiesInWindow.map((activity) => (
                      <React.Fragment key={activity.id}>
                        {/* Main Activity Timeline Row */}
                        <div className="h-8 border-b flex hover:bg-muted/50">
                          {timelineGrid.slice(0, 21).map((cell, index) => (
                            <div
                              key={index}
                              className={cn(
                                "h-8 relative border-l p-1 flex-shrink-0",
                                cell.isWeekend && "bg-muted/20 dark:bg-muted/40",
                                cell.isToday && "bg-primary/10 dark:bg-primary/20"
                              )}
                              style={{ width: "24px", minWidth: "24px" }}
                            >
                              {isActivityOnDate(activity, cell.date) && (
                                <div
                                  className={cn("absolute inset-1 rounded border", getStatusColor(activity.status))}
                                />
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Sub-Steps Timeline Rows */}
                        {activity.lookAheadEntries.map((entry) =>
                          entry.subSteps.map((subStep) => (
                            <div
                              key={`${activity.id}-${subStep.id}`}
                              className="h-8 border-b flex bg-muted/3 dark:bg-muted/5"
                            >
                              {timelineGrid.slice(0, 21).map((cell, index) => (
                                <div
                                  key={index}
                                  className={cn(
                                    "h-8 relative border-l p-1 bg-muted/3 dark:bg-muted/5 flex-shrink-0",
                                    cell.isWeekend && "bg-muted/25 dark:bg-muted/35",
                                    cell.isToday && "bg-primary/12 dark:bg-primary/18"
                                  )}
                                  style={{ width: "24px", minWidth: "24px" }}
                                >
                                  {isSubStepOnDate(subStep, cell.date) && (
                                    <div
                                      className={cn("absolute inset-1 rounded border", getStatusColor(subStep.status))}
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          ))
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Look Ahead Dialog */}
      <Dialog open={showNewLookAheadDialog} onOpenChange={setShowNewLookAheadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Look Ahead</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={newLookAheadStartDate}
                  onChange={(e) => setNewLookAheadStartDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="weeks">Weeks</Label>
                <Select value={newLookAheadWeeks} onValueChange={setNewLookAheadWeeks}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(12)].map((_, i) => (
                      <SelectItem key={i + 1} value={String(i + 1)}>
                        {i + 1} week{i + 1 > 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">
                <Copy className="h-4 w-4 mr-2" />
                Continue from Previous
              </Button>
              <Button variant="outline" className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Create New
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Detail Dialog */}
      <Dialog
        open={showScheduleDetailDialog}
        onOpenChange={(open) => {
          setShowScheduleDetailDialog(open)
          if (!open) {
            setIsEditMode(false)
            setSelectedSubStep(null)
            setNewSubStep({})
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Schedule Detail" : "Add Schedule Detail"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="substep-description">Description</Label>
                <Input
                  id="substep-description"
                  value={newSubStep.description || ""}
                  onChange={(e) => setNewSubStep({ ...newSubStep, description: e.target.value })}
                  placeholder="Enter sub-step description"
                />
              </div>
              <div>
                <Label htmlFor="assigned-party">Assigned Party</Label>
                <Input
                  id="assigned-party"
                  value={newSubStep.assignedParty || ""}
                  onChange={(e) => setNewSubStep({ ...newSubStep, assignedParty: e.target.value })}
                  placeholder="Enter crew or party"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="crew-size">Crew Size</Label>
                <Input
                  id="crew-size"
                  type="number"
                  value={newSubStep.crewSize || 1}
                  onChange={(e) => setNewSubStep({ ...newSubStep, crewSize: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="estimated-hours">Estimated Hours</Label>
                <Input
                  id="estimated-hours"
                  type="number"
                  value={newSubStep.estimatedHours || 8}
                  onChange={(e) => setNewSubStep({ ...newSubStep, estimatedHours: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newSubStep.status || "not-started"}
                  onValueChange={(value) => setNewSubStep({ ...newSubStep, status: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not-started">Not Started</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={newSubStep.startDate?.toISOString().split("T")[0] || ""}
                  onChange={(e) => setNewSubStep({ ...newSubStep, startDate: new Date(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={newSubStep.endDate?.toISOString().split("T")[0] || ""}
                  onChange={(e) => setNewSubStep({ ...newSubStep, endDate: new Date(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newSubStep.notes || ""}
                onChange={(e) => setNewSubStep({ ...newSubStep, notes: e.target.value })}
                placeholder="Enter any additional notes or requirements"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowScheduleDetailDialog(false)
                  setIsEditMode(false)
                  setSelectedSubStep(null)
                  setNewSubStep({})
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveSubStep}>
                <Save className="h-4 w-4 mr-2" />
                {isEditMode ? "Update Detail" : "Save Detail"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
