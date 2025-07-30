"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Calendar,
  Clock,
  User,
  MoreHorizontal,
  Eye,
  MessageSquare,
  Phone,
  Mail,
  AlertTriangle,
  CheckCircle,
  Clock as ClockIcon,
} from "lucide-react"

interface ClientActivity {
  clientName: string
  lastContact: string
  nextTouchpoint: string
  BDRep: string
  status: "Overdue" | "Due Soon" | "Upcoming"
  lastActivity?: string
  contactMethod?: "Phone" | "Email" | "Meeting" | "Proposal"
}

interface BetaBDClientActivityTrackerCardProps {
  activities?: ClientActivity[]
  className?: string
}

export function BetaBDClientActivityTrackerCard({
  activities = [],
  className = "",
}: BetaBDClientActivityTrackerCardProps) {
  const [selectedRep, setSelectedRep] = useState<string>("all")

  // Mock data if none provided
  const defaultActivities: ClientActivity[] = [
    {
      clientName: "City of Tampa",
      lastContact: "2025-07-24",
      nextTouchpoint: "2025-07-29",
      BDRep: "M. Alvarez",
      status: "Due Soon",
      lastActivity: "Proposal review meeting",
      contactMethod: "Meeting",
    },
    {
      clientName: "Publix",
      lastContact: "2025-07-18",
      nextTouchpoint: "2025-08-01",
      BDRep: "D. Chen",
      status: "Upcoming",
      lastActivity: "Follow-up call scheduled",
      contactMethod: "Phone",
    },
    {
      clientName: "Tampa General Hospital",
      lastContact: "2025-07-15",
      nextTouchpoint: "2025-07-25",
      BDRep: "M. Alvarez",
      status: "Overdue",
      lastActivity: "Initial proposal sent",
      contactMethod: "Email",
    },
    {
      clientName: "University of South Florida",
      lastContact: "2025-07-22",
      nextTouchpoint: "2025-07-30",
      BDRep: "D. Chen",
      status: "Due Soon",
      lastActivity: "Contract negotiation",
      contactMethod: "Meeting",
    },
    {
      clientName: "BayCare Health System",
      lastContact: "2025-07-20",
      nextTouchpoint: "2025-08-05",
      BDRep: "M. Alvarez",
      status: "Upcoming",
      lastActivity: "Site visit completed",
      contactMethod: "Meeting",
    },
  ]

  const clientActivities = activities.length > 0 ? activities : defaultActivities

  // Get unique BD reps for filter
  const bdReps = useMemo(() => {
    const reps = [...new Set(clientActivities.map((activity) => activity.BDRep))]
    return ["all", ...reps]
  }, [clientActivities])

  // Filter activities by selected rep
  const filteredActivities = useMemo(() => {
    if (selectedRep === "all") return clientActivities
    return clientActivities.filter((activity) => activity.BDRep === selectedRep)
  }, [clientActivities, selectedRep])

  // Get status badge variant and icon
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Overdue":
        return (
          <Badge variant="destructive" className="text-xs">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Overdue
          </Badge>
        )
      case "Due Soon":
        return (
          <Badge variant="default" className="text-xs bg-orange-500 hover:bg-orange-600">
            <ClockIcon className="h-3 w-3 mr-1" />
            Due Soon
          </Badge>
        )
      case "Upcoming":
        return (
          <Badge variant="secondary" className="text-xs">
            <CheckCircle className="h-3 w-3 mr-1" />
            Upcoming
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {status}
          </Badge>
        )
    }
  }

  // Get contact method icon
  const getContactMethodIcon = (method?: string) => {
    switch (method) {
      case "Phone":
        return <Phone className="h-3 w-3 text-blue-600" />
      case "Email":
        return <Mail className="h-3 w-3 text-green-600" />
      case "Meeting":
        return <Calendar className="h-3 w-3 text-purple-600" />
      case "Proposal":
        return <MessageSquare className="h-3 w-3 text-orange-600" />
      default:
        return <MessageSquare className="h-3 w-3 text-gray-600" />
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  // Calculate days until next touchpoint
  const getDaysUntil = (dateString: string) => {
    const today = new Date()
    const targetDate = new Date(dateString)
    const diffTime = targetDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <Card
      className={`bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 border-slate-200 dark:border-slate-800 ${className}`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
              <Calendar className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              Client Activity Tracker
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">Latest CRM Interactions</CardDescription>
          </div>
          <Select value={selectedRep} onValueChange={setSelectedRep}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by Rep" />
            </SelectTrigger>
            <SelectContent>
              {bdReps.map((rep) => (
                <SelectItem key={rep} value={rep}>
                  {rep === "all" ? "All Reps" : rep}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredActivities.map((activity, index) => {
            const daysUntil = getDaysUntil(activity.nextTouchpoint)
            const isOverdue = daysUntil < 0
            const isDueSoon = daysUntil >= 0 && daysUntil <= 3

            return (
              <div
                key={`${activity.clientName}-${index}`}
                className="group relative p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex items-center justify-center w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full">
                      <User className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate text-slate-900 dark:text-slate-100">
                        {activity.clientName}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-1">
                          {getContactMethodIcon(activity.contactMethod)}
                          {activity.lastActivity}
                        </span>
                        <span>•</span>
                        <span>{activity.BDRep}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        Next: {formatDate(activity.nextTouchpoint)}
                      </div>
                      <div
                        className={`text-xs font-medium ${
                          isOverdue ? "text-red-600" : isDueSoon ? "text-orange-600" : "text-green-600"
                        }`}
                      >
                        {isOverdue ? `${Math.abs(daysUntil)}d overdue` : isDueSoon ? `${daysUntil}d` : `${daysUntil}d`}
                      </div>
                    </div>
                    {getStatusBadge(activity.status)}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          View Client Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Log Activity
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Schedule Call
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No activities found for selected rep</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
