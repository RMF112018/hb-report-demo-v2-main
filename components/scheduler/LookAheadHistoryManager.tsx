/**
 * @fileoverview Look Ahead History Manager Component
 * @module LookAheadHistoryManager
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Allows user to reuse past entries (Weeks N-1, N-2) and auto-populate Weeks N+1
 */

"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  History,
  Copy,
  Eye,
  Calendar,
  CheckCircle,
  Clock,
  PlayCircle,
  ChevronRight,
  Archive,
  RefreshCw,
  Plus,
  Trash2,
} from "lucide-react"

interface LookAheadEntry {
  id: string
  activityId: string
  activityName: string
  subSteps: any[]
  createdBy: string
  createdDate: Date
  lastUpdated: Date
  week: number
  status: "draft" | "committed" | "completed"
  notes: string
  weekOf: Date
  completionPercentage: number
}

interface LookAheadHistoryManagerProps {
  projectId: string
  onCopyEntry: (entry: LookAheadEntry) => void
  onViewEntry: (entry: LookAheadEntry) => void
  onDeleteEntry?: (entryId: string) => void
  currentWeek: Date
  className?: string
}

const LookAheadHistoryManager: React.FC<LookAheadHistoryManagerProps> = ({
  projectId,
  onCopyEntry,
  onViewEntry,
  onDeleteEntry,
  currentWeek,
  className = "",
}) => {
  const [selectedWeek, setSelectedWeek] = useState<Date>(currentWeek)
  const [showHistoryDialog, setShowHistoryDialog] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<LookAheadEntry | null>(null)

  // Generate mock historical data
  const generateHistoricalEntries = (): LookAheadEntry[] => {
    const entries: LookAheadEntry[] = []
    const today = new Date()

    // Generate entries for last 8 weeks
    for (let weekOffset = -8; weekOffset <= 2; weekOffset++) {
      const weekDate = new Date(today)
      weekDate.setDate(today.getDate() + weekOffset * 7)

      const weekEntries = [
        {
          id: `entry-${weekOffset}-1`,
          activityId: "A001",
          activityName: "MEP Rough-in Level 3",
          subSteps: [
            { id: "ss1", description: "Electrical layout", status: "completed" },
            { id: "ss2", description: "Plumbing rough-in", status: "completed" },
            { id: "ss3", description: "HVAC ductwork", status: "in-progress" },
          ],
          createdBy: "John Smith",
          createdDate: new Date(weekDate.getTime() - 7 * 24 * 60 * 60 * 1000),
          lastUpdated: new Date(weekDate.getTime() - 5 * 24 * 60 * 60 * 1000),
          week: 1,
          status: (weekOffset < 0 ? "completed" : weekOffset === 0 ? "committed" : "draft") as
            | "draft"
            | "committed"
            | "completed",
          notes: `Week ${weekOffset + 9} look ahead for MEP work`,
          weekOf: weekDate,
          completionPercentage: weekOffset < 0 ? 100 : weekOffset === 0 ? 65 : 0,
        },
        {
          id: `entry-${weekOffset}-2`,
          activityId: "A002",
          activityName: "Drywall Installation",
          subSteps: [
            { id: "ss4", description: "Frame inspection", status: "completed" },
            { id: "ss5", description: "Drywall hanging", status: "in-progress" },
            { id: "ss6", description: "Taping and mudding", status: "not-started" },
          ],
          createdBy: "Sarah Johnson",
          createdDate: new Date(weekDate.getTime() - 6 * 24 * 60 * 60 * 1000),
          lastUpdated: new Date(weekDate.getTime() - 4 * 24 * 60 * 60 * 1000),
          week: 2,
          status: (weekOffset < -1 ? "completed" : weekOffset <= 0 ? "committed" : "draft") as
            | "draft"
            | "committed"
            | "completed",
          notes: `Week ${weekOffset + 9} drywall activities`,
          weekOf: weekDate,
          completionPercentage: weekOffset < -1 ? 100 : weekOffset <= 0 ? 45 : 0,
        },
      ]

      entries.push(...weekEntries)
    }

    return entries.sort((a, b) => b.weekOf.getTime() - a.weekOf.getTime())
  }

  const historicalEntries = generateHistoricalEntries()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30"
      case "committed":
        return "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30"
      case "completed":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30"
      default:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <PlayCircle className="h-4 w-4" />
      case "committed":
        return <Clock className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <PlayCircle className="h-4 w-4" />
    }
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatWeekOf = (date: Date): string => {
    const weekStart = new Date(date)
    const weekEnd = new Date(date)
    weekEnd.setDate(weekEnd.getDate() + 6)

    return `${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${weekEnd.toLocaleDateString(
      "en-US",
      { month: "short", day: "numeric" }
    )}`
  }

  const groupEntriesByWeek = (entries: LookAheadEntry[]) => {
    const groups: Record<string, LookAheadEntry[]> = {}

    entries.forEach((entry) => {
      const weekKey = formatWeekOf(entry.weekOf)
      if (!groups[weekKey]) {
        groups[weekKey] = []
      }
      groups[weekKey].push(entry)
    })

    return groups
  }

  const groupedEntries = groupEntriesByWeek(historicalEntries)

  const handleCopyForwardWeek = (weekEntries: LookAheadEntry[]) => {
    // Copy all entries from a specific week forward
    weekEntries.forEach((entry) => {
      const newEntry = {
        ...entry,
        id: `copy-${Date.now()}-${entry.id}`,
        createdDate: new Date(),
        lastUpdated: new Date(),
        status: "draft" as const,
        weekOf: new Date(currentWeek.getTime() + 7 * 24 * 60 * 60 * 1000),
        completionPercentage: 0,
      }
      onCopyEntry(newEntry)
    })
  }

  const getWeekStatus = (weekEntries: LookAheadEntry[]): string => {
    const statuses = weekEntries.map((e) => e.status)
    if (statuses.every((s) => s === "completed")) return "completed"
    if (statuses.some((s) => s === "committed")) return "committed"
    return "draft"
  }

  const getWeekProgress = (weekEntries: LookAheadEntry[]): number => {
    const total = weekEntries.length
    const completed = weekEntries.filter((e) => e.status === "completed").length
    return Math.round((completed / total) * 100)
  }

  return (
    <Card className={`border-border ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-semibold">Look Ahead History</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowHistoryDialog(true)} className="h-8 px-3 text-xs">
              <Archive className="h-3 w-3 mr-1" />
              View All
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="h-8 px-3 text-xs">
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button
            variant="outline"
            className="h-auto p-3 flex flex-col items-center gap-2"
            onClick={() => {
              const lastWeekEntries = Object.values(groupedEntries)[1] || []
              handleCopyForwardWeek(lastWeekEntries)
            }}
          >
            <Copy className="h-4 w-4" />
            <span className="text-xs">Copy Last Week</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto p-3 flex flex-col items-center gap-2"
            onClick={() => {
              const twoWeeksAgoEntries = Object.values(groupedEntries)[2] || []
              handleCopyForwardWeek(twoWeeksAgoEntries)
            }}
          >
            <Copy className="h-4 w-4" />
            <span className="text-xs">Copy 2 Weeks Ago</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto p-3 flex flex-col items-center gap-2"
            onClick={() => setShowHistoryDialog(true)}
          >
            <Eye className="h-4 w-4" />
            <span className="text-xs">Browse History</span>
          </Button>
        </div>

        {/* Recent Weeks Summary */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Recent Weeks</h4>
          {Object.entries(groupedEntries)
            .slice(0, 4)
            .map(([weekKey, weekEntries]) => (
              <div key={weekKey} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-sm">{weekKey}</span>
                    <Badge className={`text-xs ${getStatusColor(getWeekStatus(weekEntries))}`}>
                      {getWeekStatus(weekEntries)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{getWeekProgress(weekEntries)}% complete</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyForwardWeek(weekEntries)}
                      className="h-6 px-2 text-xs"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {weekEntries.length} entries • {weekEntries.reduce((sum, e) => sum + e.subSteps.length, 0)} subtasks
                </div>
              </div>
            ))}
        </div>

        {/* History Dialog */}
        <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Look Ahead History</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4 p-4">
                {Object.entries(groupedEntries).map(([weekKey, weekEntries]) => (
                  <Card key={weekKey} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{weekKey}</span>
                        <Badge className={`text-xs ${getStatusColor(getWeekStatus(weekEntries))}`}>
                          {getWeekStatus(weekEntries)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{getWeekProgress(weekEntries)}% complete</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyForwardWeek(weekEntries)}
                          className="h-6 px-2 text-xs"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy Week
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {weekEntries.map((entry) => (
                        <div key={entry.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(entry.status)}
                            <div>
                              <div className="font-medium text-sm">{entry.activityName}</div>
                              <div className="text-xs text-muted-foreground">
                                {entry.subSteps.length} subtasks • {entry.createdBy} • {formatDate(entry.createdDate)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`text-xs ${getStatusColor(entry.status)}`}>{entry.status}</Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onViewEntry(entry)}
                              className="h-6 px-2 text-xs"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onCopyEntry(entry)}
                              className="h-6 px-2 text-xs"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            {onDeleteEntry && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDeleteEntry(entry.id)}
                                className="h-6 px-2 text-xs text-red-600"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

export default LookAheadHistoryManager
