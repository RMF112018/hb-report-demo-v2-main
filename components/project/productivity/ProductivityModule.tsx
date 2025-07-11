"use client"

/**
 * @fileoverview Productivity Module Component
 * @module ProductivityModule
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Main module component for productivity tools following v-3.0.mdc standards:
 * - Modular architecture with separated concerns
 * - Task and message management
 * - TypeScript type safety
 * - Error boundaries and loading states
 * - Real-time collaboration features
 * - Performance optimization
 */

import React, { useState, useMemo, useCallback, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EnhancedMessageComposer } from "@/components/productivity/EnhancedMessageComposer"
import { EnhancedTaskComposer } from "@/components/productivity/EnhancedTaskComposer"
import { MessageSquare, CheckSquare, Activity, TrendingUp, RefreshCw, Settings, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

// Import sub-components
import { TaskPanel } from "./TaskPanel"
import { MessageThread } from "./MessageThread"
import { ProductivityFeed } from "./ProductivityFeed"

// Import productivity data types and hooks
import { useProductivityData } from "./hooks/useProductivityData"

interface ProductivityModuleProps {
  projectId: string
  projectData?: any
  user?: any
  userRole?: string
  className?: string
  initialTab?: "messages" | "tasks" | "feed"
  onActivityChange?: (stats: any) => void
}

// Intersection Observer Hook for performance optimization
const useIntersectionObserver = (ref: React.RefObject<Element | null>, options: IntersectionObserverInit = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [ref, options])

  return isIntersecting
}

// Statistics Summary Component
const ProductivityStats: React.FC<{
  stats: {
    totalThreads: number
    totalMessages: number
    totalTasks: number
    completedTasks: number
    activeTasks: number
    overdueTasksCount: number
  }
}> = React.memo(({ stats }) => {
  const productivityRate = stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Activity className="h-4 w-4" />
          Productivity Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center space-y-1">
            <div className="text-lg font-bold text-foreground">{stats.totalThreads}</div>
            <div className="text-xs text-muted-foreground">Active Threads</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-lg font-bold text-blue-600">{stats.totalMessages}</div>
            <div className="text-xs text-muted-foreground">Messages</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-lg font-bold text-green-600">{stats.completedTasks}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-lg font-bold text-orange-600">{stats.activeTasks}</div>
            <div className="text-xs text-muted-foreground">Active Tasks</div>
          </div>
        </div>

        {stats.overdueTasksCount > 0 && (
          <div className="flex items-center justify-center p-2 bg-red-50 dark:bg-red-950/20 rounded-lg">
            <div className="text-sm text-red-700 dark:text-red-300">
              {stats.overdueTasksCount} overdue task{stats.overdueTasksCount !== 1 ? "s" : ""}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Completion Rate</span>
          <span className="text-muted-foreground">{productivityRate.toFixed(1)}%</span>
        </div>
      </CardContent>
    </Card>
  )
})

ProductivityStats.displayName = "ProductivityStats"

// Main ProductivityModule Component
const ProductivityModule: React.FC<ProductivityModuleProps> = React.memo(
  ({ projectId, projectData, user, userRole = "pm", className = "", initialTab = "feed", onActivityChange }) => {
    const [activeTab, setActiveTab] = useState(initialTab)
    const [isRendering, setIsRendering] = useState(true)
    const [showEnhancedMessageComposer, setShowEnhancedMessageComposer] = useState(false)
    const [showEnhancedTaskComposer, setShowEnhancedTaskComposer] = useState(false)

    const containerRef = useRef<HTMLDivElement>(null)
    const isVisible = useIntersectionObserver(containerRef, { threshold: 0.1 })

    // Use the productivity data hook
    const { threads, tasks, addMessage, addTask, updateTaskStatus, refreshData, loading } =
      useProductivityData(projectId)

    // Calculate statistics
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

    // Handle tab change
    const handleTabChange = useCallback((tabId: string) => {
      if (tabId === "messages" || tabId === "tasks" || tabId === "feed") {
        setActiveTab(tabId)
      }
    }, [])

    // Enhanced message creation handler
    const handleCreateEnhancedMessage = useCallback(
      (messageData: any) => {
        // Create a new thread with the enhanced message data
        const newThreadData = {
          title: messageData.title,
          participants: [user?.id || "current-user", ...messageData.participants],
          initialMessage: messageData.content,
          priority: messageData.priority,
          linkedData: messageData.linkedData,
        }

        // For now, add to existing thread or create simple message
        if (messageData.content && threads.length > 0) {
          addMessage(threads[0].id, `[${messageData.title}] ${messageData.content}`)
        }
      },
      [addMessage, threads, user]
    )

    // Enhanced task creation handler
    const handleCreateEnhancedTask = useCallback(
      (taskData: any) => {
        const newTask = {
          title: taskData.title,
          description: taskData.description,
          status: "todo" as const,
          priority: taskData.priority,
          assignedTo: taskData.assignedTo,
          dueDate: taskData.dueDate,
        }

        addTask(newTask)
      },
      [addTask]
    )

    // Report activity changes to parent
    useEffect(() => {
      onActivityChange?.(stats)
    }, [stats, onActivityChange])

    // Progressive rendering
    useEffect(() => {
      if (isVisible && !loading) {
        const timer = setTimeout(() => {
          setIsRendering(false)
        }, 100)
        return () => clearTimeout(timer)
      }
    }, [isVisible, loading])

    // Intersection observer placeholder
    if (!isVisible) {
      return <div ref={containerRef} className={cn("h-64", className)} />
    }

    // Loading state
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="text-muted-foreground">Loading productivity tools...</span>
          </div>
        </div>
      )
    }

    // Rendering state
    if (isRendering) {
      return (
        <div ref={containerRef} className={className}>
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 animate-pulse text-muted-foreground" />
              <span className="text-muted-foreground text-sm">Loading productivity tools...</span>
            </div>
          </div>
        </div>
      )
    }

    // Render content based on active tab
    const renderTabContent = () => {
      switch (activeTab) {
        case "messages":
          return <MessageThread threads={threads} onSendMessage={addMessage} currentUser={user} className="w-full" />
        case "tasks":
          return (
            <TaskPanel
              tasks={tasks}
              onAddTask={addTask}
              onUpdateTask={updateTaskStatus}
              currentUser={user}
              className="w-full"
            />
          )
        case "feed":
          return (
            <ProductivityFeed
              threads={threads}
              tasks={tasks}
              onSendMessage={addMessage}
              onUpdateTask={updateTaskStatus}
              currentUser={user}
              className="w-full"
            />
          )
        default:
          return null
      }
    }

    return (
      <div ref={containerRef} className={cn("space-y-4 w-full max-w-full overflow-hidden", className)}>
        {/* Header with Quick Actions */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border">
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="font-medium text-gray-900 dark:text-gray-100">Productivity Tools</span>
              <p className="text-xs text-muted-foreground">Threaded messaging and task management</p>
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
            <Button variant="ghost" size="sm" onClick={refreshData}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Statistics Overview */}
        <ProductivityStats stats={stats} />

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="feed" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Activity Feed
            </TabsTrigger>
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

          <TabsContent value={activeTab} className="mt-4">
            <Card>
              <CardContent className="p-0">{renderTabContent()}</CardContent>
            </Card>
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
)

ProductivityModule.displayName = "ProductivityModule"

export default ProductivityModule
