"use client"

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { 
  CheckSquare, 
  Clock, 
  User, 
  Calendar,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  Plus,
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react'
import { Task, User as UserType } from '@/types/productivity'
import { useProductivityStore } from '../store/useProductivityStore'
import { ThreadPanel } from './ThreadPanel'
import { cn } from '@/lib/utils'
import { formatDistanceToNow, parseISO, format } from 'date-fns'

interface TaskBoardProps {
  className?: string
}

export const TaskBoard = ({ className }: TaskBoardProps) => {
  const { tasks, users, filterTasks, updateTaskStatus } = useProductivityStore()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterUser, setFilterUser] = useState<string>('all')
  const [filterFeature, setFilterFeature] = useState<string>('all')
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  const [completionComment, setCompletionComment] = useState('')
  const [taskToComplete, setTaskToComplete] = useState<Task | null>(null)

  const getUserById = (userId: string): UserType | undefined => {
    return users[userId]
  }

  const getUserInitials = (userId: string): string => {
    const user = getUserById(userId)
    if (!user) return userId.slice(0, 2).toUpperCase()
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const filteredTasks = useMemo(() => {
    let allTasks = tasks

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      allTasks = allTasks.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.linkedTo?.label.toLowerCase().includes(query)
      )
    }

    // Apply other filters
    const filters: any = {}
    if (filterUser !== 'all') filters.assignedTo = filterUser
    if (filterFeature !== 'all') filters.linkedType = filterFeature

    return filterTasks(filters).filter(task => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return task.title.toLowerCase().includes(query) ||
               task.description?.toLowerCase().includes(query) ||
               task.linkedTo?.label.toLowerCase().includes(query)
      }
      return true
    })
  }, [tasks, searchQuery, filterUser, filterFeature, filterTasks])

  const tasksByStatus = useMemo(() => {
    return {
      todo: filteredTasks.filter(task => task.status === 'todo'),
      'in-progress': filteredTasks.filter(task => task.status === 'in-progress'),
      blocked: filteredTasks.filter(task => task.status === 'blocked'),
      completed: filteredTasks.filter(task => task.status === 'completed')
    }
  }, [filteredTasks])

  const getFeatureTypes = () => {
    const types = new Set(tasks.map(t => t.linkedTo?.type).filter(Boolean))
    return Array.from(types)
  }

  const getFeatureDisplayName = (type: string) => {
    const displayNames: { [key: string]: string } = {
      'daily-log': 'Daily Log',
      'forecast': 'Forecast',
      'procurement': 'Procurement',
      'schedule': 'Schedule',
      'inspection': 'Inspection',
      'constraint': 'Constraint',
      'permit': 'Permit',
      'financial': 'Financial',
      'report': 'Report'
    }
    return displayNames[type] || type
  }

  const getPriorityIcon = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return <ArrowUp className="w-3 h-3 text-red-500" />
      case 'medium':
        return <Minus className="w-3 h-3 text-yellow-500" />
      case 'low':
        return <ArrowDown className="w-3 h-3 text-green-500" />
      default:
        return null
    }
  }

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500'
      case 'medium':
        return 'border-l-yellow-500'
      case 'low':
        return 'border-l-green-500'
      default:
        return 'border-l-gray-300'
    }
  }

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'blocked':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    }
  }

  const getLinkedEntityBadge = (task: Task) => {
    if (!task.linkedTo) return null

    const typeColors = {
      'daily-log': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'forecast': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'procurement': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'schedule': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      'inspection': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      'constraint': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'permit': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
      'financial': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
      'report': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    }

    return (
      <Badge variant="outline" className={cn('text-xs mb-2', typeColors[task.linkedTo.type])}>
        <ExternalLink className="w-2 h-2 mr-1" />
        {getFeatureDisplayName(task.linkedTo.type)}
      </Badge>
    )
  }

  const handleStatusChange = (task: Task, newStatus: Task['status']) => {
    if (newStatus === 'completed') {
      setTaskToComplete(task)
      setShowCompletionDialog(true)
    } else {
      updateTaskStatus(task.id, newStatus)
    }
  }

  const handleCompleteTask = () => {
    if (taskToComplete) {
      updateTaskStatus(taskToComplete.id, 'completed', completionComment || undefined)
      setShowCompletionDialog(false)
      setCompletionComment('')
      setTaskToComplete(null)
    }
  }

  const isOverdue = (task: Task) => {
    return task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed'
  }

  const renderTaskCard = (task: Task) => {
    const user = getUserById(task.assignedTo)
    const overdue = isOverdue(task)
    const commentsCount = task.comments?.length || 0

    return (
      <Card
        key={task.id}
        className={cn(
          'mb-3 cursor-pointer transition-all duration-200 hover:shadow-md border-l-4',
          getPriorityColor(task.priority),
          selectedTask?.id === task.id && 'ring-2 ring-blue-500'
        )}
        onClick={() => setSelectedTask(task)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              {getPriorityIcon(task.priority)}
              <h4 className="font-medium text-sm line-clamp-2">{task.title}</h4>
            </div>
            <div className="flex items-center space-x-1">
              {overdue && (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
              <Select
                value={task.status}
                onValueChange={(value) => handleStatusChange(task, value as Task['status'])}
              >
                <SelectTrigger className="w-auto h-6 text-xs px-2">
                  <Badge variant="outline" className={getStatusColor(task.status)}>
                    {task.status}
                  </Badge>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="completed">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {getLinkedEntityBadge(task)}

          {task.description && (
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-xs">
                  {getUserInitials(task.assignedTo)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                {user?.name || `User ${task.assignedTo}`}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              {commentsCount > 0 && (
                <div className="flex items-center space-x-1">
                  <MessageSquare className="w-3 h-3" />
                  <span>{commentsCount}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span className={overdue ? 'text-red-500' : ''}>
                  {task.dueDate ? format(task.dueDate, 'MMM d') : 'No date'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderColumn = (status: Task['status'], title: string, tasks: Task[]) => {
    return (
      <div className="flex-1 min-w-80">
        <Card className="h-full">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center">
                <CheckSquare className="w-4 h-4 mr-2" />
                {title}
              </CardTitle>
              <Badge variant="secondary">{tasks.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ScrollArea className="h-96">
              {tasks.map(renderTaskCard)}
              {tasks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">No {title.toLowerCase()} tasks</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    )
  }



  return (
    <div className={cn('h-full', className)}>
      {/* Header with Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Task Board</h2>
          <Badge variant="outline">{filteredTasks.length} tasks</Badge>
        </div>

        <div className="flex space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={filterUser} onValueChange={setFilterUser}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by user" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              {Object.values(users).map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterFeature} onValueChange={setFilterFeature}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by feature" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Features</SelectItem>
              {getFeatureTypes().map((type) => (
                <SelectItem key={type} value={type}>
                  {getFeatureDisplayName(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-12 gap-6 h-full">
        <div className="col-span-8">
          <div className="flex space-x-4 h-full">
            {renderColumn('todo', 'To Do', tasksByStatus.todo)}
            {renderColumn('in-progress', 'In Progress', tasksByStatus['in-progress'])}
            {renderColumn('blocked', 'Blocked', tasksByStatus.blocked)}
            {renderColumn('completed', 'Done', tasksByStatus.completed)}
          </div>
        </div>

        <div className="col-span-4">
          <ThreadPanel task={selectedTask || undefined} />
        </div>
      </div>

      {/* Task Completion Dialog */}
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Add a comment about completing this task (optional):
            </p>
            <Textarea
              value={completionComment}
              onChange={(e) => setCompletionComment(e.target.value)}
              placeholder="What was accomplished? Any notes or next steps?"
              className="min-h-[80px]"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCompletionDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCompleteTask}>
                Complete Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 