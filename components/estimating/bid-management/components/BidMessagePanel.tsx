/**
 * @fileoverview Enhanced Bid Message Panel Component - BuildingConnected Style
 * @version 3.1.0
 * @description Advanced threaded messaging system with BuildingConnected-style interface
 */

"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card"
import { Badge } from "../../../ui/badge"
import { Button } from "../../../ui/button"
import { Input } from "../../../ui/input"
import { Label } from "../../../ui/label"
import { Textarea } from "../../../ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select"
import { ScrollArea } from "../../../ui/scroll-area"
import { Separator } from "../../../ui/separator"
import { useToast } from "../../../ui/use-toast"
import {
  MessageSquare,
  Send,
  Reply,
  Forward,
  Search,
  Filter,
  Plus,
  Paperclip,
  Clock,
  Users,
  AlertCircle,
  CheckCircle,
  Star,
  Archive,
  Trash2,
  MoreHorizontal,
  AtSign,
  Hash,
  Phone,
  Video,
  Mail,
  Calendar,
  Building,
  UserCheck,
  Zap,
  ArrowRight,
  Eye,
  EyeOff,
  FileText,
  BarChart3,
  Download,
} from "lucide-react"
import { BidMessageThread, BidMessage, TeamMember } from "../types/bid-management"

interface BidMessagePanelProps {
  projectId: string
  packageId?: string
  className?: string
}

