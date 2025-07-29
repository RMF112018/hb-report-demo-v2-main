"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  RefreshCw,
  ExternalLink,
  Star,
  Award,
  Briefcase,
  Database,
  Zap,
  Lightbulb,
  Filter,
  User,
  Building,
  Timer,
  Bell,
  Sparkles,
  MapPin,
  TrendingUp,
  DollarSign,
  Target,
  Activity,
  BarChart3,
  PieChart,
  ArrowRight,
  CalendarDays,
  CalendarCheck,
  CalendarX,
  CalendarClock,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ComposedChart,
  ScatterChart,
  Scatter,
  FunnelChart,
  Funnel,
} from "recharts"

interface TurnoverProject {
  id: string
  projectName: string
  preconLead: string
  projectManager: string
  turnoverDate: string
  status: "Upcoming" | "In Progress" | "Completed" | "Delayed"
  transitionDuration: number // in days
  handoffNotes?: string
  lastUpdated: string
}

interface TurnoverMeeting {
  id: string
  projectName: string
  meetingDate: string
  meetingType: "Kickoff" | "Handoff" | "Follow-up" | "Final Review"
  attendees: string[]
  status: "Scheduled" | "Completed" | "Cancelled"
  notes?: string
}

interface TurnoverData {
  projects: TurnoverProject[]
  meetings: TurnoverMeeting[]
  summary: {
    upcomingMeetings: number
    completedTurnovers: number
    avgTransitionDuration: number
    pendingHandoffs: number
    totalProjects: number
  }
  timelineData: {
    month: string
    upcoming: number
    completed: number
    delayed: number
  }[]
}

interface BetaTurnoverScheduleCardProps {
  className?: string
  config?: any
  isCompact?: boolean
  userRole?: string
}

