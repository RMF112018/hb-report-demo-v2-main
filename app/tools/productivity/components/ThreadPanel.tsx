"use client"

import React, { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  ExternalLink,
  Smile,
  Send,
  Clock,
  FileText,
  AlertTriangle,
  TrendingUp,
  Zap,
  Calendar,
  DollarSign,
  Shield,
  CheckSquare,
} from "lucide-react"
import { MessageThread, Message, Task, Reaction, User } from "@/types/productivity"
import { useProductivityStore } from "@/components/productivity/store/useProductivityStore"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

interface ThreadPanelProps {
  thread?: MessageThread
  task?: Task
  className?: string
}

export const ThreadPanel = ({ thread, task, className }: ThreadPanelProps) => {
  const { users, addMessage, addTaskComment, addReaction, removeReaction } = useProductivityStore()
  const [newMessage, setNewMessage] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const messages = thread?.messages || task?.comments || []
  const threadId = thread?.id || task?.id || ""
  const isTaskThread = !!task

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getUserById = (userId: string | undefined): User | undefined => {
    if (!userId) return undefined
    return users[userId]
  }

  const getUserInitials = (userId: string | undefined): string => {
    if (!userId) return "UN" // Default initials for undefined/null userId
    const user = getUserById(userId)
    if (!user) return userId.slice(0, 2).toUpperCase()
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatSafeDate = (dateValue: any): string => {
    if (!dateValue) return "just now"

    try {
      const date = new Date(dateValue)
      if (isNaN(date.getTime())) {
        return "just now"
      }
      return formatDistanceToNow(date, { addSuffix: true })
    } catch (error) {
      return "just now"
    }
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !threadId) return

    if (isTaskThread && task) {
      const commentData = {
        content: newMessage.trim(),
        author: "u01", // Current user - should be dynamic
      }
      addTaskComment(task.id, commentData)
    } else if (thread) {
      const messageData = {
        threadId,
        sender: "u01", // Current user - should be dynamic
        content: newMessage.trim(),
        reactions: [],
      }
      addMessage(thread.id, messageData)
    }

    setNewMessage("")
  }

  const handleReaction = (messageId: string, emoji: string) => {
    const currentUserId = "u01" // Should be dynamic
    const message = messages.find((m) => m.id === messageId)
    const existingReaction =
      message && "reactions" in message
        ? message.reactions?.find((r: any) => r.userId === currentUserId && r.emoji === emoji)
        : undefined

    if (existingReaction) {
      removeReaction(messageId, currentUserId, emoji)
    } else {
      addReaction(messageId, { emoji, userId: currentUserId, timestamp: new Date() })
    }
    setShowEmojiPicker(null)
  }

  const getLinkedEntityBadge = () => {
    const linkedTo = thread?.linkedTo || task?.linkedTo
    if (!linkedTo) return null

    const typeColors = {
      "daily-log": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      forecast: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      procurement: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      schedule: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      safety: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      quality: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      permit: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
      budget: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
      other: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
    }

    return (
      <Badge variant="outline" className={cn("mb-4", typeColors[linkedTo.type as keyof typeof typeColors])}>
        <ExternalLink className="w-3 h-3 mr-1" />
        {linkedTo.label}
      </Badge>
    )
  }

  const commonEmojis = ["👍", "❤️", "😂", "😮", "😢", "😡"]

  if (!thread && !task) {
    return (
      <Card className={cn("h-full", className)}>
        <CardContent className="flex items-center justify-center h-full text-muted-foreground">
          Select a thread or task to view the conversation
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardContent className="flex-1 flex flex-col p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {thread?.title || task?.title}
          </h3>
          {getLinkedEntityBadge()}

          {/* Participants */}
          {thread && (
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-sm text-muted-foreground">Participants:</span>
              <div className="flex -space-x-2">
                {thread.participants.map((participantId) => {
                  const user = getUserById(participantId)
                  return (
                    <Avatar key={participantId} className="w-6 h-6 border-2 border-background">
                      <AvatarFallback className="text-xs">{getUserInitials(participantId)}</AvatarFallback>
                    </Avatar>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Messages */}
        <ScrollArea className="flex-1 my-4">
          <div className="space-y-4">
            {messages.map((message) => {
              // Type guard to check if it's a Message or TaskComment
              const isMessage = "sender" in message
              const sender = isMessage ? message.sender : message.author
              const user = getUserById(sender)
              const reactions = isMessage ? message.reactions || [] : []
              const timestamp = isMessage ? message.timestamp : message.timestamp

              return (
                <div key={message.id} className="group">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-sm">{getUserInitials(sender)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {user?.name || `User ${sender}`}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatSafeDate(timestamp)}
                        </span>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 relative group-hover:bg-gray-100 dark:group-hover:bg-gray-700 transition-colors">
                        <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                          {message.content}
                        </p>

                        {/* Reaction button - only show for Messages */}
                        {isMessage && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
                            onClick={() => setShowEmojiPicker(showEmojiPicker === message.id ? null : message.id)}
                          >
                            <Smile className="w-3 h-3" />
                          </Button>
                        )}

                        {/* Emoji picker - only show for Messages */}
                        {isMessage && showEmojiPicker === message.id && (
                          <div className="absolute right-0 top-8 z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 shadow-lg">
                            <div className="flex space-x-1">
                              {commonEmojis.map((emoji) => (
                                <Button
                                  key={emoji}
                                  variant="ghost"
                                  size="sm"
                                  className="p-1 h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() => handleReaction(message.id, emoji)}
                                >
                                  {emoji}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Reactions display - only show for Messages */}
                      {isMessage && reactions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {Object.entries(
                            reactions.reduce((acc: { [emoji: string]: string[] }, reaction: any) => {
                              if (!acc[reaction.emoji]) {
                                acc[reaction.emoji] = []
                              }
                              acc[reaction.emoji].push(reaction.userId)
                              return acc
                            }, {} as { [emoji: string]: string[] })
                          ).map(([emoji, userIds]) => (
                            <Button
                              key={emoji}
                              variant="outline"
                              size="sm"
                              className="h-6 px-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => handleReaction(message.id, emoji)}
                            >
                              {emoji} {(userIds as string[]).length}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <Separator />

        {/* Message input */}
        <div className="mt-4 flex items-end space-x-2">
          <div className="flex-1">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={isTaskThread ? "Add a comment..." : "Type your message..."}
              className="min-h-[80px] resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
            />
          </div>
          <Button onClick={handleSendMessage} disabled={!newMessage.trim()} className="mb-2">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
