import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, AlertTriangle, Users, Clock, TrendingUp, Target } from "lucide-react"

import type { ResponsibilityTask } from "@/types/responsibility"

interface ResponsibilityInsight {
  id: string
  type: "workload_imbalance" | "bottleneck" | "resource_conflict" | "efficiency_opportunity"
  priority: "high" | "medium" | "low"
  confidence: number
  title: string
  description: string
  impact: string
  recommendation: string
  actionRequired: boolean
}

interface HbiResponsibilityInsightsProps {
  tasks: ResponsibilityTask[]
  roles: Array<{ key: string; name: string; color: string; description: string; enabled: boolean; category: string }>
  maxInsights?: number
  onInsightAction?: (insight: ResponsibilityInsight) => void
}

export function HbiResponsibilityInsights({
  tasks,
  roles,
  maxInsights = 6,
  onInsightAction,
}: HbiResponsibilityInsightsProps) {
  // Generate AI insights based on task data
  const generateInsights = (): ResponsibilityInsight[] => {
    const insights: ResponsibilityInsight[] = []

    // Workload imbalance detection
    const roleWorkloads = roles.map((role) => ({
      role: role.name,
      assigned: tasks.filter((task) => task.responsible === role.key).length,
      completed: tasks.filter((task) => task.responsible === role.key && task.status === "completed").length,
    }))

    const maxWorkload = Math.max(...roleWorkloads.map((r) => r.assigned))
    const minWorkload = Math.min(...roleWorkloads.map((r) => r.assigned))

    if (maxWorkload - minWorkload > 3) {
      const overloadedRole = roleWorkloads.find((r) => r.assigned === maxWorkload)
      insights.push({
        id: "workload-1",
        type: "workload_imbalance",
        priority: "high",
        confidence: 85,
        title: "Workload Imbalance Detected",
        description: `${overloadedRole?.role} has significantly more tasks than other team members`,
        impact: "High - Risk of burnout and project delays",
        recommendation: "Redistribute tasks or add additional resources",
        actionRequired: true,
      })
    }

    // Bottleneck detection
    const pendingTasks = tasks.filter((task) => task.status === "pending")
    if (pendingTasks.length > tasks.length * 0.4) {
      insights.push({
        id: "bottleneck-1",
        type: "bottleneck",
        priority: "medium",
        confidence: 75,
        title: "Task Bottleneck Identified",
        description: `${pendingTasks.length} tasks are pending, indicating potential workflow issues`,
        impact: "Medium - Project timeline at risk",
        recommendation: "Review task dependencies and approval processes",
        actionRequired: true,
      })
    }

    // Resource conflict detection
    const criticalPending = tasks.filter((task) => task.type === "prime-contract" && task.status === "pending")
    if (criticalPending.length > 2) {
      insights.push({
        id: "conflict-1",
        type: "resource_conflict",
        priority: "high",
        confidence: 90,
        title: "Critical Task Backlog",
        description: `${criticalPending.length} prime contract tasks are pending`,
        impact: "High - Critical contract tasks delayed",
        recommendation: "Immediately address prime contract task assignments",
        actionRequired: true,
      })
    }

    // Efficiency opportunities
    const completionRate =
      tasks.length > 0 ? (tasks.filter((t) => t.status === "completed").length / tasks.length) * 100 : 0
    if (completionRate < 60) {
      insights.push({
        id: "efficiency-1",
        type: "efficiency_opportunity",
        priority: "medium",
        confidence: 70,
        title: "Low Completion Rate",
        description: `Only ${completionRate.toFixed(1)}% of tasks are completed`,
        impact: "Medium - Team productivity concerns",
        recommendation: "Review task complexity and resource allocation",
        actionRequired: false,
      })
    }

    return insights.slice(0, maxInsights)
  }

  const insights = generateInsights()

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "workload_imbalance":
        return <Users className="h-4 w-4" />
      case "bottleneck":
        return <Clock className="h-4 w-4" />
      case "resource_conflict":
        return <AlertTriangle className="h-4 w-4" />
      case "efficiency_opportunity":
        return <TrendingUp className="h-4 w-4" />
      default:
        return <Brain className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600"
    if (confidence >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const handleInsightAction = (insight: ResponsibilityInsight) => {
    if (onInsightAction) {
      onInsightAction(insight)
    }
  }

  return (
    <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-orange-600" />
          <span>HBI Responsibility Insights</span>
        </CardTitle>
        <CardDescription>AI-powered insights for optimizing responsibility matrix and team efficiency</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.length === 0 ? (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No insights detected. All systems are operating optimally.</p>
          </div>
        ) : (
          insights.map((insight) => (
            <div key={insight.id} className="bg-white rounded-lg p-4 border border-orange-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getInsightIcon(insight.type)}
                  <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                  <Badge className={getPriorityColor(insight.priority)}>{insight.priority}</Badge>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${getConfidenceColor(insight.confidence)}`}>
                    {insight.confidence}% confidence
                  </div>
                  <Progress value={insight.confidence} className="w-20 h-1 mt-1" />
                </div>
              </div>

              <p className="text-gray-700 mb-3">{insight.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-600">Impact:</span>
                  <span className="text-sm text-gray-700">{insight.impact}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-600">Recommendation:</span>
                  <span className="text-sm text-gray-700">{insight.recommendation}</span>
                </div>
              </div>

              {insight.actionRequired && (
                <Button variant="outline" size="sm" onClick={() => handleInsightAction(insight)} className="w-full">
                  Take Action
                </Button>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
