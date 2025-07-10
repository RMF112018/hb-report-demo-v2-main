/**
 * @fileoverview AI Assistant Coach Component
 * @module AIAssistantCoach
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Real-time AI assistant for schedule updates:
 * - Contextual suggestions and warnings
 * - CPM violation detection
 * - Impact analysis and recommendations
 * - Interactive coaching and explanations
 * - Confidence scoring for recommendations
 */

"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import {
  Brain,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Star,
  Clock,
  Calendar,
  GitBranch,
  Activity,
  Sparkles,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Info,
  ExternalLink,
  RefreshCw,
  Settings,
  FileText,
  Download,
  Send,
  Mail,
  Users,
  File,
  BarChart3,
  Diamond,
  Share2,
  Package,
  Upload,
  Bell,
  Edit3,
  Trash2,
  Plus,
  Paperclip,
  MessageSquare,
  X,
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

interface UpdatePackage {
  id: string
  activities: UpdateActivity[]
  summary: string
  health_score: number
  created_at: string
  created_by: string
  ai_insights: AIInsight[]
}

interface Recipient {
  id: string
  name: string
  email: string
  role: string
  department: string
  required: boolean
  avatar?: string
}

interface AIAssistantCoachProps {
  insights: AIInsight[]
  activities: UpdateActivity[]
  onInsightAction: (insightId: string, action: string) => void
  updatePackage?: UpdatePackage | null
  onExport?: (format: string) => void
  onDistribute?: (recipients: Recipient[]) => void
}

const exportFormats = [
  { value: "csv", label: "CSV", icon: FileText, description: "Comma-separated values for spreadsheet applications" },
  { value: "xml", label: "XML", icon: File, description: "Structured data format for system integration" },
  { value: "mpp", label: "MPP", icon: Calendar, description: "Microsoft Project file format" },
  { value: "xer", label: "XER", icon: Activity, description: "Primavera P6 exchange format" },
  { value: "json", label: "JSON", icon: FileText, description: "JavaScript Object Notation for web applications" },
  { value: "pdf", label: "PDF", icon: File, description: "Portable document format for reporting" },
]

const mockRecipients: Recipient[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@hbbuilding.com",
    role: "Project Manager",
    department: "Construction",
    required: true,
    avatar: "/avatars/john-smith.png",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@hbbuilding.com",
    role: "Scheduler",
    department: "Planning",
    required: true,
    avatar: "/avatars/sarah-johnson.png",
  },
  {
    id: "3",
    name: "Mike Davis",
    email: "mike.davis@hbbuilding.com",
    role: "Superintendent",
    department: "Field Operations",
    required: false,
    avatar: "/avatars/mike-davis.png",
  },
  {
    id: "4",
    name: "Lisa Chen",
    email: "lisa.chen@hbbuilding.com",
    role: "Project Executive",
    department: "Management",
    required: true,
    avatar: "/avatars/lisa-chen.png",
  },
  {
    id: "5",
    name: "Robert Wilson",
    email: "robert.wilson@hbbuilding.com",
    role: "Estimator",
    department: "Pre-Construction",
    required: false,
    avatar: "/avatars/robert-wilson.png",
  },
]

const delayReasons = [
  { value: "weather", label: "Weather Conditions", color: "bg-blue-100 text-blue-800" },
  { value: "permit", label: "Permit Delays", color: "bg-yellow-100 text-yellow-800" },
  { value: "equipment", label: "Equipment Issues", color: "bg-red-100 text-red-800" },
  { value: "material", label: "Material Delays", color: "bg-purple-100 text-purple-800" },
  { value: "labor", label: "Labor Shortage", color: "bg-orange-100 text-orange-800" },
  { value: "design", label: "Design Changes", color: "bg-green-100 text-green-800" },
  { value: "coordination", label: "Coordination Issues", color: "bg-gray-100 text-gray-800" },
  { value: "other", label: "Other", color: "bg-gray-100 text-gray-800" },
]

