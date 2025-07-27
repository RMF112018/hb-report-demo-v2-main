"use client"

/**
 * @fileoverview Task Panel Component
 * @module TaskPanel
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 */

import React, { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  CheckSquare,
  Clock,
  AlertCircle,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  User,
  Tag,
  Settings,
  Check,
  X,
  Edit,
  Trash2,
} from "lucide-react"
import { Task, mockUsers } from "./hooks/useProductivityData"
import { cn } from "@/lib/utils"

interface TaskPanelProps {
  tasks: Task[]
  onAddTask: (task: Omit<Task, "id" | "createdAt" | "createdBy">) => void
  onUpdateTask: (taskId: string, status: Task["status"]) => void
  currentUser?: any
  className?: string
}

// Task creation form
const TaskCreationForm: React.FC<{
  onSubmit: (taskData: Omit<Task, "id" | "createdAt" | "createdBy">) => void
  onCancel: () => void
}> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as Task["priority"],
    assignedTo: "current-user",
    dueDate: "",
    tags: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    onSubmit({
      title: formData.title,
      description: formData.description || undefined,
      status: "todo",
      priority: formData.priority,
      assignedTo: formData.assignedTo,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New Task
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter task title..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter task description..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value as Task["priority"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Assigned To</Label>
              <Select
                value={formData.assignedTo}
                onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(mockUsers).map(([id, user]) => (
                    <SelectItem key={id} value={id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g., design, urgent, safety"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button type="submit" className="flex-1">
              Create Task
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

// Task item component
const TaskItem: React.FC<{
  task: Task
  onUpdateStatus: (taskId: string, status: Task["status"]) => void
}> = ({ task, onUpdateStatus }) => {
  const [isEditing, setIsEditing] = useState(false)

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "blocked":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const isOverdue = task.dueDate && task.dueDate < new Date() && task.status !== "completed"

  return (
    <Card className={cn("relative transition-all hover:shadow-sm", isOverdue && "border-red-300 dark:border-red-700")}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <Checkbox
              checked={task.status === "completed"}
              onCheckedChange={(checked) => {
                onUpdateStatus(task.id, checked ? "completed" : "todo")
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3
                  className={cn(
                    "font-medium text-sm",
                    task.status === "completed" && "line-through text-muted-foreground"
                  )}
                >
                  {task.title}
                </h3>
                {isOverdue && (
                  <Badge variant="destructive" className="text-xs">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Overdue
                  </Badge>
                )}
              </div>

              {task.description && (
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{task.description}</p>
              )}

              <div className="flex items-center gap-2 mb-2">
                <Select value={task.status} onValueChange={(value) => onUpdateStatus(task.id, value as Task["status"])}>
                  <SelectTrigger className="w-32 h-7">
                    <SelectValue>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                        {task.status === "in-progress" ? "In Progress" : task.status === "todo" ? "To Do" : task.status}
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>

                <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="w-5 h-5">
                    <AvatarFallback className="text-xs">
                      {mockUsers[task.assignedTo as keyof typeof mockUsers]?.initials || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    {mockUsers[task.assignedTo as keyof typeof mockUsers]?.name || "Unknown"}
                  </span>
                </div>

                {task.dueDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{task.dueDate.toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {task.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Main TaskPanel component
const TaskPanel: React.FC<TaskPanelProps> = ({ tasks, onAddTask, onUpdateTask, currentUser, className = "" }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<Task["status"] | "all">("all")
  const [priorityFilter, setPriorityFilter] = useState<Task["priority"] | "all">("all")
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [sortBy, setSortBy] = useState<"dueDate" | "priority" | "created" | "status">("dueDate")

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || task.status === statusFilter
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter
      const matchesAssignee = assigneeFilter === "all" || task.assignedTo === assigneeFilter

      return matchesSearch && matchesStatus && matchesPriority && matchesAssignee
    })

    // Sort tasks
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return a.dueDate.getTime() - b.dueDate.getTime()
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case "created":
          return b.createdAt.getTime() - a.createdAt.getTime()
        case "status":
          const statusOrder = { todo: 1, "in-progress": 2, blocked: 3, completed: 4 }
          return statusOrder[a.status] - statusOrder[b.status]
        default:
          return 0
      }
    })

    return filtered
  }, [tasks, searchTerm, statusFilter, priorityFilter, assigneeFilter, sortBy])

  const handleCreateTask = useCallback(
    (taskData: Omit<Task, "id" | "createdAt" | "createdBy">) => {
      onAddTask(taskData)
      setShowCreateForm(false)
    },
    [onAddTask]
  )

  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter((t) => t.status === "completed").length
    const inProgress = tasks.filter((t) => t.status === "in-progress").length
    const overdue = tasks.filter((t) => t.dueDate && t.dueDate < new Date() && t.status !== "completed").length

    return { total, completed, inProgress, overdue }
  }, [tasks])

  return (
    <div className={cn("h-full flex flex-col", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5" />
          <h2 className="font-semibold">Task Management</h2>
          <Badge variant="secondary">{stats.total} tasks</Badge>
        </div>
        <Button onClick={() => setShowCreateForm(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Task Creation Form */}
      {showCreateForm && (
        <div className="p-4 border-b">
          <TaskCreationForm onSubmit={handleCreateTask} onCancel={() => setShowCreateForm(false)} />
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 p-4 border-b">
        <div className="text-center">
          <div className="text-lg font-bold">{stats.total}</div>
          <div className="text-xs text-muted-foreground">Total</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">{stats.inProgress}</div>
          <div className="text-xs text-muted-foreground">In Progress</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">{stats.completed}</div>
          <div className="text-xs text-muted-foreground">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-red-600">{stats.overdue}</div>
          <div className="text-xs text-muted-foreground">Overdue</div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as Task["status"] | "all")}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={priorityFilter}
            onValueChange={(value) => setPriorityFilter(value as Task["priority"] | "all")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assignees</SelectItem>
              {Object.entries(mockUsers).map(([id, user]) => (
                <SelectItem key={id} value={id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="created">Created</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Task List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredAndSortedTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckSquare className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No tasks found matching your criteria.</p>
            </div>
          ) : (
            filteredAndSortedTasks.map((task) => <TaskItem key={task.id} task={task} onUpdateStatus={onUpdateTask} />)
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

export default TaskPanel
