/**
 * @fileoverview Quality Announcements Component - QC Notices & Updates Distribution
 * @module QualityAnnouncements
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Comprehensive QC notices and updates distribution system with AI-powered features
 */

"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"
import { Switch } from "../ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Checkbox } from "../ui/checkbox"
import {
  AlertTriangle,
  Bell,
  Bot,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  Filter,
  Mail,
  MessageSquare,
  Megaphone,
  Pin,
  Plus,
  RefreshCw,
  Search,
  Send,
  Share,
  Target,
  Users,
  Zap,
} from "lucide-react"

interface AnnouncementData {
  id: string
  title: string
  content: string
  type: "procedural_update" | "alert" | "notice" | "reminder" | "training"
  priority: "low" | "medium" | "high" | "critical"
  status: "draft" | "scheduled" | "published" | "expired"
  publishedDate?: string
  scheduledDate?: string
  expiryDate?: string
  author: string
  affectedProjects: string[]
  affectedRoles: string[]
  tags: string[]
  attachments: string[]
  views: number
  comments: number
  isPinned: boolean
  isDistributedToTeams: boolean
  aiFlags: {
    isOutdated: boolean
    hasConflicts: boolean
    recommendedRecipients: string[]
    flaggedReason?: string
  }
}

interface CreateAnnouncementForm {
  title: string
  content: string
  type: string
  priority: string
  affectedProjects: string[]
  affectedRoles: string[]
  tags: string[]
  scheduleOption: "immediate" | "scheduled"
  scheduledDate: string
  expiryDate: string
  sendToTeams: boolean
  sendToEmail: boolean
  isPinned: boolean
}

