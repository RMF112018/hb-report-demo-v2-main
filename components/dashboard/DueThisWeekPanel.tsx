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
  // Get current week end date (Friday) - Fixed calculation
  const getEndOfWeek = () => {
    const today = new Date()
    const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Calculate days until next Friday (or today if it's Friday)
    let daysUntilFriday: number
    if (dayOfWeek === 5) {
      // Friday
      daysUntilFriday = 0 // Today is Friday
    } else if (dayOfWeek === 6) {
      // Saturday
      daysUntilFriday = 6 // Next Friday
    } else if (dayOfWeek === 0) {
      // Sunday
      daysUntilFriday = 5 // This Friday
    } else {
      // Monday through Thursday
      daysUntilFriday = 5 - dayOfWeek // Days until Friday
    }

    const endOfWeek = new Date(today)
    endOfWeek.setDate(today.getDate() + daysUntilFriday)
    endOfWeek.setHours(23, 59, 59, 999) // End of Friday
    return endOfWeek
  }

  // Generate comprehensive mock due items based on user role
  const dueItems = useMemo(() => {
    try {
      const endOfWeek = getEndOfWeek()
      const today = new Date()
      const items: DueItem[] = []

      // Helper function to generate dates within the current week for demo purposes
      const generateDemoDate = (offsetHours: number) => {
        const date = new Date(today.getTime() + offsetHours * 60 * 60 * 1000)
        // Ensure the date is within this week window
        if (date > endOfWeek) {
          // If the date would be beyond this week, put it earlier in the week
          return new Date(today.getTime() + (offsetHours % 72) * 60 * 60 * 1000).toISOString()
        }
        return date.toISOString()
      }

      // Role-specific mock data
      const mockDataByRole = {
        "project-executive": {
          projects: [
            "Downtown Medical Center",
            "Riverside Office Tower",
            "Tech Campus Phase II",
            "Harbor View Apartments",
            "City Hall Renovation",
            "Industrial Park Expansion",
          ],
          items: [
            {
              title: "Board presentation for Q4 portfolio review",
              type: "responsibility" as const,
              dueDate: generateDemoDate(-24), // Yesterday (overdue)
              priority: "high" as const,
              project: "Downtown Medical Center",
              status: "overdue" as const,
              category: "PX",
            },
            {
              title: "Respond to owner's concerns about MEP coordination",
              type: "message" as const,
              dueDate: generateDemoDate(8), // Later today
              priority: "high" as const,
              project: "Tech Campus Phase II",
              status: "due-soon" as const,
              category: "PX",
            },
            {
              title: "Weekly executive dashboard review meeting",
              type: "task" as const,
              dueDate: generateDemoDate(30), // Tomorrow
              priority: "medium" as const,
              project: "Portfolio Overview",
              status: "pending" as const,
              category: "PX",
            },
            {
              title: "Sign-off on change orders exceeding $50K threshold",
              type: "responsibility" as const,
              dueDate: generateDemoDate(54), // Day after tomorrow
              priority: "high" as const,
              project: "Harbor View Apartments",
              status: "pending" as const,
              category: "PX",
            },
            {
              title: "Client relationship review with major stakeholders",
              type: "task" as const,
              dueDate: generateDemoDate(78), // Three days from now
              priority: "medium" as const,
              project: "City Hall Renovation",
              status: "pending" as const,
              category: "PX",
            },
            {
              title: "Risk assessment report for new project pursuits",
              type: "responsibility" as const,
              dueDate: generateDemoDate(102), // Four days from now
              priority: "medium" as const,
              project: "Industrial Park Expansion",
              status: "pending" as const,
              category: "PX",
            },
          ],
        },
        "project-manager": {
          projects: ["Downtown Medical Center", "Riverside Office Tower"],
          items: [
            {
              title: "Submit weekly progress report to owner",
              type: "responsibility" as const,
              dueDate: generateDemoDate(6), // Later today
              priority: "high" as const,
              project: "Downtown Medical Center",
              status: "due-soon" as const,
              category: "SPM",
            },
            {
              title: "Coordinate with MEP contractor on ceiling conflicts",
              type: "task" as const,
              dueDate: generateDemoDate(26), // Tomorrow morning
              priority: "high" as const,
              project: "Downtown Medical Center",
              status: "pending" as const,
              category: "SPM",
            },
            {
              title: "Review and approve concrete pour schedule",
              type: "responsibility" as const,
              dueDate: generateDemoDate(38), // Tomorrow afternoon
              priority: "high" as const,
              project: "Downtown Medical Center",
              status: "pending" as const,
              category: "SPM",
            },
            {
              title: "Respond to architect's RFI about facade details",
              type: "message" as const,
              dueDate: generateDemoDate(50), // Day after tomorrow
              priority: "medium" as const,
              project: "Downtown Medical Center",
              status: "pending" as const,
              category: "SPM",
            },
            {
              title: "Conduct weekly safety walkthrough with superintendent",
              type: "task" as const,
              dueDate: generateDemoDate(62), // Mid-week
              priority: "medium" as const,
              project: "Downtown Medical Center",
              status: "pending" as const,
              category: "SPM",
            },
            {
              title: "Update project schedule for elevator delays",
              type: "responsibility" as const,
              dueDate: generateDemoDate(74), // Later in week
              priority: "high" as const,
              project: "Downtown Medical Center",
              status: "pending" as const,
              category: "SPM",
            },
          ],
        },
      }

      // Get role-specific data with fallback
      const roleData = mockDataByRole[userRole] || mockDataByRole["project-manager"] // Fallback to project-manager data
      const taskCategory = userRole === "project-executive" ? "PX" : "SPM"

      // Add role-specific items (always show for demo purposes)
      if (roleData && roleData.items && Array.isArray(roleData.items)) {
        roleData.items.forEach((item, index) => {
          items.push({
            ...item,
            id: `${userRole}-${index}`,
          })
        })
      }

      // If no items were added (shouldn't happen with our demo dates), add at least one demo item
      if (items.length === 0) {
        items.push({
          id: `${userRole}-demo`,
          title: "Demo task - Review project status",
          type: "task" as const,
          dueDate: today.toISOString(),
          priority: "medium" as const,
          project: "Demo Project",
          status: "pending" as const,
          category: userRole === "project-executive" ? "PX" : "SPM",
        })
      }

      // Ensure we always have at least one item
      if (items.length === 0) {
        // Fallback item if everything else fails
        items.push({
          id: "fallback-demo",
          title: "Demo task - Review project status",
          type: "task" as const,
          dueDate: today.toISOString(),
          priority: "medium" as const,
          project: "Demo Project",
          status: "pending" as const,
          category: "SPM",
        })
      }

      // Sort by due date and status priority (overdue first, then due-soon, then pending)
      const sortedItems = items
        .sort((a, b) => {
          // First sort by status priority
          const statusOrder = { overdue: 0, "due-soon": 1, pending: 2 }
          const statusDiff = statusOrder[a.status] - statusOrder[b.status]
          if (statusDiff !== 0) return statusDiff

          // Then sort by due date
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        })
        .slice(0, 6) // Show up to 6 items

      return sortedItems
    } catch (error) {
      console.error("Error generating due items:", error)
      // Return an empty array or a default item to prevent crashing
      return [
        {
          id: "error-demo",
          title: "Error generating due items",
          type: "task" as const,
          dueDate: new Date().toISOString(),
          priority: "medium" as const,
          project: "Error Project",
          status: "pending" as const,
          category: "SPM",
        },
      ]
    }
  }, [userRole])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "responsibility":
        return <Target className="h-3 w-3" style={{ color: "#0021A5" }} />
      case "task":
        return <CheckCircle className="h-3 w-3 text-green-600" />
      case "message":
        return <Mail className="h-3 w-3" style={{ color: "#FA4616" }} />
      default:
        return <Clock className="h-3 w-3 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "overdue":
        return "text-red-600"
      case "due-soon":
        return "text-[#FA4616]"
      case "pending":
        return "text-[#0021A5]"
      default:
        return "text-gray-600"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-[#FA4616]/10 text-[#FA4616] border-[#FA4616]/20"
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
    <Card className={cn("border-l-4 border-l-[#FA4616]", className)}>
      <CardHeader className="pb-3 bg-gradient-to-r from-[#FA4616]/5 to-transparent">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" style={{ color: "#FA4616" }} />
            <div>
              <div className="text-sm font-semibold">Due This Week</div>
              <div className="text-xs text-muted-foreground">Until {getWeekEndDate()}</div>
            </div>
          </div>
          <Badge variant="outline" className="text-xs border-[#0021A5]/20 text-[#0021A5]">
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
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#0021A5]/10"
                  >
                    <ExternalLink className="h-3 w-3" style={{ color: "#0021A5" }} />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}

        {dueItems.length > 0 && (
          <div className="pt-2 border-t">
            <Button variant="ghost" size="sm" className="w-full text-xs hover:bg-[#0021A5]/10">
              <TrendingUp className="h-3 w-3 mr-2" style={{ color: "#0021A5" }} />
              <span style={{ color: "#0021A5" }}>View All Due Items</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
