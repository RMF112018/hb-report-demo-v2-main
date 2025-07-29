"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle,
  FileText,
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
  Users,
  TrendingUp,
  DollarSign,
  Target,
  Activity,
  BarChart3,
  PieChart,
  Flag,
  AlertCircle,
  CalendarDays,
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

interface Milestone {
  id: string
  projectName: string
  milestoneType:
    | "Design Coordination"
    | "Permit Submittal"
    | "GMP Pricing"
    | "DD Pricing"
    | "Value Engineering"
    | "Constructability Review"
  dueDate: string
  status: "Upcoming" | "Due Soon" | "Overdue" | "Completed"
  priority: "High" | "Medium" | "Low"
  assignedTo: string
  daysRemaining: number
  description: string
}

interface MilestonesData {
  milestones: Milestone[]
  summary: {
    totalMilestones: number
    upcomingCount: number
    dueSoonCount: number
    overdueCount: number
    completedCount: number
  }
  typeBreakdown: {
    type: string
    count: number
    overdue: number
    upcoming: number
  }[]
}

interface BetaPreconMilestonesCardProps {
  className?: string
  config?: any
  isCompact?: boolean
  userRole?: string
}

export default function BetaPreconMilestonesCard({
  className,
  config,
  isCompact = false,
  userRole,
}: BetaPreconMilestonesCardProps) {
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

  const [activeTab, setActiveTab] = useState("upcoming")
  const [autoRefresh, setAutoRefresh] = useState(false)

  // Mock data for pre-construction milestones
  const milestonesData = useMemo(
    (): MilestonesData => ({
      milestones: [
        {
          id: "1",
          projectName: "Downtown Office Tower",
          milestoneType: "Design Coordination",
          dueDate: "2025-02-15",
          status: "Due Soon",
          priority: "High",
          assignedTo: "M. Alvarez",
          daysRemaining: 3,
          description: "Finalize structural coordination with architect",
        },
        {
          id: "2",
          projectName: "Luxury Condominiums",
          milestoneType: "Permit Submittal",
          dueDate: "2025-02-10",
          status: "Overdue",
          priority: "High",
          assignedTo: "D. Chen",
          daysRemaining: -2,
          description: "Submit building permit application",
        },
        {
          id: "3",
          projectName: "Medical Center Expansion",
          milestoneType: "GMP Pricing",
          dueDate: "2025-02-20",
          status: "Upcoming",
          priority: "Medium",
          assignedTo: "M. Alvarez",
          daysRemaining: 8,
          description: "Complete GMP pricing analysis",
        },
        {
          id: "4",
          projectName: "Public Library Renovation",
          milestoneType: "DD Pricing",
          dueDate: "2025-02-08",
          status: "Overdue",
          priority: "Medium",
          assignedTo: "D. Chen",
          daysRemaining: -4,
          description: "Complete design development pricing",
        },
        {
          id: "5",
          projectName: "Elementary School",
          milestoneType: "Value Engineering",
          dueDate: "2025-02-25",
          status: "Upcoming",
          priority: "Low",
          assignedTo: "M. Alvarez",
          daysRemaining: 13,
          description: "Conduct value engineering session",
        },
        {
          id: "6",
          projectName: "Luxury Hotel",
          milestoneType: "Constructability Review",
          dueDate: "2025-02-12",
          status: "Due Soon",
          priority: "High",
          assignedTo: "D. Chen",
          daysRemaining: 0,
          description: "Complete constructability review",
        },
        {
          id: "7",
          projectName: "Airport Terminal",
          milestoneType: "Design Coordination",
          dueDate: "2025-02-28",
          status: "Upcoming",
          priority: "Medium",
          assignedTo: "M. Alvarez",
          daysRemaining: 16,
          description: "Coordinate MEP design elements",
        },
        {
          id: "8",
          projectName: "Shopping Center",
          milestoneType: "Permit Submittal",
          dueDate: "2025-02-05",
          status: "Overdue",
          priority: "High",
          assignedTo: "D. Chen",
          daysRemaining: -7,
          description: "Submit site development permit",
        },
      ],
      summary: {
        totalMilestones: 8,
        upcomingCount: 3,
        dueSoonCount: 2,
        overdueCount: 3,
        completedCount: 0,
      },
      typeBreakdown: [
        { type: "Design Coordination", count: 2, overdue: 0, upcoming: 2 },
        { type: "Permit Submittal", count: 2, overdue: 2, upcoming: 0 },
        { type: "GMP Pricing", count: 1, overdue: 0, upcoming: 1 },
        { type: "DD Pricing", count: 1, overdue: 1, upcoming: 0 },
        { type: "Value Engineering", count: 1, overdue: 0, upcoming: 1 },
        { type: "Constructability Review", count: 1, overdue: 0, upcoming: 1 },
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
    dueSoon: "#F59E0B",
    overdue: "#EF4444",
    completed: "#10B981",
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
      case "Due Soon":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getDaysRemainingText = (days: number) => {
    if (days < 0) return `Overdue ${Math.abs(days)} days`
    if (days === 0) return "Due today"
    if (days === 1) return "Due tomorrow"
    if (days <= 7) return `Due in ${days} days`
    return `Due in ${days} days`
  }

  // Filter milestones based on active tab
  const filteredMilestones = useMemo(() => {
    if (activeTab === "upcoming") {
      return milestonesData.milestones.filter((m) => m.status === "Upcoming" || m.status === "Due Soon")
    } else {
      return milestonesData.milestones.filter((m) => m.status === "Overdue")
    }
  }, [milestonesData.milestones, activeTab])

  return (
    <Card
      className={`bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 border-indigo-200 dark:border-indigo-800 ${className}`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flag className={`${compactScale.iconSize} text-indigo-600`} />
            <CardTitle className={`${compactScale.textTitle} font-semibold text-slate-900 dark:text-slate-100`}>
              Pre-Con Milestones
            </CardTitle>
          </div>
          <Badge
            variant="secondary"
            className="text-xs bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
          >
            Active Tracking
          </Badge>
        </div>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Key upcoming and overdue pre-construction milestones
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className={`${compactScale.textTitle} font-bold text-indigo-600`}>
              {milestonesData.summary.totalMilestones}
            </div>
            <div className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>Total</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className={`${compactScale.textTitle} font-bold text-blue-600`}>
              {milestonesData.summary.upcomingCount + milestonesData.summary.dueSoonCount}
            </div>
            <div className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>Upcoming</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className={`${compactScale.textTitle} font-bold text-red-600`}>
              {milestonesData.summary.overdueCount}
            </div>
            <div className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>Overdue</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className={`${compactScale.textTitle} font-bold text-green-600`}>
              {milestonesData.summary.completedCount}
            </div>
            <div className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>Completed</div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming" className="text-xs">
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="pastDue" className="text-xs">
              Past Due
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {/* Timeline Chart */}
            <div className={`${compactScale.chartHeight} w-full`}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={milestonesData.typeBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis
                    dataKey="type"
                    stroke="#64748B"
                    fontSize={compactScale.textSmall}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis stroke="#64748B" fontSize={compactScale.textSmall} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      fontSize: compactScale.textSmall,
                    }}
                    formatter={(value, name) => [value, "Count"]}
                  />
                  <Bar dataKey="upcoming" fill={chartColors.upcoming} radius={[0, 0, 4, 4]} />
                  <Bar dataKey="overdue" fill={chartColors.overdue} radius={[0, 0, 4, 4]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Upcoming Milestones List */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {filteredMilestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className={`${compactScale.iconSizeSmall} text-slate-600`} />
                      <span className={`${compactScale.textMedium} font-medium text-slate-900 dark:text-slate-100`}>
                        {milestone.milestoneType}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge className={`text-xs ${getStatusColor(milestone.status)}`}>{milestone.status}</Badge>
                      <Badge className={`text-xs ${getPriorityColor(milestone.priority)}`}>{milestone.priority}</Badge>
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className={`${compactScale.textMedium} font-medium text-slate-900 dark:text-slate-100`}>
                      {milestone.projectName}
                    </div>
                    <div className={`${compactScale.textSmall} text-slate-500 dark:text-slate-400`}>
                      {milestone.description}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className={`${compactScale.iconSizeSmall} text-slate-600`} />
                      <span className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>
                        {getDaysRemainingText(milestone.daysRemaining)}
                      </span>
                    </div>
                    <div className={`${compactScale.textSmall} text-slate-500 dark:text-slate-400`}>
                      {milestone.assignedTo}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pastDue" className="space-y-4">
            {/* Overdue Milestones List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredMilestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`${compactScale.iconSizeSmall} text-red-600`} />
                      <span className={`${compactScale.textMedium} font-medium text-slate-900 dark:text-slate-100`}>
                        {milestone.milestoneType}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge className="text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        Overdue {Math.abs(milestone.daysRemaining)} days
                      </Badge>
                      <Badge className={`text-xs ${getPriorityColor(milestone.priority)}`}>{milestone.priority}</Badge>
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className={`${compactScale.textMedium} font-medium text-slate-900 dark:text-slate-100`}>
                      {milestone.projectName}
                    </div>
                    <div className={`${compactScale.textSmall} text-slate-500 dark:text-slate-400`}>
                      {milestone.description}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className={`${compactScale.iconSizeSmall} text-red-600`} />
                      <span className={`${compactScale.textSmall} text-red-600 dark:text-red-400`}>
                        Due: {formatDate(milestone.dueDate)}
                      </span>
                    </div>
                    <div className={`${compactScale.textSmall} text-slate-500 dark:text-slate-400`}>
                      {milestone.assignedTo}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Overdue Summary */}
            {filteredMilestones.length > 0 && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className={`${compactScale.iconSizeSmall} text-red-600`} />
                  <span className={`${compactScale.textMedium} font-medium text-slate-900 dark:text-slate-100`}>
                    Overdue Summary
                  </span>
                </div>
                <div className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>
                  {filteredMilestones.length} milestone{filteredMilestones.length !== 1 ? "s" : ""} require immediate
                  attention
                </div>
              </div>
            )}
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
