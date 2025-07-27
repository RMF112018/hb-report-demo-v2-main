"use client"

import { useState, useEffect, useCallback } from "react"
import {
  microsoftGraphService,
  type Team,
  type TeamMember,
  type Channel,
  type ChatMessage,
  type Chat,
  type PlannerPlan,
  type PlannerTask,
  type CalendarEvent,
} from "@/lib/msgraph"

// =====================================================
// TEAMS HOOKS
// =====================================================

/**
 * Hook for managing Teams operations
 */
export const useTeams = () => {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadTeams = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const teamsData = await microsoftGraphService.getMyTeams()
      setTeams(teamsData)
    } catch (err) {
      console.error("Error loading teams:", err)
      setError(err instanceof Error ? err.message : "Failed to load teams")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTeams()
  }, [loadTeams])

  return {
    teams,
    loading,
    error,
    refresh: loadTeams,
  }
}

/**
 * Hook for managing team members
 */
export const useTeamMembers = (teamId: string | null) => {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadMembers = useCallback(async (teamIdToLoad: string) => {
    try {
      setLoading(true)
      setError(null)
      const membersData = await microsoftGraphService.getTeamMembers(teamIdToLoad)
      setMembers(membersData)
    } catch (err) {
      console.error("Error loading team members:", err)
      setError(err instanceof Error ? err.message : "Failed to load team members")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (teamId) {
      loadMembers(teamId)
    } else {
      setMembers([])
      setLoading(false)
    }
  }, [teamId, loadMembers])

  return {
    members,
    loading,
    error,
    refresh: teamId ? () => loadMembers(teamId) : undefined,
  }
}

/**
 * Hook for managing team channels
 */
export const useTeamChannels = (teamId: string | null) => {
  const [channels, setChannels] = useState<Channel[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadChannels = useCallback(async (teamIdToLoad: string) => {
    try {
      setLoading(true)
      setError(null)
      const channelsData = await microsoftGraphService.getTeamChannels(teamIdToLoad)
      setChannels(channelsData)
    } catch (err) {
      console.error("Error loading channels:", err)
      setError(err instanceof Error ? err.message : "Failed to load channels")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (teamId) {
      loadChannels(teamId)
    } else {
      setChannels([])
      setLoading(false)
    }
  }, [teamId, loadChannels])

  return {
    channels,
    loading,
    error,
    refresh: teamId ? () => loadChannels(teamId) : undefined,
  }
}

// =====================================================
// MESSAGING HOOKS
// =====================================================

/**
 * Hook for managing channel messages
 */
export const useChannelMessages = (teamId: string | null, channelId: string | null) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  const loadMessages = useCallback(async (teamIdToLoad: string, channelIdToLoad: string) => {
    try {
      setLoading(true)
      setError(null)
      const messagesData = await microsoftGraphService.getChannelMessages(teamIdToLoad, channelIdToLoad)
      setMessages(messagesData)
    } catch (err) {
      console.error("Error loading messages:", err)
      setError(err instanceof Error ? err.message : "Failed to load messages")
    } finally {
      setLoading(false)
    }
  }, [])

  const sendMessage = useCallback(
    async (content: string, importance: "normal" | "high" | "urgent" = "normal"): Promise<boolean> => {
      if (!teamId || !channelId) return false

      try {
        setSending(true)
        setError(null)
        const newMessage = await microsoftGraphService.sendChannelMessage(teamId, channelId, content, importance)

        // Add the new message to the current messages
        setMessages((prev) => [...prev, newMessage])
        return true
      } catch (err) {
        console.error("Error sending message:", err)
        setError(err instanceof Error ? err.message : "Failed to send message")
        return false
      } finally {
        setSending(false)
      }
    },
    [teamId, channelId]
  )

  useEffect(() => {
    if (teamId && channelId) {
      loadMessages(teamId, channelId)
    } else {
      setMessages([])
      setLoading(false)
    }
  }, [teamId, channelId, loadMessages])

  return {
    messages,
    loading,
    error,
    sending,
    sendMessage,
    refresh: teamId && channelId ? () => loadMessages(teamId, channelId) : undefined,
  }
}

/**
 * Hook for managing user chats
 */
export const useChats = () => {
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadChats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const chatsData = await microsoftGraphService.getMyChats()
      setChats(chatsData)
    } catch (err) {
      console.error("Error loading chats:", err)
      setError(err instanceof Error ? err.message : "Failed to load chats")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadChats()
  }, [loadChats])

  return {
    chats,
    loading,
    error,
    refresh: loadChats,
  }
}

