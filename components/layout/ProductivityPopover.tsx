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
  AlertTriangle
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
        return 'text-orange-500 dark:text-orange-400'
      case 'low':
        return 'text-green-500 dark:text-green-400'
      default:
        return 'text-gray-500 dark:text-gray-400'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400'
      case 'in-progress':
        return 'text-blue-600 dark:text-blue-400'
      case 'todo':
        return 'text-gray-600 dark:text-gray-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  // Sort threads by most recent activity
  const sortedThreads = [...messageThreads]
    .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime())
    .slice(0, 5)

  // Sort tasks by priority and due date
  const sortedTasks = [...tasks]
    .filter(task => task.status !== 'completed')
    .sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      const aPriority = priorityOrder[a.priority] || 1
      const bPriority = priorityOrder[b.priority] || 1
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority
      }
      
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      }
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    .slice(0, 5)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "relative text-white hover:bg-white/20 p-2.5 rounded-lg transition-all duration-200",
            className
          )}
          aria-label={`Productivity Suite ${notifications > 0 ? `(${notifications} updates)` : ""}`}
        >
          <MessagesSquare className="h-4 w-4" />
          {notifications > 0 && (
            <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center p-0 text-xs text-white bg-red-500 border-2 border-white rounded-full shadow-lg">
              {notifications}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-96 p-0 shadow-xl border-gray-200 dark:border-gray-700" 
        align="end"
        sideOffset={8}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Productivity Suite
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleViewAll}
            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            View All
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </div>

        <Tabs defaultValue="messages" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mx-4 mt-2 mb-0">
            <TabsTrigger value="messages" className="text-xs">
              <MessageCircle className="w-3 h-3 mr-1" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="tasks" className="text-xs">
              <CheckSquare className="w-3 h-3 mr-1" />
              Tasks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="mt-0">
            <div className="p-4 space-y-3">
              {/* Create New Message Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCreateNew('message')}
                className="w-full justify-start"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Message Thread
              </Button>

              <Separator />

              {/* Recent Messages */}
              <div className="space-y-1">
                <h4 className="text-xs font-medium text-muted-foreground mb-2">
                  Recent Threads
                </h4>
                
                {sortedThreads.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4 text-center">
                    No message threads yet
                  </p>
                ) : (
                  <ScrollArea className="max-h-64">
                    <div className="space-y-2">
                      {sortedThreads.map((thread) => {
                        const lastMessage = thread.messages[thread.messages.length - 1]
                        const lastSender = getUserById(lastMessage?.sender)
                        
                        return (
                          <button
                            key={thread.id}
                            onClick={() => handleThreadClick(thread.id)}
                            className="w-full p-3 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex -space-x-1">
                                {thread.participants.slice(0, 2).map((participantId) => (
                                  <Avatar key={participantId} className="w-6 h-6 border-2 border-background">
                                    <AvatarFallback className="text-xs">
                                      {getUserInitials(participantId)}
                                    </AvatarFallback>
                                  </Avatar>
                                ))}
                                {thread.participants.length > 2 && (
                                  <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-background flex items-center justify-center">
                                    <span className="text-xs font-medium">
                                      +{thread.participants.length - 2}
                                    </span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                    {thread.title}
                                  </h5>
                                  <span className="text-xs text-muted-foreground flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {formatDistanceToNow(new Date(thread.lastActivity), { addSuffix: true })}
                                  </span>
                                </div>
                                
                                {lastMessage && (
                                  <p className="text-xs text-muted-foreground truncate">
                                    <span className="font-medium">
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
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="mt-0">
            <div className="p-4 space-y-3">
              {/* Create New Task Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCreateNew('task')}
                className="w-full justify-start"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </Button>

              <Separator />

              {/* Recent Tasks */}
              <div className="space-y-1">
                <h4 className="text-xs font-medium text-muted-foreground mb-2">
                  Active Tasks
                </h4>
                
                {sortedTasks.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4 text-center">
                    No active tasks
                  </p>
                ) : (
                  <ScrollArea className="max-h-64">
                    <div className="space-y-2">
                      {sortedTasks.map((task) => {
                        const assignee = getUserById(task.assignedTo)
                        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date()
                        
                        return (
                          <button
                            key={task.id}
                            onClick={() => handleTaskClick(task.id)}
                            className="w-full p-3 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <div className="flex items-start space-x-3">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="text-xs">
                                  {getUserInitials(task.assignedTo)}
                                </AvatarFallback>
                              </Avatar>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                    {task.title}
                                  </h5>
                                  <div className="flex items-center space-x-1">
                                    <AlertTriangle className={cn(
                                      "w-3 h-3",
                                      getPriorityColor(task.priority)
                                    )} />
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <span className={cn(
                                    "text-xs capitalize",
                                    getStatusColor(task.status)
                                  )}>
                                    {task.status.replace('-', ' ')}
                                  </span>
                                  
                                  {task.dueDate && (
                                    <span className={cn(
                                      "text-xs flex items-center",
                                      isOverdue ? "text-red-500 dark:text-red-400" : "text-muted-foreground"
                                    )}>
                                      <Clock className="w-3 h-3 mr-1" />
                                      {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
} 