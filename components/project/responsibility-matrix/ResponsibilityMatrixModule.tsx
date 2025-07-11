"use client"

/**
 * @fileoverview Responsibility Matrix Module Component
 * @module ResponsibilityMatrixModule
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Main module component for responsibility matrix functionality following v-3.0.mdc standards:
 * - Modular architecture with separated concerns
 * - Lazy loading and performance optimization
 * - TypeScript type safety
 * - Error boundaries and loading states
 * - Role-based access control
 * - Responsive design
 */

import React, { useState, useMemo, useCallback, useRef, useEffect } from "react"
import { useResponsibilityMatrix } from "@/hooks/use-responsibility-matrix"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw, Download, Users, BarChart3, CheckCircle, Clock, Filter, AlertCircle, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

// Import sub-components
import { AssignmentTable } from "./AssignmentTable"
import { ExportControls } from "./ExportControls"

interface ResponsibilityMatrixModuleProps {
  projectId: string
  user: any
  userRole: string
  className?: string
}

// Intersection Observer Hook for performance optimization
const useIntersectionObserver = (ref: React.RefObject<Element | null>, options: IntersectionObserverInit = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [ref, options])

  return isIntersecting
}

// Memoized Summary Cards Component
const SummaryCards: React.FC<{ metrics: any }> = React.memo(({ metrics }) => {
  const summaryData = useMemo(
    () => [
      {
        icon: Users,
        label: "Total Tasks",
        value: metrics.totalTasks,
        color: "text-blue-600 dark:text-blue-400",
      },
      {
        icon: CheckCircle,
        label: "Completed",
        value: metrics.completedTasks,
        color: "text-green-600 dark:text-green-400",
      },
      {
        icon: Clock,
        label: "Pending",
        value: metrics.pendingTasks,
        color: "text-orange-600 dark:text-orange-400",
      },
      {
        icon: BarChart3,
        label: "Completion Rate",
        value: `${metrics.completionRate.toFixed(1)}%`,
        color: "text-purple-600 dark:text-purple-400",
      },
    ],
    [metrics]
  )

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {summaryData.map((item, index) => (
        <Card key={index}>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <item.icon className={`h-5 w-5 ${item.color}`} />
              <div>
                <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
                <p className="text-lg font-bold text-foreground">{item.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
})

SummaryCards.displayName = "SummaryCards"

// Main ResponsibilityMatrixModule Component
const ResponsibilityMatrixModule: React.FC<ResponsibilityMatrixModuleProps> = React.memo(
  ({ projectId, user, userRole, className = "" }) => {
    const {
      tasks,
      roles,
      metrics,
      activeTab,
      setActiveTab,
      loading,
      updateTaskAssignment,
      updateTaskStatus,
      resetToDefault,
      roleColors,
    } = useResponsibilityMatrix(projectId)

    const [filterStatus, setFilterStatus] = useState<"all" | "active" | "pending" | "completed">("all")
    const [filterCategory, setFilterCategory] = useState<string>("all")
    const [isRendering, setIsRendering] = useState(true)
    const [showAllRoles, setShowAllRoles] = useState(false)

    const containerRef = useRef<HTMLDivElement>(null)
    const isVisible = useIntersectionObserver(containerRef, { threshold: 0.1 })

    // Memoized filtered tasks
    const filteredTasks = useMemo(() => {
      return tasks.filter((task) => {
        const statusMatch = filterStatus === "all" || task.status === filterStatus
        const categoryMatch = filterCategory === "all" || task.category === filterCategory
        return statusMatch && categoryMatch
      })
    }, [tasks, filterStatus, filterCategory])

    // Memoized categories
    const categories = useMemo(() => {
      return [...new Set(tasks.map((task) => task.category))]
    }, [tasks])

    // Memoized event handlers
    const handleAssignmentChange = useCallback(
      (taskId: string, role: string, newAssignment: string) => {
        updateTaskAssignment(taskId, role, newAssignment as "Approve" | "Primary" | "Support" | "None")
      },
      [updateTaskAssignment]
    )

    const handleStatusChange = useCallback(
      (taskId: string, newStatus: string) => {
        updateTaskStatus(taskId, newStatus as "active" | "pending" | "completed")
      },
      [updateTaskStatus]
    )

    const handleResetToDefault = useCallback(() => {
      resetToDefault()
    }, [resetToDefault])

    const handleExport = useCallback(() => {
      // Export functionality will be handled by ExportControls component
      console.log("Export functionality triggered")
    }, [])

    // Progressive rendering
    useEffect(() => {
      if (isVisible && !loading) {
        const timer = setTimeout(() => {
          setIsRendering(false)
        }, 100)
        return () => clearTimeout(timer)
      }
    }, [isVisible, loading, filteredTasks])

    // Reset rendering state when tasks change
    useEffect(() => {
      setIsRendering(true)
    }, [tasks])

    // Loading state
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="text-muted-foreground">Loading responsibility matrix...</span>
          </div>
        </div>
      )
    }

    // Intersection observer placeholder
    if (!isVisible) {
      return <div ref={containerRef} className={cn("h-64", className)} />
    }

    // Rendering state
    if (isRendering) {
      return (
        <div ref={containerRef} className={className}>
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="text-muted-foreground text-sm">Rendering matrix...</span>
            </div>
          </div>
        </div>
      )
    }

    // Error state
    if (!tasks || tasks.length === 0) {
      return (
        <div ref={containerRef} className={cn("space-y-4", className)}>
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Tasks Found</h3>
                <p className="text-muted-foreground mb-4">
                  No responsibility matrix tasks are available for this project.
                </p>
                <Button variant="outline" onClick={handleResetToDefault}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tasks
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return (
      <div ref={containerRef} className={cn("space-y-4 w-full max-w-full overflow-hidden", className)}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Responsibility Matrix</h3>
            <p className="text-sm text-muted-foreground">
              Manage task assignments and accountability across project teams
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ExportControls
              projectId={projectId}
              tasks={filteredTasks}
              roles={roles}
              userRole={userRole}
              onExport={handleExport}
            />
            <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
              <Plus className="h-4 w-4 mr-1" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <SummaryCards metrics={metrics} />

        {/* Filters and Controls */}
        <div className="flex items-center justify-between w-full flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by category" />
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
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleResetToDefault}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Matrix Tabs */}
        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
          <TabsList className="grid w-full grid-cols-3 h-8">
            <TabsTrigger value="team" className="text-xs">
              Team Matrix
            </TabsTrigger>
            <TabsTrigger value="prime-contract" className="text-xs">
              Prime Contract
            </TabsTrigger>
            <TabsTrigger value="subcontract" className="text-xs">
              Subcontract
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-3">
            <AssignmentTable
              activeTab={activeTab}
              tasks={filteredTasks}
              roles={roles}
              roleColors={roleColors}
              userRole={userRole}
              onAssignmentChange={handleAssignmentChange}
              onStatusChange={handleStatusChange}
            />
          </TabsContent>
        </Tabs>

        {/* Legend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-foreground">Legend</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {/* Assignment Types */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Assignment Types:</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500 dark:bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                      P
                    </div>
                    <span>Primary</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-green-500 dark:bg-green-600 text-white flex items-center justify-center text-xs font-bold">
                      A
                    </div>
                    <span>Approve</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 dark:bg-yellow-600 text-white flex items-center justify-center text-xs font-bold">
                      S
                    </div>
                    <span>Support</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 flex items-center justify-center text-xs"></div>
                    <span>None</span>
                  </div>
                </div>
              </div>

              {/* Role Colors */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-muted-foreground">Role Colors:</p>
                  {roles.length > 6 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAllRoles(!showAllRoles)}
                      className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      {showAllRoles ? "Show Less" : `Show All (${roles.length})`}
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  {(showAllRoles ? roles : roles.slice(0, 6)).map((role) => {
                    const roleColor = roleColors[role.key] || "#3b82f6"
                    return (
                      <div key={role.key} className="flex items-center gap-1">
                        <div
                          className="px-2 py-0.5 rounded-full flex items-center justify-center text-white text-xs font-bold min-w-6 h-4"
                          style={{ backgroundColor: roleColor, border: `1px solid ${roleColor}` }}
                        >
                          {role.key}
                        </div>
                        <span>{role.name}</span>
                      </div>
                    )
                  })}
                  {!showAllRoles && roles.length > 6 && (
                    <span className="text-xs text-muted-foreground">+{roles.length - 6} more</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
)

ResponsibilityMatrixModule.displayName = "ResponsibilityMatrixModule"

export default ResponsibilityMatrixModule