export const QualityAnnouncements: React.FC = () => {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("announcements")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedPriority, setSelectedPriority] = useState("all")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showAIInsights, setShowAIInsights] = useState(false)

  const [createForm, setCreateForm] = useState<CreateAnnouncementForm>({
    title: "",
    content: "",
    type: "notice",
    priority: "medium",
    affectedProjects: [],
    affectedRoles: [],
    tags: [],
    scheduleOption: "immediate",
    scheduledDate: "",
    expiryDate: "",
    sendToTeams: true,
    sendToEmail: true,
    isPinned: false,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  // Mock data with AI insights
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([
    {
      id: "QA-001",
      title: "Updated Quality Standards for Concrete Work",
      content:
        "New quality standards have been implemented for all concrete work effective immediately. All concrete pours must now include additional testing protocols and documentation requirements.",
      type: "procedural_update",
      priority: "high",
      status: "published",
      publishedDate: "2024-12-10T09:00:00Z",
      expiryDate: "2025-03-10T23:59:59Z",
      author: "Quality Control Department",
      affectedProjects: ["Highland Tower", "Metro Station", "Office Complex"],
      affectedRoles: ["QC Inspector", "Concrete Foreman", "Site Engineer"],
      tags: ["Standards", "Concrete", "Testing", "Documentation"],
      attachments: ["QualityStandards_Concrete_v2.1.pdf"],
      views: 234,
      comments: 12,
      isPinned: true,
      isDistributedToTeams: true,
      aiFlags: {
        isOutdated: false,
        hasConflicts: false,
        recommendedRecipients: ["QC Inspector", "Concrete Foreman", "Site Engineer", "Project Manager"],
        flaggedReason: "",
      },
    },
    {
      id: "QA-002",
      title: "Quality Audit Scheduled for January 15-17, 2025",
      content:
        "An external quality audit will be conducted from January 15-17, 2025. All project teams should ensure documentation is up to date and quality processes are being followed.",
      type: "alert",
      priority: "critical",
      status: "published",
      publishedDate: "2024-12-08T14:30:00Z",
      expiryDate: "2025-01-18T23:59:59Z",
      author: "Management Team",
      affectedProjects: ["All Projects"],
      affectedRoles: ["Project Manager", "QC Inspector", "Site Engineer", "Foreman"],
      tags: ["Audit", "Quality", "Documentation", "Compliance"],
      attachments: ["AuditSchedule_Jan2025.pdf", "PreAuditChecklist.xlsx"],
      views: 456,
      comments: 28,
      isPinned: true,
      isDistributedToTeams: true,
      aiFlags: {
        isOutdated: false,
        hasConflicts: false,
        recommendedRecipients: ["All Staff"],
        flaggedReason: "",
      },
    },
    {
      id: "QA-003",
      title: "Safety Protocol Update - Hard Hat Requirements",
      content:
        "Previous hard hat requirements from 2023 are now outdated. New OSHA standards require Class E hard hats for all electrical work areas.",
      type: "procedural_update",
      priority: "high",
      status: "published",
      publishedDate: "2024-11-15T10:00:00Z",
      expiryDate: "2025-02-15T23:59:59Z",
      author: "Safety Department",
      affectedProjects: ["Metro Station", "Power Plant"],
      affectedRoles: ["Safety Officer", "Electrical Foreman", "Site Engineer"],
      tags: ["Safety", "PPE", "OSHA", "Electrical"],
      attachments: ["OSHA_HardHat_Standards_2024.pdf"],
      views: 189,
      comments: 7,
      isPinned: false,
      isDistributedToTeams: true,
      aiFlags: {
        isOutdated: false,
        hasConflicts: true,
        recommendedRecipients: ["Safety Officer", "Electrical Foreman", "Site Engineer"],
        flaggedReason: "Conflicts with previous safety memo QA-015 from 2023",
      },
    },
  ])

  const projects = ["Highland Tower", "Metro Station", "Office Complex", "Power Plant", "Residential Complex"]
  const roles = [
    "Project Manager",
    "QC Inspector",
    "Site Engineer",
    "Foreman",
    "Safety Officer",
    "Electrical Foreman",
    "Concrete Foreman",
  ]
  const announcementTypes = [
    { value: "procedural_update", label: "Procedural Update" },
    { value: "alert", label: "Alert" },
    { value: "notice", label: "Notice" },
    { value: "reminder", label: "Reminder" },
    { value: "training", label: "Training" },
  ]

  const priorities = [
    { value: "low", label: "Low", color: "text-blue-600" },
    { value: "medium", label: "Medium", color: "text-yellow-600" },
    { value: "high", label: "High", color: "text-orange-600" },
    { value: "critical", label: "Critical", color: "text-red-600" },
  ]

  const handleCreateAnnouncement = () => {
    const newAnnouncement: AnnouncementData = {
      id: `QA-${String(announcements.length + 1).padStart(3, "0")}`,
      title: createForm.title,
      content: createForm.content,
      type: createForm.type as any,
      priority: createForm.priority as any,
      status: createForm.scheduleOption === "immediate" ? "published" : "scheduled",
      publishedDate: createForm.scheduleOption === "immediate" ? new Date().toISOString() : undefined,
      scheduledDate: createForm.scheduleOption === "scheduled" ? createForm.scheduledDate : undefined,
      expiryDate: createForm.expiryDate,
      author: "Current User",
      affectedProjects: createForm.affectedProjects,
      affectedRoles: createForm.affectedRoles,
      tags: createForm.tags,
      attachments: [],
      views: 0,
      comments: 0,
      isPinned: createForm.isPinned,
      isDistributedToTeams: createForm.sendToTeams,
      aiFlags: {
        isOutdated: false,
        hasConflicts: false,
        recommendedRecipients: generateAIRecommendations(createForm.affectedRoles, createForm.type),
        flaggedReason: "",
      },
    }

    setAnnouncements([newAnnouncement, ...announcements])
    setShowCreateDialog(false)
    resetForm()

    // Simulate Teams/Email distribution
    if (createForm.sendToTeams || createForm.sendToEmail) {
      setTimeout(() => {
        alert(
          `Announcement distributed to ${createForm.sendToTeams ? "Teams" : ""}${
            createForm.sendToTeams && createForm.sendToEmail ? " and " : ""
          }${createForm.sendToEmail ? "Email" : ""}`
        )
      }, 1000)
    }
  }

  const generateAIRecommendations = (roles: string[], type: string) => {
    const baseRoles = [...roles]

    if (type === "procedural_update") {
      baseRoles.push("Project Manager", "QC Inspector")
    } else if (type === "alert") {
      baseRoles.push("Project Manager", "Safety Officer")
    }

    return [...new Set(baseRoles)]
  }

  const resetForm = () => {
    setCreateForm({
      title: "",
      content: "",
      type: "notice",
      priority: "medium",
      affectedProjects: [],
      affectedRoles: [],
      tags: [],
      scheduleOption: "immediate",
      scheduledDate: "",
      expiryDate: "",
      sendToTeams: true,
      sendToEmail: true,
      isPinned: false,
    })
  }

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesType = selectedType === "all" || announcement.type === selectedType
    const matchesPriority = selectedPriority === "all" || announcement.priority === selectedPriority

    return matchesSearch && matchesType && matchesPriority
  })

  const aiInsights = {
    outdatedCount: announcements.filter((a) => a.aiFlags.isOutdated).length,
    conflictCount: announcements.filter((a) => a.aiFlags.hasConflicts).length,
    totalRecommendations: announcements.reduce((sum, a) => sum + a.aiFlags.recommendedRecipients.length, 0),
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Quality Notices & Updates</h3>
          <p className="text-sm text-muted-foreground">
            Distribute QC notices with AI-powered recipient recommendations and Teams integration
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowAIInsights(!showAIInsights)}>
            <Bot className="h-4 w-4 mr-2" />
            AI Insights
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Notice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Quality Notice/Update</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={createForm.title}
                      onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                      placeholder="Enter announcement title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={createForm.type}
                      onValueChange={(value) => setCreateForm({ ...createForm, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {announcementTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={createForm.content}
                    onChange={(e) => setCreateForm({ ...createForm, content: e.target.value })}
                    placeholder="Enter announcement content"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Priority</Label>
                    <Select
                      value={createForm.priority}
                      onValueChange={(value) => setCreateForm({ ...createForm, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem key={priority.value} value={priority.value}>
                            <span className={priority.color}>{priority.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Schedule</Label>
                    <Select
                      value={createForm.scheduleOption}
                      onValueChange={(value) => setCreateForm({ ...createForm, scheduleOption: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select schedule" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Distribute Immediately</SelectItem>
                        <SelectItem value="scheduled">Schedule for Later</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {createForm.scheduleOption === "scheduled" && (
                  <div>
                    <Label htmlFor="scheduledDate">Scheduled Date</Label>
                    <Input
                      id="scheduledDate"
                      type="datetime-local"
                      value={createForm.scheduledDate}
                      onChange={(e) => setCreateForm({ ...createForm, scheduledDate: e.target.value })}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="datetime-local"
                    value={createForm.expiryDate}
                    onChange={(e) => setCreateForm({ ...createForm, expiryDate: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Affected Projects</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {projects.map((project) => (
                      <div key={project} className="flex items-center space-x-2">
                        <Checkbox
                          id={`project-${project}`}
                          checked={createForm.affectedProjects.includes(project)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setCreateForm({
                                ...createForm,
                                affectedProjects: [...createForm.affectedProjects, project],
                              })
                            } else {
                              setCreateForm({
                                ...createForm,
                                affectedProjects: createForm.affectedProjects.filter((p) => p !== project),
                              })
                            }
                          }}
                        />
                        <Label htmlFor={`project-${project}`} className="text-sm">
                          {project}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Affected Roles</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {roles.map((role) => (
                      <div key={role} className="flex items-center space-x-2">
                        <Checkbox
                          id={`role-${role}`}
                          checked={createForm.affectedRoles.includes(role)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setCreateForm({ ...createForm, affectedRoles: [...createForm.affectedRoles, role] })
                            } else {
                              setCreateForm({
                                ...createForm,
                                affectedRoles: createForm.affectedRoles.filter((r) => r !== role),
                              })
                            }
                          }}
                        />
                        <Label htmlFor={`role-${role}`} className="text-sm">
                          {role}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="sendToTeams"
                      checked={createForm.sendToTeams}
                      onCheckedChange={(checked) => setCreateForm({ ...createForm, sendToTeams: checked })}
                    />
                    <Label htmlFor="sendToTeams">Send to Microsoft Teams</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="sendToEmail"
                      checked={createForm.sendToEmail}
                      onCheckedChange={(checked) => setCreateForm({ ...createForm, sendToEmail: checked })}
                    />
                    <Label htmlFor="sendToEmail">Send Email Notification</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isPinned"
                      checked={createForm.isPinned}
                      onCheckedChange={(checked) => setCreateForm({ ...createForm, isPinned: checked })}
                    />
                    <Label htmlFor="isPinned">Pin to Dashboard</Label>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateAnnouncement}>
                    <Send className="h-4 w-4 mr-2" />
                    {createForm.scheduleOption === "immediate" ? "Distribute Now" : "Schedule"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* AI Insights Panel */}
      {showAIInsights && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-600" />
              AI Quality Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm font-medium">Outdated Instructions</p>
                  <p className="text-xs text-muted-foreground">{aiInsights.outdatedCount} items flagged</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm font-medium">Conflicting Instructions</p>
                  <p className="text-xs text-muted-foreground">{aiInsights.conflictCount} conflicts detected</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Recipient Recommendations</p>
                  <p className="text-xs text-muted-foreground">{aiInsights.totalRecommendations} suggestions made</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Announcements</p>
                <p className="text-2xl font-bold text-blue-600">{announcements.length}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Published</p>
                <p className="text-2xl font-bold text-green-600">
                  {announcements.filter((a) => a.status === "published").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Scheduled</p>
                <p className="text-2xl font-bold text-orange-600">
                  {announcements.filter((a) => a.status === "scheduled").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Teams Integration</p>
                <p className="text-2xl font-bold text-purple-600">
                  {announcements.filter((a) => a.isDistributedToTeams).length}
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search announcements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {announcementTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                {priorities.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((announcement) => (
          <Card key={announcement.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {announcement.isPinned && <Pin className="h-4 w-4 text-purple-600" />}
                    <h4 className="font-semibold text-lg">{announcement.title}</h4>
                    <Badge
                      variant="outline"
                      className={`${priorities.find((p) => p.value === announcement.priority)?.color}`}
                    >
                      {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}
                    </Badge>
                    <Badge variant="outline">
                      {announcement.status.charAt(0).toUpperCase() + announcement.status.slice(1)}
                    </Badge>
                    {announcement.isDistributedToTeams && (
                      <Badge variant="secondary">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Teams
                      </Badge>
                    )}
                  </div>

                  <p className="text-muted-foreground mb-4">{announcement.content}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-muted-foreground">Affected Projects:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {announcement.affectedProjects.map((project) => (
                          <Badge key={project} variant="outline" className="text-xs">
                            {project}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Affected Roles:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {announcement.affectedRoles.map((role) => (
                          <Badge key={role} variant="outline" className="text-xs">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {(announcement.aiFlags.isOutdated || announcement.aiFlags.hasConflicts) && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-800">AI Insights</span>
                      </div>
                      {announcement.aiFlags.isOutdated && (
                        <p className="text-xs text-orange-700 mt-1">⚠️ This instruction may be outdated</p>
                      )}
                      {announcement.aiFlags.hasConflicts && (
                        <p className="text-xs text-orange-700 mt-1">⚡ {announcement.aiFlags.flaggedReason}</p>
                      )}
                      <div className="mt-2">
                        <p className="text-xs text-orange-700">
                          <strong>AI Recommended Recipients:</strong>{" "}
                          {announcement.aiFlags.recommendedRecipients.join(", ")}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span>{announcement.views} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span>{announcement.comments} comments</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{announcement.affectedRoles.length} roles</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 ml-4">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAnnouncements.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Announcements Found</h3>
            <p className="text-muted-foreground">No quality announcements match your current search criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
