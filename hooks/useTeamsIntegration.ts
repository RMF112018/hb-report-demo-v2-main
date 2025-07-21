"use client"

import { useState, useEffect, useCallback } from "react"
import { logger } from "@/lib/structured-logger"
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
      const errorMessage = err instanceof Error ? err.message : "Failed to load teams"
      logger.error("Error loading teams", {
        component: "useTeams",
        function: "loadTeams",
        error: err,
      })
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTeams().catch((err) => {
      logger.error("Unhandled promise rejection in loadTeams", {
        component: "useTeams",
        function: "loadTeams",
        error: err,
      })
    })
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
      const errorMessage = err instanceof Error ? err.message : "Failed to load team members"
      logger.error("Error loading team members", {
        component: "useTeamMembers",
        function: "loadMembers",
        teamId: teamIdToLoad,
        error: err,
      })
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (teamId) {
      loadMembers(teamId).catch((err) => {
        logger.error("Unhandled promise rejection in loadMembers", {
          component: "useTeamMembers",
          function: "loadMembers",
          teamId,
          error: err,
        })
      })
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
      const errorMessage = err instanceof Error ? err.message : "Failed to load channels"
      logger.error("Error loading channels", {
        component: "useTeamChannels",
        function: "loadChannels",
        teamId: teamIdToLoad,
        error: err,
      })
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (teamId) {
      loadChannels(teamId).catch((err) => {
        logger.error("Unhandled promise rejection in loadChannels", {
          component: "useTeamChannels",
          function: "loadChannels",
          teamId,
          error: err,
        })
      })
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
      const errorMessage = err instanceof Error ? err.message : "Failed to load messages"
      logger.error("Error loading messages", {
        component: "useChannelMessages",
        function: "loadMessages",
        teamId: teamIdToLoad,
        channelId: channelIdToLoad,
        error: err,
      })
      setError(errorMessage)
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
        const errorMessage = err instanceof Error ? err.message : "Failed to send message"
        logger.error("Error sending message", {
          component: "useChannelMessages",
          function: "sendMessage",
          teamId,
          channelId,
          error: err,
        })
        setError(errorMessage)
        return false
      } finally {
        setSending(false)
      }
    },
    [teamId, channelId]
  )

  useEffect(() => {
    if (teamId && channelId) {
      loadMessages(teamId, channelId).catch((err) => {
        logger.error("Unhandled promise rejection in loadMessages", {
          component: "useChannelMessages",
          function: "loadMessages",
          teamId,
          channelId,
          error: err,
        })
      })
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
      const errorMessage = err instanceof Error ? err.message : "Failed to load chats"
      logger.error("Error loading chats", {
        component: "useChats",
        function: "loadChats",
        error: err,
      })
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadChats().catch((err) => {
      logger.error("Unhandled promise rejection in loadChats", {
        component: "useChats",
        function: "loadChats",
        error: err,
      })
    })
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
      const errorMessage = err instanceof Error ? err.message : "Failed to load planner plans"
      logger.error("Error loading planner plans", {
        component: "usePlannerPlans",
        function: "loadPlans",
        groupId: groupIdToLoad,
        error: err,
      })
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (groupId) {
      loadPlans(groupId).catch((err) => {
        logger.error("Unhandled promise rejection in loadPlans", {
          component: "usePlannerPlans",
          function: "loadPlans",
          groupId,
          error: err,
        })
      })
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
      const errorMessage = err instanceof Error ? err.message : "Failed to load planner tasks"
      logger.error("Error loading planner tasks", {
        component: "usePlannerTasks",
        function: "loadTasks",
        planId: planIdToLoad,
        error: err,
      })
      setError(errorMessage)
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
        const errorMessage = err instanceof Error ? err.message : "Failed to create task"
        logger.error("Error creating planner task", {
          component: "usePlannerTasks",
          function: "createTask",
          planId,
          error: err,
        })
        setError(errorMessage)
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
        await microsoftGraphService.updatePlannerTaskProgress(taskId, percentComplete, etag)

        // Update the task in the current tasks
        setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, percentComplete } : task)))
        return true
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to update task progress"
        logger.error("Error updating task progress", {
          component: "usePlannerTasks",
          function: "updateTaskProgress",
          taskId,
          error: err,
        })
        setError(errorMessage)
        return false
      } finally {
        setUpdating(false)
      }
    },
    []
  )

  useEffect(() => {
    if (planId) {
      loadTasks(planId).catch((err) => {
        logger.error("Unhandled promise rejection in loadTasks", {
          component: "usePlannerTasks",
          function: "loadTasks",
          planId,
          error: err,
        })
      })
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
      const errorMessage = err instanceof Error ? err.message : "Failed to load calendar events"
      logger.error("Error loading calendar events", {
        component: "useCalendarEvents",
        function: "loadEvents",
        startDateTime,
        endDateTime,
        error: err,
      })
      setError(errorMessage)
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
        const errorMessage = err instanceof Error ? err.message : "Failed to create event"
        logger.error("Error creating calendar event", {
          component: "useCalendarEvents",
          function: "createEvent",
          error: err,
        })
        setError(errorMessage)
        return null
      } finally {
        setCreating(false)
      }
    },
    []
  )

  useEffect(() => {
    loadEvents().catch((err) => {
      logger.error("Unhandled promise rejection in loadEvents", {
        component: "useCalendarEvents",
        function: "loadEvents",
        error: err,
      })
    })
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
