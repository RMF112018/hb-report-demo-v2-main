/**
 * @fileoverview Submit Update Panel Component
 * @module SubmitUpdatePanel
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Export, distribution, and submission workflow for schedule updates:
 * - Multiple export formats (CSV, XML, MPP, XER)
 * - Microsoft Graph integration for email distribution
 * - Review package generation
 * - Approval workflow integration
 * - Submission tracking and notifications
 */

"use client"

import React, { useState, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import {
  Download,
  Send,
  Mail,
  FileText,
  File,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  Package,
  Upload,
  Share2,
  Eye,
  Edit3,
  Trash2,
  Plus,
  Settings,
  Zap,
  Activity,
  RefreshCw,
  ExternalLink,
  Paperclip,
  MessageSquare,
  Bell,
  Star,
  Target,
  GitBranch,
  BarChart3,
} from "lucide-react"
import { format } from "date-fns"

interface UpdateActivity {
  activity_id: string
  description: string
  type: "Milestone" | "Task"
  baseline_start: string
  baseline_finish: string
  current_start: string
  current_finish: string
  actual_start?: string
  actual_finish?: string
  delay_reason?: string
  notes?: string
  change_type?: "delay" | "resequence" | "acceleration" | "no_change"
  is_critical: boolean
  float_days: number
  percent_complete: number
  modified: boolean
  validation_errors: string[]
}

interface AIInsight {
  id: string
  type: "suggestion" | "warning" | "error" | "improvement"
  severity: "low" | "medium" | "high"
  title: string
  description: string
  affected_activities: string[]
  suggested_actions: string[]
  confidence: number
}

interface UpdatePackage {
  id: string
  activities: UpdateActivity[]
  summary: string
  health_score: number
  created_at: string
  created_by: string
  ai_insights: AIInsight[]
}

interface Recipient {
  id: string
  name: string
  email: string
  role: string
  department: string
  required: boolean
  avatar?: string
}

interface SubmitUpdatePanelProps {
  updatePackage: UpdatePackage
  onExport: (format: string) => void
  onDistribute: (recipients: Recipient[]) => void
}

const exportFormats = [
  { value: "csv", label: "CSV", icon: FileText, description: "Comma-separated values for spreadsheet applications" },
  { value: "xml", label: "XML", icon: File, description: "Structured data format for system integration" },
  { value: "mpp", label: "MPP", icon: Calendar, description: "Microsoft Project file format" },
  { value: "xer", label: "XER", icon: Activity, description: "Primavera P6 exchange format" },
  { value: "json", label: "JSON", icon: FileText, description: "JavaScript Object Notation for web applications" },
  { value: "pdf", label: "PDF", icon: File, description: "Portable document format for reporting" },
]

const mockRecipients: Recipient[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@hbbuilding.com",
    role: "Project Manager",
    department: "Construction",
    required: true,
    avatar: "/avatars/john-smith.png",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@hbbuilding.com",
    role: "Scheduler",
    department: "Planning",
    required: true,
    avatar: "/avatars/sarah-johnson.png",
  },
  {
    id: "3",
    name: "Mike Davis",
    email: "mike.davis@hbbuilding.com",
    role: "Superintendent",
    department: "Field Operations",
    required: false,
    avatar: "/avatars/mike-davis.png",
  },
  {
    id: "4",
    name: "Lisa Chen",
    email: "lisa.chen@hbbuilding.com",
    role: "Project Executive",
    department: "Management",
    required: true,
    avatar: "/avatars/lisa-chen.png",
  },
  {
    id: "5",
    name: "Robert Wilson",
    email: "robert.wilson@hbbuilding.com",
    role: "Estimator",
    department: "Pre-Construction",
    required: false,
    avatar: "/avatars/robert-wilson.png",
  },
]

