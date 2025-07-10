"use client"

import React, { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
// DateTimePicker component not available, using standard HTML input
import {
  CheckSquare,
  Users,
  Link,
  ChevronDown,
  ChevronRight,
  X,
  Calendar,
  AlertTriangle,
  Building2,
  DollarSign,
  FileText,
  Clock,
  Bell,
  Target,
  Flag,
  User,
  CalendarDays,
} from "lucide-react"

interface EnhancedTaskComposerProps {
  isOpen: boolean
  onClose: () => void
  onCreateTask: (taskData: TaskCreationData) => void
  projectId: string
  currentUser: any
}

interface TaskCreationData {
  title: string
  description: string
  assignedTo: string
  priority: "low" | "medium" | "high"
  dueDate?: Date
  estimatedHours?: number
  linkedData?: ProjectDataLink
  reminders: ReminderSettings[]
  tags: string[]
  dependencies: string[]
  isBlocking: boolean
}

interface ProjectDataLink {
  moduleType: string
  moduleName: string
  elementId?: string
  elementName?: string
  path: string[]
}

interface ReminderSettings {
  id: string
  type: "email" | "notification"
  timing: "1hour" | "1day" | "3days" | "1week"
  enabled: boolean
}

interface ProjectModule {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  children?: ProjectElement[]
}

interface ProjectElement {
  id: string
  name: string
  type: string
}

// Mock users for demo
const mockUsers = {
  "current-user": { id: "current-user", name: "Current User", initials: "CU", role: "Project Manager" },
  "john-doe": { id: "john-doe", name: "John Doe", initials: "JD", role: "Site Superintendent" },
  "jane-smith": { id: "jane-smith", name: "Jane Smith", initials: "JS", role: "Project Engineer" },
  "mike-johnson": { id: "mike-johnson", name: "Mike Johnson", initials: "MJ", role: "Safety Manager" },
  "sarah-wilson": { id: "sarah-wilson", name: "Sarah Wilson", initials: "SW", role: "Estimator" },
  "david-brown": { id: "david-brown", name: "David Brown", initials: "DB", role: "Field Supervisor" },
  "lisa-garcia": { id: "lisa-garcia", name: "Lisa Garcia", initials: "LG", role: "QA/QC Manager" },
}

// Mock project modules structure (same as message composer)
const projectModules: ProjectModule[] = [
  {
    id: "financial",
    name: "Financial Management",
    icon: DollarSign,
    children: [
      { id: "budget-001", name: "Project Budget Overview", type: "budget" },
      { id: "co-001", name: "Change Order #001 - Electrical", type: "change-order" },
      { id: "co-002", name: "Change Order #002 - HVAC", type: "change-order" },
      { id: "invoice-045", name: "Invoice #045 - Steel Contractor", type: "invoice" },
      { id: "forecast-q2", name: "Q2 Cash Flow Forecast", type: "forecast" },
    ],
  },
  {
    id: "scheduling",
    name: "Schedule Management",
    icon: Calendar,
    children: [
      { id: "master-schedule", name: "Master Project Schedule", type: "schedule" },
      { id: "lookahead-w25", name: "3-Week Lookahead - Week 25", type: "lookahead" },
      { id: "milestone-foundation", name: "Foundation Completion Milestone", type: "milestone" },
      { id: "critical-path", name: "Critical Path Analysis", type: "analysis" },
    ],
  },
  {
    id: "field-ops",
    name: "Field Operations",
    icon: Building2,
    children: [
      { id: "daily-log-0614", name: "Daily Log - June 14, 2025", type: "daily-log" },
      { id: "safety-inspection-001", name: "Weekly Safety Inspection", type: "inspection" },
      { id: "quality-checklist-concrete", name: "Concrete Pour QC Checklist", type: "checklist" },
      { id: "material-delivery-steel", name: "Steel Delivery Schedule", type: "delivery" },
    ],
  },
  {
    id: "documents",
    name: "Contract Documents",
    icon: FileText,
    children: [
      { id: "contract-prime", name: "Prime Contract Agreement", type: "contract" },
      { id: "drawings-architectural", name: "Architectural Drawings Rev. C", type: "drawings" },
      { id: "specs-mechanical", name: "Mechanical Specifications", type: "specifications" },
      { id: "permit-building", name: "Building Permit #2025-001", type: "permit" },
    ],
  },
  {
    id: "compliance",
    name: "Compliance & Quality",
    icon: CheckSquare,
    children: [
      { id: "rfi-001", name: "RFI #001 - Foundation Details", type: "rfi" },
      { id: "submittal-windows", name: "Window Submittal Package", type: "submittal" },
      { id: "test-report-concrete", name: "Concrete Test Report #15", type: "test-report" },
      { id: "inspection-report-electrical", name: "Electrical Rough-in Inspection", type: "inspection" },
    ],
  },
  {
    id: "team",
    name: "Team & Resources",
    icon: Users,
    children: [
      { id: "staffing-plan", name: "Project Staffing Plan", type: "staffing" },
      { id: "spcr-001", name: "SPCR #001 - Additional Foreman", type: "spcr" },
      { id: "team-assignments", name: "Current Team Assignments", type: "assignments" },
      { id: "training-safety", name: "Safety Training Records", type: "training" },
    ],
  },
]

// Common task tags
const taskTags = [
  "urgent",
  "review-required",
  "documentation",
  "approval-needed",
  "coordination",
  "safety-critical",
  "client-facing",
  "regulatory",
]

export const EnhancedTaskComposer: React.FC<EnhancedTaskComposerProps> = ({
  isOpen,
  onClose,
  onCreateTask,
  projectId,
  currentUser,
}) => {
  const [taskData, setTaskData] = useState<TaskCreationData>({
    title: "",
    description: "",
    assignedTo: "",
    priority: "medium",
    reminders: [
      { id: "1day", type: "notification", timing: "1day", enabled: true },
      { id: "1hour", type: "email", timing: "1hour", enabled: false },
    ],
    tags: [],
    dependencies: [],
    isBlocking: false,
  })

  const [linkedData, setLinkedData] = useState<ProjectDataLink | null>(null)
  const [showProjectDataPicker, setShowProjectDataPicker] = useState(false)
  const [expandedModules, setExpandedModules] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const availableUsers = Object.values(mockUsers)

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => (prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]))
  }

  const selectProjectData = (module: ProjectModule, element?: ProjectElement) => {
    const linkData: ProjectDataLink = {
      moduleType: module.id,
      moduleName: module.name,
      elementId: element?.id,
      elementName: element?.name,
      path: element ? [module.name, element.name] : [module.name],
    }
    setLinkedData(linkData)
    setShowProjectDataPicker(false)
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const updateReminder = (id: string, field: keyof ReminderSettings, value: any) => {
    setTaskData((prev) => ({
      ...prev,
      reminders: prev.reminders.map((reminder) => (reminder.id === id ? { ...reminder, [field]: value } : reminder)),
    }))
  }

  const addReminder = () => {
    const newReminder: ReminderSettings = {
      id: Date.now().toString(),
      type: "notification",
      timing: "1day",
      enabled: true,
    }
    setTaskData((prev) => ({
      ...prev,
      reminders: [...prev.reminders, newReminder],
    }))
  }

  const removeReminder = (id: string) => {
    setTaskData((prev) => ({
      ...prev,
      reminders: prev.reminders.filter((reminder) => reminder.id !== id),
    }))
  }

  const handleCreateTask = () => {
    if (!taskData.title.trim() || !taskData.assignedTo) return

    const finalTaskData: TaskCreationData = {
      ...taskData,
      tags: selectedTags,
      linkedData: linkedData || undefined,
    }

    onCreateTask(finalTaskData)
    handleClose()
  }

  const handleClose = () => {
    setTaskData({
      title: "",
      description: "",
      assignedTo: "",
      priority: "medium",
      reminders: [
        { id: "1day", type: "notification", timing: "1day", enabled: true },
        { id: "1hour", type: "email", timing: "1hour", enabled: false },
      ],
      tags: [],
      dependencies: [],
      isBlocking: false,
    })
    setLinkedData(null)
    setShowProjectDataPicker(false)
    setExpandedModules([])
    setSelectedTags([])
    onClose()
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 dark:bg-red-900/20"
      case "medium":
        return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20"
      case "low":
        return "text-green-600 bg-green-50 dark:bg-green-900/20"
      default:
        return "text-gray-600 bg-gray-50 dark:bg-gray-900/20"
    }
  }

  const getReminderTimingLabel = (timing: string) => {
    switch (timing) {
      case "1hour":
        return "1 hour before"
      case "1day":
        return "1 day before"
      case "3days":
        return "3 days before"
      case "1week":
        return "1 week before"
      default:
        return timing
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5" />
            Create New Task
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-12 gap-6 h-full">
          {/* Main Form */}
          <div className="col-span-8 space-y-4">
            {/* Basic Task Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Task Title *</Label>
                <Input
                  id="title"
                  value={taskData.title}
                  onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                  placeholder="What needs to be done?"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Task Description</Label>
                <Textarea
                  id="description"
                  value={taskData.description}
                  onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                  placeholder="Provide details about this task..."
                  className="mt-1 min-h-[100px]"
                />
              </div>
            </div>

            {/* Assignment and Priority */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Assign To *
                </Label>
                <Select
                  value={taskData.assignedTo}
                  onValueChange={(value) => setTaskData({ ...taskData, assignedTo: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-5 h-5">
                            <AvatarFallback className="text-xs">{user.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="font-medium">{user.name}</span>
                            <span className="text-xs text-muted-foreground ml-1">({user.role})</span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <Flag className="w-4 h-4" />
                  Priority Level
                </Label>
                <Select
                  value={taskData.priority}
                  onValueChange={(value: "low" | "medium" | "high") => setTaskData({ ...taskData, priority: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Low Priority
                      </span>
                    </SelectItem>
                    <SelectItem value="medium">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                        Medium Priority
                      </span>
                    </SelectItem>
                    <SelectItem value="high">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        High Priority
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="estimatedHours">Estimated Hours</Label>
                <Input
                  id="estimatedHours"
                  type="number"
                  min="0"
                  step="0.5"
                  value={taskData.estimatedHours || ""}
                  onChange={(e) =>
                    setTaskData({ ...taskData, estimatedHours: parseFloat(e.target.value) || undefined })
                  }
                  placeholder="Hours"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Due Date */}
            <div>
              <Label className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                Due Date
              </Label>
              <Input
                type="datetime-local"
                value={taskData.dueDate ? taskData.dueDate.toISOString().slice(0, 16) : ""}
                onChange={(e) =>
                  setTaskData({ ...taskData, dueDate: e.target.value ? new Date(e.target.value) : undefined })
                }
                className="mt-1"
              />
            </div>

            {/* Task Settings */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="blocking"
                  checked={taskData.isBlocking}
                  onCheckedChange={(checked) => setTaskData({ ...taskData, isBlocking: !!checked })}
                />
                <Label htmlFor="blocking" className="text-sm font-medium">
                  This task blocks other work
                </Label>
              </div>
            </div>

            {/* Reminders */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Reminders
                </Label>
                <Button variant="outline" size="sm" onClick={addReminder}>
                  Add Reminder
                </Button>
              </div>
              <div className="space-y-2">
                {taskData.reminders.map((reminder) => (
                  <div key={reminder.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Checkbox
                      checked={reminder.enabled}
                      onCheckedChange={(checked) => updateReminder(reminder.id, "enabled", !!checked)}
                    />
                    <Select value={reminder.type} onValueChange={(value) => updateReminder(reminder.id, "type", value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="notification">Notification</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={reminder.timing}
                      onValueChange={(value) => updateReminder(reminder.id, "timing", value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1hour">1 hour before</SelectItem>
                        <SelectItem value="1day">1 day before</SelectItem>
                        <SelectItem value="3days">3 days before</SelectItem>
                        <SelectItem value="1week">1 week before</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="sm" onClick={() => removeReminder(reminder.id)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Data Linking */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Link className="w-4 h-4" />
                Link Project Data (Optional)
              </Label>
              {linkedData ? (
                <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      {linkedData.moduleName}
                    </Badge>
                    <span className="text-sm">{linkedData.path.join(" → ")}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setLinkedData(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setShowProjectDataPicker(true)}
                  className="w-full justify-start"
                >
                  <Link className="w-4 h-4 mr-2" />
                  Select project data to link
                </Button>
              )}
            </div>

            {/* Project Data Picker */}
            {showProjectDataPicker && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Select Project Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-2">
                      {projectModules.map((module) => (
                        <Collapsible
                          key={module.id}
                          open={expandedModules.includes(module.id)}
                          onOpenChange={() => toggleModule(module.id)}
                        >
                          <div className="flex items-center justify-between">
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" className="flex items-center gap-2 w-full justify-start p-2">
                                {expandedModules.includes(module.id) ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                                <module.icon className="w-4 h-4" />
                                <span className="text-sm">{module.name}</span>
                              </Button>
                            </CollapsibleTrigger>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => selectProjectData(module)}
                              className="text-xs"
                            >
                              Link Module
                            </Button>
                          </div>
                          <CollapsibleContent className="ml-6 mt-1">
                            <div className="space-y-1">
                              {module.children?.map((element) => (
                                <div key={element.id} className="flex items-center justify-between py-1">
                                  <span className="text-sm text-muted-foreground">{element.name}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => selectProjectData(module, element)}
                                    className="text-xs h-6"
                                  >
                                    Link
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="flex justify-end mt-4">
                    <Button variant="outline" onClick={() => setShowProjectDataPicker(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-span-4 space-y-4">
            {/* Task Tags */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Task Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {taskTags.map((tag) => (
                    <Button
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleTag(tag)}
                      className="text-xs h-6"
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Task Preview */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Task Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(taskData.priority)}`}>
                    {taskData.priority}
                  </span>
                  {taskData.isBlocking && (
                    <Badge variant="destructive" className="text-xs">
                      Blocking
                    </Badge>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{taskData.title || "Untitled Task"}</p>
                  {taskData.assignedTo && (
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="w-4 h-4">
                        <AvatarFallback className="text-xs">
                          {mockUsers[taskData.assignedTo as keyof typeof mockUsers]?.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">
                        {mockUsers[taskData.assignedTo as keyof typeof mockUsers]?.name}
                      </span>
                    </div>
                  )}
                </div>
                {taskData.dueDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Due: {taskData.dueDate.toLocaleDateString()} at {taskData.dueDate.toLocaleTimeString()}
                    </span>
                  </div>
                )}
                {taskData.estimatedHours && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Est. {taskData.estimatedHours} hours</span>
                  </div>
                )}
                {selectedTags.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Tags:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedTags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {linkedData && (
                  <div className="border-t pt-2">
                    <p className="text-xs text-muted-foreground">Linked to:</p>
                    <p className="text-sm font-medium">{linkedData.path.join(" → ")}</p>
                  </div>
                )}
                <div className="border-t pt-2">
                  <p className="text-xs text-muted-foreground">
                    {taskData.reminders.filter((r) => r.enabled).length} reminder
                    {taskData.reminders.filter((r) => r.enabled).length !== 1 ? "s" : ""} enabled
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleCreateTask} disabled={!taskData.title.trim() || !taskData.assignedTo}>
            Create Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
