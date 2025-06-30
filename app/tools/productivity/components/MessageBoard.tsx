"use client"

import React, { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { 
  Search, 
  MessageSquare, 
  Users, 
  Clock,
  ExternalLink,
  Filter,
  Plus
} from 'lucide-react'
import { MessageThread, User } from '@/types/productivity'
import { useProductivityStore } from '../store/useProductivityStore'
import { ThreadPanel } from './ThreadPanel'
import { cn } from '@/lib/utils'
import { formatDistanceToNow, parseISO } from 'date-fns'

interface MessageBoardProps {
  className?: string
  selectedThreadId?: string | null
  autoCreate?: boolean
}

export const MessageBoard = ({ 
  className, 
  selectedThreadId, 
  autoCreate 
}: MessageBoardProps) => {
  const { messageThreads, users, searchThreads } = useProductivityStore()
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterUser, setFilterUser] = useState<string>('all')
  const [filterFeature, setFilterFeature] = useState<string>('all')

  // Handle selectedThreadId prop
  useEffect(() => {
    if (selectedThreadId) {
      const thread = messageThreads.find(t => t.id === selectedThreadId)
      if (thread) {
        setSelectedThread(thread)
      }
    }
  }, [selectedThreadId, messageThreads])

  // Handle autoCreate prop
  useEffect(() => {
    if (autoCreate) {
      // For now, we'll just clear the selection to show the "create new" state
      setSelectedThread(null)
    }
  }, [autoCreate])

  const getUserById = (userId: string): User | undefined => {
    return users[userId]
  }

  const getUserInitials = (userId: string): string => {
    const user = getUserById(userId)
    if (!user) return userId.slice(0, 2).toUpperCase()
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const filteredThreads = useMemo(() => {
    let threads = searchQuery ? searchThreads(searchQuery) : messageThreads

    // Filter by user
    if (filterUser !== 'all') {
      threads = threads.filter(thread => 
        thread.participants.includes(filterUser)
      )
    }

    // Filter by linked feature
    if (filterFeature !== 'all') {
      threads = threads.filter(thread => thread.linkedTo?.type === filterFeature)
    }

    // Sort by most recent activity
    return threads.sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime())
  }, [messageThreads, searchQuery, filterUser, filterFeature, searchThreads])

  const getFeatureTypes = () => {
    const types = new Set(messageThreads.map(t => t.linkedTo?.type).filter(Boolean))
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

  const getLinkedEntityBadge = (thread: MessageThread) => {
    if (!thread.linkedTo) return null

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
      <Badge variant="outline" className={cn('text-xs', typeColors[thread.linkedTo.type])}>
        <ExternalLink className="w-2 h-2 mr-1" />
        {getFeatureDisplayName(thread.linkedTo.type)}
      </Badge>
    )
  }

  const getLastMessagePreview = (thread: MessageThread) => {
    if (thread.messages.length === 0) return 'No messages yet'
    const lastMessage = thread.messages[thread.messages.length - 1]
    return lastMessage.content.length > 60 
      ? lastMessage.content.substring(0, 60) + '...' 
      : lastMessage.content
  }

  const getUnreadCount = (thread: MessageThread) => {
    // For demo purposes, simulate unread count
    // In real app, this would be based on user's last read timestamp
    const unreadCount = Math.floor(Math.random() * 5)
    return unreadCount > 0 ? unreadCount : null
  }

  if (!messageThreads || messageThreads.length === 0) {
    return (
      <div className={cn('grid grid-cols-12 gap-6 h-full', className)}>
        <div className="col-span-4">
          <Card className="h-full">
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                No messages found
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-8">
          <Card className="h-full">
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                Select a message thread
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('grid grid-cols-12 gap-6 h-full', className)}>
      {/* Thread List */}
      <div className="col-span-4">
        <Card className="h-full flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Messages
              </CardTitle>
              <Badge variant="secondary">{filteredThreads.length}</Badge>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex space-x-2">
              <Select value={filterUser} onValueChange={setFilterUser}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
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
                <SelectTrigger className="flex-1">
                  <SelectValue />
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
          </CardHeader>

          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full">
              <div className="space-y-1 p-4">
                {filteredThreads.map((thread) => {
                  const isSelected = selectedThread?.id === thread.id
                  const unreadCount = getUnreadCount(thread)
                  const lastMessageTime = thread.messages.length > 0 
                    ? thread.messages[thread.messages.length - 1].createdAt 
                    : thread.createdAt

                  return (
                    <div
                      key={thread.id}
                      className={cn(
                        'p-3 rounded-lg cursor-pointer transition-all duration-200 border',
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800 border-transparent'
                      )}
                      onClick={() => setSelectedThread(thread)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className={cn(
                          'text-sm font-medium line-clamp-2',
                          isSelected 
                            ? 'text-blue-900 dark:text-blue-100' 
                            : 'text-gray-900 dark:text-gray-100'
                        )}>
                          {thread.title}
                        </h4>
                        {unreadCount && (
                          <Badge variant="destructive" className="ml-2 px-1.5 py-0.5 text-xs">
                            {unreadCount}
                          </Badge>
                        )}
                      </div>

                      {getLinkedEntityBadge(thread)}

                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {getLastMessagePreview(thread)}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3 text-muted-foreground" />
                          <div className="flex -space-x-1">
                            {thread.participants.slice(0, 3).map((participantId) => (
                              <Avatar key={participantId} className="w-4 h-4 border border-background">
                                <AvatarFallback className="text-[8px]">
                                  {getUserInitials(participantId)}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {thread.participants.length > 3 && (
                              <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 border border-background flex items-center justify-center">
                                <span className="text-[8px] text-muted-foreground">
                                  +{thread.participants.length - 3}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDistanceToNow(parseISO(lastMessageTime), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                  )
                })}

                {filteredThreads.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">No message threads found</p>
                    {searchQuery && (
                      <p className="text-xs mt-1">Try adjusting your search or filters</p>
                    )}
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Thread Panel */}
      <div className="col-span-8">
        <ThreadPanel thread={selectedThread || undefined} />
      </div>
    </div>
  )
} 