"use client"

/**
 * @fileoverview Assignment Table Component for Responsibility Matrix
 * @module AssignmentTable
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Table component for responsibility matrix with:
 * - Interactive assignment management
 * - Status tracking and updates
 * - Category grouping and expansion
 * - Role-based permissions
 * - Performance optimization with React.memo
 */

import React, { useState, useMemo, useCallback, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Users, ChevronDown, ChevronUp } from "lucide-react"

interface AssignmentTableProps {
  activeTab: string
  tasks: any[]
  roles: any[]
  roleColors: { [key: string]: string }
  userRole: string
  onAssignmentChange: (taskId: string, role: string, assignment: string) => void
  onStatusChange: (taskId: string, status: string) => void
}

// Lightweight Assignment Cell Component
const AssignmentCell: React.FC<{
  assignment: string
  onAssignmentChange: (value: string) => void
  disabled?: boolean
}> = React.memo(({ assignment, onAssignmentChange, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isChanging, setIsChanging] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const getAssignmentDisplay = useCallback((assignment: string) => {
    switch (assignment) {
      case "Primary":
        return { text: "P", color: "bg-blue-500 text-white dark:bg-blue-600 dark:text-white", title: "Primary" }
      case "Approve":
        return { text: "A", color: "bg-green-500 text-white dark:bg-green-600 dark:text-white", title: "Approve" }
      case "Support":
        return { text: "S", color: "bg-yellow-500 text-white dark:bg-yellow-600 dark:text-white", title: "Support" }
      default:
        return { text: "", color: "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500", title: "None" }
    }
  }, [])

  const display = getAssignmentDisplay(assignment)

  const handleAssignmentClick = useCallback(
    (newAssignment: string) => {
      setIsChanging(true)
      onAssignmentChange(newAssignment)
      setIsOpen(false)
      // Reset changing state after a brief delay
      setTimeout(() => setIsChanging(false), 200)
    },
    [onAssignmentChange]
  )

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  if (disabled) {
    return (
      <div
        className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold opacity-50 ${display.color}`}
      >
        {display.text}
      </div>
    )
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 hover:scale-110 ${
          display.color
        } ${isChanging ? "animate-pulse" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        title={display.title}
      >
        {display.text}
      </button>
      {isOpen && (
        <div className="absolute z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg py-1 min-w-20 top-6 left-0">
          {["None", "Support", "Primary", "Approve"].map((option) => (
            <button
              key={option}
              className="block w-full text-left px-3 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
              onClick={() => handleAssignmentClick(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
})

AssignmentCell.displayName = "AssignmentCell"

// Lightweight Status Cell Component
const StatusCell: React.FC<{
  status: string
  onStatusChange: (value: string) => void
  disabled?: boolean
}> = React.memo(({ status, onStatusChange, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "pending":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "active":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }, [])

  const handleStatusClick = useCallback(
    (newStatus: string) => {
      onStatusChange(newStatus)
      setIsOpen(false)
    },
    [onStatusChange]
  )

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  if (disabled) {
    return <Badge className={`text-xs py-0 px-1 ${getStatusColor(status)} opacity-50`}>{status.slice(0, 3)}</Badge>
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        className={`text-xs py-0 px-1 rounded ${getStatusColor(status)} transition-all duration-200 hover:scale-105`}
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
      >
        {status.slice(0, 3)}
      </button>
      {isOpen && (
        <div className="absolute z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg py-1 min-w-20 top-6 left-0">
          {["active", "pending", "completed"].map((option) => (
            <button
              key={option}
              className="block w-full text-left px-3 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 capitalize"
              onClick={() => handleStatusClick(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
})

StatusCell.displayName = "StatusCell"

// Utility function to convert hex color to CSS style
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

// Memoized Table Row Component
const TableRowMemo: React.FC<{
  task: any
  index: number
  roles: any[]
  roleColors: { [key: string]: string }
  onAssignmentChange: (taskId: string, role: string, assignment: string) => void
  onStatusChange: (taskId: string, status: string) => void
}> = React.memo(({ task, index, roles, roleColors, onAssignmentChange, onStatusChange }) => {
  const handleAssignmentChange = useCallback(
    (role: string, assignment: string) => {
      onAssignmentChange(task.id, role, assignment)
    },
    [task.id, onAssignmentChange]
  )

  const handleStatusChange = useCallback(
    (status: string) => {
      onStatusChange(task.id, status)
    },
    [task.id, onStatusChange]
  )

  // Get the responsible party's color
  const getResponsibleColor = useCallback(() => {
    const responsible = task.responsible
    if (!responsible || responsible === "" || responsible === "Unassigned") {
      return "bg-gray-400 hover:bg-gray-500 text-white dark:bg-gray-600 dark:hover:bg-gray-700"
    }

    const roleColor = roleColors[responsible]
    if (roleColor) {
      const rgb = hexToRgb(roleColor)
      if (rgb) {
        return {
          backgroundColor: roleColor,
          color: "white",
          border: `1px solid ${roleColor}`,
        }
      }
    }

    return "bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
  }, [task.responsible, roleColors])

  const responsibleColor = getResponsibleColor()
  const isResponsibleStyleObject = typeof responsibleColor === "object"

  return (
    <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-800 h-8">
      <TableCell className="font-medium text-xs py-0.5 px-1">{index + 1}</TableCell>
      <TableCell className="max-w-20 py-0.5 px-1">
        <div className="truncate text-xs" title={task.task}>
          {task.task}
        </div>
      </TableCell>
      <TableCell className="py-0.5 px-1">
        <StatusCell status={task.status} onStatusChange={handleStatusChange} />
      </TableCell>
      <TableCell className="py-0.5 px-1">
        <div className="flex justify-center">
          <Badge
            className={`text-xs py-0 px-1 ${isResponsibleStyleObject ? "" : responsibleColor}`}
            style={isResponsibleStyleObject ? responsibleColor : undefined}
          >
            {(task.responsible || "Unassigned").slice(0, 3)}
          </Badge>
        </div>
      </TableCell>
      {roles.map((role) => {
        const assignment = task.assignments[role.key] || "None"
        return (
          <TableCell key={role.key} className="text-center py-0.5 px-1">
            <div className="flex justify-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <AssignmentCell
                      assignment={assignment}
                      onAssignmentChange={(newAssignment) => handleAssignmentChange(role.key, newAssignment)}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{role.name}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TableCell>
        )
      })}
    </TableRow>
  )
})

TableRowMemo.displayName = "TableRowMemo"

// Category Header Component
const CategoryHeader: React.FC<{
  category: string
  isExpanded: boolean
  onToggle: () => void
  taskCount: number
  rolesCount: number
}> = React.memo(({ category, isExpanded, onToggle, taskCount, rolesCount }) => {
  return (
    <TableRow className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
      <TableCell colSpan={4 + rolesCount} className="py-2">
        <button
          className="flex items-center gap-2 w-full text-left hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          onClick={onToggle}
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          <span className="font-medium text-sm">{category}</span>
          <Badge variant="secondary" className="ml-2 text-xs">
            {taskCount} {taskCount === 1 ? "task" : "tasks"}
          </Badge>
        </button>
      </TableCell>
    </TableRow>
  )
})

CategoryHeader.displayName = "CategoryHeader"

// Main AssignmentTable Component
export const AssignmentTable: React.FC<AssignmentTableProps> = React.memo(
  ({ activeTab, tasks, roles, roleColors, userRole, onAssignmentChange, onStatusChange }) => {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

    // Group tasks by category
    const groupedTasks = useMemo(() => {
      const groups: { [key: string]: any[] } = {}
      tasks.forEach((task) => {
        if (!groups[task.category]) {
          groups[task.category] = []
        }
        groups[task.category].push(task)
      })
      return groups
    }, [tasks])

    // Initialize expanded categories (all expanded by default)
    useEffect(() => {
      const categories = Object.keys(groupedTasks)
      if (categories.length > 0) {
        setExpandedCategories(new Set(categories))
      }
    }, [groupedTasks])

    // Toggle category expansion
    const toggleCategory = useCallback((category: string) => {
      setExpandedCategories((prev) => {
        const newSet = new Set(prev)
        if (newSet.has(category)) {
          newSet.delete(category)
        } else {
          newSet.add(category)
        }
        return newSet
      })
    }, [])

    const getTabTitle = () => {
      switch (activeTab) {
        case "team":
          return "Team Responsibility Matrix"
        case "prime-contract":
          return "Prime Contract Matrix"
        case "subcontract":
          return "Subcontract Matrix"
        default:
          return "Responsibility Matrix"
      }
    }

    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4" />
            {getTabTitle()}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="overflow-x-auto max-w-full border rounded">
            <TooltipProvider>
              <Table className="w-full min-w-[500px] text-xs">
                <TableHeader>
                  <TableRow className="h-8">
                    <TableHead className="w-6 text-xs">#</TableHead>
                    <TableHead className="min-w-24 text-xs">Task</TableHead>
                    <TableHead className="w-14 text-xs">Status</TableHead>
                    <TableHead className="w-16 text-xs text-center">Responsible</TableHead>
                    {roles.map((role) => {
                      const roleColor = roleColors[role.key] || "#3b82f6"
                      const rgb = hexToRgb(roleColor)
                      const headerStyle = rgb
                        ? {
                            backgroundColor: roleColor,
                            color: "white",
                            border: `1px solid ${roleColor}`,
                          }
                        : undefined

                      return (
                        <TableHead key={role.key} className="w-10 text-center">
                          <div className="flex justify-center">
                            <Tooltip>
                              <TooltipTrigger>
                                <div
                                  className="px-2 py-0.5 rounded-full flex items-center justify-center text-white text-xs font-bold min-w-8 h-5"
                                  style={
                                    headerStyle || {
                                      backgroundColor: "#3b82f6",
                                      color: "white",
                                      border: "1px solid #3b82f6",
                                    }
                                  }
                                >
                                  {role.key}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{role.name}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TableHead>
                      )
                    })}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(groupedTasks).map(([category, categoryTasks]) => (
                    <React.Fragment key={category}>
                      <CategoryHeader
                        category={category}
                        isExpanded={expandedCategories.has(category)}
                        onToggle={() => toggleCategory(category)}
                        taskCount={categoryTasks.length}
                        rolesCount={roles.length}
                      />
                      {expandedCategories.has(category) &&
                        categoryTasks.map((task, index) => (
                          <TableRowMemo
                            key={task.id}
                            task={task}
                            index={index}
                            roles={roles}
                            roleColors={roleColors}
                            onAssignmentChange={onAssignmentChange}
                            onStatusChange={onStatusChange}
                          />
                        ))}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>
    )
  }
)

AssignmentTable.displayName = "AssignmentTable"
