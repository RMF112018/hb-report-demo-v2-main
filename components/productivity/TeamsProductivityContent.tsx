"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  MessageSquare,
  Users,
  Calendar,
  CheckSquare,
  Plus,
  Send,
  RefreshCw,
  ExternalLink,
  User,
  Clock,
  AlertTriangle,
  CheckCircle,
  Star,
  Settings,
  Search,
  Filter,
  Video,
  Phone,
  Paperclip,
  Smile,
  MoreHorizontal,
  Hash,
  Bell,
  Archive,
  Edit3,
  Trash2,
  PlayCircle,
  PauseCircle,
  Download,
  Upload,
  Link,
  Flag,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTeamsProductivity, useTeamsChannel, usePlannerTasks } from "@/hooks/useTeamsIntegration"

// Import productivity content components
import PlannerTasksContent from "./PlannerTasksContent"
import CalendarIntegrationContent from "./CalendarIntegrationContent"
import TeamManagementContent from "./TeamManagementContent"

interface TeamsProductivityContentProps {
  projectId: string
  projectData: any
  userRole: string
  user: any
  className?: string
}

interface ActiveTeamState {
  teamId: string | null
  channelId: string | null
  planId: string | null
}

export const TeamsProductivityContent: React.FC<TeamsProductivityContentProps> = ({
  projectId,
  projectData,
  userRole,
  user,
  className,
}) => {
  const [activeTab, setActiveTab] = useState<"messages" | "tasks" | "calendar" | "team">("messages")
  const [activeTeam, setActiveTeam] = useState<ActiveTeamState>({
    teamId: null,
    channelId: null,
    planId: null,
  })
  const [isFocusMode, setIsFocusMode] = useState(false)

  // Teams integration hooks
  const { currentTeam, teams, members, channels, plans, chats, events, isLoading, error, createEvent, refreshAll } =
    useTeamsProductivity(activeTeam.teamId)

  // Set default team (project team) when teams load
  useEffect(() => {
    if (teams.length > 0 && !activeTeam.teamId) {
      // Try to find project-specific team first
      const projectTeam = teams.find(
        (team) =>
          team.displayName.toLowerCase().includes("project") ||
          team.displayName.toLowerCase().includes(projectData?.name?.toLowerCase() || "riverside")
      )

      const defaultTeam = projectTeam || teams[0]
      setActiveTeam((prev) => ({
        ...prev,
        teamId: defaultTeam.id,
      }))
    }
  }, [teams, activeTeam.teamId, projectData?.name])

  // Set default channel when channels load
  useEffect(() => {
    if (channels.length > 0 && activeTeam.teamId && !activeTeam.channelId) {
      const generalChannel = channels.find((channel) => channel.displayName.toLowerCase() === "general") || channels[0]

      setActiveTeam((prev) => ({
        ...prev,
        channelId: generalChannel.id,
      }))
    }
  }, [channels, activeTeam.teamId, activeTeam.channelId])

  // Set default plan when plans load
  useEffect(() => {
    if (plans.length > 0 && activeTeam.teamId && !activeTeam.planId) {
      setActiveTeam((prev) => ({
        ...prev,
        planId: plans[0].id,
      }))
    }
  }, [plans, activeTeam.teamId, activeTeam.planId])

  const handleFocusToggle = () => {
    setIsFocusMode(!isFocusMode)
  }

  // Loading state
  if (isLoading && teams.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span className="text-muted-foreground">Loading Teams data...</span>
        </div>
      </div>
    )
  }

  // Error state
  if (error && teams.length === 0) {
    return (
      <Alert className="m-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Unable to load Teams data: {error}
          <Button variant="outline" size="sm" onClick={refreshAll} className="ml-2">
            <RefreshCw className="h-4 w-4 mr-1" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  const renderMessagingTab = () => (
    <TeamsMessaging
      teamId={activeTeam.teamId}
      channelId={activeTeam.channelId}
      teams={teams}
      channels={channels}
      onTeamChange={(teamId) => setActiveTeam((prev) => ({ ...prev, teamId, channelId: null }))}
      onChannelChange={(channelId) => setActiveTeam((prev) => ({ ...prev, channelId }))}
    />
  )

  const renderTasksTab = () => {
    // Find the selected plan
    const selectedPlan = plans.find((plan) => plan.id === activeTeam.planId)

    return (
      <PlannerTasksContent
        planId={selectedPlan?.id || null}
        teamMembers={members}
        currentUser={user}
        className="w-full h-full"
      />
    )
  }

  const renderCalendarTab = () => (
    <CalendarIntegrationContent
      teamMembers={members}
      currentUser={user}
      projectData={projectData}
      className="w-full h-full"
    />
  )

  const renderTeamTab = () => (
    <TeamManagementContent selectedTeam={currentTeam || null} currentUser={user} className="w-full h-full" />
  )

  // Main content
  const mainContent = (
    <div className={cn("flex flex-col h-full w-full min-w-0 max-w-full overflow-hidden", className)}>
      {/* Header */}
      <div className="pb-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-foreground">Microsoft Teams Integration</h2>
              </div>
              <Badge variant="outline" className="text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                Connected
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Enterprise collaboration with Teams messaging, Planner tasks, and calendar integration
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={refreshAll}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleFocusToggle}>
              {isFocusMode ? (
                <>
                  <Minimize2 className="h-3 w-3 mr-1" />
                  Exit Focus
                </>
              ) : (
                <>
                  <Maximize2 className="h-3 w-3 mr-1" />
                  Focus Mode
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Teams Integration Status */}
      {currentTeam && (
        <div className="mb-4 flex-shrink-0">
          <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-900 dark:text-blue-100">
                      {projectData?.name || currentTeam.displayName}
                    </h3>
                    <p className="text-sm text-blue-600 dark:text-blue-300">
                      {members.length} members • {channels.length} channels • {plans.length} plans
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Open in Teams
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Tabs */}
      <div className="flex-1 min-h-0">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-4 flex-shrink-0">
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 mt-4 min-h-0">
            <TabsContent value="messages" className="h-full m-0">
              {renderMessagingTab()}
            </TabsContent>
            <TabsContent value="tasks" className="h-full m-0">
              {renderTasksTab()}
            </TabsContent>
            <TabsContent value="calendar" className="h-full m-0">
              {renderCalendarTab()}
            </TabsContent>
            <TabsContent value="team" className="h-full m-0">
              {renderTeamTab()}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )

  // Return focus mode if active
  if (isFocusMode) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-950 flex flex-col z-50">
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
          <div className="p-6 min-h-full w-full max-w-full">{mainContent}</div>
        </div>
      </div>
    )
  }

  return mainContent
}

