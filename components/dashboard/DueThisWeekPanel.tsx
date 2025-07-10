"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Clock,
  AlertTriangle,
  Users,
  CheckCircle,
  ExternalLink,
  Target,
  TrendingUp,
  Mail,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Import data
import projectsData from "@/data/mock/projects.json"
import responsibilityData from "@/data/mock/responsibility.json"

interface DueThisWeekPanelProps {
  userRole: "project-executive" | "project-manager"
  className?: string
}

interface DueItem {
  id: string
  title: string
  type: "responsibility" | "task" | "message"
  dueDate: string
  priority: "high" | "medium" | "low"
  project?: string
  status: "pending" | "overdue" | "due-soon"
  category: string
}

export function DueThisWeekPanel({ userRole, className }: DueThisWeekPanelProps) {
  // Get current week end date (Friday)
  const getEndOfWeek = () => {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const daysUntilFriday = dayOfWeek === 0 ? 5 : 5 - dayOfWeek // Sunday = 0, Friday = 5
    const endOfWeek = new Date(today)
    endOfWeek.setDate(today.getDate() + daysUntilFriday)
    return endOfWeek
  }

  // Generate mock due items based on user role and existing data
  const dueItems = useMemo(() => {
    const endOfWeek = getEndOfWeek()
    const items: DueItem[] = []

    // Filter projects based on user role
    const userProjects =
      userRole === "project-executive"
        ? projectsData.filter((p) => p.active).slice(0, 6)
        : projectsData.filter((p) => p.active).slice(0, 1)

    // Get responsibilities based on user role
    const taskCategory = userRole === "project-executive" ? "PX" : "SPM"
    const userResponsibilities = responsibilityData.filter((r) => r && r["Task Category"] === taskCategory)

    // Generate responsibilities due this week from actual data
    userResponsibilities.slice(0, 3).forEach((resp, respIndex) => {
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + (respIndex + 1)) // Due in 1-3 days

      if (dueDate <= endOfWeek) {
        items.push({
          id: `resp-${respIndex}`,
          title: resp["Tasks/Role"] || "Unknown Task",
          type: "responsibility",
          dueDate: dueDate.toISOString(),
          priority: respIndex === 0 ? "high" : respIndex === 1 ? "medium" : "low",
          project:
            userProjects[respIndex % userProjects.length]?.display_name ||
            userProjects[respIndex % userProjects.length]?.name,
          status:
            dueDate < new Date()
              ? "overdue"
              : dueDate.getTime() - new Date().getTime() < 24 * 60 * 60 * 1000
              ? "due-soon"
              : "pending",
          category: taskCategory,
        })
      }
    })

    // Add mock messages and tasks
    const mockItems: Omit<DueItem, "id">[] = [
      {
        title: "Respond to owner's RFI about electrical changes",
        type: "message",
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        priority: "high",
        project: userProjects[0]?.display_name || userProjects[0]?.name,
        status: "due-soon",
        category: taskCategory,
      },
      {
        title: "Weekly safety meeting minutes submission",
        type: "task",
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        priority: "medium",
        project: userProjects[0]?.display_name || userProjects[0]?.name,
        status: "pending",
        category: taskCategory,
      },
      {
        title: "Budget variance report review",
        type: "task",
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        priority: "medium",
        project: userProjects[1]?.display_name || userProjects[1]?.name || userProjects[0]?.display_name,
        status: "pending",
        category: taskCategory,
      },
    ]

    // Add mock items with unique IDs
    mockItems.forEach((item, index) => {
      const dueDate = new Date(item.dueDate)
      if (dueDate <= endOfWeek) {
        items.push({
          ...item,
          id: `mock-${index}`,
        })
      }
    })

    // Sort by due date (earliest first)
    return items.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).slice(0, 5)
  }, [userRole])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "responsibility":
        return <Target className="h-3 w-3 text-blue-600" />
      case "task":
        return <CheckCircle className="h-3 w-3 text-green-600" />
      case "message":
        return <Mail className="h-3 w-3 text-purple-600" />
      default:
        return <Clock className="h-3 w-3 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "overdue":
        return "text-red-600"
      case "due-soon":
        return "text-orange-600"
      case "pending":
        return "text-blue-600"
      default:
        return "text-gray-600"
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

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Tomorrow"
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`
    return `${diffDays} days`
  }

  const getWeekEndDate = () => {
    const endOfWeek = getEndOfWeek()
    return endOfWeek.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card className={cn("border-l-4 border-l-[rgb(250,70,22)]", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <div>
              <div className="text-sm font-semibold">Due This Week</div>
              <div className="text-xs text-muted-foreground">Until {getWeekEndDate()}</div>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {dueItems.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {dueItems.length === 0 ? (
          <div className="text-center py-6">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">All caught up!</p>
            <p className="text-xs text-muted-foreground">No items due this week</p>
          </div>
        ) : (
          dueItems.map((item) => (
            <div
              key={item.id}
              className="group flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <div className="flex-shrink-0 mt-0.5">{getTypeIcon(item.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-xs font-medium text-foreground leading-tight">{item.title}</p>
                  <Badge variant="outline" className={cn("text-xs flex-shrink-0", getPriorityColor(item.priority))}>
                    {item.priority}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <span className="truncate">{item.project}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className={cn("flex items-center gap-1 text-xs", getStatusColor(item.status))}>
                    <Clock className="h-3 w-3" />
                    {formatDueDate(item.dueDate)}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}

        {dueItems.length > 0 && (
          <div className="pt-2 border-t">
            <Button variant="ghost" size="sm" className="w-full text-xs">
              <TrendingUp className="h-3 w-3 mr-2" />
              View All Due Items
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
