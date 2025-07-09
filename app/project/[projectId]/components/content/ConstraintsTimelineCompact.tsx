/**
 * @fileoverview Compact Constraints Timeline Component
 * @module ConstraintsTimelineCompact
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Compact, professional constraints timeline with clickable rows for Field Management integration
 */

"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  User,
  MapPin,
  Target,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data for constraints timeline
const mockConstraints = [
  {
    id: "1",
    no: "C-001",
    description: "Electrical rough-in delayed due to structural modifications",
    category: "Electrical",
    priority: "High",
    status: "Open",
    assigned: "John Smith",
    dateIdentified: "2024-01-15",
    dueDate: "2024-01-25",
    startDate: "2024-01-15",
    endDate: "2024-01-25",
    progress: 30,
    daysElapsed: 10,
    impact: "Schedule delay of 3 days",
  },
  {
    id: "2",
    no: "C-002",
    description: "HVAC ductwork conflicts with sprinkler system",
    category: "HVAC",
    priority: "High",
    status: "In Progress",
    assigned: "Mike Johnson",
    dateIdentified: "2024-01-12",
    dueDate: "2024-01-22",
    startDate: "2024-01-12",
    endDate: "2024-01-22",
    progress: 65,
    daysElapsed: 13,
    impact: "Requires coordination meeting",
  },
  {
    id: "3",
    no: "C-003",
    description: "Concrete strength test results below specification",
    category: "Structural",
    priority: "Critical",
    status: "Open",
    assigned: "Sarah Wilson",
    dateIdentified: "2024-01-18",
    dueDate: "2024-01-28",
    startDate: "2024-01-18",
    endDate: "2024-01-28",
    progress: 10,
    daysElapsed: 7,
    impact: "Potential structural rework",
  },
  {
    id: "4",
    no: "C-004",
    description: "Permit approval delayed for window installation",
    category: "Permits",
    priority: "Medium",
    status: "Open",
    assigned: "David Lee",
    dateIdentified: "2024-01-20",
    dueDate: "2024-02-05",
    startDate: "2024-01-20",
    endDate: "2024-02-05",
    progress: 20,
    daysElapsed: 5,
    impact: "Facade work on hold",
  },
  {
    id: "5",
    no: "C-005",
    description: "Material delivery delayed due to supplier issues",
    category: "Procurement",
    priority: "Medium",
    status: "Resolved",
    assigned: "Lisa Chen",
    dateIdentified: "2024-01-10",
    dueDate: "2024-01-20",
    startDate: "2024-01-10",
    endDate: "2024-01-20",
    progress: 100,
    daysElapsed: 15,
    impact: "Minor schedule adjustment",
  },
  {
    id: "6",
    no: "C-006",
    description: "Fire safety inspection requires additional exits",
    category: "Safety",
    priority: "High",
    status: "Open",
    assigned: "Robert Kim",
    dateIdentified: "2024-01-22",
    dueDate: "2024-02-10",
    startDate: "2024-01-22",
    endDate: "2024-02-10",
    progress: 15,
    daysElapsed: 3,
    impact: "Design modification needed",
  },
]

interface ConstraintsTimelineCompactProps {
  projectId?: string
  userRole?: string
  onConstraintClick?: (constraint: any) => void
}

const ConstraintsTimelineCompact: React.FC<ConstraintsTimelineCompactProps> = ({
  projectId,
  userRole = "project-manager",
  onConstraintClick,
}) => {
  const [constraints] = useState(mockConstraints)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [timeRange, setTimeRange] = useState("month")

  // Filter constraints
  const filteredConstraints = useMemo(() => {
    let filtered = constraints

    if (selectedCategory !== "all") {
      filtered = filtered.filter((c) => c.category === selectedCategory)
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((c) => c.status === selectedStatus)
    }

    return filtered.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
  }, [constraints, selectedCategory, selectedStatus])

  const categories = useMemo(() => {
    return [...new Set(constraints.map((c) => c.category))].sort()
  }, [constraints])

  const statuses = ["Open", "In Progress", "Resolved"]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-500"
      case "High":
        return "bg-orange-500"
      case "Medium":
        return "bg-yellow-500"
      case "Low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const getDaysFromStart = (startDate: string) => {
    const start = new Date(startDate)
    const now = new Date()
    return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }

  const getTimelineWidth = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(120, Math.min(400, totalDays * 8)) // Min 120px, max 400px
  }

  const handleConstraintClick = (constraint: any) => {
    if (onConstraintClick) {
      onConstraintClick(constraint)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Constraints Timeline</h3>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Timeline View</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{filteredConstraints.length} constraints</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredConstraints.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No constraints found for selected filters</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredConstraints.map((constraint) => (
                <TooltipProvider key={constraint.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="group cursor-pointer p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                        onClick={() => handleConstraintClick(constraint)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={cn("w-2 h-2 rounded-full", getPriorityColor(constraint.priority))} />
                            <span className="font-medium text-sm">{constraint.no}</span>
                            <Badge variant="outline" className="text-xs">
                              {constraint.category}
                            </Badge>
                            <Badge className={cn("text-xs", getStatusColor(constraint.status))}>
                              {constraint.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>{constraint.assigned}</span>
                            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>

                        <div className="mb-2">
                          <p className="text-sm font-medium truncate">{constraint.description}</p>
                          <p className="text-xs text-muted-foreground truncate">{constraint.impact}</p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(constraint.startDate)}</span>
                          </div>

                          <div className="flex-1">
                            <div className="relative">
                              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className={cn(
                                    "h-full transition-all duration-300",
                                    constraint.status === "Resolved"
                                      ? "bg-green-500"
                                      : constraint.status === "In Progress"
                                      ? "bg-blue-500"
                                      : "bg-orange-500"
                                  )}
                                  style={{ width: `${constraint.progress}%` }}
                                />
                              </div>
                              <div
                                className="absolute -top-1 -right-1 w-4 h-4 bg-white dark:bg-gray-800 border-2 border-current rounded-full"
                                style={{
                                  left: `${constraint.progress}%`,
                                  transform: "translateX(-50%)",
                                  borderColor:
                                    constraint.status === "Resolved"
                                      ? "#10b981"
                                      : constraint.status === "In Progress"
                                      ? "#3b82f6"
                                      : "#f59e0b",
                                }}
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{formatDate(constraint.dueDate)}</span>
                          </div>

                          <div className="text-xs font-medium">{constraint.progress}%</div>
                        </div>

                        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            <span>Days elapsed: {constraint.daysElapsed}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>Priority: {constraint.priority}</span>
                          </div>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="max-w-xs">
                        <p className="font-medium">{constraint.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{constraint.impact}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs">
                          <Badge variant="outline">{constraint.priority}</Badge>
                          <Badge variant="outline">{constraint.status}</Badge>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Open</p>
                <p className="text-lg font-semibold">{constraints.filter((c) => c.status === "Open").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">In Progress</p>
                <p className="text-lg font-semibold">{constraints.filter((c) => c.status === "In Progress").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Resolved</p>
                <p className="text-lg font-semibold">{constraints.filter((c) => c.status === "Resolved").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm font-medium">Critical</p>
                <p className="text-lg font-semibold">
                  {constraints.filter((c) => c.priority === "Critical" && c.status !== "Resolved").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ConstraintsTimelineCompact
