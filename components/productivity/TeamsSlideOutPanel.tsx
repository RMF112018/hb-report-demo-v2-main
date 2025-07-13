"use client"

/**
 * @fileoverview Microsoft Teams Integration Slide-Out Panel
 * @module TeamsSlideOutPanel
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-29
 *
 * Modern Microsoft Teams integration with professional UI:
 * - Full-height responsive Teams interface
 * - Proper dark theme compatibility
 * - Optimized scrolling and space management
 * - Professional Teams styling and UX
 */

import React, { useState, useCallback, useMemo, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  MessageSquare,
  Send,
  Plus,
  Users,
  Calendar,
  CheckSquare,
  Video,
  Phone,
  AtSign,
  Hash,
  Paperclip,
  Smile,
  MoreHorizontal,
  Star,
  Reply,
  Edit3,
  Trash2,
  RefreshCw,
  AlertCircle,
  ChevronDown,
  Settings,
  Bell,
  Search,
  Filter,
  Archive,
  Flag,
  Clock,
  CheckCircle,
  Circle,
  UserPlus,
  Share,
  Eye,
  EyeOff,
  PinIcon,
  Zap,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  FileText,
  Image,
  Link,
  MapPin,
  Calendar as CalendarIcon,
  User,
  Mail,
  Building,
  Briefcase,
  GraduationCap,
} from "lucide-react"

// Import Teams integration hooks
import { useTeams } from "@/hooks/useTeamsIntegration"
import { useTeamMembers } from "@/hooks/useTeamsIntegration"
import { useTeamChannels } from "@/hooks/useTeamsIntegration"
import { useChannelMessages } from "@/hooks/useTeamsIntegration"
import { usePlannerPlans } from "@/hooks/useTeamsIntegration"
import { usePlannerTasks } from "@/hooks/useTeamsIntegration"
import { useCalendarEvents } from "@/hooks/useTeamsIntegration"
import { Team, TeamMember, Channel, ChatMessage, PlannerTask } from "@/lib/msgraph"

// Types
interface TeamsSlideOutPanelProps {
  isOpen: boolean
  onClose: () => void
  projectId?: string
  projectName?: string
  userRole?: string
  currentUser?: any
}

interface MessageComposerProps {
  onSendMessage: (content: string, mentions?: string[]) => void
  teamMembers: TeamMember[]
  disabled?: boolean
  placeholder?: string
}

