"use client"

/**
 * @fileoverview Microsoft Calendar Integration Content Component
 * @module CalendarIntegrationContent
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-29
 *
 * Comprehensive Microsoft Calendar integration component:
 * - Microsoft Graph Calendar API integration
 * - Event creation, management, and scheduling
 * - Online Teams meeting integration
 * - Project milestone and deadline tracking
 * - Meeting attendee management
 */

import React, { useState, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Calendar as CalendarIcon,
  Plus,
  Edit,
  Trash2,
  Clock,
  MapPin,
  Users,
  Video,
  Mail,
  Phone,
  RefreshCw,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  UserPlus,
  Link,
  AlertCircle,
  CheckCircle,
  Target,
} from "lucide-react"
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday, parseISO } from "date-fns"
import { cn } from "@/lib/utils"

// Import hooks and types
import { useCalendarEvents } from "@/hooks/useTeamsIntegration"
import { CalendarEvent, TeamMember } from "@/lib/msgraph"

interface CalendarIntegrationContentProps {
  teamMembers: TeamMember[]
  currentUser: any
  projectData?: any
  className?: string
}

// Event priority colors
const PRIORITY_CONFIG = {
  low: { label: "Low", color: "bg-gray-100 text-gray-700 border-gray-300" },
  normal: { label: "Normal", color: "bg-blue-100 text-blue-700 border-blue-300" },
  high: { label: "High", color: "bg-orange-100 text-orange-700 border-orange-300" },
} as const

// Event type configuration
const EVENT_TYPES = {
  meeting: { label: "Meeting", icon: Users, color: "bg-blue-500" },
  milestone: { label: "Milestone", icon: Target, color: "bg-green-500" },
  deadline: { label: "Deadline", icon: AlertCircle, color: "bg-red-500" },
  review: { label: "Review", icon: CheckCircle, color: "bg-purple-500" },
}

// Event creation form interface
interface EventFormData {
  subject: string
  body: string
  start: Date
  end: Date
  attendeeEmails: string[]
  isOnlineMeeting: boolean
  importance: "low" | "normal" | "high"
  location?: string
  eventType: keyof typeof EVENT_TYPES
}

