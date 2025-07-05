"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Inbox, Mail, MailOpen, AlertCircle, Clock, User, ExternalLink, Settings, Bell } from "lucide-react"
import { cn } from "@/lib/utils"

interface ActionItemsInboxProps {
  userRole: "project-executive" | "project-manager"
  className?: string
}

export function ActionItemsInbox({ userRole, className }: ActionItemsInboxProps) {
  // Mock inbox data - this would be replaced with actual productivity tool integration
  const mockInboxData = useMemo(() => {
    const baseMessages = [
      {
        id: "msg-1",
        from: "Sarah Johnson",
        subject: "RFI Response Required - HVAC System",
        timestamp: "2 hours ago",
        priority: "high",
        unread: true,
        type: "rfi",
        projectName: "Palm Beach Luxury Estate",
      },
      {
        id: "msg-2",
        from: "Mike Chen",
        subject: "Change Order Approval Needed",
        timestamp: "4 hours ago",
        priority: "medium",
        unread: true,
        type: "change-order",
        projectName: "Miami Commercial Tower",
      },
      {
        id: "msg-3",
        from: "Jennifer Davis",
        subject: "Weekly Progress Report",
        timestamp: "1 day ago",
        priority: "low",
        unread: false,
        type: "report",
        projectName: "Orlando Retail Complex",
      },
      {
        id: "msg-4",
        from: "Robert Wilson",
        subject: "Budget Variance Alert",
        timestamp: "2 days ago",
        priority: "high",
        unread: true,
        type: "alert",
        projectName: "Naples Waterfront Condominium",
      },
      {
        id: "msg-5",
        from: "Lisa Rodriguez",
        subject: "Submittal Review Complete",
        timestamp: "3 days ago",
        priority: "medium",
        unread: false,
        type: "submittal",
        projectName: "Fort Lauderdale Hotel Resort",
      },
    ]

    // Filter messages based on user role
    if (userRole === "project-manager") {
      return baseMessages.slice(0, 3) // Fewer messages for PM
    }

    return baseMessages
  }, [userRole])

  const stats = useMemo(() => {
    const total = mockInboxData.length
    const unread = mockInboxData.filter((m) => m.unread).length
    const highPriority = mockInboxData.filter((m) => m.priority === "high").length

    return { total, unread, highPriority }
  }, [mockInboxData])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "rfi":
        return <AlertCircle className="h-4 w-4 text-orange-600" />
      case "change-order":
        return <ExternalLink className="h-4 w-4 text-blue-600" />
      case "report":
        return <Mail className="h-4 w-4 text-green-600" />
      case "alert":
        return <Bell className="h-4 w-4 text-red-600" />
      case "submittal":
        return <ExternalLink className="h-4 w-4 text-purple-600" />
      default:
        return <Mail className="h-4 w-4 text-gray-600" />
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

  return (
    <Card className={cn("h-full border-l-4 border-l-[rgb(0,33,165)]", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Inbox className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Inbox
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              {stats.unread} Unread
            </Badge>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="!p-0">
        {/* Statistics Banner */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total Messages</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{stats.unread}</div>
              <div className="text-xs text-muted-foreground">Unread</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{stats.highPriority}</div>
              <div className="text-xs text-muted-foreground">High Priority</div>
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="max-h-80 overflow-y-auto">
          {mockInboxData.length === 0 ? (
            <div className="px-6 py-8 text-center text-muted-foreground">
              <Inbox className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-sm">No messages in your inbox</p>
              <p className="text-xs mt-1">New messages will appear here</p>
            </div>
          ) : (
            <div className="divide-y">
              {mockInboxData.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors cursor-pointer",
                    message.unread && "bg-blue-50/30 dark:bg-blue-950/10"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 mt-1">
                        {message.unread ? (
                          <Mail className="h-4 w-4 text-blue-600" />
                        ) : (
                          <MailOpen className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {getTypeIcon(message.type)}
                          <span
                            className={cn(
                              "text-sm truncate",
                              message.unread ? "font-semibold text-foreground" : "text-muted-foreground"
                            )}
                          >
                            {message.subject}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          {message.from}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{message.projectName}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant="outline" className={cn("text-xs", getPriorityColor(message.priority))}>
                        {message.priority}
                      </Badge>
                      <div className="text-xs text-muted-foreground">{message.timestamp}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 dark:bg-gray-800/30">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Productivity Tool Integration</div>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