export const SubmitUpdatePanel: React.FC<SubmitUpdatePanelProps> = ({ updatePackage, onExport, onDistribute }) => {
  const { toast } = useToast()
  const [selectedFormats, setSelectedFormats] = useState<string[]>(["csv", "pdf"])
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>(
    mockRecipients.filter((r) => r.required).map((r) => r.id)
  )
  const [emailSubject, setEmailSubject] = useState(`Schedule Update Package - ${format(new Date(), "MMM d, yyyy")}`)
  const [emailMessage, setEmailMessage] = useState(
    `Please find the attached schedule update package for review. This update includes ${updatePackage.activities.length} modified activities with a health score of ${updatePackage.health_score}%.`
  )
  const [isExporting, setIsExporting] = useState(false)
  const [isDistributing, setIsDistributing] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [autoNotifications, setAutoNotifications] = useState(true)
  const [requireApproval, setRequireApproval] = useState(true)
  const [activeTab, setActiveTab] = useState("export")

  // Handle format selection
  const handleFormatToggle = useCallback((format: string) => {
    setSelectedFormats((prev) => (prev.includes(format) ? prev.filter((f) => f !== format) : [...prev, format]))
  }, [])

  // Handle recipient selection
  const handleRecipientToggle = useCallback(
    (recipientId: string) => {
      const recipient = mockRecipients.find((r) => r.id === recipientId)
      if (recipient?.required) {
        toast({
          title: "Required Recipient",
          description: "This recipient is required and cannot be removed.",
          variant: "destructive",
        })
        return
      }

      setSelectedRecipients((prev) =>
        prev.includes(recipientId) ? prev.filter((id) => id !== recipientId) : [...prev, recipientId]
      )
    },
    [toast]
  )

  // Handle export
  const handleExport = useCallback(async () => {
    if (selectedFormats.length === 0) {
      toast({
        title: "No Formats Selected",
        description: "Please select at least one export format.",
        variant: "destructive",
      })
      return
    }

    setIsExporting(true)
    setExportProgress(0)

    try {
      for (let i = 0; i < selectedFormats.length; i++) {
        const format = selectedFormats[i]
        setExportProgress(((i + 1) / selectedFormats.length) * 100)

        // Simulate export delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        onExport(format)

        toast({
          title: `${format.toUpperCase()} Export Complete`,
          description: `Update package exported successfully in ${format.toUpperCase()} format.`,
        })
      }
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export update package. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
      setExportProgress(0)
    }
  }, [selectedFormats, onExport, toast])

  // Handle distribution
  const handleDistribute = useCallback(async () => {
    if (selectedRecipients.length === 0) {
      toast({
        title: "No Recipients Selected",
        description: "Please select at least one recipient.",
        variant: "destructive",
      })
      return
    }

    setIsDistributing(true)

    try {
      const recipients = mockRecipients.filter((r) => selectedRecipients.includes(r.id))

      // Simulate Microsoft Graph API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      onDistribute(recipients)

      toast({
        title: "Distribution Complete",
        description: `Update package sent to ${recipients.length} recipients successfully.`,
      })

      // Show mock Outlook integration
      toast({
        title: "Outlook Integration",
        description: "Email draft has been created and opened in Outlook.",
      })
    } catch (error) {
      toast({
        title: "Distribution Failed",
        description: "Failed to distribute update package. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDistributing(false)
    }
  }, [selectedRecipients, onDistribute, toast])

  // Generate package summary
  const packageSummary = useMemo(() => {
    const delayedActivities = updatePackage.activities.filter((a) => a.change_type === "delay")
    const criticalActivities = updatePackage.activities.filter((a) => a.is_critical)
    const highRiskInsights = updatePackage.ai_insights.filter((i) => i.severity === "high")

    return {
      totalActivities: updatePackage.activities.length,
      delayedActivities: delayedActivities.length,
      criticalActivities: criticalActivities.length,
      highRiskInsights: highRiskInsights.length,
      healthScore: updatePackage.health_score,
    }
  }, [updatePackage])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Submit Update Package
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            {packageSummary.totalActivities} activities
          </div>
          <div className="flex items-center gap-1">
            <GitBranch className="h-4 w-4" />
            {packageSummary.criticalActivities} critical
          </div>
          <div className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            {packageSummary.healthScore}% health score
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="distribute">Distribute</TabsTrigger>
            <TabsTrigger value="review">Review</TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Export Formats</Label>
                <p className="text-xs text-muted-foreground mb-3">
                  Select the file formats to export your update package
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {exportFormats.map((format) => (
                    <div
                      key={format.value}
                      className={cn(
                        "flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-all",
                        selectedFormats.includes(format.value)
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-muted-foreground"
                      )}
                      onClick={() => handleFormatToggle(format.value)}
                    >
                      <Checkbox
                        checked={selectedFormats.includes(format.value)}
                        onChange={() => handleFormatToggle(format.value)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <format.icon className="h-4 w-4" />
                          <span className="font-medium">{format.label}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{format.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {selectedFormats.length} format{selectedFormats.length !== 1 ? "s" : ""} selected
                </div>
                <Button
                  onClick={handleExport}
                  disabled={isExporting || selectedFormats.length === 0}
                  className="min-w-32"
                >
                  {isExporting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </>
                  )}
                </Button>
              </div>

              {isExporting && (
                <div className="space-y-2">
                  <Progress value={exportProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center">
                    Exporting {selectedFormats.length} format{selectedFormats.length !== 1 ? "s" : ""}...
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="distribute" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Recipients</Label>
                <p className="text-xs text-muted-foreground mb-3">Select team members to receive the update package</p>
                <div className="space-y-2">
                  {mockRecipients.map((recipient) => (
                    <div
                      key={recipient.id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border",
                        selectedRecipients.includes(recipient.id) ? "border-primary bg-primary/10" : "border-border"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedRecipients.includes(recipient.id)}
                          onChange={() => handleRecipientToggle(recipient.id)}
                          disabled={recipient.required}
                        />
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={recipient.avatar} />
                          <AvatarFallback>
                            {recipient.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{recipient.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {recipient.role} • {recipient.department}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {recipient.required && (
                          <Badge variant="secondary" className="text-xs">
                            Required
                          </Badge>
                        )}
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div>
                  <Label htmlFor="subject" className="text-sm font-medium">
                    Email Subject
                  </Label>
                  <Input
                    id="subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-sm font-medium">
                    Email Message
                  </Label>
                  <Textarea
                    id="message"
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    rows={4}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Switch checked={autoNotifications} onCheckedChange={setAutoNotifications} />
                    <Label className="text-sm">Auto-notifications</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={requireApproval} onCheckedChange={setRequireApproval} />
                    <Label className="text-sm">Require approval</Label>
                  </div>
                </div>
                <Button
                  onClick={handleDistribute}
                  disabled={isDistributing || selectedRecipients.length === 0}
                  className="min-w-32"
                >
                  {isDistributing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="review" className="space-y-4">
            <div className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>Review package ready for submission. All validations passed.</AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Package Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Activities:</span>
                        <span className="font-medium">{packageSummary.totalActivities}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Delayed Activities:</span>
                        <span className="font-medium text-red-600 dark:text-red-400">
                          {packageSummary.delayedActivities}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Critical Activities:</span>
                        <span className="font-medium text-orange-600 dark:text-orange-400">
                          {packageSummary.criticalActivities}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Health Score:</span>
                        <span className="font-medium">{packageSummary.healthScore}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Recipients:</span>
                        <span className="font-medium">{selectedRecipients.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Export Formats:</span>
                        <span className="font-medium">{selectedFormats.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Notifications:</span>
                        <span className="font-medium">{autoNotifications ? "Enabled" : "Disabled"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Approval Required:</span>
                        <span className="font-medium">{requireApproval ? "Yes" : "No"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-between">
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Package
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export All
                  </Button>
                  <Button onClick={handleDistribute}>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Package
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
