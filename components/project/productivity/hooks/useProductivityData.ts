/**
 * @fileoverview Productivity Data Hook
 * @module useProductivityData
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 */

import { useState, useCallback, useEffect } from "react"

export interface Message {
  id: string
  content: string
  sender: string
  timestamp: Date
  threadId: string
}

export interface MessageThread {
  id: string
  title: string
  participants: string[]
  messages: Message[]
  createdAt: Date
  lastActivity: Date
  priority?: "low" | "medium" | "high"
  linkedData?: any
}

export interface Task {
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
  linkedData?: any
  tags?: string[]
}

// Mock users for demo
export const mockUsers = {
  "current-user": { id: "current-user", name: "Current User", initials: "CU" },
  "john-doe": { id: "john-doe", name: "John Doe", initials: "JD" },
  "jane-smith": { id: "jane-smith", name: "Jane Smith", initials: "JS" },
  "mike-johnson": { id: "mike-johnson", name: "Mike Johnson", initials: "MJ" },
  "sarah-wilson": { id: "sarah-wilson", name: "Sarah Wilson", initials: "SW" },
}

// Initial demo data
const getInitialThreads = (): MessageThread[] => [
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
    priority: "high",
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
    priority: "medium",
  },
  {
    id: "thread-3",
    title: "Safety Protocol Review",
    participants: ["current-user", "sarah-wilson"],
    messages: [
      {
        id: "msg-4",
        content: "Please review the updated safety protocols for the new site area.",
        sender: "sarah-wilson",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        threadId: "thread-3",
      },
    ],
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    lastActivity: new Date(Date.now() - 5 * 60 * 60 * 1000),
    priority: "high",
  },
]

const getInitialTasks = (): Task[] => [
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
    tags: ["design", "urgent"],
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
    tags: ["safety"],
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
    tags: ["coordination"],
  },
  {
    id: "task-4",
    title: "Equipment inspection checklist",
    description: "Complete monthly equipment safety inspection",
    status: "todo",
    priority: "medium",
    assignedTo: "mike-johnson",
    createdBy: "sarah-wilson",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    tags: ["equipment", "safety"],
  },
]

export const useProductivityData = (projectId: string) => {
  const [threads, setThreads] = useState<MessageThread[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true)

      // Load from localStorage if available
      const storageKey = `productivity-data-${projectId}`
      const savedData = localStorage.getItem(storageKey)

      if (savedData) {
        try {
          const parsed = JSON.parse(savedData)
          setThreads(
            parsed.threads?.map((thread: any) => ({
              ...thread,
              messages: thread.messages.map((msg: any) => ({
                ...msg,
                timestamp: new Date(msg.timestamp),
              })),
              createdAt: new Date(thread.createdAt),
              lastActivity: new Date(thread.lastActivity),
            })) || getInitialThreads()
          )

          setTasks(
            parsed.tasks?.map((task: any) => ({
              ...task,
              createdAt: new Date(task.createdAt),
              dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
              completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
            })) || getInitialTasks()
          )
        } catch (error) {
          console.error("Failed to parse saved productivity data:", error)
          setThreads(getInitialThreads())
          setTasks(getInitialTasks())
        }
      } else {
        setThreads(getInitialThreads())
        setTasks(getInitialTasks())
      }

      setLoading(false)
    }

    initializeData()
  }, [projectId])

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (!loading && (threads.length > 0 || tasks.length > 0)) {
      const storageKey = `productivity-data-${projectId}`
      const dataToSave = {
        threads,
        tasks,
        lastUpdated: new Date().toISOString(),
      }
      localStorage.setItem(storageKey, JSON.stringify(dataToSave))
    }
  }, [threads, tasks, projectId, loading])

  // Add message to thread
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

  // Add new task
  const addTask = useCallback((taskData: Omit<Task, "id" | "createdAt" | "createdBy">) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      createdAt: new Date(),
      createdBy: "current-user",
      ...taskData,
    }
    setTasks((prev) => [...prev, newTask])
  }, [])

  // Update task status
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

  // Add new thread
  const addThread = useCallback((threadData: Omit<MessageThread, "id" | "createdAt" | "lastActivity" | "messages">) => {
    const newThread: MessageThread = {
      id: `thread-${Date.now()}`,
      createdAt: new Date(),
      lastActivity: new Date(),
      messages: [],
      ...threadData,
    }
    setThreads((prev) => [...prev, newThread])
    return newThread.id
  }, [])

  // Delete task
  const deleteTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }, [])

  // Update task
  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, ...updates } : task)))
  }, [])

  // Refresh data
  const refreshData = useCallback(() => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  return {
    threads,
    tasks,
    loading,
    addMessage,
    addTask,
    addThread,
    updateTaskStatus,
    updateTask,
    deleteTask,
    refreshData,
  }
}
