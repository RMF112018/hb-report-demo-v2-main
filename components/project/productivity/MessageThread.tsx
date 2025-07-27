"use client"

/**
 * @fileoverview Message Thread Component
 * @module MessageThread
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 */

import React, { useState, useMemo, useCallback, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  MessageSquare,
  Send,
  Search,
  Users,
  Clock,
  Plus,
  MoreHorizontal,
  Pin,
  Archive,
  Star,
  Reply,
  Edit,
  Trash2,
  Paperclip,
  Smile,
} from "lucide-react"
import { MessageThread as MessageThreadType, Message, mockUsers } from "./hooks/useProductivityData"
import { cn } from "@/lib/utils"

interface MessageThreadProps {
  threads: MessageThreadType[]
  onSendMessage: (threadId: string, content: string) => void
  currentUser?: any
  className?: string
}

// Message item component
const MessageItem: React.FC<{
  message: Message
  isCurrentUser: boolean
  showAvatar?: boolean
}> = ({ message, isCurrentUser, showAvatar = true }) => {
  const user = mockUsers[message.sender as keyof typeof mockUsers]
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content)

  const formatTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return "just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return timestamp.toLocaleDateString()
  }

  return (
    <div className={cn("flex gap-3 group", isCurrentUser && "flex-row-reverse")}>
      {showAvatar && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarFallback className="text-xs">{user?.initials || "U"}</AvatarFallback>
        </Avatar>
      )}

      <div className={cn("flex-1 min-w-0", isCurrentUser && "flex items-end flex-col")}>
        {showAvatar && (
          <div className={cn("flex items-center gap-2 mb-1", isCurrentUser && "flex-row-reverse")}>
            <span className="text-xs font-medium">{user?.name || "Unknown User"}</span>
            <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
          </div>
        )}

        <div
          className={cn(
            "rounded-lg p-3 max-w-[85%] text-sm",
            isCurrentUser ? "bg-blue-600 text-white" : "bg-muted",
            !showAvatar && "mt-1"
          )}
        >
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[60px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) {
                    setIsEditing(false)
                  }
                  if (e.key === "Escape") {
                    setEditContent(message.content)
                    setIsEditing(false)
                  }
                }}
              />
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditContent(message.content)
                    setIsEditing(false)
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="whitespace-pre-wrap break-words">{message.content}</div>
          )}
        </div>

        {/* Message actions */}
        <div
          className={cn(
            "flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity",
            isCurrentUser && "flex-row-reverse"
          )}
        >
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
            <Reply className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
            <Star className="h-3 w-3" />
          </Button>
          {isCurrentUser && (
            <>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setIsEditing(true)}>
                <Edit className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                <Trash2 className="h-3 w-3" />
              </Button>
            </>
          )}
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Thread view component
const ThreadView: React.FC<{
  thread: MessageThreadType
  onSendMessage: (threadId: string, content: string) => void
  onBack: () => void
  currentUser?: any
}> = ({ thread, onSendMessage, onBack, currentUser }) => {
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [thread.messages])

  const handleSendMessage = useCallback(() => {
    if (newMessage.trim()) {
      onSendMessage(thread.id, newMessage.trim())
      setNewMessage("")
      setIsTyping(false)
    }
  }, [newMessage, onSendMessage, thread.id])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSendMessage()
      }
    },
    [handleSendMessage]
  )

  const groupedMessages = useMemo(() => {
    const groups = []
    let currentGroup = null

    for (const message of thread.messages) {
      if (
        !currentGroup ||
        currentGroup.sender !== message.sender ||
        message.timestamp.getTime() - currentGroup.lastTimestamp > 5 * 60 * 1000
      ) {
        currentGroup = {
          sender: message.sender,
          messages: [message],
          lastTimestamp: message.timestamp.getTime(),
        }
        groups.push(currentGroup)
      } else {
        currentGroup.messages.push(message)
        currentGroup.lastTimestamp = message.timestamp.getTime()
      }
    }

    return groups
  }, [thread.messages])

  return (
    <div className="flex flex-col h-full">
      {/* Thread header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            ←
          </Button>
          <div>
            <h3 className="font-semibold">{thread.title}</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              {thread.participants.length} participants
              {thread.priority && (
                <Badge variant={thread.priority === "high" ? "destructive" : "secondary"} className="text-xs">
                  {thread.priority}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Pin className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Archive className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-4 py-4">
          {groupedMessages.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-2">
              {group.messages.map((message, messageIndex) => (
                <MessageItem
                  key={message.id}
                  message={message}
                  isCurrentUser={message.sender === (currentUser?.id || "current-user")}
                  showAvatar={messageIndex === 0}
                />
              ))}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message input */}
      <div className="p-4 border-t">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value)
                setIsTyping(e.target.value.length > 0)
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="min-h-[40px] max-h-[120px] resize-none pr-20"
              rows={1}
            />
            <div className="absolute right-2 top-2 flex items-center gap-1">
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                <Paperclip className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                <Smile className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <Button onClick={handleSendMessage} disabled={!newMessage.trim()} className="px-3">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {isTyping && (
          <div className="text-xs text-muted-foreground mt-1">Press Enter to send, Shift+Enter for new line</div>
        )}
      </div>
    </div>
  )
}

