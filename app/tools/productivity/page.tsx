"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AppHeader } from "@/components/layout/app-header"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  MessageSquare,
  CheckSquare,
  Users,
  Clock,
  TrendingUp,
  Activity,
  Home,
  RefreshCw,
  Download,
  Plus,
  BarChart3,
  Settings,
  Target,
} from "lucide-react"
import { MessageBoard } from "./components/MessageBoard"
import { TaskBoard } from "./components/TaskBoard"
import { QuickComposer } from "./components/QuickComposer"
import { useProductivityStore } from "./store/useProductivityStore"
import { useToast } from "@/hooks/use-toast"

export default function ProductivityPage() {
  const { messageThreads, tasks, users } = useProductivityStore()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("messages")
  const [selectedThread, setSelectedThread] = useState<string | null>(null)
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [createType, setCreateType] = useState<"message" | "task" | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Handle query parameters
  useEffect(() => {
    const threadParam = searchParams.get("thread")
    const taskParam = searchParams.get("task")
    const createParam = searchParams.get("create") as "message" | "task" | null

    if (threadParam) {
      setSelectedThread(threadParam)
      setActiveTab("messages")
    }

    if (taskParam) {
      setSelectedTask(taskParam)
      setActiveTab("tasks")
    }

    if (createParam) {
      setCreateType(createParam)
      if (createParam === "message") {
        setActiveTab("messages")
      } else if (createParam === "task") {
        setActiveTab("tasks")
      }
    }
  }, [searchParams])

  const getStatistics = () => {
    const totalThreads = messageThreads.length
    const totalMessages = messageThreads.reduce((acc, thread) => acc + thread.messages.length, 0)
    const totalTasks = tasks.length
    const completedTasks = tasks.filter((task) => task.status === "completed").length
    const inProgressTasks = tasks.filter((task) => task.status === "in-progress").length
    const blockedTasks = tasks.filter((task) => task.status === "blocked").length
    const todoTasks = tasks.filter((task) => task.status === "todo").length
    const activeUsers = new Set([...messageThreads.flatMap((t) => t.participants), ...tasks.map((t) => t.assignedTo)])
      .size

    const overdueTasks = tasks.filter(
      (task) => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "completed"
    ).length

    return {
      totalThreads,
      totalMessages,
      totalTasks,
      completedTasks,
      inProgressTasks,
      blockedTasks,
      todoTasks,
      activeUsers,
      overdueTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    }
  }

  const stats = getStatistics()

  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Data Refreshed",
        description: "Productivity data has been updated",
      })
    }, 1000)
  }

  // Handle export
  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Productivity report is being prepared",
    })
  }

  // Handle create new
  const handleCreateNew = () => {
    setCreateType("message") // Default to message creation
  }

  return (
    <>
      <AppHeader />
      <div className="space-y-6 p-6">
        {/* Breadcrumb Navigation */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard" className="flex items-center gap-1">
                <Home className="h-3 w-3" />
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/tools">Tools</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Productivity</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header Section - Made Sticky */}
        <div className="sticky top-20 z-40 bg-white dark:bg-gray-950 border-b border-border/40 -mx-6 px-6 pb-4 backdrop-blur-sm">
          <div className="flex flex-col gap-4 pt-3">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Productivity Suite</h1>
                <p className="text-muted-foreground mt-1">Manage messages, tasks, and team collaboration</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <Button variant="outline" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button className="bg-[#FF6B35] hover:bg-[#E55A2B]" onClick={handleCreateNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content with Sidebar Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
          {/* Sidebar - Hidden on mobile, shown on xl+ */}
          <div className="hidden xl:block xl:col-span-3 space-y-4">
            {/* Quick Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Message Threads</span>
                  <span className="font-medium">{stats.totalThreads}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Messages</span>
                  <span className="font-medium text-blue-600">{stats.totalMessages}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Tasks</span>
                  <span className="font-medium text-purple-600">{stats.totalTasks}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Completion Rate</span>
                  <span className="font-medium text-green-600">{stats.completionRate}%</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-green-600 dark:text-green-400" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab("messages")}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Messages
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab("tasks")}>
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Tasks
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={() => setCreateType("message")}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Message
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={() => setCreateType("task")}>
                  <Target className="h-4 w-4 mr-2" />
                  New Task
                </Button>
              </CardContent>
            </Card>

            {/* Task Status Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  Task Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">To Do</span>
                  <span className="font-medium">{stats.todoTasks}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">In Progress</span>
                  <span className="font-medium text-blue-600">{stats.inProgressTasks}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Blocked</span>
                  <span className="font-medium text-red-600">{stats.blockedTasks}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="font-medium text-green-600">{stats.completedTasks}</span>
                </div>
              </CardContent>
            </Card>

            {/* Team Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  Team Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Active Users</span>
                  <span className="font-medium text-orange-600">{stats.activeUsers}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Overdue Tasks</span>
                  <span className="font-medium text-red-600">{stats.overdueTasks}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="xl:col-span-9">
            {/* Custom Tab Navigation */}
            <div className="flex items-center gap-1 mb-6">
              <button
                onClick={() => setActiveTab("messages")}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
                  activeTab === "messages"
                    ? "text-primary border-primary bg-primary/5"
                    : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted-foreground/50"
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                Messages
                <Badge variant="secondary" className="ml-2">
                  {stats.totalThreads}
                </Badge>
              </button>
              <button
                onClick={() => setActiveTab("tasks")}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
                  activeTab === "tasks"
                    ? "text-primary border-primary bg-primary/5"
                    : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted-foreground/50"
                }`}
              >
                <CheckSquare className="h-4 w-4" />
                Tasks
                <Badge variant="secondary" className="ml-2">
                  {stats.totalTasks}
                </Badge>
              </button>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === "messages" && (
                <div className="h-[800px]">
                  <MessageBoard selectedThreadId={selectedThread} autoCreate={createType === "message"} />
                </div>
              )}

              {activeTab === "tasks" && (
                <div className="h-[800px]">
                  <TaskBoard selectedTaskId={selectedTask} autoCreate={createType === "task"} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Composer Floating Action Button */}
        <QuickComposer initialType={createType} onClose={() => setCreateType(null)} />
      </div>
    </>
  )
}
