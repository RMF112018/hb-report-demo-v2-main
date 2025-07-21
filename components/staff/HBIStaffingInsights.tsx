import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, AlertTriangle, Users, Clock, TrendingUp, UserPlus, Target, Zap } from "lucide-react"

export interface Project {
  id: string
  name: string
  status: string
  startDate: string
  endDate: string
  manager: string
}

export interface Employee {
  id: string
  name: string
  position: string
  department: string
  availability: number
  currentProject?: string | null
}

export interface StaffingInsight {
  id: string
  type: "staffing_need" | "schedule_overlap" | "employee_suggestion" | "resource_conflict"
  priority: "high" | "medium" | "low"
  confidence: number
  title: string
  description: string
  projectId?: string
  employeeId?: string
  suggestedEmployeeId?: string
  impact: string
  recommendation: string
  actionRequired: boolean
}

interface HBIStaffingInsightsProps {
  projects: Project[]
  employees: Employee[]
  maxInsights?: number
  onInsightAction?: (insight: StaffingInsight) => void
}

export function HBIStaffingInsights({
  projects,
  employees,
  maxInsights = 8,
  onInsightAction,
}: HBIStaffingInsightsProps) {
  // Mock insights generation - in real implementation, this would be AI-driven
  const generateInsights = (): StaffingInsight[] => {
    const insights: StaffingInsight[] = []

    // Staffing needs
    const understaffedProjects = projects.filter((p) => p.status === "active").slice(0, 2)
    understaffedProjects.forEach((project, index) => {
      insights.push({
        id: `staffing-${index}`,
        type: "staffing_need",
        priority: "high",
        confidence: 85 + Math.random() * 10,
        title: `Staffing Need Detected`,
        description: `${project.name} requires additional ${
          project.name.includes("Hospital") ? "nurses" : "engineers"
        }`,
        projectId: project.id,
        impact: "High - Project timeline at risk",
        recommendation: "Create SPCR for additional staff",
        actionRequired: true,
      })
    })

    // Schedule overlaps
    const overlappingEmployees = employees.filter((e) => e.currentProject).slice(0, 2)
    overlappingEmployees.forEach((employee, index) => {
      insights.push({
        id: `overlap-${index}`,
        type: "schedule_overlap",
        priority: "medium",
        confidence: 75 + Math.random() * 15,
        title: `Schedule Conflict Detected`,
        description: `${employee.name} has overlapping assignments`,
        employeeId: employee.id,
        impact: "Medium - Resource allocation conflict",
        recommendation: "Review and adjust assignments",
        actionRequired: true,
      })
    })

    // Employee suggestions
    const availableEmployees = employees.filter((e) => e.availability > 80).slice(0, 2)
    availableEmployees.forEach((employee, index) => {
      insights.push({
        id: `suggestion-${index}`,
        type: "employee_suggestion",
        priority: "medium",
        confidence: 70 + Math.random() * 20,
        title: `Employee Recommendation`,
        description: `${employee.name} is well-suited for upcoming role`,
        suggestedEmployeeId: employee.id,
        impact: "Medium - Optimization opportunity",
        recommendation: "Consider for upcoming position",
        actionRequired: false,
      })
    })

    // Resource conflicts
    insights.push({
      id: "resource-conflict-1",
      type: "resource_conflict",
      priority: "high",
      confidence: 90,
      title: `Resource Allocation Conflict`,
      description: "Multiple projects competing for same specialized resources",
      impact: "High - Project delays likely",
      recommendation: "Prioritize resource allocation",
      actionRequired: true,
    })

    return insights.slice(0, maxInsights)
  }

  const insights = generateInsights()

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "staffing_need":
        return <UserPlus className="h-4 w-4" />
      case "schedule_overlap":
        return <Clock className="h-4 w-4" />
      case "employee_suggestion":
        return <Users className="h-4 w-4" />
      case "resource_conflict":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Brain className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600"
    if (confidence >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const handleInsightAction = (insight: StaffingInsight) => {
    onInsightAction?.(insight)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">HBI Staffing Insights</h2>
            <p className="text-muted-foreground">AI-powered recommendations for workforce optimization</p>
          </div>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Zap className="h-3 w-3" />
          AI Powered
        </Badge>
      </div>

      {/* Insights Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {insights.map((insight) => (
          <Card key={insight.id} className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400/10 to-red-400/10 rounded-bl-full" />
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-orange-100 rounded-md">{getInsightIcon(insight.type)}</div>
                  <div>
                    <CardTitle className="text-base">{insight.title}</CardTitle>
                    <CardDescription className="text-sm">{insight.description}</CardDescription>
                  </div>
                </div>
                <Badge className={getPriorityColor(insight.priority)}>
                  {insight.priority.charAt(0).toUpperCase() + insight.priority.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Confidence Score */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">AI Confidence</span>
                  <span className={`font-medium ${getConfidenceColor(insight.confidence)}`}>
                    {Math.round(insight.confidence)}%
                  </span>
                </div>
                <Progress value={insight.confidence} className="h-2" />
              </div>

              {/* Impact and Recommendation */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Target className="h-3 w-3 text-muted-foreground" />
                  <span className="font-medium">Impact:</span>
                  <span className="text-muted-foreground">{insight.impact}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <TrendingUp className="h-3 w-3 text-muted-foreground mt-0.5" />
                  <span className="font-medium">Recommendation:</span>
                  <span className="text-muted-foreground">{insight.recommendation}</span>
                </div>
              </div>

              {/* Action Button */}
              {insight.actionRequired && (
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  onClick={() => handleInsightAction(insight)}
                >
                  Take Action
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {insights.filter((i) => i.priority === "high").length}
              </div>
              <div className="text-sm text-muted-foreground">High Priority</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {insights.filter((i) => i.priority === "medium").length}
              </div>
              <div className="text-sm text-muted-foreground">Medium Priority</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {insights.filter((i) => i.type === "staffing_need").length}
              </div>
              <div className="text-sm text-muted-foreground">Staffing Needs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(insights.reduce((acc, i) => acc + i.confidence, 0) / insights.length)}
              </div>
              <div className="text-sm text-muted-foreground">Avg Confidence</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
