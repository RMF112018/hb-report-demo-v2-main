/**
 * @fileoverview Schedule Update Component - Comprehensive Schedule Update System
 * @module ScheduleUpdate
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Interactive schedule update system with:
 * - Editable activity table with validation
 * - Date range filtering
 * - AI-assisted feedback and coaching
 * - Update comparison and diff views
 * - Export and submission workflow
 * - Microsoft Graph integration for review packages
 */

"use client"

import React, { useState, useMemo, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import {
  RefreshCw,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Download,
  Send,
  Brain,
  Target,
  TrendingUp,
  FileText,
  Settings,
  Filter,
  Save,
  Upload,
  Mail,
  Users,
  GitBranch,
  Zap,
  Info,
  Plus,
  Minimize2,
  Maximize2,
  BarChart3,
  Activity,
  Package,
} from "lucide-react"

// Import the modular components
import { ScheduleUpdateTable } from "./update-components/ScheduleUpdateTable"
import { UpdateRangeSelector } from "./update-components/UpdateRangeSelector"
import { FragnetBuilder } from "./update-components/FragnetBuilder"
import { AIAssistantCoach } from "./update-components/AIAssistantCoach"

// Types and interfaces
interface ScheduleUpdateProps {
  userRole: string
  projectData: any
  projectId?: string
  hideAISidebar?: boolean
  onUpdatePackageChange?: (updatePackage: UpdatePackage | null) => void
  onAIInsightsChange?: (insights: AIInsight[]) => void
  onActivitiesChange?: (activities: UpdateActivity[]) => void
}

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

interface UpdatePackage {
  id: string
  activities: UpdateActivity[]
  summary: string
  health_score: number
  created_at: string
  created_by: string
  ai_insights: AIInsight[]
}

interface AIInsight {
  id: string
  type: "suggestion" | "warning" | "error" | "improvement"
  severity: "low" | "medium" | "high"
  title: string
  description: string
  affected_activities: string[]
  suggested_actions: string[]
  confidence: number
  timestamp: string
  category: "schedule" | "resources" | "risk" | "optimization"
  interactive: boolean
  explanation?: string
  references?: string[]
}

interface DateRange {
  start: Date
  end: Date
  label: string
}

const ScheduleUpdate: React.FC<ScheduleUpdateProps> = ({
  userRole,
  projectData,
  projectId,
  hideAISidebar = false,
  onUpdatePackageChange,
  onAIInsightsChange,
  onActivitiesChange,
}) => {
  const { toast } = useToast()

  // Core state management
  const [activities, setActivities] = useState<UpdateActivity[]>([])
  const [selectedRange, setSelectedRange] = useState<DateRange>({
    start: new Date(2024, 0, 1), // January 1, 2024
    end: new Date(2026, 11, 31), // December 31, 2026
    label: "All Activities",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [updatePackage, setUpdatePackage] = useState<UpdatePackage | null>(null)
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([])

  const [showFragnetBuilder, setShowFragnetBuilder] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [healthScore, setHealthScore] = useState(85)
  const [isLoading, setIsLoading] = useState(false)

  // Initialize with mock data from the same dataset used in ProjectSchedule
  useEffect(() => {
    const mockActivities: UpdateActivity[] = [
      {
        activity_id: "A001",
        description: "Milestone - Project Kickoff",
        type: "Milestone",
        baseline_start: "2025-09-08",
        baseline_finish: "2025-09-08",
        current_start: "2025-09-11",
        current_finish: "2025-09-11",
        actual_start: "2025-09-11",
        actual_finish: "2025-09-11",
        delay_reason: "weather",
        notes: "Delayed due to severe weather conditions",
        change_type: "delay",
        is_critical: true,
        float_days: 0,
        percent_complete: 100,
        modified: true,
        validation_errors: [],
      },
      {
        activity_id: "A002",
        description: "Milestone - Design Approval",
        type: "Milestone",
        baseline_start: "2025-09-02",
        baseline_finish: "2025-09-02",
        current_start: "2025-09-06",
        current_finish: "2025-09-06",
        actual_start: "2025-09-06",
        actual_finish: "2025-09-06",
        delay_reason: "permit",
        notes: "Waiting for city approval",
        change_type: "delay",
        is_critical: false,
        float_days: 2,
        percent_complete: 100,
        modified: true,
        validation_errors: [],
      },
      {
        activity_id: "A003",
        description: "Milestone - Foundation Complete",
        type: "Milestone",
        baseline_start: "2025-09-12",
        baseline_finish: "2025-09-12",
        current_start: "2025-09-18",
        current_finish: "2025-09-18",
        is_critical: true,
        float_days: 0,
        percent_complete: 0,
        modified: false,
        validation_errors: [],
      },
      {
        activity_id: "A004",
        description: "Task - Site Preparation",
        type: "Task",
        baseline_start: "2025-09-05",
        baseline_finish: "2025-09-19",
        current_start: "2025-09-06",
        current_finish: "2025-09-19",
        actual_start: "2025-09-06",
        actual_finish: "2025-09-19",
        percent_complete: 100,
        is_critical: false,
        float_days: 1,
        modified: false,
        validation_errors: [],
      },
      {
        activity_id: "A005",
        description: "Task - Excavation Work",
        type: "Task",
        baseline_start: "2025-09-10",
        baseline_finish: "2025-09-24",
        current_start: "2025-09-12",
        current_finish: "2025-09-26",
        actual_start: "2025-09-12",
        percent_complete: 75,
        delay_reason: "equipment",
        notes: "Excavator breakdown caused 2-day delay",
        change_type: "delay",
        is_critical: true,
        float_days: 0,
        modified: true,
        validation_errors: [],
      },
      {
        activity_id: "A006",
        description: "Milestone - Permit Approval",
        type: "Milestone",
        baseline_start: "2025-09-15",
        baseline_finish: "2025-09-15",
        current_start: "2025-09-19",
        current_finish: "2025-09-19",
        delay_reason: "permit",
        notes: "Extended review process",
        change_type: "delay",
        is_critical: false,
        float_days: 1,
        percent_complete: 0,
        modified: true,
        validation_errors: [],
      },
      {
        activity_id: "A007",
        description: "Task - Foundation Pour",
        type: "Task",
        baseline_start: "2025-09-20",
        baseline_finish: "2025-10-05",
        current_start: "2025-09-21",
        current_finish: "2025-10-06",
        percent_complete: 0,
        is_critical: true,
        float_days: 0,
        modified: false,
        validation_errors: [],
      },
    ]

    setActivities(mockActivities)
    generateAIInsights(mockActivities)
  }, [])

  // Generate AI insights based on current activities
  const generateAIInsights = useCallback((activities: UpdateActivity[]) => {
    const insights: AIInsight[] = [
      {
        id: "insight-1",
        type: "warning",
        severity: "high",
        title: "Critical Path Impact Detected",
        description:
          "The 3-day delay in Project Kickoff (A001) will impact the project completion date. Consider accelerating downstream activities.",
        affected_activities: ["A001", "A003", "A007"],
        suggested_actions: [
          "Review resource allocation for Foundation Pour",
          "Consider overtime for critical activities",
          "Evaluate parallel work opportunities",
        ],
        confidence: 0.92,
        timestamp: new Date().toISOString(),
        category: "risk",
        interactive: true,
        explanation:
          "Critical path delays directly impact project completion date. Each day of delay on the critical path extends the project by one day unless mitigated.",
      },
      {
        id: "insight-2",
        type: "suggestion",
        severity: "medium",
        title: "Missing Progress Updates",
        description: "Several activities are missing actual start dates. Please update to improve schedule accuracy.",
        affected_activities: ["A003", "A006", "A007"],
        suggested_actions: [
          "Request field updates for in-progress activities",
          "Set up automatic progress reporting",
          "Schedule weekly update meetings",
        ],
        confidence: 0.85,
        timestamp: new Date().toISOString(),
        category: "schedule",
        interactive: true,
        explanation:
          "Activities showing progress without actual start dates indicate incomplete tracking. This can lead to inaccurate schedule projections and poor decision-making.",
      },
      {
        id: "insight-3",
        type: "improvement",
        severity: "low",
        title: "Optimization Opportunity",
        description:
          "Site Preparation completed on schedule. Consider starting Excavation Work earlier if resources permit.",
        affected_activities: ["A004", "A005"],
        suggested_actions: [
          "Check equipment availability",
          "Coordinate with excavation crew",
          "Update logic ties if applicable",
        ],
        confidence: 0.78,
        timestamp: new Date().toISOString(),
        category: "optimization",
        interactive: true,
        explanation:
          "Early completions create opportunities to accelerate the overall schedule by starting dependent activities sooner.",
      },
    ]
    setAiInsights(insights)
  }, [])

  // Handle activity updates
  const handleActivityUpdate = useCallback((activityId: string, updates: Partial<UpdateActivity>) => {
    setActivities((prev) =>
      prev.map((activity) =>
        activity.activity_id === activityId ? { ...activity, ...updates, modified: true } : activity
      )
    )
  }, [])

  // Validate update logic
  const validateUpdates = useCallback(() => {
    const errors: string[] = []
    const modifiedActivities = activities.filter((a) => a.modified)

    modifiedActivities.forEach((activity) => {
      // Check date logic
      if (activity.actual_start && activity.actual_finish) {
        if (new Date(activity.actual_start) > new Date(activity.actual_finish)) {
          errors.push(`${activity.activity_id}: Start date cannot be after finish date`)
        }
      }

      // Check required fields for delays
      if (activity.change_type === "delay" && !activity.delay_reason) {
        errors.push(`${activity.activity_id}: Delay reason is required for delayed activities`)
      }

      // Check critical path violations
      if (activity.is_critical && activity.float_days < 0) {
        errors.push(`${activity.activity_id}: Negative float detected on critical path`)
      }
    })

    setValidationErrors(errors)
    return errors.length === 0
  }, [activities])

  // Calculate health score
  const calculateHealthScore = useCallback(() => {
    const totalActivities = activities.length
    const completedActivities = activities.filter((a) => a.percent_complete === 100).length
    const onScheduleActivities = activities.filter((a) => !a.modified || a.change_type !== "delay").length
    const criticalDelays = activities.filter((a) => a.is_critical && a.change_type === "delay").length

    let score = 100
    score -= (totalActivities - completedActivities) * 2 // Incomplete activities
    score -= (totalActivities - onScheduleActivities) * 3 // Schedule deviations
    score -= criticalDelays * 10 // Critical path delays
    score -= validationErrors.length * 5 // Validation errors

    return Math.max(0, Math.min(100, score))
  }, [activities, validationErrors])

  // Update health score when activities change
  useEffect(() => {
    setHealthScore(calculateHealthScore())
  }, [activities, calculateHealthScore])

  // Filter activities by date range
  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const activityStart = new Date(activity.current_start)
      const activityEnd = new Date(activity.current_finish)
      return (
        (activityStart >= selectedRange.start && activityStart <= selectedRange.end) ||
        (activityEnd >= selectedRange.start && activityEnd <= selectedRange.end) ||
        (activityStart <= selectedRange.start && activityEnd >= selectedRange.end)
      )
    })
  }, [activities, selectedRange])

  // Handle submission
  const handleSubmit = async () => {
    if (!validateUpdates()) {
      toast({
        title: "Validation Failed",
        description: "Please fix validation errors before submitting",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      // Create update package
      const newUpdatePackage: UpdatePackage = {
        id: `update-${Date.now()}`,
        activities: activities.filter((a) => a.modified),
        summary: `Schedule update for ${filteredActivities.length} activities`,
        health_score: healthScore,
        created_at: new Date().toISOString(),
        created_by: userRole,
        ai_insights: aiInsights,
      }

      setUpdatePackage(newUpdatePackage)

      // Simulate submission delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Update Submitted",
        description: "Schedule update package has been created successfully",
      })
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit update package. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Share data with parent component when provided
  useEffect(() => {
    if (onUpdatePackageChange) {
      onUpdatePackageChange(updatePackage)
    }
  }, [updatePackage, onUpdatePackageChange])

  useEffect(() => {
    if (onAIInsightsChange) {
      onAIInsightsChange(aiInsights)
    }
  }, [aiInsights, onAIInsightsChange])

  useEffect(() => {
    if (onActivitiesChange) {
      onActivitiesChange(filteredActivities)
    }
  }, [filteredActivities, onActivitiesChange])

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      {/* Header Section */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <RefreshCw className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Schedule Update</h2>
            <p className="text-sm text-muted-foreground">Review and update project schedule activities</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={healthScore >= 80 ? "default" : healthScore >= 60 ? "secondary" : "destructive"}>
            Health Score: {healthScore}%
          </Badge>
          <Button variant="outline" size="sm" onClick={() => setShowFragnetBuilder(!showFragnetBuilder)}>
            <GitBranch className="h-4 w-4 mr-2" />
            Fragnet Builder
          </Button>
        </div>
      </div>

      {/* Update Range Selector */}
      <UpdateRangeSelector selectedRange={selectedRange} onRangeChange={setSelectedRange} />

      {/* Main Content Area */}
      <div className={`grid grid-cols-1 gap-6 ${hideAISidebar ? "xl:grid-cols-1" : "xl:grid-cols-4"}`}>
        {/* Schedule Update Table - Takes full width when hideAISidebar is true */}
        <div className={hideAISidebar ? "xl:col-span-1 space-y-4" : "xl:col-span-3 space-y-4"}>
          <ScheduleUpdateTable
            activities={filteredActivities}
            onActivityUpdate={handleActivityUpdate}
            validationErrors={validationErrors}
            isLoading={isLoading}
            onResetChanges={() => setActivities((prev) => prev.map((a) => ({ ...a, modified: false })))}
            onSubmitUpdate={handleSubmit}
            isSubmitting={isSubmitting}
          />

          {/* Fragnet Builder */}
          {showFragnetBuilder && (
            <FragnetBuilder
              activities={filteredActivities}
              onClose={() => setShowFragnetBuilder(false)}
              onFragnetUpdate={(updates) => {
                // Handle fragnet updates
                console.log("Fragnet updates:", updates)
              }}
            />
          )}
        </div>

        {/* AI Assistant Coach - Only render when hideAISidebar is false */}
        {!hideAISidebar && (
          <div className="xl:col-span-1">
            <AIAssistantCoach
              insights={aiInsights}
              activities={filteredActivities}
              onInsightAction={(insightId, action) => {
                console.log("AI insight action:", insightId, action)
              }}
              updatePackage={updatePackage}
              onExport={(format) => {
                toast({
                  title: "Export Started",
                  description: `Exporting update package in ${format} format`,
                })
              }}
              onDistribute={(recipients) => {
                toast({
                  title: "Distribution Started",
                  description: `Sending update package to ${recipients.length} recipients`,
                })
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default ScheduleUpdate
