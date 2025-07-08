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
import {
  MessageSquare,
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
  CheckSquare,
  Clock,
  Settings,
  Target,
  Briefcase,
} from "lucide-react"

interface EnhancedMessageComposerProps {
  isOpen: boolean
  onClose: () => void
  onCreateMessage: (messageData: MessageCreationData) => void
  projectId: string
  currentUser: any
}

interface MessageCreationData {
  title: string
  content: string
  participants: string[]
  linkedData?: ProjectDataLink
  priority: "low" | "medium" | "high"
  isUrgent: boolean
}

interface ProjectDataLink {
  moduleType: string
  moduleName: string
  elementId?: string
  elementName?: string
  path: string[]
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

// Mock project modules structure
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

export const EnhancedMessageComposer: React.FC<EnhancedMessageComposerProps> = ({
  isOpen,
  onClose,
  onCreateMessage,
  projectId,
  currentUser,
}) => {
  const [messageData, setMessageData] = useState<MessageCreationData>({
    title: "",
    content: "",
    participants: [],
    priority: "medium",
    isUrgent: false,
  })

  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])
  const [linkedData, setLinkedData] = useState<ProjectDataLink | null>(null)
  const [showProjectDataPicker, setShowProjectDataPicker] = useState(false)
  const [expandedModules, setExpandedModules] = useState<string[]>([])

  const availableUsers = Object.values(mockUsers).filter((user) => user.id !== currentUser?.id)

  const toggleParticipant = (userId: string) => {
    setSelectedParticipants((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

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

  const handleCreateMessage = () => {
    if (!messageData.title.trim()) return

    const finalMessageData: MessageCreationData = {
      ...messageData,
      participants: selectedParticipants,
      linkedData: linkedData || undefined,
    }

    onCreateMessage(finalMessageData)
    handleClose()
  }

  const handleClose = () => {
    setMessageData({
      title: "",
      content: "",
      participants: [],
      priority: "medium",
      isUrgent: false,
    })
    setSelectedParticipants([])
    setLinkedData(null)
    setShowProjectDataPicker(false)
    setExpandedModules([])
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Create Message Thread
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-12 gap-6 h-full">
          {/* Main Form */}
          <div className="col-span-8 space-y-4">
            {/* Message Details */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Thread Title *</Label>
                <Input
                  id="title"
                  value={messageData.title}
                  onChange={(e) => setMessageData({ ...messageData, title: e.target.value })}
                  placeholder="What's this conversation about?"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="content">Initial Message</Label>
                <Textarea
                  id="content"
                  value={messageData.content}
                  onChange={(e) => setMessageData({ ...messageData, content: e.target.value })}
                  placeholder="Start the conversation..."
                  className="mt-1 min-h-[120px]"
                />
              </div>
            </div>

            {/* Priority and Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Priority Level
                </Label>
                <Select
                  value={messageData.priority}
                  onValueChange={(value: "low" | "medium" | "high") =>
                    setMessageData({ ...messageData, priority: value })
                  }
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

              <div className="flex items-end">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="urgent"
                    checked={messageData.isUrgent}
                    onCheckedChange={(checked) => setMessageData({ ...messageData, isUrgent: !!checked })}
                  />
                  <Label htmlFor="urgent" className="text-sm font-medium">
                    Mark as Urgent
                  </Label>
                </div>
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

          {/* Sidebar - Participants */}
          <div className="col-span-4 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Add Participants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {availableUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <Checkbox
                          id={`user-${user.id}`}
                          checked={selectedParticipants.includes(user.id)}
                          onCheckedChange={() => toggleParticipant(user.id)}
                        />
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">{user.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Selected Participants */}
            {selectedParticipants.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Selected Participants ({selectedParticipants.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedParticipants.map((userId) => {
                      const user = mockUsers[userId as keyof typeof mockUsers]
                      return (
                        <div key={userId} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs">{user.initials}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{user.name}</span>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => toggleParticipant(userId)}>
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Message Preview */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(messageData.priority)}`}>
                    {messageData.priority}
                  </span>
                  {messageData.isUrgent && (
                    <Badge variant="destructive" className="text-xs">
                      Urgent
                    </Badge>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{messageData.title || "Untitled Thread"}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedParticipants.length} participant{selectedParticipants.length !== 1 ? "s" : ""}
                  </p>
                </div>
                {linkedData && (
                  <div className="border-t pt-2">
                    <p className="text-xs text-muted-foreground">Linked to:</p>
                    <p className="text-sm font-medium">{linkedData.path.join(" → ")}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleCreateMessage} disabled={!messageData.title.trim()}>
            Create Message Thread
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