// =====================================================
// TEAMS MESSAGING COMPONENT
// =====================================================

interface TeamsMessagingProps {
  teamId: string | null
  channelId: string | null
  teams: any[]
  channels: any[]
  onTeamChange: (teamId: string) => void
  onChannelChange: (channelId: string) => void
}

const TeamsMessaging: React.FC<TeamsMessagingProps> = ({
  teamId,
  channelId,
  teams,
  channels,
  onTeamChange,
  onChannelChange,
}) => {
  const [newMessage, setNewMessage] = useState("")
  const { currentChannel, messages, loading, error, sending, sendMessage, refresh } = useTeamsChannel(teamId, channelId)

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const success = await sendMessage(newMessage.trim())
    if (success) {
      setNewMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Channel Selection */}
      <div className="flex gap-3 mb-4 flex-shrink-0">
        <div className="flex-1">
          <label className="text-sm font-medium mb-1 block">Team</label>
          <Select value={teamId || ""} onValueChange={onTeamChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select team" />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {team.displayName}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium mb-1 block">Channel</label>
          <Select value={channelId || ""} onValueChange={onChannelChange} disabled={!teamId}>
            <SelectTrigger>
              <SelectValue placeholder="Select channel" />
            </SelectTrigger>
            <SelectContent>
              {channels.map((channel) => (
                <SelectItem key={channel.id} value={channel.id}>
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    {channel.displayName}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 min-h-0 flex flex-col">
        {currentChannel && (
          <div className="mb-3 pb-3 border-b flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-medium">{currentChannel.displayName}</h3>
                {currentChannel.description && (
                  <span className="text-sm text-muted-foreground">• {currentChannel.description}</span>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={refresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Messages List */}
        <div className="flex-1 min-h-0 overflow-y-auto mb-4 space-y-3">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-5 w-5 animate-spin mr-2" />
              <span className="text-muted-foreground">Loading messages...</span>
            </div>
          )}

          {error && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>Error loading messages: {error}</AlertDescription>
            </Alert>
          )}

          {!loading && !error && messages.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No messages in this channel yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className="flex gap-3 p-3 rounded-lg hover:bg-muted/50">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">{message.from.user?.displayName?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{message.from.user?.displayName || "Unknown User"}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(message.createdDateTime).toLocaleString()}
                  </span>
                  {message.importance === "high" && (
                    <Badge variant="destructive" className="text-xs">
                      High Priority
                    </Badge>
                  )}
                  {message.importance === "urgent" && (
                    <Badge variant="destructive" className="text-xs">
                      Urgent
                    </Badge>
                  )}
                </div>
                <div className="text-sm whitespace-pre-wrap break-words">{message.body.content}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        {currentChannel && (
          <div className="flex-shrink-0 border-t pt-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Message #${currentChannel.displayName}`}
                  className="resize-none min-h-[60px]"
                  disabled={sending}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Button onClick={handleSendMessage} disabled={!newMessage.trim() || sending} className="h-[60px]">
                  {sending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <span>Press Enter to send • Shift+Enter for new line</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Placeholder components removed - replaced by dedicated components:
// - PlannerTasksContent for task management
// - CalendarIntegrationContent for calendar integration
// - TeamManagementContent for team collaboration

export default TeamsProductivityContent