// Thread list component
const ThreadList: React.FC<{
  threads: MessageThreadType[]
  onSelectThread: (thread: MessageThreadType) => void
  searchTerm: string
  onSearchChange: (term: string) => void
}> = ({ threads, onSelectThread, searchTerm, onSearchChange }) => {
  const filteredThreads = useMemo(() => {
    if (!searchTerm.trim()) return threads
    return threads.filter(
      (thread) =>
        thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        thread.messages.some((msg) => msg.content.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [threads, searchTerm])

  const sortedThreads = useMemo(() => {
    return [...filteredThreads].sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime())
  }, [filteredThreads])

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Thread list */}
      <ScrollArea className="flex-1">
        <div className="divide-y">
          {sortedThreads.map((thread) => {
            const lastMessage = thread.messages[thread.messages.length - 1]
            const lastMessageTime = lastMessage ? lastMessage.timestamp : thread.createdAt

            return (
              <div
                key={thread.id}
                className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => onSelectThread(thread)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex -space-x-1">
                    {thread.participants.slice(0, 2).map((participantId, index) => {
                      const participant = mockUsers[participantId as keyof typeof mockUsers]
                      return (
                        <Avatar key={participantId} className="w-8 h-8 border-2 border-background">
                          <AvatarFallback className="text-xs">{participant?.initials || "U"}</AvatarFallback>
                        </Avatar>
                      )
                    })}
                    {thread.participants.length > 2 && (
                      <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                        <span className="text-xs font-medium">+{thread.participants.length - 2}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm truncate">{thread.title}</h4>
                      <div className="flex items-center gap-2">
                        {thread.priority && (
                          <Badge variant={thread.priority === "high" ? "destructive" : "secondary"} className="text-xs">
                            {thread.priority}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {lastMessageTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>

                    {lastMessage && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {mockUsers[lastMessage.sender as keyof typeof mockUsers]?.name || "Unknown"}:
                        </span>
                        <p className="text-xs text-muted-foreground truncate flex-1">{lastMessage.content}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {thread.messages.length} messages
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />
                        {thread.participants.length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}

// Main MessageThread component
const MessageThread: React.FC<MessageThreadProps> = ({ threads, onSendMessage, currentUser, className = "" }) => {
  const [selectedThread, setSelectedThread] = useState<MessageThreadType | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const handleSelectThread = useCallback((thread: MessageThreadType) => {
    setSelectedThread(thread)
  }, [])

  const handleBackToList = useCallback(() => {
    setSelectedThread(null)
  }, [])

  const stats = useMemo(() => {
    const totalMessages = threads.reduce((acc, thread) => acc + thread.messages.length, 0)
    const activeThreads = threads.filter(
      (thread) => thread.lastActivity > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ).length

    return { totalThreads: threads.length, totalMessages, activeThreads }
  }, [threads])

  return (
    <div className={cn("h-full flex flex-col", className)}>
      {selectedThread ? (
        <ThreadView
          thread={selectedThread}
          onSendMessage={onSendMessage}
          onBack={handleBackToList}
          currentUser={currentUser}
        />
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <h2 className="font-semibold">Messages</h2>
              <Badge variant="secondary">{stats.totalThreads} threads</Badge>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Thread
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 p-4 border-b">
            <div className="text-center">
              <div className="text-lg font-bold">{stats.totalThreads}</div>
              <div className="text-xs text-muted-foreground">Total Threads</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{stats.totalMessages}</div>
              <div className="text-xs text-muted-foreground">Messages</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{stats.activeThreads}</div>
              <div className="text-xs text-muted-foreground">Active Today</div>
            </div>
          </div>

          {/* Thread List */}
          <ThreadList
            threads={threads}
            onSelectThread={handleSelectThread}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </>
      )}
    </div>
  )
}

export default MessageThread
