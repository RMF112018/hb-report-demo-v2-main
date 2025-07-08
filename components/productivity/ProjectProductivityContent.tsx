"use client"

import React, { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { EnhancedMessageComposer } from "@/components/productivity/EnhancedMessageComposer"
import { EnhancedTaskComposer } from "@/components/productivity/EnhancedTaskComposer"
import {
  MessageSquare,
  CheckSquare,
  Plus,
  Search,
  Send,
  Users,
  Clock,
  AlertCircle,
  Filter,
  MoreHorizontal,
  Link,
  Tag,
  Bell,
} from "lucide-react"

interface ProjectProductivityContentProps {
  projectId: string
  projectData: any
  userRole: string
  user: any
  className?: string
}

interface Message {
  id: string
  content: string
  sender: string
  timestamp: Date
  threadId: string
}

interface MessageThread {
  id: string
  title: string
  participants: string[]
  messages: Message[]
  createdAt: Date
  lastActivity: Date
}

interface Task {
  id: string
  title: string
  description?: string
  status: "todo" | "in-progress" | "completed" | "blocked"
  priority: "low" | "medium" | "high"
  assignedTo: string
  createdBy: string
  createdAt: Date
  dueDate?: Date
  completedAt?: Date
}

// Mock users for demo
const mockUsers = {
  "current-user": { id: "current-user", name: "Current User", initials: "CU" },
  "john-doe": { id: "john-doe", name: "John Doe", initials: "JD" },
  "jane-smith": { id: "jane-smith", name: "Jane Smith", initials: "JS" },
  "mike-johnson": { id: "mike-johnson", name: "Mike Johnson", initials: "MJ" },
  "sarah-wilson": { id: "sarah-wilson", name: "Sarah Wilson", initials: "SW" },
}

// Demo data with memoization
const useProductivityData = (projectId: string) => {
  const [threads, setThreads] = useState<MessageThread[]>(() => [
    {
      id: "thread-1",
      title: "Schedule Review Meeting",
      participants: ["current-user", "john-doe", "jane-smith"],
      messages: [
        {
          id: "msg-1",
          content: "We need to review the updated project schedule for next week.",
          sender: "john-doe",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          threadId: "thread-1",
        },
        {
          id: "msg-2",
          content: "I can join at 2 PM tomorrow. Does that work for everyone?",
          sender: "current-user",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          threadId: "thread-1",
        },
      ],
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
    {
      id: "thread-2",
      title: "Material Delivery Update",
      participants: ["current-user", "mike-johnson"],
      messages: [
        {
          id: "msg-3",
          content: "Steel delivery has been postponed by 2 days due to weather conditions.",
          sender: "mike-johnson",
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          threadId: "thread-2",
        },
      ],
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      lastActivity: new Date(Date.now() - 3 * 60 * 60 * 1000),
    },
  ])

  const [tasks, setTasks] = useState<Task[]>(() => [
    {
      id: "task-1",
      title: "Review updated drawings",
      description: "Check the latest architectural drawings for any conflicts",
      status: "todo",
      priority: "high",
      assignedTo: "jane-smith",
      createdBy: "current-user",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    {
      id: "task-2",
      title: "Update safety protocols",
      description: "Revise safety procedures based on recent site assessment",
      status: "in-progress",
      priority: "medium",
      assignedTo: "john-doe",
      createdBy: "current-user",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: "task-3",
      title: "Coordinate with subcontractors",
      status: "completed",
      priority: "low",
      assignedTo: "sarah-wilson",
      createdBy: "mike-johnson",
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    },
  ])

  const addMessage = useCallback((threadId: string, content: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content,
      sender: "current-user",
      timestamp: new Date(),
      threadId,
    }

    setThreads((prev) =>
      prev.map((thread) =>
        thread.id === threadId
          ? {
              ...thread,
              messages: [...thread.messages, newMessage],
              lastActivity: new Date(),
            }
          : thread
      )
    )
  }, [])

  const addTask = useCallback((taskData: Omit<Task, "id" | "createdAt" | "createdBy">) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      createdAt: new Date(),
      createdBy: "current-user",
      ...taskData,
    }
    setTasks((prev) => [...prev, newTask])
  }, [])

  const updateTaskStatus = useCallback((taskId: string, status: Task["status"]) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status,
              completedAt: status === "completed" ? new Date() : undefined,
            }
          : task
      )
    )
  }, [])

  return {
    threads,
    tasks,
    addMessage,
    addTask,
    updateTaskStatus,
  }
}