// Modern Microsoft Teams Message Composer
const MessageComposer: React.FC<MessageComposerProps> = ({
  onSendMessage,
  teamMembers,
  disabled = false,
  placeholder = "Type a message...",
}) => {
  const [message, setMessage] = useState("")
  const [mentions, setMentions] = useState<string[]>([])
  const [showMentions, setShowMentions] = useState(false)
  const [mentionQuery, setMentionQuery] = useState("")
  const [showEmoji, setShowEmoji] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const filteredMembers = useMemo(() => {
    if (!mentionQuery) return teamMembers
    return teamMembers.filter((member) => member.displayName.toLowerCase().includes(mentionQuery.toLowerCase()))
  }, [teamMembers, mentionQuery])

  const handleMessageChange = (value: string) => {
    setMessage(value)

    // Check for @mentions
    const atIndex = value.lastIndexOf("@")
    if (atIndex !== -1) {
      const query = value.substring(atIndex + 1)
      if (query.length >= 0) {
        setMentionQuery(query)
        setShowMentions(true)
      }
    } else {
      setShowMentions(false)
      setMentionQuery("")
    }
  }

  const handleMentionSelect = (member: TeamMember) => {
    const atIndex = message.lastIndexOf("@")
    if (atIndex !== -1) {
      const newMessage = message.substring(0, atIndex) + `@${member.displayName} `
      setMessage(newMessage)
      setMentions([...mentions, member.id])
      setShowMentions(false)
      setMentionQuery("")
      textareaRef.current?.focus()
    }
  }

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim(), mentions)
      setMessage("")
      setMentions([])
      setShowMentions(false)
      setMentionQuery("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex-shrink-0 relative border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      {/* Mentions dropdown */}
      {showMentions && filteredMembers.length > 0 && (
        <div className="absolute bottom-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-t-lg shadow-lg max-h-40 overflow-y-auto z-50">
          {filteredMembers.map((member) => (
            <button
              key={member.id}
              onClick={() => handleMentionSelect(member)}
              className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs bg-[#6264A7] text-white">
                  {member.displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{member.displayName}</div>
                <div className="text-xs text-gray-500 truncate">{member.email}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Message composer */}
      <div className="flex items-end gap-2 p-3">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => handleMessageChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className="min-h-[36px] max-h-24 resize-none border-gray-300 dark:border-gray-600 rounded text-sm focus:ring-1 focus:ring-[#6264A7] focus:border-transparent pr-16"
          />

          {/* Formatting toolbar */}
          <div className="absolute right-1 bottom-1 flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEmoji(!showEmoji)}
              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <Smile className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <Paperclip className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          size="sm"
          className="h-9 px-3 bg-[#6264A7] hover:bg-[#585A99] text-white rounded text-sm"
        >
          <Send className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}

// Modern Microsoft Teams Message Thread
const MessageThread: React.FC<{
  messages: ChatMessage[]
  currentUser: any
  teamMembers: TeamMember[]
}> = ({ messages, currentUser, teamMembers }) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  const getMemberName = (fromId: string) => {
    const member = teamMembers.find((m) => m.id === fromId)
    return member?.displayName || "Unknown User"
  }

  const getMessagePriority = (message: ChatMessage) => {
    if (message.body?.content?.includes("🚨") || message.body?.content?.includes("urgent")) {
      return "high"
    }
    if (message.body?.content?.includes("⚠️") || message.body?.content?.includes("warning")) {
      return "medium"
    }
    return "normal"
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <MessageSquare className="h-12 w-12 mx-auto text-gray-300" />
          <p className="text-gray-500">No messages yet</p>
          <p className="text-sm text-gray-400">Start the conversation!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="space-y-1 p-3">
          {messages.map((message, index) => {
            const isCurrentUser = message.from?.user?.id === currentUser?.id
            const previousMessage = index > 0 ? messages[index - 1] : null
            const isSameSender = previousMessage?.from?.user?.id === message.from?.user?.id
            const timeDiff = previousMessage
              ? new Date(message.createdDateTime).getTime() - new Date(previousMessage.createdDateTime).getTime()
              : 0
            const showAvatar = !isSameSender || timeDiff > 300000 // 5 minutes

            const priority = getMessagePriority(message)
            const memberName = getMemberName(message.from?.user?.id || "")

            return (
              <div key={message.id} className={cn("group", showAvatar ? "mt-3" : "mt-1")}>
                <div className="flex items-start gap-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded p-2 -mx-1">
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-8">
                    {showAvatar && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-[#6264A7] text-white">
                          {memberName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>

                  {/* Message content */}
                  <div className="flex-1 min-w-0">
                    {/* Header with name and time */}
                    {showAvatar && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm text-gray-900 dark:text-gray-100">{memberName}</span>
                        <span className="text-xs text-gray-500">{formatTime(message.createdDateTime)}</span>
                        {priority === "high" && (
                          <Badge variant="destructive" className="text-xs px-1 py-0 h-4">
                            high
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Message body */}
                    <div className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
                      {message.body?.content || "Message content not available"}
                    </div>

                    {/* Message actions (on hover) */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-2 flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        <Reply className="h-3 w-3 mr-1" />
                        Reply
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
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

// Quick Task Creator
const QuickTaskCreator: React.FC<{
  onCreateTask: (title: string, assigneeId?: string) => void
  teamMembers: TeamMember[]
}> = ({ onCreateTask, teamMembers }) => {
  const [taskTitle, setTaskTitle] = useState("")
  const [assigneeId, setAssigneeId] = useState<string>("")

  const handleCreateTask = async () => {
    if (taskTitle.trim()) {
      await onCreateTask(taskTitle.trim(), assigneeId || undefined)
      setTaskTitle("")
      setAssigneeId("")
    }
  }

  return (
    <Card className="border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Quick Task</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="Enter task title..."
          className="text-sm"
        />

        <Select value={assigneeId} onValueChange={setAssigneeId}>
          <SelectTrigger className="text-sm">
            <SelectValue placeholder="Assign to..." />
          </SelectTrigger>
          <SelectContent>
            {teamMembers.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                <div className="flex items-center gap-2">
                  <Avatar className="h-4 w-4">
                    <AvatarFallback className="text-xs bg-[#6264A7] text-white">
                      {member.displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{member.displayName}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={handleCreateTask}
          disabled={!taskTitle.trim()}
          size="sm"
          className="w-full bg-[#6264A7] hover:bg-[#585A99] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Task
        </Button>
      </CardContent>
    </Card>
  )
}

// Main Teams Panel Component
export const TeamsSlideOutPanel: React.FC<TeamsSlideOutPanelProps> = ({
  isOpen,
  onClose,
  projectId,
  projectName = "Project Team",
  userRole = "team-member",
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState("messages")
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)

  // Teams integration hooks
  const { teams, loading: teamsLoading, error: teamsError } = useTeams()
  const { members, loading: membersLoading } = useTeamMembers(selectedTeam?.id || null)
  const { channels, loading: channelsLoading } = useTeamChannels(selectedTeam?.id || null)
  const {
    messages,
    loading: messagesLoading,
    sendMessage,
    sending,
  } = useChannelMessages(selectedTeam?.id || null, selectedChannel?.id || null)
  const { plans, loading: plansLoading } = usePlannerPlans(selectedTeam?.id || null)
  const { tasks, createTask } = usePlannerTasks(plans.length > 0 ? plans[0].id : null)
  const { events, createEvent } = useCalendarEvents()

  // Auto-select first team and channel
  useEffect(() => {
    if (teams.length > 0 && !selectedTeam) {
      const projectTeam =
        teams.find(
          (team) =>
            team.displayName.toLowerCase().includes(projectName.toLowerCase()) ||
            team.displayName.toLowerCase().includes("project")
        ) || teams[0]
      setSelectedTeam(projectTeam)
    }
  }, [teams, selectedTeam, projectName])

  useEffect(() => {
    if (channels.length > 0 && !selectedChannel) {
      const generalChannel = channels.find((ch) => ch.displayName.toLowerCase() === "general") || channels[0]
      setSelectedChannel(generalChannel)
    }
  }, [channels, selectedChannel])

  const handleSendMessage = useCallback(
    async (content: string, mentions?: string[]) => {
      const success = await sendMessage(content, "normal")
      if (success) {
        console.log("Message sent:", content)
      }
    },
    [sendMessage]
  )

  const handleCreateTask = useCallback(
    async (title: string, assigneeId?: string) => {
      if (!selectedTeam) return
      const newTask = await createTask(title, undefined, assigneeId ? [assigneeId] : undefined)
      if (newTask) {
        console.log("Task created:", newTask)
      }
    },
    [selectedTeam, createTask]
  )

  const isLoading = teamsLoading || membersLoading || channelsLoading || plansLoading

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="flex flex-col h-full p-0 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 w-[480px] max-w-[90vw] z-[140]"
      >
        {/* Clean Header */}
        <div className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          {/* Top header row */}
          <div className="flex items-center gap-2 px-4 py-3">
            <MessageSquare className="h-4 w-4 text-[#6264A7]" />
            <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">Microsoft Teams</span>
          </div>

          {/* Team and Channel Selection */}
          <div className="px-4 pb-3 space-y-2">
            <Select
              value={selectedTeam?.id || ""}
              onValueChange={(teamId) => {
                const team = teams.find((t) => t.id === teamId)
                setSelectedTeam(team || null)
                setSelectedChannel(null)
              }}
            >
              <SelectTrigger className="w-full h-8 bg-transparent border-gray-300 dark:border-gray-600 text-xs hover:bg-gray-50 dark:hover:bg-gray-800">
                <SelectValue placeholder="Select team..." />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    <span className="text-xs">{team.displayName}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedChannel?.id || ""}
              onValueChange={(channelId) => {
                const channel = channels.find((c) => c.id === channelId)
                setSelectedChannel(channel || null)
              }}
            >
              <SelectTrigger className="w-full h-8 bg-transparent border-gray-300 dark:border-gray-600 text-xs hover:bg-gray-50 dark:hover:bg-gray-800">
                <SelectValue placeholder="Select channel..." />
              </SelectTrigger>
              <SelectContent>
                {channels.map((channel) => (
                  <SelectItem key={channel.id} value={channel.id}>
                    <span className="text-xs">{channel.displayName}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-3">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-[#6264A7]" />
              <p className="text-sm text-gray-600">Loading Teams data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {teamsError && (
          <div className="flex-1 p-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{teamsError}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Main Content */}
        {!isLoading && !teamsError && selectedTeam && selectedChannel && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tab Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
                <TabsList className="grid w-full grid-cols-4 h-10 bg-gray-50 dark:bg-gray-800 rounded-none">
                  <TabsTrigger
                    value="messages"
                    className="text-xs font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-[#6264A7] data-[state=active]:border-b-2 data-[state=active]:border-[#6264A7] rounded-none"
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Messages
                  </TabsTrigger>
                  <TabsTrigger
                    value="tasks"
                    className="text-xs font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-[#6264A7] data-[state=active]:border-b-2 data-[state=active]:border-[#6264A7] rounded-none"
                  >
                    <CheckSquare className="h-4 w-4 mr-1" />
                    Tasks
                  </TabsTrigger>
                  <TabsTrigger
                    value="calendar"
                    className="text-xs font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-[#6264A7] data-[state=active]:border-b-2 data-[state=active]:border-[#6264A7] rounded-none"
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    Calendar
                  </TabsTrigger>
                  <TabsTrigger
                    value="team"
                    className="text-xs font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-[#6264A7] data-[state=active]:border-b-2 data-[state=active]:border-[#6264A7] rounded-none"
                  >
                    <Users className="h-4 w-4 mr-1" />
                    Team
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Messages Tab */}
              <TabsContent
                value="messages"
                className="flex-1 flex flex-col m-0 bg-white dark:bg-gray-900 overflow-hidden"
              >
                <MessageThread messages={messages} currentUser={currentUser} teamMembers={members} />
                <MessageComposer
                  onSendMessage={handleSendMessage}
                  teamMembers={members}
                  disabled={sending}
                  placeholder={`Message #${selectedChannel.displayName}`}
                />
              </TabsContent>

              {/* Tasks Tab */}
              <TabsContent value="tasks" className="flex-1 m-0 bg-white dark:bg-gray-900 overflow-hidden">
                <div className="h-full overflow-y-auto p-3 space-y-3">
                  <QuickTaskCreator onCreateTask={handleCreateTask} teamMembers={members} />

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Recent Tasks</h4>
                    {tasks.length > 0 ? (
                      <div className="space-y-2">
                        {tasks.slice(0, 5).map((task) => (
                          <div
                            key={task.id}
                            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                          >
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <div className="flex-1">
                              <div className="text-sm font-medium">{task.title}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                {task.assignments && Object.keys(task.assignments).length > 0 && (
                                  <span>Assigned to {Object.keys(task.assignments).length} member(s)</span>
                                )}
                              </div>
                            </div>
                            <Badge variant={task.percentComplete === 100 ? "default" : "secondary"} className="text-xs">
                              {task.percentComplete}%
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <CheckSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No tasks yet. Create your first task above!</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Calendar Tab */}
              <TabsContent value="calendar" className="flex-1 m-0 bg-white dark:bg-gray-900 overflow-hidden">
                <div className="h-full overflow-y-auto p-3 space-y-3">
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Calendar integration</p>
                    <p className="text-xs">Schedule meetings and track project milestones</p>
                  </div>
                </div>
              </TabsContent>

              {/* Team Tab */}
              <TabsContent value="team" className="flex-1 m-0 bg-white dark:bg-gray-900 overflow-hidden">
                <div className="h-full overflow-y-auto p-3 space-y-3">
                  <div>
                    <h4 className="text-sm font-medium mb-3">Team Members ({members.length})</h4>
                    <div className="space-y-2">
                      {members.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs bg-[#6264A7] text-white">
                              {member.displayName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="text-sm font-medium">{member.displayName}</div>
                            <div className="text-xs text-gray-500">{member.email}</div>
                          </div>
                          {member.roles.includes("owner") && (
                            <Badge variant="outline" className="text-xs">
                              Owner
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
