"use client"

/**
 * @fileoverview Microsoft Planner Tasks Content Component
 * @module PlannerTasksContent
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-29
 *
 * Comprehensive Microsoft Planner tasks integration component:
 * - Microsoft Graph Planner API integration
 * - Task creation, assignment, and progress tracking
 * - Board views with buckets and assignments
 * - Real-time task management aligned with Microsoft Planner
 * - Task details with descriptions, checklists, and references
 */

import React, { useState, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  CheckSquare,
  Plus,
  Edit,
  Trash2,
  Clock,
  User,
  Flag,
  Calendar as CalendarIcon,
  Users,
  MoreHorizontal,
  Filter,
  SortDesc,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Circle,
  PlayCircle,
  Target,
  List,
  Kanban,
  Grid,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Import hooks and types
import { usePlannerTasks } from "@/hooks/useTeamsIntegration"
import { PlannerTask, TeamMember } from "@/lib/msgraph"

interface PlannerTasksContentProps {
  planId: string | null
  teamMembers: TeamMember[]
  currentUser: any
  className?: string
}

// Task priority colors and labels
const PRIORITY_CONFIG = {
  0: { label: "Low", color: "bg-gray-100 text-gray-700 border-gray-300" },
  1: { label: "Important", color: "bg-blue-100 text-blue-700 border-blue-300" },
  2: { label: "Medium", color: "bg-yellow-100 text-yellow-700 border-yellow-300" },
  3: { label: "High", color: "bg-orange-100 text-orange-700 border-orange-300" },
  4: { label: "Urgent", color: "bg-red-100 text-red-700 border-red-300" },
  5: { label: "Critical", color: "bg-red-200 text-red-800 border-red-400" },
} as const

// Task status configuration
const STATUS_CONFIG = {
  notStarted: { label: "Not Started", icon: Circle, color: "text-gray-500" },
  inProgress: { label: "In Progress", icon: PlayCircle, color: "text-blue-500" },
  completed: { label: "Completed", icon: CheckCircle, color: "text-green-500" },
  deferred: { label: "Deferred", icon: AlertCircle, color: "text-yellow-500" },
  waitingOnSomeoneElse: { label: "Waiting", icon: Clock, color: "text-purple-500" },
}

// Task creation form interface
interface TaskFormData {
  title: string
  description: string
  dueDate: Date | null
  priority: number
  assigneeIds: string[]
  bucketId?: string
}

// Task Card Component
const TaskCard: React.FC<{
  task: PlannerTask
  teamMembers: TeamMember[]
  onEdit: (task: PlannerTask) => void
  onDelete: (taskId: string) => void
  onProgressUpdate: (taskId: string, progress: number) => void
}> = ({ task, teamMembers, onEdit, onDelete, onProgressUpdate }) => {
  const [isProgressOpen, setIsProgressOpen] = useState(false)
  const [newProgress, setNewProgress] = useState(task.percentComplete)

  const priority = PRIORITY_CONFIG[task.priority as keyof typeof PRIORITY_CONFIG] || PRIORITY_CONFIG[0]
  const assignedMembers = teamMembers.filter((member) => task.assignments[member.userId])

  const handleProgressUpdate = () => {
    onProgressUpdate(task.id, newProgress)
    setIsProgressOpen(false)
  }

  const getStatusFromProgress = (progress: number) => {
    if (progress === 0) return STATUS_CONFIG.notStarted
    if (progress === 100) return STATUS_CONFIG.completed
    return STATUS_CONFIG.inProgress
  }

  const status = getStatusFromProgress(task.percentComplete)
  const StatusIcon = status.icon

  return (
    <Card className="group hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <StatusIcon className={cn("h-4 w-4", status.color)} />
              <h3 className="font-semibold text-sm line-clamp-2">{task.title}</h3>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={cn("text-xs", priority.color)}>
                <Flag className="h-3 w-3 mr-1" />
                {priority.label}
              </Badge>
              {task.dueDateTime && (
                <Badge variant="outline" className="text-xs">
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  {format(new Date(task.dueDateTime), "MMM d")}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="sm" onClick={() => onEdit(task)}>
              <Edit className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(task.id)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Progress</span>
            <Popover open={isProgressOpen} onOpenChange={setIsProgressOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                  {task.percentComplete}%
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Update Progress</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={newProgress}
                        onChange={(e) => setNewProgress(Number(e.target.value))}
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleProgressUpdate}>
                      Update
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setIsProgressOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <Progress value={task.percentComplete} className="h-2" />
        </div>

        {/* Assigned Members */}
        {assignedMembers.length > 0 && (
          <div className="flex items-center gap-2">
            <Users className="h-3 w-3 text-muted-foreground" />
            <div className="flex -space-x-2">
              {assignedMembers.slice(0, 3).map((member) => (
                <Avatar key={member.id} className="h-6 w-6 border-2 border-background">
                  <AvatarImage src={`https://graph.microsoft.com/v1.0/users/${member.userId}/photo/$value`} />
                  <AvatarFallback className="text-xs">
                    {member.displayName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              ))}
              {assignedMembers.length > 3 && (
                <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                  <span className="text-xs font-medium">+{assignedMembers.length - 3}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Task Description */}
        {task.hasDescription && (
          <div className="text-xs text-muted-foreground line-clamp-2">
            <p>Click to view task details...</p>
          </div>
        )}

        {/* Task Metadata */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Created {format(new Date(task.createdDateTime), "MMM d, yyyy")}</span>
          {task.checklistItemCount > 0 && (
            <span className="flex items-center gap-1">
              <CheckSquare className="h-3 w-3" />
              {task.activeChecklistItemCount}/{task.checklistItemCount}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Task Creation Form Component
const TaskCreationForm: React.FC<{
  isOpen: boolean
  onClose: () => void
  onSubmit: (taskData: TaskFormData) => void
  teamMembers: TeamMember[]
}> = ({ isOpen, onClose, onSubmit, teamMembers }) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    dueDate: null,
    priority: 1,
    assigneeIds: [],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.title.trim()) {
      onSubmit(formData)
      setFormData({
        title: "",
        description: "",
        dueDate: null,
        priority: 1,
        assigneeIds: [],
      })
      onClose()
    }
  }

  const handleAssigneeToggle = (memberId: string) => {
    setFormData((prev) => ({
      ...prev,
      assigneeIds: prev.assigneeIds.includes(memberId)
        ? prev.assigneeIds.filter((id) => id !== memberId)
        : [...prev.assigneeIds, memberId],
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Enter task title..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Enter task description..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dueDate ? format(formData.dueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dueDate || undefined}
                    onSelect={(date) => setFormData((prev) => ({ ...prev, dueDate: date || null }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={formData.priority.toString()}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: Number(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PRIORITY_CONFIG).map(([value, config]) => (
                    <SelectItem key={value} value={value}>
                      <div className="flex items-center gap-2">
                        <Flag className="h-3 w-3" />
                        {config.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Assign To</Label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={member.id}
                    checked={formData.assigneeIds.includes(member.userId)}
                    onChange={() => handleAssigneeToggle(member.userId)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor={member.id} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={`https://graph.microsoft.com/v1.0/users/${member.userId}/photo/$value`} />
                      <AvatarFallback className="text-xs">
                        {member.displayName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {member.displayName}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Main Component
const PlannerTasksContent: React.FC<PlannerTasksContentProps> = ({ planId, teamMembers, currentUser, className }) => {
  const { tasks, loading, error, creating, createTask, updateTaskProgress, refresh } = usePlannerTasks(planId)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "completed">("all")
  const [sortBy, setSortBy] = useState<"dueDate" | "priority" | "created">("dueDate")

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks

    // Apply status filter
    if (filterStatus === "active") {
      filtered = filtered.filter((task) => task.percentComplete < 100)
    } else if (filterStatus === "completed") {
      filtered = filtered.filter((task) => task.percentComplete === 100)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          if (!a.dueDateTime) return 1
          if (!b.dueDateTime) return -1
          return new Date(a.dueDateTime).getTime() - new Date(b.dueDateTime).getTime()
        case "priority":
          return b.priority - a.priority
        case "created":
          return new Date(b.createdDateTime).getTime() - new Date(a.createdDateTime).getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [tasks, filterStatus, sortBy])

  const handleCreateTask = useCallback(
    async (taskData: TaskFormData) => {
      if (!planId) return

      const success = await createTask(
        taskData.title,
        undefined, // bucketId
        taskData.assigneeIds,
        taskData.dueDate ? taskData.dueDate.toISOString() : undefined,
        taskData.priority
      )

      if (success) {
        // Refresh tasks after creation
        refresh?.()
      }
    },
    [planId, createTask, refresh]
  )

  const handleTaskEdit = useCallback((task: PlannerTask) => {
    // TODO: Implement task editing
    console.log("Edit task:", task)
  }, [])

  const handleTaskDelete = useCallback((taskId: string) => {
    // TODO: Implement task deletion
    console.log("Delete task:", taskId)
  }, [])

  const handleProgressUpdate = useCallback(
    async (taskId: string, progress: number) => {
      const success = await updateTaskProgress(taskId, progress, "current-etag")
      if (success) {
        refresh?.()
      }
    },
    [updateTaskProgress, refresh]
  )

  // Calculate statistics
  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter((task) => task.percentComplete === 100).length
    const inProgress = tasks.filter((task) => task.percentComplete > 0 && task.percentComplete < 100).length
    const notStarted = tasks.filter((task) => task.percentComplete === 0).length
    const overdue = tasks.filter(
      (task) => task.dueDateTime && new Date(task.dueDateTime) < new Date() && task.percentComplete < 100
    ).length

    return { total, completed, inProgress, notStarted, overdue }
  }, [tasks])

  if (!planId) {
    return (
      <div className={cn("flex items-center justify-center h-64", className)}>
        <div className="text-center space-y-2">
          <Target className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">No plan selected</p>
          <p className="text-sm text-muted-foreground">Select a team and plan to manage tasks</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn("p-4", className)}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with Stats */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Microsoft Planner Tasks</h3>
            <p className="text-sm text-muted-foreground">Manage project tasks with Microsoft Planner integration</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
              <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
              Refresh
            </Button>
            <Button onClick={() => setIsCreateModalOpen(true)} disabled={creating}>
              <Plus className="h-4 w-4 mr-2" />
              {creating ? "Creating..." : "New Task"}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total Tasks</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
              <div className="text-xs text-muted-foreground">In Progress</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">{stats.notStarted}</div>
              <div className="text-xs text-muted-foreground">Not Started</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
              <div className="text-xs text-muted-foreground">Overdue</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <SortDesc className="h-4 w-4 text-muted-foreground" />
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="created">Created</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "kanban" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("kanban")}
          >
            <Kanban className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tasks Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="text-muted-foreground">Loading tasks...</span>
          </div>
        </div>
      ) : filteredAndSortedTasks.length === 0 ? (
        <div className="text-center py-12">
          <CheckSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No tasks found</p>
          <p className="text-sm text-muted-foreground">Create your first task to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              teamMembers={teamMembers}
              onEdit={handleTaskEdit}
              onDelete={handleTaskDelete}
              onProgressUpdate={handleProgressUpdate}
            />
          ))}
        </div>
      )}

      {/* Task Creation Modal */}
      <TaskCreationForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTask}
        teamMembers={teamMembers}
      />
    </div>
  )
}

export default PlannerTasksContent
