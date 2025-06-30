"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  MessagesSquare, 
  Plus, 
  MessageCircle, 
  CheckSquare,
  Clock,
  User,
  ExternalLink,
  AlertTriangle,
  Circle,
  Dot
} from 'lucide-react'
import { useProductivityStore } from '@/app/tools/productivity/store/useProductivityStore'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

interface ProductivityPopoverProps {
  notifications?: number
  className?: string
}

export const ProductivityPopover = ({ 
  notifications = 0, 
  className 
}: ProductivityPopoverProps) => {
  const router = useRouter()
  const { messageThreads, tasks, users } = useProductivityStore()
  const [open, setOpen] = useState(false)

  const getUserById = (userId: string) => {
    return users[userId]
  }

  const getUserInitials = (userId: string): string => {
    const user = getUserById(userId)
    if (!user) return userId.slice(0, 2).toUpperCase()
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  // Simulate unread status for demo purposes
  const getUnreadCount = (threadId: string): number => {
    // In a real app, this would be based on user's last read timestamp
    // For demo, we'll simulate some unread messages
    const hash = threadId.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    return hash % 4 // 0-3 unread messages
  }

  const isThreadUnread = (threadId: string): boolean => {
    return getUnreadCount(threadId) > 0
  }

  const isTaskNew = (task: any): boolean => {
    // Consider task "new" if created within last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    return new Date(task.createdAt) > oneDayAgo
  }

  const getTotalUnreadCount = (): number => {
    return messageThreads.reduce((total, thread) => total + getUnreadCount(thread.id), 0)
  }

  const handleThreadClick = (threadId: string) => {
    setOpen(false)
    router.push(`/tools/productivity?thread=${threadId}`)
  }

  const handleTaskClick = (taskId: string) => {
    setOpen(false)
    router.push(`/tools/productivity?task=${taskId}`)
  }

  const handleCreateNew = (type: 'message' | 'task') => {
    setOpen(false)
    router.push(`/tools/productivity?create=${type}`)
  }

  const handleViewAll = () => {
    setOpen(false)
    router.push('/tools/productivity')
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500 dark:text-red-400'
      case 'medium':
        return 'text-amber-500 dark:text-amber-400'
      case 'low':
        return 'text-emerald-500 dark:text-emerald-400'
      default:
        return 'text-gray-500 dark:text-gray-400'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-600 dark:text-emerald-400'
      case 'in-progress':
        return 'text-blue-600 dark:text-blue-400'
      case 'blocked':
        return 'text-red-600 dark:text-red-400'
      case 'todo':
        return 'text-gray-600 dark:text-gray-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getEntityTypeColor = (type: string) => {
    const typeColors = {
      'daily-log': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800',
      'forecast': 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800',
      'procurement': 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-800',
      'schedule': 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-300 dark:border-orange-800',
      'inspection': 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800',
      'constraint': 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-300 dark:border-yellow-800',
      'permit': 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-300 dark:border-indigo-800',
      'financial': 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/30 dark:text-teal-300 dark:border-teal-800',
      'report': 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950/30 dark:text-slate-300 dark:border-slate-800'
    }
    return typeColors[type] || typeColors['report']
  }

  // Enhanced sorting for threads: unread first, then by most recent activity
  const sortedThreads = [...messageThreads]
    .sort((a, b) => {
      const aUnread = isThreadUnread(a.id)
      const bUnread = isThreadUnread(b.id)
      
      // Unread messages first
      if (aUnread && !bUnread) return -1
      if (!aUnread && bUnread) return 1
      
      // Then by most recent activity
      return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
    })
    .slice(0, 8) // Show more items in enhanced version

  // Enhanced sorting for tasks: new first, then by newest activity, then by priority
  const sortedTasks = [...tasks]
    .filter(task => task.status !== 'completed')
    .sort((a, b) => {
      const aNew = isTaskNew(a)
      const bNew = isTaskNew(b)
      
      // New tasks first
      if (aNew && !bNew) return -1
      if (!aNew && bNew) return 1
      
      // Then by most recent activity (updatedAt)
      const aActivity = new Date(a.updatedAt).getTime()
      const bActivity = new Date(b.updatedAt).getTime()
      
      if (aActivity !== bActivity) {
        return bActivity - aActivity
      }
      
      // Finally by priority
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      const aPriority = priorityOrder[a.priority] || 1
      const bPriority = priorityOrder[b.priority] || 1
      
      return bPriority - aPriority
    })
    .slice(0, 8) // Show more items in enhanced version

  const totalUnreadCount = getTotalUnreadCount()
  const displayNotifications = totalUnreadCount > 0 ? totalUnreadCount : notifications

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "relative text-white hover:bg-white/20 p-2.5 rounded-lg transition-all duration-200 hover:scale-105",
            className
          )}
          aria-label={`Productivity Suite ${displayNotifications > 0 ? `(${displayNotifications} updates)` : ""}`}
        >
          <MessagesSquare className="h-4 w-4" />
          {displayNotifications > 0 && (
            <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center p-0 text-xs text-white bg-red-500 border-2 border-white rounded-full shadow-lg animate-pulse">
              {displayNotifications > 99 ? '99+' : displayNotifications}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-[480px] p-0 shadow-2xl border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg" 
        align="end"
        sideOffset={12}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <MessagesSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Productivity Suite
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Messages & Tasks
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleViewAll}
            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200"
          >
            View All
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </div>

        <Tabs defaultValue="messages" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mx-4 mt-3 mb-0 bg-gray-100 dark:bg-gray-800">
            <TabsTrigger value="messages" className="text-xs font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
              <MessageCircle className="w-3 h-3 mr-1.5" />
              Messages
              {totalUnreadCount > 0 && (
                <Badge variant="secondary" className="ml-1.5 h-4 px-1.5 text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                  {totalUnreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="tasks" className="text-xs font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
              <CheckSquare className="w-3 h-3 mr-1.5" />
              Tasks
              <Badge variant="secondary" className="ml-1.5 h-4 px-1.5 text-xs">
                {sortedTasks.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="mt-0 pb-3">
            {/* Create New Message Button */}
            <div className="p-4 pb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCreateNew('message')}
                className="w-full justify-start hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950/30 dark:hover:border-blue-800 transition-all duration-200 group"
              >
                <div className="p-1 rounded bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/30 mr-2">
                  <Plus className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                </div>
                New Message Thread
              </Button>
            </div>

            <Separator className="mx-4" />

            {/* Recent Messages */}
            <div className="px-4 pt-3">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  Recent Threads
                </h4>
                <Badge variant="outline" className="text-xs">
                  {sortedThreads.length}
                </Badge>
              </div>
              
              {sortedThreads.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    No message threads yet
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Create your first thread to get started
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[280px] pr-2">
                  <div className="space-y-2">
                    {sortedThreads.map((thread) => {
                      const lastMessage = thread.messages[thread.messages.length - 1]
                      const lastSender = getUserById(lastMessage?.sender)
                      const unreadCount = getUnreadCount(thread.id)
                      const isUnread = unreadCount > 0
                      
                      return (
                        <button
                          key={thread.id}
                          onClick={() => handleThreadClick(thread.id)}
                          className={cn(
                            "w-full p-3 text-left rounded-lg border transition-all duration-200 hover:shadow-md group",
                            isUnread 
                              ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40" 
                              : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                          )}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="relative">
                              <div className="flex -space-x-1">
                                {thread.participants.slice(0, 2).map((participantId) => (
                                  <Avatar key={participantId} className="w-6 h-6 border-2 border-background">
                                    <AvatarFallback className="text-xs bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900">
                                      {getUserInitials(participantId)}
                                    </AvatarFallback>
                                  </Avatar>
                                ))}
                                {thread.participants.length > 2 && (
                                  <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-background flex items-center justify-center">
                                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                      +{thread.participants.length - 2}
                                    </span>
                                  </div>
                                )}
                              </div>
                              {isUnread && (
                                <div className="absolute -top-1 -right-1">
                                  <Circle className="w-3 h-3 text-blue-500 fill-current" />
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h5 className={cn(
                                  "text-sm truncate max-w-[280px]",
                                  isUnread 
                                    ? "font-semibold text-gray-900 dark:text-gray-100" 
                                    : "font-medium text-gray-800 dark:text-gray-200"
                                )}>
                                  {thread.title}
                                </h5>
                                <div className="flex items-center space-x-1">
                                  {unreadCount > 0 && (
                                    <Badge className="h-4 px-1.5 text-xs bg-blue-500 text-white">
                                      {unreadCount}
                                    </Badge>
                                  )}
                                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                    <Clock className="w-2.5 h-2.5 mr-1" />
                                    {formatDistanceToNow(new Date(thread.lastActivity), { addSuffix: true })}
                                  </span>
                                </div>
                              </div>
                              
                              {thread.linkedTo && (
                                <Badge variant="outline" className={cn('text-xs mb-1.5', getEntityTypeColor(thread.linkedTo.type))}>
                                  <ExternalLink className="w-2 h-2 mr-1" />
                                  {thread.linkedTo.type.replace('-', ' ')}
                                </Badge>
                              )}
                              
                              {lastMessage && (
                                <p className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-[350px]">
                                  <span className="font-medium text-gray-700 dark:text-gray-300">
                                    {lastSender?.name || 'Someone'}:
                                  </span>{' '}
                                  {lastMessage.content}
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </ScrollArea>
              )}
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="mt-0 pb-3">
            {/* Create New Task Button */}
            <div className="p-4 pb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCreateNew('task')}
                className="w-full justify-start hover:bg-emerald-50 hover:border-emerald-200 dark:hover:bg-emerald-950/30 dark:hover:border-emerald-800 transition-all duration-200 group"
              >
                <div className="p-1 rounded bg-emerald-100 dark:bg-emerald-900/30 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/30 mr-2">
                  <Plus className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                </div>
                New Task
              </Button>
            </div>

            <Separator className="mx-4" />

            {/* Active Tasks */}
            <div className="px-4 pt-3">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  Active Tasks
                </h4>
                <Badge variant="outline" className="text-xs">
                  {sortedTasks.length}
                </Badge>
              </div>
              
              {sortedTasks.length === 0 ? (
                <div className="text-center py-8">
                  <CheckSquare className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    No active tasks
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Create your first task to get started
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[280px] pr-2">
                  <div className="space-y-2">
                    {sortedTasks.map((task) => {
                      const assignee = getUserById(task.assignedTo)
                      const isOverdue = task.dueDate && new Date(task.dueDate) < new Date()
                      const isNew = isTaskNew(task)
                      
                      return (
                        <button
                          key={task.id}
                          onClick={() => handleTaskClick(task.id)}
                          className={cn(
                            "w-full p-3 text-left rounded-lg border transition-all duration-200 hover:shadow-md group",
                            isNew 
                              ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
                              : isOverdue
                              ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40"
                              : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                          )}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="relative">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="text-xs bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                                  {getUserInitials(task.assignedTo)}
                                </AvatarFallback>
                              </Avatar>
                              {isNew && (
                                <div className="absolute -top-1 -right-1">
                                  <Circle className="w-3 h-3 text-emerald-500 fill-current" />
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-[280px]">
                                  {task.title}
                                </h5>
                                <div className="flex items-center space-x-1">
                                  {isNew && (
                                    <Badge className="h-4 px-1.5 text-xs bg-emerald-500 text-white">
                                      NEW
                                    </Badge>
                                  )}
                                  <AlertTriangle className={cn(
                                    "w-3 h-3",
                                    getPriorityColor(task.priority)
                                  )} />
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between mb-1.5">
                                <Badge variant="outline" className={cn(
                                  "text-xs capitalize",
                                  task.status === 'in-progress' && "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300",
                                  task.status === 'blocked' && "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300",
                                  task.status === 'todo' && "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950/30 dark:text-gray-300"
                                )}>
                                  {task.status.replace('-', ' ')}
                                </Badge>
                                
                                {task.dueDate && (
                                  <span className={cn(
                                    "text-xs flex items-center",
                                    isOverdue 
                                      ? "text-red-600 dark:text-red-400 font-medium" 
                                      : "text-gray-500 dark:text-gray-400"
                                  )}>
                                    <Clock className="w-2.5 h-2.5 mr-1" />
                                    {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
                                  </span>
                                )}
                              </div>
                              
                              {task.linkedTo && (
                                <Badge variant="outline" className={cn('text-xs', getEntityTypeColor(task.linkedTo.type))}>
                                  <ExternalLink className="w-2 h-2 mr-1" />
                                  {task.linkedTo.type.replace('-', ' ')}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </ScrollArea>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
} 