// =====================================================
// PLANNER HOOKS
// =====================================================

/**
 * Hook for managing Planner plans
 */
export const usePlannerPlans = (groupId: string | null) => {
  const [plans, setPlans] = useState<PlannerPlan[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadPlans = useCallback(async (groupIdToLoad: string) => {
    try {
      setLoading(true)
      setError(null)
      const plansData = await microsoftGraphService.getPlannerPlans(groupIdToLoad)
      setPlans(plansData)
    } catch (err) {
      console.error("Error loading planner plans:", err)
      setError(err instanceof Error ? err.message : "Failed to load planner plans")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (groupId) {
      loadPlans(groupId)
    } else {
      setPlans([])
      setLoading(false)
    }
  }, [groupId, loadPlans])

  return {
    plans,
    loading,
    error,
    refresh: groupId ? () => loadPlans(groupId) : undefined,
  }
}

/**
 * Hook for managing Planner tasks
 */
export const usePlannerTasks = (planId: string | null) => {
  const [tasks, setTasks] = useState<PlannerTask[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(false)

  const loadTasks = useCallback(async (planIdToLoad: string) => {
    try {
      setLoading(true)
      setError(null)
      const tasksData = await microsoftGraphService.getPlannerTasks(planIdToLoad)
      setTasks(tasksData)
    } catch (err) {
      console.error("Error loading planner tasks:", err)
      setError(err instanceof Error ? err.message : "Failed to load planner tasks")
    } finally {
      setLoading(false)
    }
  }, [])

  const createTask = useCallback(
    async (
      title: string,
      bucketId?: string,
      assigneeIds?: string[],
      dueDateTime?: string,
      priority?: number
    ): Promise<PlannerTask | null> => {
      if (!planId) return null

      try {
        setCreating(true)
        setError(null)
        const newTask = await microsoftGraphService.createPlannerTask(
          planId,
          title,
          bucketId,
          assigneeIds,
          dueDateTime,
          priority
        )

        // Add the new task to the current tasks
        setTasks((prev) => [...prev, newTask])
        return newTask
      } catch (err) {
        console.error("Error creating planner task:", err)
        setError(err instanceof Error ? err.message : "Failed to create task")
        return null
      } finally {
        setCreating(false)
      }
    },
    [planId]
  )

  const updateTaskProgress = useCallback(
    async (taskId: string, percentComplete: number, etag: string): Promise<boolean> => {
      try {
        setUpdating(true)
        setError(null)
        const updatedTask = await microsoftGraphService.updatePlannerTaskProgress(taskId, percentComplete, etag)

        // Update the task in the current tasks
        setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, percentComplete } : task)))
        return true
      } catch (err) {
        console.error("Error updating task progress:", err)
        setError(err instanceof Error ? err.message : "Failed to update task progress")
        return false
      } finally {
        setUpdating(false)
      }
    },
    []
  )

  useEffect(() => {
    if (planId) {
      loadTasks(planId)
    } else {
      setTasks([])
      setLoading(false)
    }
  }, [planId, loadTasks])

  return {
    tasks,
    loading,
    error,
    creating,
    updating,
    createTask,
    updateTaskProgress,
    refresh: planId ? () => loadTasks(planId) : undefined,
  }
}

