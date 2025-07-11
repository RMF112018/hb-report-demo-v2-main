"use client"

/**
 * @fileoverview Productivity Feed Component
 * @module ProductivityFeed
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 */

import React, { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Activity,
  MessageSquare,
  CheckSquare,
  Clock,
  Users,
  Search,
  Filter,
  TrendingUp,
  Calendar,
  AlertCircle,
  Check,
  ArrowRight,
  Reply,
  Edit,
  Trash2,
} from "lucide-react"
import { MessageThread, Task, Message, mockUsers } from "./hooks/useProductivityData"
import { cn } from "@/lib/utils"

interface ProductivityFeedProps {
  threads: MessageThread[]
  tasks: Task[]
  onSendMessage: (threadId: string, content: string) => void
  onUpdateTask: (taskId: string, status: Task["status"]) => void
  currentUser?: any
  className?: string
}

// Activity item types
type ActivityItem = {
  id: string
  type: "message" | "task" | "task_status_change" | "thread_created" | "task_created"
  timestamp: Date
  user: string
  content: string
  metadata?: any
  priority?: "low" | "medium" | "high"
  status?: string
  relatedId?: string
}

// Activity item component
const ActivityItemComponent: React.FC<{
  item: ActivityItem
  onUpdateTask?: (taskId: string, status: Task["status"]) => void
  onReplyMessage?: (threadId: string, content: string) => void
}> = ({ item, onUpdateTask, onReplyMessage }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [showReplyForm, setShowReplyForm] = useState(false)

  const user = mockUsers[item.user as keyof typeof mockUsers]

  const formatTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return "just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return timestamp.toLocaleDateString()
  }

  const getActivityIcon = () => {
    switch (item.type) {
      case "message":
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case "task":
      case "task_created":
        return <CheckSquare className="h-4 w-4 text-green-500" />
      case "task_status_change":
        return <ArrowRight className="h-4 w-4 text-orange-500" />
      case "thread_created":
        return <Users className="h-4 w-4 text-purple-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getActivityColor = () => {
    if (item.priority === "high") return "border-l-red-500"
    if (item.priority === "medium") return "border-l-yellow-500"
    if (item.priority === "low") return "border-l-green-500"
    return "border-l-gray-300"
  }

  const handleReply = () => {
    if (replyContent.trim() && onReplyMessage && item.relatedId) {
      onReplyMessage(item.relatedId, replyContent.trim())
      setReplyContent("")
      setShowReplyForm(false)
    }
  }

  const handleTaskStatusChange = (newStatus: Task["status"]) => {
    if (onUpdateTask && item.relatedId) {
      onUpdateTask(item.relatedId, newStatus)
    }
  }

  return (
    <Card className={cn("border-l-4 transition-all hover:shadow-sm", getActivityColor())}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarFallback className="text-xs">{user?.initials || "U"}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {getActivityIcon()}
              <span className="text-sm font-medium">{user?.name || "Unknown User"}</span>
              <span className="text-xs text-muted-foreground">{formatTime(item.timestamp)}</span>
              {item.priority && (
                <Badge variant={item.priority === "high" ? "destructive" : "secondary"} className="text-xs">
                  {item.priority}
                </Badge>
              )}
            </div>

            <div className="text-sm text-muted-foreground mb-2">{item.content}</div>

            {item.metadata && (
              <div className="space-y-2">
                {item.metadata.title && <div className="text-sm font-medium">{item.metadata.title}</div>}
                {item.metadata.description && (
                  <div className="text-sm text-muted-foreground">{item.metadata.description}</div>
                )}
                {item.metadata.dueDate && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Due: {new Date(item.metadata.dueDate).toLocaleDateString()}
                  </div>
                )}
                {item.metadata.assignee && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    Assigned to: {mockUsers[item.metadata.assignee as keyof typeof mockUsers]?.name || "Unknown"}
                  </div>
                )}
              </div>
            )}

            {/* Task status update controls */}
            {item.type === "task" && item.relatedId && (
              <div className="flex items-center gap-2 mt-2">
                <Select onValueChange={(value) => handleTaskStatusChange(value as Task["status"])}>
                  <SelectTrigger className="w-32 h-7">
                    <SelectValue placeholder="Update status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 mt-3">
              {item.type === "message" && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="h-7 text-xs"
                >
                  <Reply className="h-3 w-3 mr-1" />
                  Reply
                </Button>
              )}

              {item.metadata && Object.keys(item.metadata).length > 0 && (
                <Button size="sm" variant="ghost" onClick={() => setIsExpanded(!isExpanded)} className="h-7 text-xs">
                  {isExpanded ? "Less" : "More"}
                </Button>
              )}

              <span className="text-xs text-muted-foreground">{item.type.replace(/_/g, " ")}</span>
            </div>

            {/* Reply form */}
            {showReplyForm && (
              <div className="mt-3 space-y-2">
                <Input
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleReply()
                    }
                  }}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleReply} disabled={!replyContent.trim()}>
                    Send
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowReplyForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Expanded details */}
            {isExpanded && item.metadata && (
              <div className="mt-3 p-3 bg-muted rounded-lg">
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                  {JSON.stringify(item.metadata, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Main ProductivityFeed component
const ProductivityFeed: React.FC<ProductivityFeedProps> = ({
  threads,
  tasks,
  onSendMessage,
  onUpdateTask,
  currentUser,
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "messages" | "tasks">("all")
  const [filterPriority, setFilterPriority] = useState<"all" | "high" | "medium" | "low">("all")
  const [sortBy, setSortBy] = useState<"timestamp" | "priority" | "type">("timestamp")

  // Generate activity items from threads and tasks
  const activityItems = useMemo(() => {
    const items: ActivityItem[] = []

    // Add messages
    threads.forEach((thread) => {
      // Thread creation
      items.push({
        id: `thread-created-${thread.id}`,
        type: "thread_created",
        timestamp: thread.createdAt,
        user: thread.participants[0] || "unknown",
        content: `created thread "${thread.title}"`,
        priority: thread.priority,
        metadata: {
          title: thread.title,
          participants: thread.participants.length,
        },
        relatedId: thread.id,
      })

      // Messages in thread
      thread.messages.forEach((message) => {
        items.push({
          id: `message-${message.id}`,
          type: "message",
          timestamp: message.timestamp,
          user: message.sender,
          content: message.content,
          priority: thread.priority,
          metadata: {
            threadTitle: thread.title,
            messageId: message.id,
          },
          relatedId: thread.id,
        })
      })
    })

    // Add tasks
    tasks.forEach((task) => {
      // Task creation
      items.push({
        id: `task-created-${task.id}`,
        type: "task_created",
        timestamp: task.createdAt,
        user: task.createdBy,
        content: `created task "${task.title}"`,
        priority: task.priority,
        metadata: {
          title: task.title,
          description: task.description,
          assignee: task.assignedTo,
          dueDate: task.dueDate,
          status: task.status,
        },
        relatedId: task.id,
      })

      // Task completion
      if (task.completedAt) {
        items.push({
          id: `task-completed-${task.id}`,
          type: "task_status_change",
          timestamp: task.completedAt,
          user: task.assignedTo,
          content: `completed task "${task.title}"`,
          priority: task.priority,
          status: "completed",
          metadata: {
            title: task.title,
            previousStatus: "in-progress",
            newStatus: "completed",
          },
          relatedId: task.id,
        })
      }

      // Current task (if active)
      if (task.status === "todo" || task.status === "in-progress") {
        items.push({
          id: `task-active-${task.id}`,
          type: "task",
          timestamp: task.createdAt,
          user: task.assignedTo,
          content: `working on "${task.title}"`,
          priority: task.priority,
          status: task.status,
          metadata: {
            title: task.title,
            description: task.description,
            status: task.status,
            dueDate: task.dueDate,
          },
          relatedId: task.id,
        })
      }
    })

    return items
  }, [threads, tasks])

  // Filter and sort activity items
  const filteredAndSortedItems = useMemo(() => {
    let filtered = activityItems

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.metadata?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.metadata?.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter((item) => {
        if (filterType === "messages") {
          return item.type === "message" || item.type === "thread_created"
        }
        if (filterType === "tasks") {
          return item.type === "task" || item.type === "task_created" || item.type === "task_status_change"
        }
        return true
      })
    }

    // Filter by priority
    if (filterPriority !== "all") {
      filtered = filtered.filter((item) => item.priority === filterPriority)
    }

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "timestamp":
          return b.timestamp.getTime() - a.timestamp.getTime()
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return (
            (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) -
            (priorityOrder[a.priority as keyof typeof priorityOrder] || 0)
          )
        case "type":
          return a.type.localeCompare(b.type)
        default:
          return 0
      }
    })

    return filtered
  }, [activityItems, searchTerm, filterType, filterPriority, sortBy])

  // Statistics
  const stats = useMemo(() => {
    const totalItems = activityItems.length
    const messagesCount = activityItems.filter((item) => item.type === "message").length
    const tasksCount = activityItems.filter((item) => item.type.includes("task")).length
    const todayCount = activityItems.filter(
      (item) => item.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ).length

    return { totalItems, messagesCount, tasksCount, todayCount }
  }, [activityItems])

  return (
    <div className={cn("h-full flex flex-col", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          <h2 className="font-semibold">Activity Feed</h2>
          <Badge variant="secondary">{stats.totalItems} items</Badge>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-500" />
          <span className="text-sm text-muted-foreground">{stats.todayCount} today</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 p-4 border-b">
        <div className="text-center">
          <div className="text-lg font-bold">{stats.totalItems}</div>
          <div className="text-xs text-muted-foreground">Total Items</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">{stats.messagesCount}</div>
          <div className="text-xs text-muted-foreground">Messages</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">{stats.tasksCount}</div>
          <div className="text-xs text-muted-foreground">Tasks</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-purple-600">{stats.todayCount}</div>
          <div className="text-xs text-muted-foreground">Today</div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search activity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Select value={filterType} onValueChange={(value) => setFilterType(value as typeof filterType)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="messages">Messages</SelectItem>
              <SelectItem value="tasks">Tasks</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterPriority} onValueChange={(value) => setFilterPriority(value as typeof filterPriority)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="timestamp">Time</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="type">Type</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Activity Feed */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredAndSortedItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No activity found matching your criteria.</p>
            </div>
          ) : (
            filteredAndSortedItems.map((item) => (
              <ActivityItemComponent
                key={item.id}
                item={item}
                onUpdateTask={onUpdateTask}
                onReplyMessage={onSendMessage}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

export default ProductivityFeed