export const AIAssistantCoach: React.FC<AIAssistantCoachProps> = ({
  insights,
  activities,
  onInsightAction,
  updatePackage,
  onExport,
  onDistribute,
}) => {
  const [expandedInsights, setExpandedInsights] = useState<Set<string>>(new Set())
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null)
  const [isThinking, setIsThinking] = useState(false)
  const [activeFilter, setActiveFilter] = useState<"all" | "high" | "medium" | "low">("all")
  const [aiStatus, setAiStatus] = useState<"idle" | "analyzing" | "ready">("ready")
  const [activeTab, setActiveTab] = useState("summary")

  // Update Panel State
  const [selectedFormats, setSelectedFormats] = useState<string[]>(["csv", "pdf"])
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>(
    mockRecipients.filter((r) => r.required).map((r) => r.id)
  )
  const [emailSubject, setEmailSubject] = useState(`Schedule Update Package - ${format(new Date(), "MMM d, yyyy")}`)
  const [emailMessage, setEmailMessage] = useState("")
  const [isExporting, setIsExporting] = useState(false)
  const [isDistributing, setIsDistributing] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [autoNotifications, setAutoNotifications] = useState(true)
  const [requireApproval, setRequireApproval] = useState(true)

  // Initialize email message when update package is available
  useEffect(() => {
    if (updatePackage) {
      setEmailMessage(
        `Please find the attached schedule update package for review. This update includes ${updatePackage.activities.length} modified activities with a health score of ${updatePackage.health_score}%.`
      )
    }
  }, [updatePackage])

  // Generate real-time insights based on activities
  const generateRealTimeInsights = useCallback(() => {
    const newInsights: AIInsight[] = []

    // Check for missing progress updates
    const missingUpdates = activities.filter(
      (a) => a.percent_complete > 0 && a.percent_complete < 100 && !a.actual_start
    )

    if (missingUpdates.length > 0) {
      newInsights.push({
        id: `missing-updates-${Date.now()}`,
        type: "suggestion",
        severity: "medium",
        title: "Missing Progress Updates",
        description: `${missingUpdates.length} activities are missing actual start dates. Update these to improve schedule accuracy.`,
        affected_activities: missingUpdates.map((a) => a.activity_id),
        suggested_actions: [
          "Request field updates from superintendents",
          "Set up automatic progress reporting",
          "Schedule weekly update meetings",
        ],
        confidence: 0.85,
        timestamp: new Date().toISOString(),
        category: "schedule",
        interactive: true,
        explanation:
          "Activities showing progress without actual start dates indicate incomplete tracking. This can lead to inaccurate schedule projections and poor decision-making.",
      })
    }

    // Check for critical path delays
    const criticalDelays = activities.filter((a) => a.is_critical && a.change_type === "delay")

    if (criticalDelays.length > 0) {
      newInsights.push({
        id: `critical-delays-${Date.now()}`,
        type: "warning",
        severity: "high",
        title: "Critical Path Impact",
        description: `${criticalDelays.length} critical activities are delayed. This will impact project completion.`,
        affected_activities: criticalDelays.map((a) => a.activity_id),
        suggested_actions: [
          "Analyze downstream impact",
          "Consider resource acceleration",
          "Evaluate parallel work opportunities",
          "Update milestone dates",
        ],
        confidence: 0.95,
        timestamp: new Date().toISOString(),
        category: "risk",
        interactive: true,
        explanation:
          "Critical path delays directly impact project completion date. Each day of delay on the critical path extends the project by one day unless mitigated.",
      })
    }

    // Check for negative float
    const negativeFloat = activities.filter((a) => a.float_days < 0)

    if (negativeFloat.length > 0) {
      newInsights.push({
        id: `negative-float-${Date.now()}`,
        type: "error",
        severity: "high",
        title: "Negative Float Detected",
        description: `${negativeFloat.length} activities have negative float, indicating behind-schedule conditions.`,
        affected_activities: negativeFloat.map((a) => a.activity_id),
        suggested_actions: [
          "Crash critical activities",
          "Add resources to negative float activities",
          "Revise activity durations",
          "Consider fast-tracking options",
        ],
        confidence: 0.9,
        timestamp: new Date().toISOString(),
        category: "schedule",
        interactive: true,
        explanation:
          "Negative float indicates activities are behind schedule. This requires immediate attention to prevent further delays.",
      })
    }

    // Check for optimization opportunities
    const completedEarly = activities.filter((a) => {
      if (a.actual_finish && a.baseline_finish) {
        const actual = new Date(a.actual_finish)
        const baseline = new Date(a.baseline_finish)
        return actual < baseline
      }
      return false
    })

    if (completedEarly.length > 0) {
      newInsights.push({
        id: `optimization-${Date.now()}`,
        type: "improvement",
        severity: "low",
        title: "Acceleration Opportunities",
        description: `${completedEarly.length} activities completed early. Consider accelerating dependent activities.`,
        affected_activities: completedEarly.map((a) => a.activity_id),
        suggested_actions: [
          "Start successor activities early",
          "Reallocate resources from completed activities",
          "Update logic ties",
          "Consider parallel execution",
        ],
        confidence: 0.75,
        timestamp: new Date().toISOString(),
        category: "optimization",
        interactive: true,
        explanation:
          "Early completions create opportunities to accelerate the overall schedule by starting dependent activities sooner.",
      })
    }

    return newInsights
  }, [activities])

  // Filter insights based on severity
  const filteredInsights = insights.filter((insight) => {
    if (activeFilter === "all") return true
    return insight.severity === activeFilter
  })

  // Toggle insight expansion
  const toggleInsightExpansion = useCallback((insightId: string) => {
    setExpandedInsights((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(insightId)) {
        newSet.delete(insightId)
      } else {
        newSet.add(insightId)
      }
      return newSet
    })
  }, [])

  // Get insight icon
  const getInsightIcon = useCallback((insight: AIInsight) => {
    switch (insight.type) {
      case "suggestion":
        return <Lightbulb className="h-4 w-4 text-blue-500 dark:text-blue-400" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500 dark:text-red-400" />
      case "improvement":
        return <TrendingUp className="h-4 w-4 text-green-500 dark:text-green-400" />
      default:
        return <Info className="h-4 w-4 text-gray-500 dark:text-gray-400" />
    }
  }, [])

  // Get insight color
  const getInsightColor = useCallback((insight: AIInsight) => {
    switch (insight.severity) {
      case "high":
        return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
      case "medium":
        return "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950"
      case "low":
        return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
      default:
        return "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950"
    }
  }, [])

  // Render insight card
  const renderInsight = useCallback(
    (insight: AIInsight) => {
      const isExpanded = expandedInsights.has(insight.id)

      return (
        <Card key={insight.id} className={cn("transition-all", getInsightColor(insight))}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                {getInsightIcon(insight)}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm">{insight.title}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {insight.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 dark:text-yellow-400" />
                        <span className="text-xs font-medium">{Math.round(insight.confidence * 100)}%</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>AI Confidence Score</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleInsightExpansion(insight.id)}
                  className="h-6 w-6 p-0"
                >
                  {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </Button>
              </div>
            </div>
          </CardHeader>

          <Collapsible open={isExpanded}>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Affected Activities */}
                  {insight.affected_activities.length > 0 && (
                    <div>
                      <Label className="text-xs font-medium text-gray-600">Affected Activities</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {insight.affected_activities.map((activityId) => (
                          <Badge key={activityId} variant="secondary" className="text-xs">
                            {activityId}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggested Actions */}
                  {insight.suggested_actions.length > 0 && (
                    <div>
                      <Label className="text-xs font-medium text-gray-600">Suggested Actions</Label>
                      <ul className="mt-1 space-y-1">
                        {insight.suggested_actions.map((action, index) => (
                          <li key={index} className="text-xs text-foreground flex items-start gap-2">
                            <span className="text-blue-500 dark:text-blue-400 mt-1">•</span>
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Confidence Score */}
                  <div>
                    <Label className="text-xs font-medium text-gray-600">Confidence Score</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={insight.confidence * 100} className="flex-1 h-2" />
                      <span className="text-xs text-gray-500">{Math.round(insight.confidence * 100)}%</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onInsightAction(insight.id, "accept")}
                      className="flex-1"
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onInsightAction(insight.id, "dismiss")}
                      className="flex-1"
                    >
                      <ThumbsDown className="h-3 w-3 mr-1" />
                      Dismiss
                    </Button>
                    {insight.interactive && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <HelpCircle className="h-3 w-3 mr-1" />
                            Explain
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{insight.title}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <p className="text-sm">{insight.explanation}</p>
                            {insight.references && (
                              <div>
                                <h4 className="font-medium mb-2">References:</h4>
                                <ul className="space-y-1">
                                  {insight.references.map((ref, index) => (
                                    <li
                                      key={index}
                                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                                    >
                                      <ExternalLink className="h-3 w-3 inline mr-1" />
                                      {ref}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      )
    },
    [expandedInsights, toggleInsightExpansion, getInsightIcon, getInsightColor, onInsightAction]
  )

  // Simulate AI thinking
  const simulateAIThinking = useCallback(() => {
    setIsThinking(true)
    setAiStatus("analyzing")

    setTimeout(() => {
      setIsThinking(false)
      setAiStatus("ready")
    }, 2000)
  }, [])

  // Handle format selection
  const handleFormatToggle = useCallback((format: string) => {
    setSelectedFormats((prev) => (prev.includes(format) ? prev.filter((f) => f !== format) : [...prev, format]))
  }, [])

  // Handle recipient selection
  const handleRecipientToggle = useCallback((recipientId: string) => {
    setSelectedRecipients((prev) =>
      prev.includes(recipientId) ? prev.filter((id) => id !== recipientId) : [...prev, recipientId]
    )
  }, [])

  // Handle export
  const handleExport = useCallback(
    async (format: string) => {
      setIsExporting(true)
      setExportProgress(0)

      // Simulate export progress
      const interval = setInterval(() => {
        setExportProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsExporting(false)
            onExport?.(format)
            return 100
          }
          return prev + 10
        })
      }, 200)
    },
    [onExport]
  )

  // Handle distribute
  const handleDistribute = useCallback(async () => {
    setIsDistributing(true)
    const recipients = mockRecipients.filter((r) => selectedRecipients.includes(r.id))

    // Simulate distribution delay
    setTimeout(() => {
      setIsDistributing(false)
      onDistribute?.(recipients)
    }, 2000)
  }, [selectedRecipients, onDistribute])

  // Calculate statistics for update package
  const updateStatistics = useMemo(() => {
    if (!updatePackage) return null

    const { activities } = updatePackage
    const totalActivities = activities.length
    const delayedActivities = activities.filter((a) => a.change_type === "delay").length
    const criticalActivities = activities.filter((a) => a.is_critical).length
    const completedActivities = activities.filter((a) => a.percent_complete === 100).length

    // Calculate average delay
    const delays = activities
      .filter((a) => a.change_type === "delay")
      .map((a) => {
        const baselineDate = new Date(a.baseline_start)
        const currentDate = new Date(a.current_start)
        return Math.ceil((currentDate.getTime() - baselineDate.getTime()) / (1000 * 60 * 60 * 24))
      })

    const averageDelay = delays.length > 0 ? delays.reduce((sum, delay) => sum + delay, 0) / delays.length : 0

    // Group by delay reason
    const delayReasonCounts = activities.reduce((acc, activity) => {
      if (activity.delay_reason) {
        acc[activity.delay_reason] = (acc[activity.delay_reason] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    const criticalPathDelays = activities.filter((a) => a.is_critical && a.change_type === "delay").length

    return {
      totalActivities,
      delayedActivities,
      criticalActivities,
      completedActivities,
      averageDelay,
      delayReasonCounts,
      criticalPathDelays,
    }
  }, [updatePackage])

  // Get health score color
  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400"
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  // Get health score badge variant
  const getHealthScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default"
    if (score >= 60) return "secondary"
    return "destructive"
  }

  // Render update package content
  const renderUpdatePackageContent = () => {
    if (!updatePackage || !updateStatistics) return null

    return (
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="distribute">Distribute</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
          <TabsTrigger value="review">Review</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="flex-1 mt-4">
          <ScrollArea className="h-full">
            <div className="space-y-4">
              {/* Health Score */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <BarChart3 className="h-4 w-4" />
                    Health Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold">
                      <span className={getHealthScoreColor(updatePackage.health_score)}>
                        {updatePackage.health_score}
                      </span>
                      <span className="text-sm text-gray-500">/100</span>
                    </div>
                    <div className="flex-1">
                      <Progress value={updatePackage.health_score} className="h-2" />
                      <Badge variant={getHealthScoreBadgeVariant(updatePackage.health_score)} className="mt-1 text-xs">
                        {updatePackage.health_score >= 80
                          ? "Excellent"
                          : updatePackage.health_score >= 60
                          ? "Good"
                          : "Needs Attention"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Activity className="h-4 w-4" />
                    Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-600">{updateStatistics.totalActivities}</div>
                      <div className="text-xs text-gray-500">Total Activities</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-red-600">{updateStatistics.delayedActivities}</div>
                      <div className="text-xs text-gray-500">Delayed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-orange-600">{updateStatistics.criticalActivities}</div>
                      <div className="text-xs text-gray-500">Critical</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-600">{updateStatistics.completedActivities}</div>
                      <div className="text-xs text-gray-500">Completed</div>
                    </div>
                  </div>

                  {updateStatistics.averageDelay > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="text-center">
                        <div className="text-lg font-bold text-amber-600">
                          {Math.round(updateStatistics.averageDelay)} days
                        </div>
                        <div className="text-xs text-gray-500">Average Delay</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Delay Reasons */}
              {Object.keys(updateStatistics.delayReasonCounts).length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4" />
                      Delay Reasons
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(updateStatistics.delayReasonCounts).map(([reason, count]) => {
                        const reasonInfo = delayReasons.find((r) => r.value === reason)
                        return (
                          <div key={reason} className="flex items-center justify-between">
                            <Badge variant="outline" className={cn("text-xs", reasonInfo?.color)}>
                              {reasonInfo?.label}
                            </Badge>
                            <span className="text-xs font-medium">{count}</span>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Critical Path Impact */}
              {updateStatistics.criticalPathDelays > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    <strong>Critical Path Impact:</strong> {updateStatistics.criticalPathDelays} critical activities are
                    delayed. This may impact the project completion date.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="distribute" className="flex-1 mt-4">
          <ScrollArea className="h-full">
            <div className="space-y-4">
              {/* Email Settings */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4" />
                    Email Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label htmlFor="subject" className="text-xs">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-xs">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      value={emailMessage}
                      onChange={(e) => setEmailMessage(e.target.value)}
                      className="text-xs min-h-[60px]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Recipients */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4" />
                    Recipients
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {mockRecipients.map((recipient) => (
                      <div key={recipient.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={recipient.id}
                          checked={selectedRecipients.includes(recipient.id)}
                          onCheckedChange={() => handleRecipientToggle(recipient.id)}
                        />
                        <div className="flex items-center gap-2 flex-1">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={recipient.avatar} />
                            <AvatarFallback className="text-xs">
                              {recipient.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-xs font-medium">{recipient.name}</div>
                            <div className="text-xs text-gray-500">{recipient.role}</div>
                          </div>
                        </div>
                        {recipient.required && (
                          <Badge variant="secondary" className="text-xs">
                            Required
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Distribution Options */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Settings className="h-4 w-4" />
                    Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications" className="text-xs">
                      Auto Notifications
                    </Label>
                    <Switch id="notifications" checked={autoNotifications} onCheckedChange={setAutoNotifications} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="approval" className="text-xs">
                      Require Approval
                    </Label>
                    <Switch id="approval" checked={requireApproval} onCheckedChange={setRequireApproval} />
                  </div>
                </CardContent>
              </Card>

              <Button onClick={handleDistribute} disabled={isDistributing} className="w-full">
                {isDistributing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Distributing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Distribute Update
                  </>
                )}
              </Button>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="export" className="flex-1 mt-4">
          <ScrollArea className="h-full">
            <div className="space-y-4">
              {/* Export Formats */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Download className="h-4 w-4" />
                    Export Formats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {exportFormats.map((format) => {
                      const Icon = format.icon
                      return (
                        <div key={format.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={format.value}
                            checked={selectedFormats.includes(format.value)}
                            onCheckedChange={() => handleFormatToggle(format.value)}
                          />
                          <div className="flex items-center gap-2 flex-1">
                            <Icon className="h-4 w-4" />
                            <div>
                              <div className="text-xs font-medium">{format.label}</div>
                              <div className="text-xs text-gray-500">{format.description}</div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Export Progress */}
              {isExporting && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Exporting...
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={exportProgress} className="w-full" />
                    <div className="text-xs text-gray-500 mt-2">{exportProgress}% complete</div>
                  </CardContent>
                </Card>
              )}

              {/* Export Actions */}
              <div className="grid grid-cols-2 gap-2">
                {selectedFormats.map((format: string) => (
                  <Button
                    key={format}
                    variant="outline"
                    onClick={() => handleExport(format)}
                    disabled={isExporting}
                    className="text-xs"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    {format.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="review" className="flex-1 mt-4">
          <ScrollArea className="h-full">
            <div className="space-y-4">
              {/* Review Status */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Eye className="h-4 w-4" />
                    Review Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Package Created</span>
                      <Badge variant="default" className="text-xs">
                        Complete
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Review Pending</span>
                      <Badge variant="secondary" className="text-xs">
                        In Progress
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Approval Required</span>
                      <Badge variant="outline" className="text-xs">
                        Pending
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Package Info */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4" />
                    Package Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <span className="text-xs">
                        Created: {format(new Date(updatePackage.created_at), "MMM d, yyyy 'at' h:mm a")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3 text-gray-500" />
                      <span className="text-xs">By: {updatePackage.created_by}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-3 w-3 text-gray-500" />
                      <span className="text-xs">ID: {updatePackage.id}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="space-y-2">
                <Button variant="outline" className="w-full text-xs">
                  <Eye className="h-3 w-3 mr-1" />
                  View Full Report
                </Button>
                <Button variant="outline" className="w-full text-xs">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Add Comment
                </Button>
                <Button variant="outline" className="w-full text-xs">
                  <Bell className="h-3 w-3 mr-1" />
                  Request Review
                </Button>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          HBI Scheduler
          <Badge variant="outline" className="text-xs">
            {updatePackage ? "Update Saved" : aiStatus === "ready" ? "Ready" : "Analyzing"}
          </Badge>
        </CardTitle>

        {!updatePackage && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={simulateAIThinking} disabled={isThinking}>
              {isThinking ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-3 w-3 mr-1" />
                  Refresh
                </>
              )}
            </Button>
            <div className="flex rounded-md border">
              {["all", "high", "medium", "low"].map((filter) => (
                <Button
                  key={filter}
                  variant={activeFilter === filter ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveFilter(filter as any)}
                  className="px-2 text-xs"
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        {updatePackage ? (
          renderUpdatePackageContent()
        ) : (
          <>
            <ScrollArea className="flex-1">
              <div className="space-y-3">
                {filteredInsights.length > 0 ? (
                  filteredInsights.map(renderInsight)
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">No insights for current filter</p>
                    <Button variant="outline" size="sm" onClick={() => setActiveFilter("all")} className="mt-2">
                      Show All
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Status Bar */}
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <Activity className="h-3 w-3" />
                  {filteredInsights.length} insights
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  Updated now
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