// =====================================================
// CALENDAR HOOKS
// =====================================================

/**
 * Hook for managing calendar events
 */
export const useCalendarEvents = (startDateTime?: string, endDateTime?: string) => {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const eventsData = await microsoftGraphService.getCalendarEvents(startDateTime, endDateTime)
      setEvents(eventsData)
    } catch (err) {
      console.error("Error loading calendar events:", err)
      setError(err instanceof Error ? err.message : "Failed to load calendar events")
    } finally {
      setLoading(false)
    }
  }, [startDateTime, endDateTime])

  const createEvent = useCallback(
    async (
      subject: string,
      start: string,
      end: string,
      attendeeEmails: string[],
      body?: string,
      isOnlineMeeting: boolean = true
    ): Promise<CalendarEvent | null> => {
      try {
        setCreating(true)
        setError(null)
        const newEvent = await microsoftGraphService.createCalendarEvent(
          subject,
          start,
          end,
          attendeeEmails,
          body,
          isOnlineMeeting
        )

        // Add the new event to the current events
        setEvents((prev) => [...prev, newEvent])
        return newEvent
      } catch (err) {
        console.error("Error creating calendar event:", err)
        setError(err instanceof Error ? err.message : "Failed to create event")
        return null
      } finally {
        setCreating(false)
      }
    },
    []
  )

  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  return {
    events,
    loading,
    error,
    creating,
    createEvent,
    refresh: loadEvents,
  }
}

// =====================================================
// COMPOSITE HOOKS
// =====================================================

/**
 * Combined hook for Teams productivity features
 * Provides a complete Teams integration for a specific team/project
 */
export const useTeamsProductivity = (teamId: string | null) => {
  const { teams, loading: teamsLoading, error: teamsError } = useTeams()
  const { members, loading: membersLoading, error: membersError, refresh: refreshMembers } = useTeamMembers(teamId)
  const { channels, loading: channelsLoading, error: channelsError, refresh: refreshChannels } = useTeamChannels(teamId)
  const { plans, loading: plansLoading, error: plansError, refresh: refreshPlans } = usePlannerPlans(teamId)
  const { chats, loading: chatsLoading, error: chatsError, refresh: refreshChats } = useChats()
  const {
    events,
    loading: eventsLoading,
    error: eventsError,
    createEvent,
    refresh: refreshEvents,
  } = useCalendarEvents()

  const currentTeam = teams.find((team) => team.id === teamId)

  const refreshAll = useCallback(() => {
    refreshMembers?.()
    refreshChannels?.()
    refreshPlans?.()
    refreshChats()
    refreshEvents()
  }, [refreshMembers, refreshChannels, refreshPlans, refreshChats, refreshEvents])

  const isLoading = teamsLoading || membersLoading || channelsLoading || plansLoading || chatsLoading || eventsLoading

  const errors = [teamsError, membersError, channelsError, plansError, chatsError, eventsError]
    .filter(Boolean)
    .join(", ")

  return {
    // Data
    currentTeam,
    teams,
    members,
    channels,
    plans,
    chats,
    events,

    // State
    isLoading,
    error: errors || null,

    // Actions
    createEvent,
    refreshAll,
  }
}

/**
 * Hook for Teams messaging in a specific channel
 */
export const useTeamsChannel = (teamId: string | null, channelId: string | null) => {
  const { messages, loading, error, sending, sendMessage, refresh } = useChannelMessages(teamId, channelId)
  const { channels } = useTeamChannels(teamId)

  const currentChannel = channels.find((channel) => channel.id === channelId)

  return {
    currentChannel,
    messages,
    loading,
    error,
    sending,
    sendMessage,
    refresh,
  }
}

export default {
  useTeams,
  useTeamMembers,
  useTeamChannels,
  useChannelMessages,
  useChats,
  usePlannerPlans,
  usePlannerTasks,
  useCalendarEvents,
  useTeamsProductivity,
  useTeamsChannel,
}