// Event Card Component
const EventCard: React.FC<{
  event: CalendarEvent
  onEdit: (event: CalendarEvent) => void
  onDelete: (eventId: string) => void
}> = ({ event, onEdit, onDelete }) => {
  const startTime = parseISO(event.start.dateTime)
  const endTime = parseISO(event.end.dateTime)
  const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))

  const priority = PRIORITY_CONFIG[event.importance as keyof typeof PRIORITY_CONFIG] || PRIORITY_CONFIG.normal

  return (
    <Card className="group hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              {event.isOnlineMeeting && <Video className="h-4 w-4 text-blue-500" />}
              <h3 className="font-semibold text-sm line-clamp-2">{event.subject}</h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>
                {format(startTime, "MMM d, h:mm a")} - {format(endTime, "h:mm a")}
              </span>
              <span>({duration}m)</span>
            </div>
            {event.location?.displayName && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{event.location.displayName}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="sm" onClick={() => onEdit(event)}>
              <Edit className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(event.id)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Attendees */}
        {event.attendees.length > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-3 w-3 text-muted-foreground" />
            <div className="flex -space-x-2">
              {event.attendees.slice(0, 3).map((attendee, index) => (
                <Avatar key={index} className="h-6 w-6 border-2 border-background">
                  <AvatarFallback className="text-xs">
                    {attendee.emailAddress.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              ))}
              {event.attendees.length > 3 && (
                <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                  <span className="text-xs font-medium">+{event.attendees.length - 3}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Event badges */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn("text-xs", priority.color)}>
            {priority.label}
          </Badge>
          {event.isOnlineMeeting && (
            <Badge variant="outline" className="text-xs">
              <Video className="h-3 w-3 mr-1" />
              Teams
            </Badge>
          )}
          {event.onlineMeetingUrl && (
            <Button variant="ghost" size="sm" asChild className="h-6 px-2">
              <a href={event.onlineMeetingUrl} target="_blank" rel="noopener noreferrer">
                <Link className="h-3 w-3 mr-1" />
                Join
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Event Creation Form Component
const EventCreationForm: React.FC<{
  isOpen: boolean
  onClose: () => void
  onSubmit: (eventData: EventFormData) => void
  teamMembers: TeamMember[]
}> = ({ isOpen, onClose, onSubmit, teamMembers }) => {
  const [formData, setFormData] = useState<EventFormData>({
    subject: "",
    body: "",
    start: new Date(),
    end: addDays(new Date(), 0),
    attendeeEmails: [],
    isOnlineMeeting: true,
    importance: "normal",
    location: "",
    eventType: "meeting",
  })

  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.subject.trim()) {
      const eventData = {
        ...formData,
        attendeeEmails: selectedAttendees,
      }
      onSubmit(eventData)
      setFormData({
        subject: "",
        body: "",
        start: new Date(),
        end: addDays(new Date(), 0),
        attendeeEmails: [],
        isOnlineMeeting: true,
        importance: "normal",
        location: "",
        eventType: "meeting",
      })
      setSelectedAttendees([])
      onClose()
    }
  }

  const handleAttendeeToggle = (email: string) => {
    setSelectedAttendees((prev) => (prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]))
  }

  const EventTypeIcon = EVENT_TYPES[formData.eventType].icon

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Calendar Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Event Title *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                placeholder="Enter event title..."
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Event Type</Label>
              <Select
                value={formData.eventType}
                onValueChange={(value: keyof typeof EVENT_TYPES) =>
                  setFormData((prev) => ({ ...prev, eventType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(EVENT_TYPES).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <config.icon className="h-4 w-4" />
                        {config.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Description</Label>
            <Textarea
              id="body"
              value={formData.body}
              onChange={(e) => setFormData((prev) => ({ ...prev, body: e.target.value }))}
              placeholder="Enter event description..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date & Time</Label>
              <Input
                type="datetime-local"
                value={format(formData.start, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) => setFormData((prev) => ({ ...prev, start: new Date(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label>End Date & Time</Label>
              <Input
                type="datetime-local"
                value={format(formData.end, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) => setFormData((prev) => ({ ...prev, end: new Date(e.target.value) }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={formData.importance}
                onValueChange={(value: "low" | "normal" | "high") =>
                  setFormData((prev) => ({ ...prev, importance: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="Enter location..."
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="online-meeting"
              checked={formData.isOnlineMeeting}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isOnlineMeeting: checked }))}
            />
            <Label htmlFor="online-meeting" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Create Teams meeting
            </Label>
          </div>

          <div className="space-y-2">
            <Label>Attendees</Label>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto border rounded-lg p-3">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`attendee-${member.id}`}
                    checked={selectedAttendees.includes(member.email)}
                    onChange={() => handleAttendeeToggle(member.email)}
                    className="rounded border-gray-300"
                  />
                  <label
                    htmlFor={`attendee-${member.id}`}
                    className="flex items-center gap-2 text-sm cursor-pointer flex-1"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={`https://graph.microsoft.com/v1.0/users/${member.userId}/photo/$value`} />
                      <AvatarFallback className="text-xs">
                        {member.displayName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.displayName}</div>
                      <div className="text-xs text-muted-foreground">{member.email}</div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Calendar View Component
const CalendarView: React.FC<{
  events: CalendarEvent[]
  currentDate: Date
  onDateChange: (date: Date) => void
  onEventClick: (event: CalendarEvent) => void
}> = ({ events, currentDate, onDateChange, onEventClick }) => {
  const weekStart = startOfWeek(currentDate)
  const weekEnd = endOfWeek(currentDate)
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const getEventsForDay = (date: Date) => {
    return events
      .filter((event) => isSameDay(parseISO(event.start.dateTime), date))
      .sort((a, b) => parseISO(a.start.dateTime).getTime() - parseISO(b.start.dateTime).getTime())
  }

  return (
    <div className="space-y-4">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => onDateChange(addDays(currentDate, -7))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-semibold">
          {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
        </h3>
        <Button variant="outline" size="sm" onClick={() => onDateChange(addDays(currentDate, 7))}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Week View */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => {
          const dayEvents = getEventsForDay(day)
          const isCurrentDay = isToday(day)

          return (
            <Card key={day.toISOString()} className={cn("min-h-32", isCurrentDay && "ring-2 ring-blue-500")}>
              <CardHeader className="pb-2">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">{format(day, "EEE")}</div>
                  <div className={cn("text-sm font-medium", isCurrentDay && "text-blue-600")}>{format(day, "d")}</div>
                </div>
              </CardHeader>
              <CardContent className="p-2 space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    onClick={() => onEventClick(event)}
                    className="p-1 rounded text-xs bg-blue-100 text-blue-700 cursor-pointer hover:bg-blue-200 transition-colors line-clamp-2"
                  >
                    <div className="font-medium">{event.subject}</div>
                    <div className="text-xs opacity-75">{format(parseISO(event.start.dateTime), "h:mm a")}</div>
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-muted-foreground text-center py-1">+{dayEvents.length - 3} more</div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// Main Component
const CalendarIntegrationContent: React.FC<CalendarIntegrationContentProps> = ({
  teamMembers,
  currentUser,
  projectData,
  className,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"list" | "calendar">("calendar")

  const { events, loading, error, creating, createEvent, refresh } = useCalendarEvents()

  const handleCreateEvent = useCallback(
    async (eventData: EventFormData) => {
      const success = await createEvent(
        eventData.subject,
        eventData.start.toISOString(),
        eventData.end.toISOString(),
        eventData.attendeeEmails,
        eventData.body,
        eventData.isOnlineMeeting
      )

      if (success) {
        refresh()
      }
    },
    [createEvent, refresh]
  )

  const handleEventEdit = useCallback((event: CalendarEvent) => {
    // TODO: Implement event editing
    console.log("Edit event:", event)
  }, [])

  const handleEventDelete = useCallback((eventId: string) => {
    // TODO: Implement event deletion
    console.log("Delete event:", eventId)
  }, [])

  // Filter events for current week
  const weekStart = startOfWeek(currentDate)
  const weekEnd = endOfWeek(currentDate)
  const currentWeekEvents = events.filter((event) => {
    const eventDate = parseISO(event.start.dateTime)
    return eventDate >= weekStart && eventDate <= weekEnd
  })

  if (error) {
    return (
      <div className={cn("p-4", className)}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Microsoft Calendar Integration</h3>
          <p className="text-sm text-muted-foreground">Schedule events and meetings with Microsoft Calendar</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
            <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)} disabled={creating}>
            <Plus className="h-4 w-4 mr-2" />
            {creating ? "Creating..." : "New Event"}
          </Button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === "calendar" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("calendar")}
        >
          <CalendarIcon className="h-4 w-4 mr-2" />
          Calendar
        </Button>
        <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
          <Users className="h-4 w-4 mr-2" />
          List
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="text-muted-foreground">Loading calendar events...</span>
          </div>
        </div>
      ) : viewMode === "calendar" ? (
        <CalendarView
          events={events}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          onEventClick={handleEventEdit}
        />
      ) : (
        <div className="space-y-4">
          {currentWeekEvents.length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No events this week</p>
              <p className="text-sm text-muted-foreground">Create your first event to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentWeekEvents.map((event) => (
                <EventCard key={event.id} event={event} onEdit={handleEventEdit} onDelete={handleEventDelete} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Event Creation Modal */}
      <EventCreationForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateEvent}
        teamMembers={teamMembers}
      />
    </div>
  )
}

export default CalendarIntegrationContent
