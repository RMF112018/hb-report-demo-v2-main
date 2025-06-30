"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  MessageSquare, 
  CheckSquare, 
  Users, 
  Clock,
  TrendingUp,
  Activity
} from 'lucide-react'
import { MessageBoard } from './components/MessageBoard'
import { TaskBoard } from './components/TaskBoard'
import { QuickComposer } from './components/QuickComposer'
import { useProductivityStore } from './store/useProductivityStore'
import { StandardPageLayout } from '@/components/layout/StandardPageLayout'

export default function ProductivityPage() {
  const { messageThreads, tasks, users } = useProductivityStore()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('messages')
  const [selectedThread, setSelectedThread] = useState<string | null>(null)
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [createType, setCreateType] = useState<'message' | 'task' | null>(null)

  // Handle query parameters
  useEffect(() => {
    const threadParam = searchParams.get('thread')
    const taskParam = searchParams.get('task')
    const createParam = searchParams.get('create') as 'message' | 'task' | null

    if (threadParam) {
      setSelectedThread(threadParam)
      setActiveTab('messages')
    }

    if (taskParam) {
      setSelectedTask(taskParam)
      setActiveTab('tasks')
    }

    if (createParam) {
      setCreateType(createParam)
      if (createParam === 'message') {
        setActiveTab('messages')
      } else if (createParam === 'task') {
        setActiveTab('tasks')
      }
    }
  }, [searchParams])

  const getStatistics = () => {
    const totalThreads = messageThreads.length
    const totalMessages = messageThreads.reduce((acc, thread) => acc + thread.messages.length, 0)
    const totalTasks = tasks.length
    const completedTasks = tasks.filter(task => task.status === 'completed').length
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length
    const blockedTasks = tasks.filter(task => task.status === 'blocked').length
    const todoTasks = tasks.filter(task => task.status === 'todo').length
    const activeUsers = new Set([
      ...messageThreads.flatMap(t => t.participants),
      ...tasks.map(t => t.assignedTo)
    ]).size

    const overdueTasks = tasks.filter(task => 
      task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed'
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
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    }
  }

  const stats = getStatistics()

  const breadcrumbItems = [
    { label: 'Tools', href: '/tools' },
    { label: 'Productivity', href: '/tools/productivity' }
  ]



  return (
    <StandardPageLayout
      title="Productivity Suite"
      description="Manage messages, tasks, and team collaboration"
      breadcrumbs={breadcrumbItems}
    >
      {/* Statistics Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.totalThreads}</p>
                <p className="text-xs text-muted-foreground">Message Threads</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.totalMessages}</p>
                <p className="text-xs text-muted-foreground">Total Messages</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckSquare className="w-4 h-4 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{stats.totalTasks}</p>
                <p className="text-xs text-muted-foreground">Total Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <div>
                <p className="text-2xl font-bold">{stats.completionRate}%</p>
                <p className="text-xs text-muted-foreground">Completion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{stats.activeUsers}</p>
                <p className="text-xs text-muted-foreground">Active Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{stats.overdueTasks}</p>
                <p className="text-xs text-muted-foreground">Overdue Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task Status Quick Overview */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card className="border-l-4 border-l-gray-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">{stats.todoTasks}</p>
                <p className="text-sm text-muted-foreground">To Do</p>
              </div>
              <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300">
                To Do
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">{stats.inProgressTasks}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
              <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">{stats.blockedTasks}</p>
                <p className="text-sm text-muted-foreground">Blocked</p>
              </div>
              <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                Blocked
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">{stats.completedTasks}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                Done
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-400">
          <TabsTrigger value="messages" className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>Messages</span>
            <Badge variant="secondary" className="ml-2">
              {stats.totalThreads}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center space-x-2">
            <CheckSquare className="w-4 h-4" />
            <span>Tasks</span>
            <Badge variant="secondary" className="ml-2">
              {stats.totalTasks}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-6">
          <div className="h-[800px]">
            <MessageBoard 
              selectedThreadId={selectedThread}
              autoCreate={createType === 'message'}
            />
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <div className="h-[800px]">
            <TaskBoard 
              selectedTaskId={selectedTask}
              autoCreate={createType === 'task'}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Composer Floating Action Button */}
      <QuickComposer 
        initialType={createType}
        onClose={() => setCreateType(null)}
      />
    </StandardPageLayout>
  )
} 