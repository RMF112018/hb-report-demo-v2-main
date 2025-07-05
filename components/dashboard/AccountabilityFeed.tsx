"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  Calendar,
  FileText,
  ExternalLink,
  Target,
  Activity,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Import data
import projectsData from "@/data/mock/projects.json"
import responsibilityData from "@/data/mock/responsibility.json"

interface AccountabilityFeedProps {
  userRole: "project-executive" | "project-manager"
  className?: string
}

interface ResponsibilityItem {
  id: string
  taskCategory: string
  taskDescription: string
  projectId: number
  projectName: string
  status: "active" | "pending" | "completed"
  priority: "high" | "medium" | "low"
  dueDate?: string
  lastUpdated?: string
  cadence?: string
}

export function AccountabilityFeed({ userRole, className }: AccountabilityFeedProps) {
  // Filter projects based on user role
  const userProjects = useMemo(() => {
    const activeProjects = projectsData.filter((p) => p.active)
    if (userRole === "project-executive") {
      return activeProjects.slice(0, 6) // 6 projects for PX
    } else {
      return activeProjects.slice(0, 1) // 1 project for PM
    }
  }, [userRole])

  // Filter responsibilities based on user role
  const userResponsibilities = useMemo(() => {
    const roleFilter = userRole === "project-executive" ? "PX" : "SPM"

    const filteredData = responsibilityData.filter((item) => item["Task Category"] === roleFilter && item["Tasks/Role"])

    // Create responsibility items with project assignments
    const responsibilities: ResponsibilityItem[] = []

    userProjects.forEach((project) => {
      filteredData.forEach((item, index) => {
        if (item["Task Category"] && item["Tasks/Role"]) {
          responsibilities.push({
            id: `${project.project_id}-${index}`,
            taskCategory: item["Task Category"],
            taskDescription: item["Tasks/Role"],
            projectId: project.project_id,
            projectName: project.display_name || project.name,
            status: Math.random() > 0.7 ? "completed" : Math.random() > 0.5 ? "active" : "pending",
            priority: Math.random() > 0.6 ? "high" : Math.random() > 0.3 ? "medium" : "low",
            dueDate: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            lastUpdated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            cadence: Math.random() > 0.5 ? "Weekly" : Math.random() > 0.3 ? "Monthly" : "As Needed",
          })
        }
      })
    })

    return responsibilities
  }, [userRole, userProjects])

  // Group responsibilities by project
  const groupedResponsibilities = useMemo(() => {
    const groups: { [projectId: number]: ResponsibilityItem[] } = {}

    userResponsibilities.forEach((item) => {
      if (!groups[item.projectId]) {
        groups[item.projectId] = []
      }
      groups[item.projectId].push(item)
    })

    return groups
  }, [userResponsibilities])

  // Calculate statistics
  const stats = useMemo(() => {
    const total = userResponsibilities.length
    const completed = userResponsibilities.filter((r) => r.status === "completed").length
    const active = userResponsibilities.filter((r) => r.status === "active").length
    const pending = userResponsibilities.filter((r) => r.status === "pending").length
    const highPriority = userResponsibilities.filter((r) => r.priority === "high").length

    return { total, completed, active, pending, highPriority }
  }, [userResponsibilities])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "active":
        return <Activity className="h-4 w-4 text-blue-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-orange-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />
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
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const getCardTitle = () => {
    switch (userRole) {
      case "project-executive":
        return "Portfolio Responsibility Feed"
      case "project-manager":
        return "Project Responsibility Feed"
      default:
        return "Accountability Feed"
    }
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            {getCardTitle()}
          </div>
          <Badge variant="outline" className="text-sm">
            {stats.total} Total
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="!p-0">
        {/* Statistics Banner */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{stats.highPriority}</div>
              <div className="text-xs text-muted-foreground">High Priority</div>
            </div>
          </div>
        </div>

        {/* Grouped Responsibilities */}
        <div>
          {Object.entries(groupedResponsibilities).map(([projectId, items]) => {
            const project = userProjects.find((p) => p.project_id === parseInt(projectId))
            if (!project) return null

            return (
              <div key={projectId} className="border-b last:border-b-0">
                {/* Project Header */}
                <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/30 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-600 rounded-full" />
                      <div>
                        <h3 className="font-semibold text-sm">{project.display_name || project.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {project.city}, {project.state_code} • {project.project_stage_name}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {items.length} tasks
                    </Badge>
                  </div>
                </div>

                {/* Responsibilities List */}
                <div className="divide-y">
                  {items.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {getStatusIcon(item.status)}
                            <span className="text-sm font-medium text-foreground truncate">{item.taskDescription}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {item.taskCategory}
                            </div>
                            {item.cadence && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {item.cadence}
                              </div>
                            )}
                            {item.dueDate && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Due {formatDate(item.dueDate)}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={cn("text-xs", getPriorityColor(item.priority))}>
                            {item.priority}
                          </Badge>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {items.length > 5 && (
                    <div className="px-6 py-3 text-center border-t">
                      <Button variant="ghost" size="sm" className="text-xs">
                        View {items.length - 5} more tasks
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 dark:bg-gray-800/30">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {userRole === "project-executive" ? "6" : "1"} project
              {userRole === "project-executive" ? "s" : ""} • {stats.total} total responsibilities
            </div>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
