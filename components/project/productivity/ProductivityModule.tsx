"use client"

/**
 * @fileoverview Productivity Module Component - Microsoft Teams Integration
 * @module ProductivityModule
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Enhanced productivity module with Microsoft Teams integration:
 * - Microsoft Graph API integration for Teams, Planner, and Calendar
 * - Real-time messaging through Teams channels
 * - Task management via Microsoft Planner
 * - Calendar integration for project scheduling
 * - Enterprise-grade Microsoft 365 integration
 * - Backward compatibility with legacy productivity features
 */

import React, { useState, useMemo, useCallback, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  MessageSquare,
  CheckSquare,
  Activity,
  TrendingUp,
  RefreshCw,
  Settings,
  Plus,
  Users,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Maximize2,
  Minimize2,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Import Microsoft Teams productivity component
import { TeamsProductivityContent } from "@/components/productivity/TeamsProductivityContent"

// Import legacy productivity components for backward compatibility
import { EnhancedMessageComposer } from "@/components/productivity/EnhancedMessageComposer"
import { EnhancedTaskComposer } from "@/components/productivity/EnhancedTaskComposer"
import TaskPanel from "./TaskPanel"
import MessageThread from "./MessageThread"
import ProductivityFeed from "./ProductivityFeed"

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

// Statistics Summary Component for Legacy Mode
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

// Main ProductivityModule Component with Teams Integration
const ProductivityModule: React.FC<ProductivityModuleProps> = React.memo(
  ({ projectId, projectData, user, userRole = "pm", className = "", initialTab = "feed", onActivityChange }) => {
    const [activeTab, setActiveTab] = useState(initialTab)
    const [isRendering, setIsRendering] = useState(true)
    const [showEnhancedMessageComposer, setShowEnhancedMessageComposer] = useState(false)
    const [showEnhancedTaskComposer, setShowEnhancedTaskComposer] = useState(false)
    const [isTeamsMode, setIsTeamsMode] = useState(true) // Default to Teams mode
    const [isFocusMode, setIsFocusMode] = useState(false)

    const containerRef = useRef<HTMLDivElement>(null)
    const isVisible = useIntersectionObserver(containerRef, { threshold: 0.1 })

    // Use the productivity data hook for legacy mode
    const { threads, tasks, addMessage, addTask, updateTaskStatus, refreshData, loading } =
      useProductivityData(projectId)

    // Calculate statistics for legacy mode
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

    // Handle tab change for legacy mode
    const handleTabChange = useCallback((tabId: string) => {
      if (tabId === "messages" || tabId === "tasks" || tabId === "feed") {
        setActiveTab(tabId)
      }
    }, [])

    // Enhanced message creation handler for legacy mode
    const handleCreateEnhancedMessage = useCallback(
      (messageData: any) => {
        const newThreadData = {
          title: messageData.title,
          participants: [user?.id || "current-user", ...messageData.participants],
          initialMessage: messageData.content,
          priority: messageData.priority,
          linkedData: messageData.linkedData,
        }

        if (messageData.content && threads.length > 0) {
          addMessage(threads[0].id, `[${messageData.title}] ${messageData.content}`)
        }
      },
      [addMessage, threads, user]
    )

    // Enhanced task creation handler for legacy mode
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
      if (onActivityChange && !isTeamsMode) {
        onActivityChange(stats)
      }
    }, [onActivityChange, stats, isTeamsMode])

    // Handle focus mode toggle
    const handleFocusToggle = useCallback(() => {
      setIsFocusMode((prev) => !prev)
    }, [])

    // Handle Teams mode toggle
    const handleTeamsModeToggle = useCallback((enabled: boolean) => {
      setIsTeamsMode(enabled)
    }, [])

    // Render legacy productivity content
    const renderLegacyContent = () => {
      return (
        <div className="space-y-4">
          {/* Legacy Mode Warning */}
          <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-700 dark:text-orange-300">
              <strong>Legacy Mode:</strong> You're using the deprecated productivity system. Switch to Microsoft Teams
              mode for enhanced collaboration features.
            </AlertDescription>
          </Alert>

          {/* Legacy Statistics */}
          <ProductivityStats stats={stats} />

          {/* Legacy Tab Navigation */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="messages">
                <MessageSquare className="h-4 w-4 mr-2" />
                Messages
              </TabsTrigger>
              <TabsTrigger value="tasks">
                <CheckSquare className="h-4 w-4 mr-2" />
                Tasks
              </TabsTrigger>
              <TabsTrigger value="feed">
                <Activity className="h-4 w-4 mr-2" />
                Feed
              </TabsTrigger>
            </TabsList>

            <TabsContent value="messages" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Message Threads</h3>
                <Button onClick={() => setShowEnhancedMessageComposer(true)} size="sm" className="h-8">
                  <Plus className="h-4 w-4 mr-2" />
                  New Thread
                </Button>
              </div>
              <MessageThread
                threads={threads}
                onSendMessage={addMessage}
                currentUser={user}
                className="min-h-[400px]"
              />
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Task Management</h3>
                <Button onClick={() => setShowEnhancedTaskComposer(true)} size="sm" className="h-8">
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
                </Button>
              </div>
              <TaskPanel
                tasks={tasks}
                onUpdateTask={updateTaskStatus}
                onAddTask={addTask}
                currentUser={user}
                className="min-h-[400px]"
              />
            </TabsContent>

            <TabsContent value="feed" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Activity Feed</h3>
                <Button onClick={refreshData} size="sm" variant="outline" className="h-8">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
              <ProductivityFeed
                threads={threads}
                tasks={tasks}
                currentUser={user}
                onSendMessage={addMessage}
                onUpdateTask={updateTaskStatus}
                className="min-h-[400px]"
              />
            </TabsContent>
          </Tabs>

          {/* Legacy Enhanced Composers */}
          {showEnhancedMessageComposer && (
            <EnhancedMessageComposer
              isOpen={showEnhancedMessageComposer}
              onClose={() => setShowEnhancedMessageComposer(false)}
              onCreateMessage={handleCreateEnhancedMessage}
              projectId={projectId}
              currentUser={user}
            />
          )}

          {showEnhancedTaskComposer && (
            <EnhancedTaskComposer
              isOpen={showEnhancedTaskComposer}
              onClose={() => setShowEnhancedTaskComposer(false)}
              onCreateTask={handleCreateEnhancedTask}
              projectId={projectId}
              currentUser={user}
            />
          )}
        </div>
      )
    }

    // Render Teams productivity content
    const renderTeamsContent = () => {
      return (
        <div className="space-y-4">
          {/* Teams Productivity Content */}
          <TeamsProductivityContent
            projectId={projectId}
            projectData={projectData}
            user={user}
            userRole={userRole}
            className="w-full"
          />
        </div>
      )
    }

    // Main content
    const mainContent = (
      <div ref={containerRef} className={cn("space-y-6", className)}>
        {/* Content Area */}
        <div className="w-full min-w-0 max-w-full">{isTeamsMode ? renderTeamsContent() : renderLegacyContent()}</div>
      </div>
    )

    // Return focus mode if active
    if (isFocusMode) {
      return (
        <div className="fixed inset-0 bg-white dark:bg-gray-950 flex flex-col z-50">
          <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
            <div className="p-6 min-h-full w-full max-w-full">{mainContent}</div>
          </div>
        </div>
      )
    }

    return mainContent
  }
)

ProductivityModule.displayName = "ProductivityModule"

export default ProductivityModule
