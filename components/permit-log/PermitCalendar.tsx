"use client"

import React, { useState, useMemo, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { FileText, Users, AlertTriangle, CheckCircle } from "lucide-react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  startOfWeek,
  endOfWeek,
  isToday,
  parseISO,
  differenceInDays,
} from "date-fns"
import type { Permit, Inspection, CalendarEvent } from "@/types/permit-log"

interface PermitCalendarProps {
  permits: Permit[]
  onEditPermit?: (permit: Permit) => void
  onViewPermit?: (permit: Permit) => void
  onCreatePermit?: () => void
  userRole?: string
  className?: string
}

type EventType = "permit-application" | "permit-approval" | "permit-expiration" | "inspection"

const eventTypeColors = {
  "permit-application": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200",
  "permit-approval": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200",
  "permit-expiration": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200",
  inspection: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-purple-200",
}

const eventTypeIcons = {
  "permit-application": FileText,
  "permit-approval": CheckCircle,
  "permit-expiration": AlertTriangle,
  inspection: Users,
}

export function PermitCalendar({
  permits,
  onEditPermit,
  onViewPermit,
  onCreatePermit,
  userRole = "user",
  className = "",
}: PermitCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEventTypes] = useState<EventType[]>([
    "permit-application",
    "permit-approval",
    "permit-expiration",
    "inspection",
  ])
  const view = "month" // Fixed to month view for simplified calendar

  // Generate calendar events from permits
  const calendarEvents = useMemo(() => {
    const events: CalendarEvent[] = []

    permits.forEach((permit) => {
      // Application date event
      if (selectedEventTypes.includes("permit-application")) {
        events.push({
          id: `app-${permit.id}`,
          type: "permit-application",
          date: parseISO(permit.applicationDate),
          title: `Applied: ${permit.number}`,
          status: permit.status,
          permit,
          priority: permit.priority,
        })
      }

      // Approval date event
      if (permit.approvalDate && selectedEventTypes.includes("permit-approval")) {
        events.push({
          id: `approval-${permit.id}`,
          type: "permit-approval",
          date: parseISO(permit.approvalDate),
          title: `Approved: ${permit.number}`,
          status: permit.status,
          permit,
          priority: permit.priority,
        })
      }

      // Expiration date event
      if (selectedEventTypes.includes("permit-expiration")) {
        const expirationDate = parseISO(permit.expirationDate)
        const daysUntilExpiration = differenceInDays(expirationDate, new Date())

        // Only show if within 60 days or already expired
        if (daysUntilExpiration <= 60) {
          events.push({
            id: `exp-${permit.id}`,
            type: "permit-expiration",
            date: expirationDate,
            title: `Expires: ${permit.number}`,
            status: permit.status,
            permit,
            priority: daysUntilExpiration <= 30 ? "high" : permit.priority,
          })
        }
      }

      // Inspection events
      if (permit.inspections && selectedEventTypes.includes("inspection")) {
        permit.inspections.forEach((inspection) => {
          const inspectionDate = inspection.scheduledDate
            ? parseISO(inspection.scheduledDate)
            : inspection.completedDate
            ? parseISO(inspection.completedDate)
            : null

          if (inspectionDate) {
            events.push({
              id: `insp-${inspection.id}`,
              type: "inspection",
              date: inspectionDate,
              title: `${inspection.type}: ${permit.number}`,
              status: inspection.result,
              permit,
              inspection,
              priority: inspection.result === "failed" ? "high" : permit.priority,
            })
          }
        })
      }
    })

    return events.sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [permits, selectedEventTypes])

  // Get calendar days to display
  const calendarDays = useMemo(() => {
    if (view === "month") {
      const start = startOfWeek(startOfMonth(currentDate))
      const end = endOfWeek(endOfMonth(currentDate))
      return eachDayOfInterval({ start, end })
    } else {
      const start = startOfWeek(currentDate)
      const end = endOfWeek(currentDate)
      return eachDayOfInterval({ start, end })
    }
  }, [currentDate, view])

  // Get events for a specific date
  const getEventsForDate = useCallback(
    (date: Date) => {
      return calendarEvents.filter((event) => isSameDay(event.date, date))
    },
    [calendarEvents]
  )

  // No navigation needed for simplified calendar

  // Simplified calendar - no header controls needed

  // Render calendar grid
  const renderCalendarGrid = () => (
    <Card className="flex-1 flex flex-col">
      <CardContent className="p-0 flex-1 overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b bg-muted/50">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 flex-1 auto-rows-fr">
          {calendarDays.map((day) => {
            const dayEvents = getEventsForDate(day)
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isDayToday = isToday(day)

            return (
              <div
                key={day.toISOString()}
                className={`
                  border-r border-b p-2 min-h-24 transition-colors
                  ${isCurrentMonth ? "bg-background" : "bg-muted/20"}
                  ${isDayToday ? "bg-blue-50 dark:bg-blue-950 ring-2 ring-blue-200 dark:ring-blue-800" : ""}
                `}
              >
                <div
                  className={`
                  text-sm font-medium mb-1
                  ${isCurrentMonth ? "text-foreground" : "text-muted-foreground"}
                  ${isDayToday ? "text-blue-600 font-bold" : ""}
                `}
                >
                  {format(day, "d")}
                </div>

                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => {
                    const Icon = eventTypeIcons[event.type]
                    return (
                      <TooltipProvider key={event.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={`
                                text-xs px-2 py-1 rounded border cursor-pointer
                                ${eventTypeColors[event.type]}
                                ${
                                  event.priority === "high" ||
                                  event.priority === "urgent" ||
                                  event.priority === "critical"
                                    ? "ring-1 ring-red-400"
                                    : ""
                                }
                              `}
                              onClick={(e) => {
                                e.stopPropagation()
                                onViewPermit?.(event.permit)
                              }}
                            >
                              <div className="flex items-center gap-1">
                                <Icon className="h-3 w-3" />
                                <span className="truncate">{event.title}</span>
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-1">
                              <div className="font-medium">{event.title}</div>
                              <div className="text-xs">Type: {event.permit.type}</div>
                              <div className="text-xs">Authority: {event.permit.authority}</div>
                              {event.inspection && (
                                <div className="text-xs">Inspector: {event.inspection.inspector}</div>
                              )}
                              <div className="text-xs">Status: {event.status}</div>
                              {event.priority && <div className="text-xs">Priority: {event.priority}</div>}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )
                  })}

                  {dayEvents.length > 3 && (
                    <div className="text-xs text-muted-foreground text-center">+{dayEvents.length - 3} more</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )

  // Simplified calendar - no event details sidebar needed

  return <div className={`h-full flex flex-col ${className}`}>{renderCalendarGrid()}</div>
}