// Enhanced mock message threads with BuildingConnected-style data
const mockMessageThreads: BidMessageThread[] = [
  {
    id: "thread-001",
    projectId: "2525841",
    packageId: "pkg-001",
    subject: "Concrete Package - Specification Clarification",
    participants: [
      {
        id: "user-001",
        name: "Sarah Chen",
        email: "s.chen@hedrickbrothers.com",
        role: "Lead Estimator",
        department: "Estimating",
        isActive: true,
        avatar: "/avatars/sarah-chen.png",
        company: "Hedrick Brothers Construction",
      },
      {
        id: "user-002",
        name: "Mike Johnson",
        email: "m.johnson@aceconstructionco.com",
        role: "Project Manager",
        department: "External",
        isActive: true,
        avatar: "/avatars/mike-johnson.png",
        company: "Ace Construction Co.",
      },
      {
        id: "user-003",
        name: "Lisa Rodriguez",
        email: "l.rodriguez@steelworksllc.com",
        role: "Estimator",
        department: "External",
        isActive: true,
        avatar: "/avatars/lisa-rodriguez.png",
        company: "SteelWorks LLC",
      },
    ],
    messages: [
      {
        id: "msg-001",
        threadId: "thread-001",
        projectId: "2525841",
        packageId: "pkg-001",
        sender: {
          id: "user-002",
          name: "Mike Johnson",
          email: "m.johnson@aceconstructionco.com",
          role: "Project Manager",
          department: "External",
          isActive: true,
          avatar: "/avatars/mike-johnson.png",
          company: "Ace Construction Co.",
        },
        recipients: [
          {
            id: "user-001",
            name: "Sarah Chen",
            email: "s.chen@hedrickbrothers.com",
            role: "Lead Estimator",
            department: "Estimating",
            isActive: true,
            avatar: "/avatars/sarah-chen.png",
            company: "Hedrick Brothers Construction",
          },
        ],
        subject: "Concrete Package - Specification Clarification",
        content:
          "Hi Sarah, I have a question about the concrete specifications in Section 03 31 00. The drawings show different rebar spacing than what's specified in the written specs. Could you please clarify which one takes precedence? This affects our pricing significantly.",
        attachments: [
          {
            id: "att-001",
            name: "Rebar_Detail_Drawing.pdf",
            size: 2400000,
            type: "application/pdf",
            url: "/documents/rebar-detail.pdf",
            uploadedBy: "user-002",
            uploadedDate: "2025-01-28T09:25:00Z",
          },
        ],
        timestamp: "2025-01-28T09:30:00Z",
        isRead: true,
        priority: "high",
        status: "delivered",
        readBy: ["user-001"],
        reactions: [],
      },
      {
        id: "msg-002",
        threadId: "thread-001",
        projectId: "2525841",
        packageId: "pkg-001",
        sender: {
          id: "user-001",
          name: "Sarah Chen",
          email: "s.chen@hedrickbrothers.com",
          role: "Lead Estimator",
          department: "Estimating",
          isActive: true,
          avatar: "/avatars/sarah-chen.png",
          company: "Hedrick Brothers Construction",
        },
        recipients: [
          {
            id: "user-002",
            name: "Mike Johnson",
            email: "m.johnson@aceconstructionco.com",
            role: "Project Manager",
            department: "External",
            isActive: true,
            avatar: "/avatars/mike-johnson.png",
            company: "Ace Construction Co.",
          },
        ],
        subject: "Re: Concrete Package - Specification Clarification",
        content:
          "Hi Mike, great question! The drawings take precedence per the contract documents hierarchy outlined in Division 01. I'll send over an addendum clarifying this for all bidders within the next hour. Thanks for catching this discrepancy.",
        attachments: [],
        timestamp: "2025-01-28T10:15:00Z",
        isRead: true,
        priority: "normal",
        status: "delivered",
        readBy: ["user-002"],
        reactions: [{ userId: "user-002", type: "thumbs_up", timestamp: "2025-01-28T10:20:00Z" }],
      },
    ],
    lastMessage: "Hi Mike, great question! The drawings take precedence per the contract documents hierarchy...",
    lastActivity: "2025-01-28T10:15:00Z",
    isActive: true,
    messageCount: 2,
    unreadCount: 0,
    priority: "high",
    tags: ["specification", "clarification", "urgent"],
    status: "active",
  },
  {
    id: "thread-002",
    projectId: "2525841",
    packageId: "pkg-002",
    subject: "Steel Package - Shop Drawing Submittal Schedule",
    participants: [
      {
        id: "user-001",
        name: "Sarah Chen",
        email: "s.chen@hedrickbrothers.com",
        role: "Lead Estimator",
        department: "Estimating",
        isActive: true,
        avatar: "/avatars/sarah-chen.png",
        company: "Hedrick Brothers Construction",
      },
      {
        id: "user-003",
        name: "Lisa Rodriguez",
        email: "l.rodriguez@steelworksllc.com",
        role: "Estimator",
        department: "External",
        isActive: true,
        avatar: "/avatars/lisa-rodriguez.png",
        company: "SteelWorks LLC",
      },
    ],
    messages: [
      {
        id: "msg-003",
        threadId: "thread-002",
        projectId: "2525841",
        packageId: "pkg-002",
        sender: {
          id: "user-003",
          name: "Lisa Rodriguez",
          email: "l.rodriguez@steelworksllc.com",
          role: "Estimator",
          department: "External",
          isActive: true,
          avatar: "/avatars/lisa-rodriguez.png",
          company: "SteelWorks LLC",
        },
        recipients: [
          {
            id: "user-001",
            name: "Sarah Chen",
            email: "s.chen@hedrickbrothers.com",
            role: "Lead Estimator",
            department: "Estimating",
            isActive: true,
            avatar: "/avatars/sarah-chen.png",
            company: "Hedrick Brothers Construction",
          },
        ],
        subject: "Steel Package - Shop Drawing Submittal Schedule",
        content:
          "Sarah, we need to coordinate the shop drawing submittal schedule for the steel package. Our fabricator requires a 6-week lead time from approval to delivery. Can we schedule a call to discuss the timeline?",
        attachments: [
          {
            id: "att-002",
            name: "Steel_Submittal_Schedule.xlsx",
            size: 145000,
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            url: "/documents/steel-schedule.xlsx",
            uploadedBy: "user-003",
            uploadedDate: "2025-01-28T14:20:00Z",
          },
        ],
        timestamp: "2025-01-28T14:22:00Z",
        isRead: true,
        priority: "normal",
        status: "delivered",
        readBy: ["user-001"],
        reactions: [],
      },
    ],
    lastMessage: "Sarah, we need to coordinate the shop drawing submittal schedule for the steel package...",
    lastActivity: "2025-01-28T14:22:00Z",
    isActive: true,
    messageCount: 1,
    unreadCount: 1,
    priority: "normal",
    tags: ["schedule", "shop-drawings"],
    status: "pending-response",
  },
]

