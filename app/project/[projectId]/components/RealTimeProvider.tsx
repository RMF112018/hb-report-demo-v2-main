/**
 * @fileoverview Real-time Features Provider with WebSocket Integration
 * @module RealTimeProvider
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Advanced real-time system with WebSocket connections, live updates,
 * collaborative features, and offline support.
 */

"use client"

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from "react"
import { usePreferences } from "./UserPreferencesProvider"

/**
 * Connection status types
 */
export type ConnectionStatus = "connecting" | "connected" | "disconnected" | "reconnecting" | "error"

/**
 * Real-time event types
 */
export type RealTimeEventType =
  | "project_update"
  | "financial_change"
  | "schedule_update"
  | "team_member_activity"
  | "notification"
  | "user_presence"
  | "document_collaboration"
  | "system_alert"

/**
 * Real-time event interface
 */
export interface RealTimeEvent {
  /** Event ID */
  id: string
  /** Event type */
  type: RealTimeEventType
  /** Event data */
  data: any
  /** Timestamp */
  timestamp: Date
  /** User ID who triggered the event */
  userId?: string
  /** Project ID */
  projectId?: string
  /** Priority level */
  priority: "low" | "medium" | "high" | "critical"
  /** Metadata */
  metadata?: Record<string, any>
}

/**
 * User presence information
 */
export interface UserPresence {
  /** User ID */
  userId: string
  /** User name */
  name: string
  /** User role */
  role: string
  /** Current page/tool */
  currentPage?: string
  /** Activity status */
  status: "active" | "idle" | "away" | "offline"
  /** Last seen timestamp */
  lastSeen: Date
  /** User avatar */
  avatar?: string
}

/**
 * Real-time configuration
 */
interface RealTimeConfig {
  /** WebSocket URL */
  wsUrl: string
  /** Enable real-time features */
  enabled: boolean
  /** Auto-reconnect */
  autoReconnect: boolean
  /** Reconnection delay */
  reconnectDelay: number
  /** Max reconnection attempts */
  maxReconnectAttempts: number
  /** Heartbeat interval */
  heartbeatInterval: number
  /** Event buffer size */
  eventBufferSize: number
  /** Enable presence tracking */
  enablePresence: boolean
  /** Enable collaborative features */
  enableCollaboration: boolean
}

/**
 * Real-time context value
 */
interface RealTimeContextValue {
  /** Connection status */
  connectionStatus: ConnectionStatus
  /** Connected users */
  connectedUsers: UserPresence[]
  /** Recent events */
  recentEvents: RealTimeEvent[]
  /** Subscribe to events */
  subscribeToEvents: (eventTypes: RealTimeEventType[], callback: (event: RealTimeEvent) => void) => () => void
  /** Send event */
  sendEvent: (event: Omit<RealTimeEvent, "id" | "timestamp">) => void
  /** Update user presence */
  updateUserPresence: (presence: Partial<UserPresence>) => void
  /** Get user presence */
  getUserPresence: (userId: string) => UserPresence | undefined
  /** Connection health */
  connectionHealth: {
    latency: number
    packetsLost: number
    reconnectCount: number
    uptime: number
  }
  /** Force reconnect */
  forceReconnect: () => void
  /** Toggle real-time features */
  toggleRealTime: (enabled: boolean) => void
}

/**
 * Default real-time configuration
 */
const DEFAULT_CONFIG: RealTimeConfig = {
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001",
  enabled: true,
  autoReconnect: true,
  reconnectDelay: 1000,
  maxReconnectAttempts: 5,
  heartbeatInterval: 30000,
  eventBufferSize: 100,
  enablePresence: true,
  enableCollaboration: true,
}

/**
 * Real-time context
 */
const RealTimeContext = createContext<RealTimeContextValue | null>(null)

/**
 * Props for RealTimeProvider
 */
export interface RealTimeProviderProps {
  children: React.ReactNode
  projectId: string
  userId: string
  config?: Partial<RealTimeConfig>
}

/**
 * RealTimeProvider component - Advanced real-time features
 */
