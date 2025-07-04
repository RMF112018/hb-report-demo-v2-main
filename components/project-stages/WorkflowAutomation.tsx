"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Bell,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  Mail,
  Calendar,
  FileText,
  Zap,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Archive,
  Target,
  Workflow,
  Bot,
} from "lucide-react"

interface WorkflowAutomationProps {
  project: any
  currentStage: string
  userRole: string
  onNotificationSent?: (notification: any) => void
  onWorkflowTriggered?: (workflow: any) => void
}

interface AutomationRule {
  id: string
  name: string
  stage: string
  trigger: string
  action: string
  conditions: string[]
  recipients: string[]
  active: boolean
  lastTriggered?: Date
  triggerCount: number
}

interface Notification {
  id: string
  type: "email" | "sms" | "push" | "system"
  title: string
  message: string
  recipients: string[]
  scheduledTime?: Date
  status: "pending" | "sent" | "failed"
  priority: "low" | "medium" | "high" | "urgent"
}

interface WorkflowTask {
  id: string
  name: string
  stage: string
  assignee: string
  dueDate: Date
  priority: "low" | "medium" | "high"
  status: "pending" | "in_progress" | "completed" | "overdue"
  dependencies: string[]
  automated: boolean
}

export const WorkflowAutomation = ({
  project,
  currentStage,
  userRole,
  onNotificationSent,
  onWorkflowTriggered,
}: WorkflowAutomationProps) => {
  const [activeTab, setActiveTab] = useState("overview")
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [workflowTasks, setWorkflowTasks] = useState<WorkflowTask[]>([])
  const [newRuleDialogOpen, setNewRuleDialogOpen] = useState(false)
  const [newNotificationDialogOpen, setNewNotificationDialogOpen] = useState(false)

  // Mock data initialization
  useEffect(() => {
    // Initialize automation rules
    const mockRules: AutomationRule[] = [
      {
        id: "rule-1",
        name: "Stage Transition Notification",
        stage: "All Stages",
        trigger: "stage_transition",
        action: "send_notification",
        conditions: ["stage_changed"],
        recipients: ["team_all", "stakeholders"],
        active: true,
        triggerCount: 12,
        lastTriggered: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: "rule-2",
        name: "Milestone Deadline Alert",
        stage: currentStage,
        trigger: "milestone_approaching",
        action: "send_alert",
        conditions: ["deadline_within_7_days"],
        recipients: ["project_manager", "team_leads"],
        active: true,
        triggerCount: 8,
        lastTriggered: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        id: "rule-3",
        name: "Quality Gate Failure",
        stage: currentStage,
        trigger: "quality_check_failed",
        action: "escalate",
        conditions: ["quality_score_below_threshold"],
        recipients: ["quality_manager", "project_manager"],
        active: true,
        triggerCount: 3,
        lastTriggered: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: "rule-4",
        name: "Document Approval Request",
        stage: currentStage,
        trigger: "document_uploaded",
        action: "request_approval",
        conditions: ["document_type_critical"],
        recipients: ["approvers"],
        active: true,
        triggerCount: 15,
        lastTriggered: new Date(Date.now() - 3 * 60 * 60 * 1000),
      },
      {
        id: "rule-5",
        name: "Budget Variance Alert",
        stage: currentStage,
        trigger: "budget_variance",
        action: "send_alert",
        conditions: ["variance_exceeds_5_percent"],
        recipients: ["financial_controller", "project_manager"],
        active: false,
        triggerCount: 2,
        lastTriggered: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
    ]

    // Initialize notifications
    const mockNotifications: Notification[] = [
      {
        id: "notif-1",
        type: "email",
        title: "Stage Transition Completed",
        message: `Project ${project.name} has successfully transitioned to ${currentStage} stage.`,
        recipients: ["team@company.com", "stakeholders@company.com"],
        status: "sent",
        priority: "medium",
      },
      {
        id: "notif-2",
        type: "push",
        title: "Milestone Approaching",
        message: "Design review milestone is due in 3 days.",
        recipients: ["pm@company.com", "leads@company.com"],
        status: "pending",
        priority: "high",
        scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      },
      {
        id: "notif-3",
        type: "sms",
        title: "Quality Gate Failed",
        message: "Quality check failed for concrete inspection. Immediate attention required.",
        recipients: ["quality@company.com"],
        status: "sent",
        priority: "urgent",
      },
      {
        id: "notif-4",
        type: "email",
        title: "Document Approval Required",
        message: "New structural drawings uploaded and require approval.",
        recipients: ["approvers@company.com"],
        status: "pending",
        priority: "medium",
        scheduledTime: new Date(Date.now() + 1 * 60 * 60 * 1000),
      },
    ]

    // Initialize workflow tasks
    const mockTasks: WorkflowTask[] = [
      {
        id: "task-1",
        name: "Complete safety inspection",
        stage: currentStage,
        assignee: "Safety Inspector",
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        priority: "high",
        status: "pending",
        dependencies: [],
        automated: false,
      },
      {
        id: "task-2",
        name: "Review and approve drawings",
        stage: currentStage,
        assignee: "Chief Engineer",
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        priority: "medium",
        status: "in_progress",
        dependencies: ["task-1"],
        automated: false,
      },
      {
        id: "task-3",
        name: "Generate progress report",
        stage: currentStage,
        assignee: "System",
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        priority: "low",
        status: "completed",
        dependencies: [],
        automated: true,
      },
      {
        id: "task-4",
        name: "Update project schedule",
        stage: currentStage,
        assignee: "Project Manager",
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        priority: "medium",
        status: "overdue",
        dependencies: ["task-2"],
        automated: false,
      },
    ]

    setAutomationRules(mockRules)
    setNotifications(mockNotifications)
    setWorkflowTasks(mockTasks)
  }, [currentStage, project.name])

  const canManageAutomation = userRole === "admin" || userRole === "project_manager"

  const toggleRule = (ruleId: string) => {
    setAutomationRules((prev) => prev.map((rule) => (rule.id === ruleId ? { ...rule, active: !rule.active } : rule)))
  }

  const sendNotification = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === notificationId ? { ...notif, status: "sent" as const } : notif))
    )
    onNotificationSent && onNotificationSent({ id: notificationId })
  }

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />
      case "sms":
        return <Bell className="h-4 w-4" />
      case "push":
        return <Bell className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  // Calculate automation metrics
  const activeRulesCount = automationRules.filter((rule) => rule.active).length
  const totalTriggers = automationRules.reduce((sum, rule) => sum + rule.triggerCount, 0)
  const pendingNotifications = notifications.filter((n) => n.status === "pending").length
  const completedTasks = workflowTasks.filter((t) => t.status === "completed").length
  const overdueTasks = workflowTasks.filter((t) => t.status === "overdue").length

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Workflow className="h-5 w-5" />
              Workflow Automation
            </CardTitle>
            <CardDescription>Stage-specific automation rules and workflow management</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{activeRulesCount} Active Rules</Badge>
            <Badge variant="outline">{totalTriggers} Total Triggers</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="rules">Automation Rules</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="tasks">Workflow Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Automation Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Active Rules</p>
                      <p className="text-2xl font-bold">{activeRulesCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Pending Notifications</p>
                      <p className="text-2xl font-bold">{pendingNotifications}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Completed Tasks</p>
                      <p className="text-2xl font-bold">{completedTasks}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Overdue Tasks</p>
                      <p className="text-2xl font-bold">{overdueTasks}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Automation Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {automationRules.slice(0, 3).map((rule) => (
                    <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${rule.active ? "bg-green-100" : "bg-gray-100"}`}>
                          <Bot className={`h-4 w-4 ${rule.active ? "text-green-600" : "text-gray-400"}`} />
                        </div>
                        <div>
                          <p className="font-medium">{rule.name}</p>
                          <p className="text-sm text-muted-foreground">Triggered {rule.triggerCount} times</p>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {rule.lastTriggered ? `Last: ${rule.lastTriggered.toLocaleDateString()}` : "Never triggered"}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Automation Rules</h3>
              {canManageAutomation && (
                <Dialog open={newRuleDialogOpen} onOpenChange={setNewRuleDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Zap className="h-4 w-4 mr-2" />
                      Create Rule
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Automation Rule</DialogTitle>
                      <DialogDescription>Set up a new automation rule for workflow management</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="ruleName">Rule Name</Label>
                        <Input id="ruleName" placeholder="Enter rule name" />
                      </div>
                      <div>
                        <Label htmlFor="trigger">Trigger</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select trigger" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="stage_transition">Stage Transition</SelectItem>
                            <SelectItem value="milestone_approaching">Milestone Approaching</SelectItem>
                            <SelectItem value="quality_check_failed">Quality Check Failed</SelectItem>
                            <SelectItem value="document_uploaded">Document Uploaded</SelectItem>
                            <SelectItem value="budget_variance">Budget Variance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="action">Action</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select action" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="send_notification">Send Notification</SelectItem>
                            <SelectItem value="send_alert">Send Alert</SelectItem>
                            <SelectItem value="escalate">Escalate</SelectItem>
                            <SelectItem value="request_approval">Request Approval</SelectItem>
                            <SelectItem value="create_task">Create Task</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setNewRuleDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => setNewRuleDialogOpen(false)}>Create Rule</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <div className="space-y-4">
              {automationRules.map((rule) => (
                <Card key={rule.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${rule.active ? "bg-green-100" : "bg-gray-100"}`}>
                          <Bot className={`h-4 w-4 ${rule.active ? "text-green-600" : "text-gray-400"}`} />
                        </div>
                        <div>
                          <h4 className="font-medium">{rule.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Stage: {rule.stage} • Trigger: {rule.trigger} • Action: {rule.action}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{rule.triggerCount} triggers</Badge>
                        {canManageAutomation && (
                          <Switch checked={rule.active} onCheckedChange={() => toggleRule(rule.id)} />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Notifications</h3>
              {canManageAutomation && (
                <Dialog open={newNotificationDialogOpen} onOpenChange={setNewNotificationDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Bell className="h-4 w-4 mr-2" />
                      Send Notification
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Send Notification</DialogTitle>
                      <DialogDescription>Send a custom notification to team members</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="notifTitle">Title</Label>
                        <Input id="notifTitle" placeholder="Enter notification title" />
                      </div>
                      <div>
                        <Label htmlFor="notifMessage">Message</Label>
                        <Textarea id="notifMessage" placeholder="Enter notification message" />
                      </div>
                      <div>
                        <Label htmlFor="notifType">Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select notification type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="sms">SMS</SelectItem>
                            <SelectItem value="push">Push Notification</SelectItem>
                            <SelectItem value="system">System Alert</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setNewNotificationDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => setNewNotificationDialogOpen(false)}>Send Notification</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <div className="space-y-4">
              {notifications.map((notification) => (
                <Card key={notification.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-full">{getNotificationIcon(notification.type)}</div>
                        <div>
                          <h4 className="font-medium">{notification.title}</h4>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Recipients: {notification.recipients.join(", ")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(notification.priority)}>{notification.priority}</Badge>
                        <Badge variant={notification.status === "sent" ? "default" : "outline"}>
                          {notification.status}
                        </Badge>
                        {notification.status === "pending" && canManageAutomation && (
                          <Button size="sm" onClick={() => sendNotification(notification.id)}>
                            Send Now
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Workflow Tasks</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {completedTasks}/{workflowTasks.length} Completed
                </Badge>
                <Progress value={(completedTasks / workflowTasks.length) * 100} className="w-24" />
              </div>
            </div>

            <div className="space-y-4">
              {workflowTasks.map((task) => (
                <Card key={task.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-full">
                          {task.automated ? (
                            <Bot className="h-4 w-4 text-purple-600" />
                          ) : (
                            <Users className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{task.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Assigned to: {task.assignee} • Due: {task.dueDate.toLocaleDateString()}
                          </p>
                          {task.dependencies.length > 0 && (
                            <p className="text-xs text-muted-foreground">
                              Dependencies: {task.dependencies.join(", ")}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                        <Badge className={getTaskStatusColor(task.status)}>{task.status}</Badge>
                        {task.automated && (
                          <Badge variant="outline">
                            <Bot className="h-3 w-3 mr-1" />
                            Automated
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