export default function BetaTurnoverScheduleCard({
  className,
  config,
  isCompact = false,
  userRole,
}: BetaTurnoverScheduleCardProps) {
  // Scale classes based on isCompact prop for 50% size reduction
  const compactScale = {
    iconSize: isCompact ? "h-3 w-3" : "h-5 w-5",
    iconSizeSmall: isCompact ? "h-2 w-2" : "h-3 w-3",
    textTitle: isCompact ? "text-sm" : "text-lg",
    textSmall: isCompact ? "text-[10px]" : "text-xs",
    textMedium: isCompact ? "text-xs" : "text-sm",
    padding: isCompact ? "p-1" : "p-2",
    paddingCard: isCompact ? "pb-1" : "pb-2",
    gap: isCompact ? "gap-1" : "gap-2",
    marginTop: isCompact ? "mt-0.5" : "mt-1",
    chartHeight: isCompact ? "h-32" : "h-48",
  }

  const [activeTab, setActiveTab] = useState("overview")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [autoRefresh, setAutoRefresh] = useState(false)

  // Mock data for turnover schedule
  const turnoverData = useMemo(
    (): TurnoverData => ({
      projects: [
        {
          id: "1",
          projectName: "Downtown Office Tower",
          preconLead: "M. Alvarez",
          projectManager: "S. Johnson",
          turnoverDate: "2025-06-15",
          status: "Upcoming",
          transitionDuration: 45,
          handoffNotes: "Final design review pending",
          lastUpdated: "2025-01-24",
        },
        {
          id: "2",
          projectName: "Luxury Condominiums",
          preconLead: "D. Chen",
          projectManager: "R. Williams",
          turnoverDate: "2025-08-20",
          status: "In Progress",
          transitionDuration: 30,
          handoffNotes: "Permit approval in progress",
          lastUpdated: "2025-01-22",
        },
        {
          id: "3",
          projectName: "Public Library Renovation",
          preconLead: "M. Alvarez",
          projectManager: "T. Davis",
          turnoverDate: "2025-04-10",
          status: "Completed",
          transitionDuration: 60,
          handoffNotes: "Successfully handed off to operations",
          lastUpdated: "2025-01-20",
        },
        {
          id: "4",
          projectName: "Medical Center Expansion",
          preconLead: "D. Chen",
          projectManager: "L. Brown",
          turnoverDate: "2025-09-30",
          status: "Delayed",
          transitionDuration: 75,
          handoffNotes: "Design changes required",
          lastUpdated: "2025-01-18",
        },
        {
          id: "5",
          projectName: "Luxury Hotel",
          preconLead: "M. Alvarez",
          projectManager: "K. Wilson",
          turnoverDate: "2025-11-15",
          status: "Upcoming",
          transitionDuration: 40,
          handoffNotes: "Site survey completed",
          lastUpdated: "2025-01-15",
        },
        {
          id: "6",
          projectName: "Elementary School",
          preconLead: "D. Chen",
          projectManager: "J. Martinez",
          turnoverDate: "2025-05-20",
          status: "Completed",
          transitionDuration: 55,
          handoffNotes: "All permits approved",
          lastUpdated: "2025-01-12",
        },
      ],
      meetings: [
        {
          id: "1",
          projectName: "Downtown Office Tower",
          meetingDate: "2025-02-15",
          meetingType: "Kickoff",
          attendees: ["M. Alvarez", "S. Johnson", "R. Smith"],
          status: "Scheduled",
          notes: "Initial handoff planning meeting",
        },
        {
          id: "2",
          projectName: "Luxury Condominiums",
          meetingDate: "2025-01-30",
          meetingType: "Handoff",
          attendees: ["D. Chen", "R. Williams", "T. Lee"],
          status: "Scheduled",
          notes: "Final design handoff meeting",
        },
        {
          id: "3",
          projectName: "Public Library Renovation",
          meetingDate: "2025-01-15",
          meetingType: "Final Review",
          attendees: ["M. Alvarez", "T. Davis", "A. Garcia"],
          status: "Completed",
          notes: "Project successfully handed off",
        },
        {
          id: "4",
          projectName: "Medical Center Expansion",
          meetingDate: "2025-02-10",
          meetingType: "Follow-up",
          attendees: ["D. Chen", "L. Brown", "K. Patel"],
          status: "Scheduled",
          notes: "Address design change requirements",
        },
      ],
      summary: {
        upcomingMeetings: 3,
        completedTurnovers: 2,
        avgTransitionDuration: 50,
        pendingHandoffs: 4,
        totalProjects: 6,
      },
      timelineData: [
        { month: "Jan", upcoming: 2, completed: 1, delayed: 0 },
        { month: "Feb", upcoming: 3, completed: 1, delayed: 1 },
        { month: "Mar", upcoming: 1, completed: 2, delayed: 0 },
        { month: "Apr", upcoming: 2, completed: 1, delayed: 1 },
        { month: "May", upcoming: 1, completed: 2, delayed: 0 },
        { month: "Jun", upcoming: 3, completed: 1, delayed: 1 },
      ],
    }),
    []
  )

  // Chart colors
  const chartColors = {
    primary: "#3B82F6",
    secondary: "#10B981",
    accent: "#8B5CF6",
    warning: "#F59E0B",
    danger: "#EF4444",
    success: "#22C55E",
    upcoming: "#3B82F6",
    completed: "#10B981",
    delayed: "#EF4444",
    inProgress: "#F59E0B",
  }

  // Helper functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Delayed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getMeetingStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  // Filter projects based on selected status
  const filteredProjects = useMemo(() => {
    if (selectedStatus === "all") return turnoverData.projects
    return turnoverData.projects.filter((project) => project.status === selectedStatus)
  }, [turnoverData.projects, selectedStatus])

  // Get upcoming meetings (next 30 days)
  const upcomingMeetings = useMemo(() => {
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

    return turnoverData.meetings.filter((meeting) => {
      const meetingDate = new Date(meeting.meetingDate)
      return meetingDate <= thirtyDaysFromNow && meeting.status === "Scheduled"
    })
  }, [turnoverData.meetings])

  // Get completed turnovers (past 90 days)
  const completedTurnovers = useMemo(() => {
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

    return turnoverData.projects.filter((project) => {
      const turnoverDate = new Date(project.turnoverDate)
      return turnoverDate >= ninetyDaysAgo && project.status === "Completed"
    })
  }, [turnoverData.projects])

  return (
    <Card
      className={`bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950 dark:to-cyan-900 border-cyan-200 dark:border-cyan-800 ${className}`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className={`${compactScale.iconSize} text-cyan-600`} />
            <CardTitle className={`${compactScale.textTitle} font-semibold text-slate-900 dark:text-slate-100`}>
              Turnover Schedule
            </CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300">
            Last Updated {formatDate(new Date().toISOString())}
          </Badge>
        </div>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Track turnover from Pre-Construction to Operations
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className={`${compactScale.textTitle} font-bold text-cyan-600`}>{upcomingMeetings.length}</div>
            <div className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>Upcoming Meetings</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className={`${compactScale.textTitle} font-bold text-green-600`}>{completedTurnovers.length}</div>
            <div className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>Completed (90d)</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className={`${compactScale.textTitle} font-bold text-blue-600`}>
              {turnoverData.summary.avgTransitionDuration}
            </div>
            <div className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>Avg Duration (days)</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className={`${compactScale.textTitle} font-bold text-orange-600`}>
              {turnoverData.summary.pendingHandoffs}
            </div>
            <div className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>Pending Handoffs</div>
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className={`${compactScale.iconSizeSmall} text-slate-600`} />
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Upcoming">Upcoming</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Delayed">Delayed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="text-xs">
              Overview
            </TabsTrigger>
            <TabsTrigger value="timeline" className="text-xs">
              Timeline
            </TabsTrigger>
            <TabsTrigger value="projects" className="text-xs">
              Projects
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Timeline Chart */}
            <div className={`${compactScale.chartHeight} w-full`}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={turnoverData.timelineData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      fontSize: compactScale.textSmall,
                    }}
                  />
                  <Bar dataKey="upcoming" fill="#3B82F6" stackId="a" />
                  <Bar dataKey="completed" fill="#10B981" stackId="a" />
                  <Bar dataKey="delayed" fill="#EF4444" stackId="a" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Status Breakdown */}
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                <div className={`${compactScale.textMedium} font-medium text-blue-700 dark:text-blue-300`}>
                  {turnoverData.projects.filter((p) => p.status === "Upcoming").length}
                </div>
                <div className={`${compactScale.textSmall} text-blue-600 dark:text-blue-400`}>Upcoming</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
                <div className={`${compactScale.textMedium} font-medium text-yellow-700 dark:text-yellow-300`}>
                  {turnoverData.projects.filter((p) => p.status === "In Progress").length}
                </div>
                <div className={`${compactScale.textSmall} text-yellow-600 dark:text-yellow-400`}>In Progress</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                <div className={`${compactScale.textMedium} font-medium text-green-700 dark:text-green-300`}>
                  {turnoverData.projects.filter((p) => p.status === "Completed").length}
                </div>
                <div className={`${compactScale.textSmall} text-green-600 dark:text-green-400`}>Completed</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                <div className={`${compactScale.textMedium} font-medium text-red-700 dark:text-red-300`}>
                  {turnoverData.projects.filter((p) => p.status === "Delayed").length}
                </div>
                <div className={`${compactScale.textSmall} text-red-600 dark:text-red-400`}>Delayed</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            {/* Upcoming Meetings */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CalendarDays className={`${compactScale.iconSizeSmall} text-cyan-600`} />
                <span className={`${compactScale.textMedium} font-medium text-slate-900 dark:text-slate-100`}>
                  Upcoming Meetings (Next 30 Days)
                </span>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {upcomingMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`${compactScale.textMedium} font-medium text-slate-900 dark:text-slate-100`}>
                        {meeting.projectName}
                      </span>
                      <Badge className={`text-xs ${getMeetingStatusColor(meeting.status)}`}>
                        {meeting.meetingType}
                      </Badge>
                    </div>
                    <div className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>
                      {formatDate(meeting.meetingDate)} • {meeting.attendees.join(", ")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Completed Turnovers */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CalendarCheck className={`${compactScale.iconSizeSmall} text-green-600`} />
                <span className={`${compactScale.textMedium} font-medium text-slate-900 dark:text-slate-100`}>
                  Completed Turnovers (Past 90 Days)
                </span>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {completedTurnovers.map((project) => (
                  <div
                    key={project.id}
                    className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`${compactScale.textMedium} font-medium text-slate-900 dark:text-slate-100`}>
                        {project.projectName}
                      </span>
                      <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Completed
                      </Badge>
                    </div>
                    <div className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>
                      {formatDate(project.turnoverDate)} • {project.transitionDuration} days
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            {/* Projects Table */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Building className={`${compactScale.iconSizeSmall} text-slate-600`} />
                      <span className={`${compactScale.textMedium} font-medium text-slate-900 dark:text-slate-100`}>
                        {project.projectName}
                      </span>
                    </div>
                    <Badge className={`text-xs ${getStatusColor(project.status)}`}>{project.status}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <div className={`${compactScale.textSmall} text-slate-500 dark:text-slate-400`}>Pre-Con Lead</div>
                      <div className={`${compactScale.textMedium} text-slate-900 dark:text-slate-100`}>
                        {project.preconLead}
                      </div>
                    </div>
                    <div>
                      <div className={`${compactScale.textSmall} text-slate-500 dark:text-slate-400`}>PM</div>
                      <div className={`${compactScale.textMedium} text-slate-900 dark:text-slate-100`}>
                        {project.projectManager}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <div className={`${compactScale.textSmall} text-slate-500 dark:text-slate-400`}>
                        Turnover Date
                      </div>
                      <div className={`${compactScale.textMedium} text-slate-900 dark:text-slate-100`}>
                        {formatDate(project.turnoverDate)}
                      </div>
                    </div>
                    <div>
                      <div className={`${compactScale.textSmall} text-slate-500 dark:text-slate-400`}>Duration</div>
                      <div className={`${compactScale.textMedium} text-slate-900 dark:text-slate-100`}>
                        {project.transitionDuration} days
                      </div>
                    </div>
                  </div>

                  {project.handoffNotes && (
                    <div className="mt-2 p-2 rounded bg-slate-50 dark:bg-slate-700/50">
                      <div className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>
                        {project.handoffNotes}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="p-3 rounded-lg bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className={`${compactScale.iconSizeSmall} text-cyan-600`} />
                <span className={`${compactScale.textMedium} font-medium text-slate-900 dark:text-slate-100`}>
                  Filter Summary
                </span>
              </div>
              <div className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>
                Showing {filteredProjects.length} of {turnoverData.projects.length} projects
                {selectedStatus !== "all" && ` with ${selectedStatus} status`}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Auto-refresh toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} className="scale-75" />
            <Label className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>Auto-refresh</Label>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100`}
          >
            <RefreshCw className={`${compactScale.iconSizeSmall} mr-1`} />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