const MessageBoard: React.FC<{
  threads: MessageThread[]
  onSendMessage: (threadId: string, content: string) => void
  className?: string
}> = ({ threads, onSendMessage, className = "" }) => {
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [newMessage, setNewMessage] = useState("")

  const filteredThreads = useMemo(() => {
    return threads.filter(
      (thread) =>
        thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.messages.some((msg) => msg.content.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [threads, searchQuery])

  const handleSendMessage = () => {
    if (selectedThread && newMessage.trim()) {
      onSendMessage(selectedThread.id, newMessage.trim())
      setNewMessage("")
    }
  }

  return (
    <div className={`grid grid-cols-12 gap-4 h-full ${className}`}>
      {/* Thread List */}
      <div className="col-span-5">
        <Card className="h-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Message Threads</CardTitle>
              <Badge variant="secondary" className="text-xs">
                {filteredThreads.length}
              </Badge>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search threads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-8"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              <div className="space-y-1 p-3">
                {filteredThreads.map((thread) => (
                  <div
                    key={thread.id}
                    onClick={() => setSelectedThread(thread)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedThread?.id === thread.id
                        ? "bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-sm font-medium line-clamp-1">{thread.title}</h4>
                      <span className="text-xs text-muted-foreground">{thread.messages.length}</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      <div className="flex -space-x-1">
                        {thread.participants.slice(0, 3).map((userId) => (
                          <Avatar key={userId} className="w-4 h-4 border border-background">
                            <AvatarFallback className="text-[8px]">
                              {mockUsers[userId as keyof typeof mockUsers]?.initials || "U"}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {thread.messages.length > 0
                        ? thread.messages[thread.messages.length - 1].content
                        : "No messages yet"}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Thread Detail */}
      <div className="col-span-7">
        <Card className="h-full">
          {selectedThread ? (
            <>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">{selectedThread.title}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Users className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {selectedThread.participants.length} participants
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col h-[350px]">
                <ScrollArea className="flex-1 mb-4">
                  <div className="space-y-3">
                    {selectedThread.messages.map((message) => (
                      <div key={message.id} className="flex items-start space-x-3">
                        <Avatar className="w-7 h-7">
                          <AvatarFallback className="text-xs">
                            {mockUsers[message.sender as keyof typeof mockUsers]?.initials || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-xs font-medium">
                              {mockUsers[message.sender as keyof typeof mockUsers]?.name || "Unknown"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="flex items-end space-x-2">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 min-h-[60px] text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()} size="sm">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Select a thread to view messages</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}

const TaskBoard: React.FC<{
  tasks: Task[]
  onAddTask: (task: Omit<Task, "id" | "createdAt" | "createdBy">) => void
  onUpdateTask: (taskId: string, status: Task["status"]) => void
  className?: string
}> = ({ tasks, onAddTask, onUpdateTask, className = "" }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as Task["priority"],
    assignedTo: "current-user",
    dueDate: "",
  })

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || task.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [tasks, searchQuery, statusFilter])

  const tasksByStatus = useMemo(() => {
    return {
      todo: filteredTasks.filter((task) => task.status === "todo"),
      "in-progress": filteredTasks.filter((task) => task.status === "in-progress"),
      completed: filteredTasks.filter((task) => task.status === "completed"),
      blocked: filteredTasks.filter((task) => task.status === "blocked"),
    }
  }, [filteredTasks])

  const handleCreateTask = () => {
    if (newTask.title.trim()) {
      onAddTask({
        ...newTask,
        status: "todo",
        dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
      })
      setNewTask({
        title: "",
        description: "",
        priority: "medium",
        assignedTo: "current-user",
        dueDate: "",
      })
      setShowCreateTask(false)
    }
  }

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 dark:bg-red-900/20"
      case "medium":
        return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20"
      case "low":
        return "text-green-600 bg-green-50 dark:bg-green-900/20"
      default:
        return "text-gray-600 bg-gray-50 dark:bg-gray-900/20"
    }
  }

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "todo":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "blocked":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Task Management</h3>
          <p className="text-xs text-muted-foreground">{filteredTasks.length} tasks</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-8 w-48"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setShowCreateTask(!showCreateTask)} size="sm" className="h-8">
            <Plus className="w-4 h-4 mr-1" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Create Task Form */}
      {showCreateTask && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Create New Task</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Input
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="h-8"
                />
              </div>
              <div>
                <Input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="h-8"
                />
              </div>
            </div>
            <Textarea
              placeholder="Task description (optional)"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="h-16"
            />
            <div className="flex items-center gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowCreateTask(false)} size="sm">
                Cancel
              </Button>
              <Button onClick={handleCreateTask} size="sm" disabled={!newTask.title.trim()}>
                Create Task
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Task Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
          <Card key={status} className="h-fit">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm capitalize">{status.replace("-", " ")}</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {statusTasks.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {statusTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium line-clamp-2">{task.title}</h4>
                    <Select
                      value={task.status}
                      onValueChange={(value) => onUpdateTask(task.id, value as Task["status"])}
                    >
                      <SelectTrigger className="w-auto h-6 text-xs border-none shadow-none">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                          {task.status === "in-progress"
                            ? "In Progress"
                            : task.status === "todo"
                            ? "To Do"
                            : task.status}
                        </span>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {task.description && (
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{task.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-5 h-5">
                        <AvatarFallback className="text-xs">
                          {mockUsers[task.assignedTo as keyof typeof mockUsers]?.initials || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    {task.dueDate && (
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{task.dueDate.toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export const ProjectProductivityContent: React.FC<ProjectProductivityContentProps> = ({
  projectId,
  projectData,
  userRole,
  user,
  className = "",
}) => {
  const { threads, tasks, addMessage, addTask, updateTaskStatus } = useProductivityData(projectId)
  const [showEnhancedMessageComposer, setShowEnhancedMessageComposer] = useState(false)
  const [showEnhancedTaskComposer, setShowEnhancedTaskComposer] = useState(false)

  const stats = useMemo(
    () => ({
      totalThreads: threads.length,
      totalMessages: threads.reduce((acc, thread) => acc + thread.messages.length, 0),
      totalTasks: tasks.length,
      completedTasks: tasks.filter((task) => task.status === "completed").length,
      activeTasks: tasks.filter((task) => task.status === "todo" || task.status === "in-progress").length,
      overdueTasksCount: tasks.filter(
        (task) => task.dueDate && task.dueDate < new Date() && task.status !== "completed"
      ).length,
    }),
    [threads, tasks]
  )

  const handleCreateEnhancedMessage = useCallback(
    (messageData: any) => {
      // Create a new thread with the enhanced message data
      const newThread = {
        id: `thread-${Date.now()}`,
        title: messageData.title,
        participants: [user?.id || "current-user", ...messageData.participants],
        messages: messageData.content
          ? [
              {
                id: `msg-${Date.now()}`,
                content: messageData.content,
                sender: user?.id || "current-user",
                timestamp: new Date(),
                threadId: `thread-${Date.now()}`,
              },
            ]
          : [],
        createdAt: new Date(),
        lastActivity: new Date(),
        linkedData: messageData.linkedData,
        priority: messageData.priority,
        isUrgent: messageData.isUrgent,
      }

      // Add the new thread to the threads state
      // Note: This would need to be handled by the useProductivityData hook
      // For now, we'll just add a message to an existing thread or create a simple version
      if (messageData.content) {
        addMessage(threads[0]?.id || "thread-1", `[${messageData.title}] ${messageData.content}`)
      }
    },
    [addMessage, threads, user]
  )

  const handleCreateEnhancedTask = useCallback(
    (taskData: any) => {
      const newTask = {
        title: taskData.title,
        description: taskData.description,
        status: "todo" as const,
        priority: taskData.priority,
        assignedTo: taskData.assignedTo,
        dueDate: taskData.dueDate,
        linkedData: taskData.linkedData,
        reminders: taskData.reminders,
        tags: taskData.tags,
        isBlocking: taskData.isBlocking,
      }

      addTask(newTask)
    },
    [addTask]
  )

  return (
    <div className={`space-y-4 w-full max-w-full ${className}`}>
      {/* Enhanced Action Bar */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border">
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="font-medium text-gray-900 dark:text-gray-100">Quick Actions</span>
            <p className="text-xs text-muted-foreground">Create messages and tasks with advanced features</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowEnhancedMessageComposer(true)}
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">New Message</span>
          </Button>
          <Button onClick={() => setShowEnhancedTaskComposer(true)} size="sm" className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4" />
            <span className="hidden sm:inline">New Task</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="messages" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Messages
            <Badge variant="secondary" className="text-xs">
              {stats.totalThreads}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4" />
            Tasks
            <Badge variant="secondary" className="text-xs">
              {stats.activeTasks}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="w-full max-w-full overflow-hidden">
          <MessageBoard threads={threads} onSendMessage={addMessage} className="h-[500px]" />
        </TabsContent>

        <TabsContent value="tasks" className="w-full max-w-full overflow-hidden">
          <TaskBoard tasks={tasks} onAddTask={addTask} onUpdateTask={updateTaskStatus} className="min-h-[500px]" />
        </TabsContent>
      </Tabs>

      {/* Enhanced Composers */}
      <EnhancedMessageComposer
        isOpen={showEnhancedMessageComposer}
        onClose={() => setShowEnhancedMessageComposer(false)}
        onCreateMessage={handleCreateEnhancedMessage}
        projectId={projectId}
        currentUser={user}
      />

      <EnhancedTaskComposer
        isOpen={showEnhancedTaskComposer}
        onClose={() => setShowEnhancedTaskComposer(false)}
        onCreateTask={handleCreateEnhancedTask}
        projectId={projectId}
        currentUser={user}
      />
    </div>
  )
}