export function RealTimeProvider({ children, projectId, userId, config = {} }: RealTimeProviderProps) {
  const finalConfig = useMemo(() => ({ ...DEFAULT_CONFIG, ...config }), [config])
  const { preferences } = usePreferences()

  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected")
  const [connectedUsers, setConnectedUsers] = useState<UserPresence[]>([])
  const [recentEvents, setRecentEvents] = useState<RealTimeEvent[]>([])
  const [connectionHealth, setConnectionHealth] = useState({
    latency: 0,
    packetsLost: 0,
    reconnectCount: 0,
    uptime: 0,
  })

  const wsRef = useRef<WebSocket | null>(null)
  const eventListenersRef = useRef<Map<string, (event: RealTimeEvent) => void>>(new Map())
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const lastHeartbeatRef = useRef<Date | null>(null)
  const connectionStartTimeRef = useRef<Date | null>(null)

  // Initialize WebSocket connection
  const initializeWebSocket = useCallback(() => {
    if (!finalConfig.enabled) return

    try {
      setConnectionStatus("connecting")
      connectionStartTimeRef.current = new Date()

      const ws = new WebSocket(`${finalConfig.wsUrl}?projectId=${projectId}&userId=${userId}`)

      ws.onopen = () => {
        setConnectionStatus("connected")
        reconnectAttemptsRef.current = 0

        // Start heartbeat
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current as NodeJS.Timeout)
        }

        heartbeatIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            lastHeartbeatRef.current = new Date()
            ws.send(JSON.stringify({ type: "heartbeat", timestamp: new Date() }))
          }
        }, finalConfig.heartbeatInterval)

        // Request initial presence data
        if (finalConfig.enablePresence) {
          ws.send(JSON.stringify({ type: "request_presence" }))
        }
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)

          switch (data.type) {
            case "event":
              handleRealTimeEvent(data.payload)
              break

            case "presence_update":
              handlePresenceUpdate(data.payload)
              break

            case "heartbeat_response":
              const latency = Date.now() - lastHeartbeatRef.current!.getTime()
              setConnectionHealth((prev) => ({ ...prev, latency }))
              break

            case "user_joined":
              handleUserJoined(data.payload)
              break

            case "user_left":
              handleUserLeft(data.payload)
              break

            default:
              console.log("Unknown message type:", data.type)
          }
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error)
        }
      }

      ws.onclose = () => {
        setConnectionStatus("disconnected")

        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current as NodeJS.Timeout)
        }

        // Auto-reconnect
        if (finalConfig.autoReconnect && reconnectAttemptsRef.current < finalConfig.maxReconnectAttempts) {
          setConnectionStatus("reconnecting")
          reconnectAttemptsRef.current++

          reconnectTimeoutRef.current = setTimeout(() => {
            setConnectionHealth((prev) => ({ ...prev, reconnectCount: prev.reconnectCount + 1 }))
            initializeWebSocket()
          }, finalConfig.reconnectDelay * Math.pow(2, reconnectAttemptsRef.current))
        }
      }

      ws.onerror = (error) => {
        console.error("WebSocket error:", error)
        setConnectionStatus("error")
      }

      wsRef.current = ws
    } catch (error) {
      console.error("Failed to initialize WebSocket:", error)
      setConnectionStatus("error")
    }
  }, [finalConfig, projectId, userId])

  // Handle real-time events
  const handleRealTimeEvent = useCallback(
    (event: RealTimeEvent) => {
      // Add to recent events
      setRecentEvents((prev) => {
        const newEvents = [event, ...prev].slice(0, finalConfig.eventBufferSize)
        return newEvents
      })

      // Notify event listeners
      eventListenersRef.current.forEach((callback, listenerId) => {
        try {
          callback(event)
        } catch (error) {
          console.error(`Error in event listener ${listenerId}:`, error)
        }
      })

      // Show notification if enabled
      if (preferences.notifications.enableDesktopNotifications && event.priority === "high") {
        showNotification(event)
      }
    },
    [finalConfig.eventBufferSize, preferences.notifications.enableDesktopNotifications]
  )

  // Handle presence updates
  const handlePresenceUpdate = useCallback((presence: UserPresence) => {
    setConnectedUsers((prev) => {
      const index = prev.findIndex((u) => u.userId === presence.userId)
      if (index >= 0) {
        const updated = [...prev]
        updated[index] = presence
        return updated
      } else {
        return [...prev, presence]
      }
    })
  }, [])

  // Handle user joined
  const handleUserJoined = useCallback((user: UserPresence) => {
    setConnectedUsers((prev) => {
      if (prev.some((u) => u.userId === user.userId)) return prev
      return [...prev, user]
    })
  }, [])

  // Handle user left
  const handleUserLeft = useCallback((userId: string) => {
    setConnectedUsers((prev) => prev.filter((u) => u.userId !== userId))
  }, [])

  // Show notification
  const showNotification = useCallback((event: RealTimeEvent) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(`HB Project: ${event.type}`, {
        body: typeof event.data === "string" ? event.data : JSON.stringify(event.data),
        icon: "/favicon.ico",
        tag: event.id,
      })
    }
  }, [])

  // Subscribe to events
  const subscribeToEvents = useCallback((eventTypes: RealTimeEventType[], callback: (event: RealTimeEvent) => void) => {
    const listenerId = `${Date.now()}-${Math.random()}`

    const wrappedCallback = (event: RealTimeEvent) => {
      if (eventTypes.includes(event.type)) {
        callback(event)
      }
    }

    eventListenersRef.current.set(listenerId, wrappedCallback)

    return () => {
      eventListenersRef.current.delete(listenerId)
    }
  }, [])

  // Send event
  const sendEvent = useCallback(
    (event: Omit<RealTimeEvent, "id" | "timestamp">) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const fullEvent: RealTimeEvent = {
          ...event,
          id: `${Date.now()}-${Math.random()}`,
          timestamp: new Date(),
          userId,
        }

        wsRef.current.send(
          JSON.stringify({
            type: "event",
            payload: fullEvent,
          })
        )
      }
    },
    [userId]
  )

  // Update user presence
  const updateUserPresence = useCallback(
    (presence: Partial<UserPresence>) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: "presence_update",
            payload: { ...presence, userId },
          })
        )
      }
    },
    [userId]
  )

  // Get user presence
  const getUserPresence = useCallback(
    (userId: string) => {
      return connectedUsers.find((u) => u.userId === userId)
    },
    [connectedUsers]
  )

  // Force reconnect
  const forceReconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close()
    }
    reconnectAttemptsRef.current = 0
    initializeWebSocket()
  }, [initializeWebSocket])

  // Toggle real-time features
  const toggleRealTime = useCallback(
    (enabled: boolean) => {
      if (enabled) {
        initializeWebSocket()
      } else {
        if (wsRef.current) {
          wsRef.current.close()
        }
        setConnectionStatus("disconnected")
      }
    },
    [initializeWebSocket]
  )

  // Initialize on mount
  useEffect(() => {
    initializeWebSocket()

    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current)
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [initializeWebSocket])

  // Update connection uptime
  useEffect(() => {
    const interval = setInterval(() => {
      if (connectionStatus === "connected" && connectionStartTimeRef.current) {
        const uptime = Date.now() - connectionStartTimeRef.current.getTime()
        setConnectionHealth((prev) => ({ ...prev, uptime }))
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [connectionStatus])

  // Context value
  const contextValue = useMemo<RealTimeContextValue>(
    () => ({
      connectionStatus,
      connectedUsers,
      recentEvents,
      subscribeToEvents,
      sendEvent,
      updateUserPresence,
      getUserPresence,
      connectionHealth,
      forceReconnect,
      toggleRealTime,
    }),
    [
      connectionStatus,
      connectedUsers,
      recentEvents,
      subscribeToEvents,
      sendEvent,
      updateUserPresence,
      getUserPresence,
      connectionHealth,
      forceReconnect,
      toggleRealTime,
    ]
  )

  return <RealTimeContext.Provider value={contextValue}>{children}</RealTimeContext.Provider>
}

/**
 * Hook to use real-time features
 */
export function useRealTime() {
  const context = useContext(RealTimeContext)
  if (!context) {
    throw new Error("useRealTime must be used within a RealTimeProvider")
  }
  return context
}

/**
 * Hook to use user presence
 */
export function useUserPresence() {
  const { connectedUsers, updateUserPresence, getUserPresence } = useRealTime()

  return {
    connectedUsers,
    updateUserPresence,
    getUserPresence,
  }
}

/**
 * Hook to use real-time events
 */
export function useRealTimeEvents(eventTypes: RealTimeEventType[]) {
  const { subscribeToEvents, sendEvent, recentEvents } = useRealTime()
  const [events, setEvents] = useState<RealTimeEvent[]>([])

  useEffect(() => {
    const unsubscribe = subscribeToEvents(eventTypes, (event) => {
      setEvents((prev) => [event, ...prev.slice(0, 49)])
    })

    return unsubscribe
  }, [eventTypes, subscribeToEvents])

  return {
    events,
    sendEvent,
    recentEvents: recentEvents.filter((e) => eventTypes.includes(e.type)),
  }
}

export default RealTimeProvider
