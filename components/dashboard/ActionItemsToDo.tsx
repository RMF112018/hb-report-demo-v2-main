"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CheckSquare,
  Square,
  Clock,
  AlertCircle,
  User,
  Calendar,
  ExternalLink,
  Settings,
  Plus,
  Flag,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ActionItemsToDoProps {
  userRole: "project-executive" | "project-manager"
  className?: string
}

export function ActionItemsToDo({ userRole, className }: ActionItemsToDoProps) {
  // Mock to-do data - this would be replaced with actual productivity tool integration
  const mockToDoData = useMemo(() => {
    const baseTasks = [
      {
        id: "task-1",
        title: "Review Q4 Financial Reports",
        description: "Complete quarterly financial review for all active projects",
        dueDate: "2024-12-31",
        priority: "high",
        completed: false,
        assignedBy: "CFO Office",
        projectName: "Portfolio Review",
        estimatedTime: "2 hours",
        category: "financial",
      },
      {
        id: "task-2",
        title: "Sign Change Order #CO-2024-15",
        description: "Approve change order for additional HVAC work",
        dueDate: "2024-12-28",
        priority: "high",
        completed: false,
        assignedBy: "Project Manager",
        projectName: "Palm Beach Luxury Estate",
        estimatedTime: "15 minutes",
        category: "approval",
      },
      {
        id: "task-3",
        title: "Update Project Schedule",
        description: "Adjust timeline for Q1 milestone deliverables",
        dueDate: "2024-12-30",
        priority: "medium",
        completed: false,
        assignedBy: "Scheduler",
        projectName: "Miami Commercial Tower",
        estimatedTime: "1 hour",
        category: "scheduling",
      },
      {
        id: "task-4",
        title: "Conduct Safety Audit",
        description: "Monthly safety inspection for all job sites",
        dueDate: "2024-12-29",
        priority: "high",
        completed: true,
        assignedBy: "Safety Manager",
        projectName: "Multiple Sites",
        estimatedTime: "3 hours",
        category: "safety",
      },
      {
        id: "task-5",
        title: "Review Subcontractor Proposals",
        description: "Evaluate electrical contractor bids",
        dueDate: "2025-01-02",
        priority: "medium",
        completed: false,
        assignedBy: "Procurement",
        projectName: "Orlando Retail Complex",
        estimatedTime: "45 minutes",
        category: "procurement",
      },
      {
        id: "task-6",
        title: "Prepare Monthly Board Report",
        description: "Compile project status for board presentation",
        dueDate: "2025-01-05",
        priority: "medium",
        completed: false,
        assignedBy: "Executive Team",
        projectName: "Executive Summary",
        estimatedTime: "1.5 hours",
        category: "reporting",
      },
    ]

    // Filter tasks based on user role
    if (userRole === "project-manager") {
      return baseTasks
        .filter((task) => ["approval", "scheduling", "safety", "procurement"].includes(task.category))
        .slice(0, 4)
    }

    return baseTasks
  }, [userRole])

  const stats = useMemo(() => {
    const total = mockToDoData.length
    const completed = mockToDoData.filter((t) => t.completed).length
    const pending = mockToDoData.filter((t) => !t.completed).length
    const overdue = mockToDoData.filter((t) => !t.completed && new Date(t.dueDate) < new Date()).length
    const highPriority = mockToDoData.filter((t) => !t.completed && t.priority === "high").length

    return { total, completed, pending, overdue, highPriority }
  }, [mockToDoData])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "financial":
        return <AlertCircle className="h-4 w-4 text-green-600" />
      case "approval":
        return <CheckSquare className="h-4 w-4 text-blue-600" />
      case "scheduling":
        return <Calendar className="h-4 w-4 text-purple-600" />
      case "safety":
        return <Flag className="h-4 w-4 text-red-600" />
      case "procurement":
        return <ExternalLink className="h-4 w-4 text-orange-600" />
      case "reporting":
        return <ExternalLink className="h-4 w-4 text-gray-600" />
      default:
        return <Square className="h-4 w-4 text-gray-600" />
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow"
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    }
  }

  const isOverdue = (dateString: string) => {
    return new Date(dateString) < new Date()
  }

  return (
    <Card className={cn("h-full border-l-4 border-l-[#0021A5]", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" style={{ color: "#0021A5" }} />
            To Do
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm border-[#FA4616]/20 text-[#FA4616]">
              {stats.pending} Pending
            </Badge>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-[#0021A5]/10">
              <Plus className="h-4 w-4" style={{ color: "#0021A5" }} />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="!p-0">
        {/* Statistics Banner */}
        <div className="px-4 py-3 bg-gradient-to-r from-[#0021A5]/5 to-transparent border-b border-[#0021A5]/10">
          <div className="grid grid-cols-4 gap-3 text-center">
            <div>
              <div className="text-xl font-semibold" style={{ color: "#0021A5" }}>
                {stats.total}
              </div>
              <div className="text-xs text-muted-foreground">Total Tasks</div>
            </div>
            <div>
              <div className="text-xl font-semibold" style={{ color: "#FA4616" }}>
                {stats.pending}
              </div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
            <div>
              <div className="text-xl font-semibold text-green-600">{stats.completed}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div>
              <div className="text-xl font-semibold text-red-600">{stats.overdue}</div>
              <div className="text-xs text-muted-foreground">Overdue</div>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="max-h-72 overflow-y-auto">
          {mockToDoData.length === 0 ? (
            <div className="px-4 py-6 text-center text-muted-foreground">
              <CheckSquare className="h-10 w-10 mx-auto mb-3 text-gray-400" />
              <p className="text-sm">No tasks assigned</p>
              <p className="text-xs mt-1">New tasks will appear here</p>
            </div>
          ) : (
            <div className="divide-y">
              {mockToDoData.map((task) => (
                <div
                  key={task.id}
                  className={cn(
                    "px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors cursor-pointer",
                    task.completed && "opacity-60"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 mt-1">
                        {task.completed ? (
                          <CheckSquare className="h-4 w-4 text-green-600" />
                        ) : (
                          <Square className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {getCategoryIcon(task.category)}
                          <span
                            className={cn(
                              "text-sm truncate",
                              task.completed ? "line-through text-muted-foreground" : "text-foreground font-medium"
                            )}
                          >
                            {task.title}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{task.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {task.assignedBy}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.estimatedTime}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{task.projectName}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant="outline" className={cn("text-xs", getPriorityColor(task.priority))}>
                        {task.priority}
                      </Badge>
                      <div
                        className={cn(
                          "text-xs",
                          isOverdue(task.dueDate) && !task.completed
                            ? "text-red-600 font-semibold"
                            : "text-muted-foreground"
                        )}
                      >
                        {formatDate(task.dueDate)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t bg-gray-50 dark:bg-gray-800/30">
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">Productivity Tool Integration</div>
            <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
              <ExternalLink className="h-3 w-3 mr-1.5" />
              View All
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
