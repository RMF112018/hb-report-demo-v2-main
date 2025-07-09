/**
 * @fileoverview Update Summary Sidebar Component
 * @module UpdateSummarySidebar
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Slide-in sidebar panel for summarizing proposed changes:
 * - Change summary and statistics
 * - Before/after comparison
 * - Health score breakdown
 * - Export and distribution options
 * - Review workflow integration
 */

"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import {
  FileText,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Users,
  Download,
  Send,
  Eye,
  BarChart3,
  Target,
  Diamond,
  Activity,
  GitBranch,
  Zap,
  Brain,
  Star,
  Bookmark,
  Share2,
  Mail,
  MessageSquare,
  RefreshCw,
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

interface UpdateSummarySidebarProps {
  updatePackage: UpdatePackage
  onClose: () => void
}

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

export const UpdateSummarySidebar: React.FC<UpdateSummarySidebarProps> = ({ updatePackage, onClose }) => {
  const [activeTab, setActiveTab] = useState("summary")

  // Calculate statistics
  const statistics = useMemo(() => {
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

    // Calculate critical path impact
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

  // Render activity change item
  const renderActivityChange = (activity: UpdateActivity, index: number) => {
    const baselineDate = new Date(activity.baseline_start)
    const currentDate = new Date(activity.current_start)
    const delayDays = Math.ceil((currentDate.getTime() - baselineDate.getTime()) / (1000 * 60 * 60 * 24))

    return (
      <div key={activity.activity_id} className="space-y-2 p-3 border rounded-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {activity.type === "Milestone" ? (
                <Diamond className="h-4 w-4 text-orange-500" />
              ) : (
                <Target className="h-4 w-4 text-blue-500" />
              )}
              <span className="font-medium text-sm">{activity.activity_id}</span>
              {activity.is_critical && (
                <Badge variant="destructive" className="text-xs">
                  Critical
                </Badge>
              )}
            </div>
            <div className="text-sm text-gray-600 mt-1">{activity.description}</div>
          </div>
          <div className="text-right">
            <Badge variant={activity.change_type === "delay" ? "destructive" : "default"} className="text-xs">
              {activity.change_type === "delay" ? `+${delayDays}d` : activity.change_type}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-gray-500">Baseline:</span>
            <div>{format(new Date(activity.baseline_start), "MM/dd/yyyy")}</div>
          </div>
          <div>
            <span className="text-gray-500">Current:</span>
            <div>{format(new Date(activity.current_start), "MM/dd/yyyy")}</div>
          </div>
        </div>

        {activity.delay_reason && (
          <div className="text-xs">
            <span className="text-gray-500">Reason:</span>
            <Badge
              variant="outline"
              className={cn("text-xs ml-2", delayReasons.find((r) => r.value === activity.delay_reason)?.color)}
            >
              {delayReasons.find((r) => r.value === activity.delay_reason)?.label}
            </Badge>
          </div>
        )}

        {activity.notes && (
          <div className="text-xs">
            <span className="text-gray-500">Notes:</span>
            <div className="mt-1 text-gray-700">{activity.notes}</div>
          </div>
        )}
      </div>
    )
  }

  // Render AI insight
  const renderAIInsight = (insight: AIInsight) => {
    const severityColors = {
      low: "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950",
      medium: "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950",
      high: "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950",
    }

    const severityIcons = {
      low: CheckCircle,
      medium: AlertTriangle,
      high: AlertTriangle,
    }

    const Icon = severityIcons[insight.severity]

    return (
      <div key={insight.id} className={cn("p-3 rounded-lg border", severityColors[insight.severity])}>
        <div className="flex items-start gap-2">
          <Icon className="h-4 w-4 mt-0.5 text-gray-600" />
          <div className="flex-1">
            <div className="font-medium text-sm">{insight.title}</div>
            <div className="text-sm text-gray-600 mt-1">{insight.description}</div>

            {insight.affected_activities.length > 0 && (
              <div className="mt-2">
                <div className="text-xs text-gray-500">Affected Activities:</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {insight.affected_activities.map((activityId) => (
                    <Badge key={activityId} variant="outline" className="text-xs">
                      {activityId}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {insight.suggested_actions.length > 0 && (
              <div className="mt-2">
                <div className="text-xs text-gray-500">Suggested Actions:</div>
                <ul className="mt-1 space-y-1">
                  {insight.suggested_actions.map((action, index) => (
                    <li key={index} className="text-xs text-gray-700 ml-2">
                      • {action}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-2 flex items-center gap-2">
              <div className="text-xs text-gray-500">Confidence:</div>
              <Progress value={insight.confidence * 100} className="w-16 h-2" />
              <div className="text-xs text-gray-500">{Math.round(insight.confidence * 100)}%</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Update Summary</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="changes">Changes</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="flex-1 m-4 mt-4">
          <ScrollArea className="h-full">
            <div className="space-y-6">
              {/* Health Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Health Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-bold">
                      <span className={getHealthScoreColor(updatePackage.health_score)}>
                        {updatePackage.health_score}
                      </span>
                      <span className="text-lg text-gray-500">/100</span>
                    </div>
                    <div className="flex-1">
                      <Progress value={updatePackage.health_score} className="h-2" />
                      <Badge variant={getHealthScoreBadgeVariant(updatePackage.health_score)} className="mt-2">
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
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{statistics.totalActivities}</div>
                      <div className="text-sm text-gray-500">Total Activities</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{statistics.delayedActivities}</div>
                      <div className="text-sm text-gray-500">Delayed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{statistics.criticalActivities}</div>
                      <div className="text-sm text-gray-500">Critical</div>
                    </div>
                    <div className="text-2xl font-bold text-green-600">{statistics.completedActivities}</div>
                    <div className="text-sm text-gray-500">Completed</div>
                  </div>

                  {statistics.averageDelay > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="text-center">
                        <div className="text-xl font-bold text-amber-600">
                          {Math.round(statistics.averageDelay)} days
                        </div>
                        <div className="text-sm text-gray-500">Average Delay</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Delay Reasons */}
              {Object.keys(statistics.delayReasonCounts).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Delay Reasons
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(statistics.delayReasonCounts).map(([reason, count]) => {
                        const reasonInfo = delayReasons.find((r) => r.value === reason)
                        return (
                          <div key={reason} className="flex items-center justify-between">
                            <Badge variant="outline" className={reasonInfo?.color}>
                              {reasonInfo?.label}
                            </Badge>
                            <span className="text-sm font-medium">{count}</span>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Critical Path Impact */}
              {statistics.criticalPathDelays > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Critical Path Impact:</strong> {statistics.criticalPathDelays} critical activities are
                    delayed. This may impact the project completion date.
                  </AlertDescription>
                </Alert>
              )}

              {/* Update Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Update Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        Created: {format(new Date(updatePackage.created_at), "MMM d, yyyy 'at' h:mm a")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">By: {updatePackage.created_by}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Package ID: {updatePackage.id}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="changes" className="flex-1 m-4 mt-4">
          <ScrollArea className="h-full">
            <div className="space-y-4">
              {updatePackage.activities.map((activity, index) => renderActivityChange(activity, index))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="insights" className="flex-1 m-4 mt-4">
          <ScrollArea className="h-full">
            <div className="space-y-4">
              {updatePackage.ai_insights.length > 0 ? (
                updatePackage.ai_insights.map(renderAIInsight)
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No AI insights available</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Action Bar */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" className="flex-1">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button className="flex-1">
            <Send className="h-4 w-4 mr-2" />
            Submit
          </Button>
        </div>
      </div>
    </div>
  )
}