const BidMessagePanel: React.FC<BidMessagePanelProps> = ({ projectId, packageId, className = "" }) => {
  const { toast } = useToast()
  const [selectedThread, setSelectedThread] = useState<BidMessageThread | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [showComposer, setShowComposer] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [newSubject, setNewSubject] = useState("")
  const [newRecipients, setNewRecipients] = useState<string[]>([])
  const [replyMessage, setReplyMessage] = useState("")
  const [showThreadDetails, setShowThreadDetails] = useState(false)

  // Filter threads based on search and filters
  const filteredThreads = useMemo(() => {
    let filtered = mockMessageThreads.filter((thread) => {
      const matchesProject = thread.projectId === projectId
      const matchesPackage = !packageId || thread.packageId === packageId
      const matchesSearch =
        !searchQuery ||
        thread.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.participants.some((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesPriority = filterPriority === "all" || thread.priority === filterPriority
      const matchesStatus = filterStatus === "all" || thread.status === filterStatus

      return matchesProject && matchesPackage && matchesSearch && matchesPriority && matchesStatus
    })

    return filtered.sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime())
  }, [projectId, packageId, searchQuery, filterPriority, filterStatus])

  // Get unread count
  const unreadCount = useMemo(() => {
    return filteredThreads.reduce((sum, thread) => sum + thread.unreadCount, 0)
  }, [filteredThreads])

  // Get thread status color
  const getThreadStatusColor = (status: string) => {
    switch (status) {
      case "pending-response":
        return "text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-950 dark:border-orange-800"
      case "active":
        return "text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-950 dark:border-blue-800"
      case "resolved":
        return "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950 dark:border-green-800"
      case "archived":
        return "text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-800 dark:border-gray-600"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-800 dark:border-gray-600"
    }
  }

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "normal":
        return "bg-blue-500"
      case "low":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  // Get priority icon
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Zap className="h-3 w-3 text-red-500" />
      case "high":
        return <AlertCircle className="h-3 w-3 text-orange-500" />
      case "normal":
        return <Clock className="h-3 w-3 text-blue-500" />
      case "low":
        return <Clock className="h-3 w-3 text-gray-500" />
      default:
        return <Clock className="h-3 w-3 text-gray-500" />
    }
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)
    const diffDays = diffMs / (1000 * 60 * 60 * 24)

    if (diffHours < 1) {
      return "Just now"
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)}h ago`
    } else if (diffDays < 7) {
      return `${Math.floor(diffDays)}d ago`
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      })
    }
  }

  // Handle message actions
  const handleSendMessage = () => {
    if (!newMessage.trim() || !newSubject.trim()) return

    toast({
      title: "Message Sent",
      description: "Your message has been sent successfully.",
    })

    setNewMessage("")
    setNewSubject("")
    setNewRecipients([])
    setShowComposer(false)
  }

  const handleSendReply = () => {
    if (!replyMessage.trim()) return

    toast({
      title: "Reply Sent",
      description: "Your reply has been sent successfully.",
    })

    setReplyMessage("")
  }

  const handleMarkAsRead = (threadId: string) => {
    // Implementation for marking thread as read
    toast({
      title: "Marked as Read",
      description: "Thread marked as read.",
    })
  }

  const handleArchiveThread = (threadId: string) => {
    toast({
      title: "Thread Archived",
      description: "Thread has been archived.",
    })
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <Card className="h-[800px]">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Messages
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount} new
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowComposer(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-2 mt-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending-response">Pending Response</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="flex h-[680px]">
            {/* Thread List */}
            <div className="w-1/3 border-r border-gray-200 dark:border-gray-700">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-2">
                  {filteredThreads.map((thread) => (
                    <div
                      key={thread.id}
                      className={`p-4 rounded-lg cursor-pointer transition-all duration-200 border ${
                        selectedThread?.id === thread.id
                          ? "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-700 shadow-sm"
                          : "bg-card hover:bg-muted/50 border-transparent hover:border-border hover:shadow-sm"
                      }`}
                      onClick={() => setSelectedThread(thread)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {thread.priority && getPriorityIcon(thread.priority)}
                            <h4 className="font-semibold text-sm truncate">{thread.subject}</h4>
                          </div>
                          {thread.tags && thread.tags.length > 0 && (
                            <div className="flex gap-1 mb-2">
                              {thread.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0.5">
                                  {tag}
                                </Badge>
                              ))}
                              {thread.tags.length > 2 && (
                                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                                  +{thread.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          {thread.status && (
                            <Badge
                              variant="outline"
                              className={`text-xs px-2 py-1 ${getThreadStatusColor(thread.status)}`}
                            >
                              {thread.status.replace("-", " ")}
                            </Badge>
                          )}
                          {thread.unreadCount > 0 && (
                            <Badge
                              variant="destructive"
                              className="text-xs min-w-[20px] h-5 flex items-center justify-center"
                            >
                              {thread.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{thread.lastMessage}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex -space-x-1">
                            {thread.participants.slice(0, 3).map((participant) => (
                              <Avatar key={participant.id} className="h-6 w-6 border-2 border-background">
                                <AvatarImage src={participant.avatar} alt={participant.name} />
                                <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                                  {participant.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {thread.participants.length > 3 && (
                              <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                                <span className="text-xs text-muted-foreground">+{thread.participants.length - 3}</span>
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {thread.messageCount} message{thread.messageCount !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{formatTimestamp(thread.lastActivity)}</span>
                          {selectedThread?.id === thread.id && <ArrowRight className="h-3 w-3 text-blue-500" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Message View */}
            <div className="flex-1 flex flex-col">
              {selectedThread ? (
                <>
                  {/* Thread Header */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{selectedThread.subject}</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedThread.participants.length} participants • {selectedThread.messageCount} messages
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleMarkAsRead(selectedThread.id)}>
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleArchiveThread(selectedThread.id)}>
                          <Archive className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-6">
                      {selectedThread.messages.map((message, index) => (
                        <div key={message.id} className="flex gap-3">
                          <Avatar className="h-8 w-8 mt-1">
                            <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                            <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                              {message.sender.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-sm">{message.sender.name}</span>
                              {message.sender.company && (
                                <span className="text-xs text-muted-foreground">@ {message.sender.company}</span>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {formatTimestamp(message.timestamp)}
                              </span>
                              {message.priority !== "normal" && (
                                <Badge variant="outline" className="text-xs">
                                  {message.priority}
                                </Badge>
                              )}
                              {message.status && (
                                <div className="flex items-center gap-1">
                                  {message.status === "delivered" && <CheckCircle className="h-3 w-3 text-green-500" />}
                                  {message.status === "read" && <Eye className="h-3 w-3 text-blue-500" />}
                                  {message.status === "failed" && <AlertCircle className="h-3 w-3 text-red-500" />}
                                  <span className="text-xs text-muted-foreground capitalize">{message.status}</span>
                                </div>
                              )}
                            </div>

                            <div className="bg-card border border-border rounded-lg p-4 hover:shadow-sm transition-shadow">
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

                              {/* Attachments */}
                              {message.attachments && message.attachments.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-border">
                                  <div className="space-y-2">
                                    {message.attachments.map((attachment) => (
                                      <div
                                        key={attachment.id}
                                        className="flex items-center gap-3 p-2 bg-muted rounded-lg"
                                      >
                                        <div className="flex-shrink-0">
                                          {attachment.type.includes("pdf") ? (
                                            <FileText className="h-4 w-4 text-red-500" />
                                          ) : attachment.type.includes("image") ? (
                                            <Eye className="h-4 w-4 text-blue-500" />
                                          ) : attachment.type.includes("spreadsheet") ? (
                                            <BarChart3 className="h-4 w-4 text-green-500" />
                                          ) : (
                                            <Paperclip className="h-4 w-4 text-gray-500" />
                                          )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium truncate">{attachment.name}</p>
                                          <p className="text-xs text-muted-foreground">
                                            {formatFileSize(attachment.size)}
                                          </p>
                                        </div>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                          <Download className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Message Reactions */}
                              {message.reactions && message.reactions.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-border">
                                  <div className="flex gap-2">
                                    {message.reactions.map((reaction) => (
                                      <Badge
                                        key={`${reaction.userId}-${reaction.type}`}
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {reaction.type === "thumbs_up"
                                          ? "👍"
                                          : reaction.type === "thumbs_down"
                                          ? "👎"
                                          : reaction.type === "heart"
                                          ? "❤️"
                                          : reaction.type === "laugh"
                                          ? "😂"
                                          : reaction.type === "wow"
                                          ? "😮"
                                          : reaction.type === "sad"
                                          ? "😢"
                                          : reaction.type === "angry"
                                          ? "😠"
                                          : "👍"}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Message Actions */}
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                <Reply className="h-3 w-3 mr-1" />
                                Reply
                              </Button>
                              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                <Forward className="h-3 w-3 mr-1" />
                                Forward
                              </Button>
                              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                Star
                              </Button>
                              {message.readBy && message.readBy.length > 0 && (
                                <span className="text-xs text-muted-foreground">
                                  Read by {message.readBy.length} participant{message.readBy.length !== 1 ? "s" : ""}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Reply Composer */}
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Type your reply..."
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        className="min-h-[80px]"
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Paperclip className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <AtSign className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button onClick={handleSendReply} disabled={!replyMessage.trim()}>
                          <Send className="h-4 w-4 mr-2" />
                          Send Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Select a message thread to view</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Message Composer Dialog */}
      <Dialog open={showComposer} onOpenChange={setShowComposer}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="recipients">Recipients</Label>
              <Input id="recipients" placeholder="Enter email addresses or select team members" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Enter message subject"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="min-h-[120px] mt-1"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowComposer(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendMessage} disabled={!newMessage.trim() || !newSubject.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default BidMessagePanel
