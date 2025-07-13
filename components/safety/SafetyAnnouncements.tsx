/**
 * @fileoverview Safety Announcements Component
 * @module SafetyAnnouncements
 * @version 1.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Component for managing safety announcements, notices, and alerts
 * Provides announcement publishing, priority management, and distribution tracking
 */

"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Checkbox } from "../ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Progress } from "../ui/progress"
import { toast } from "sonner"
import {
  Bell,
  AlertTriangle,
  Info,
  CheckCircle,
  Plus,
  Edit,
  Eye,
  Send,
  Users,
  Calendar,
  Clock,
  Search,
  Filter,
  RefreshCw,
  Megaphone,
  Archive,
  Pin,
  Trash2,
  ExternalLink,
  Paperclip,
  Target,
  TrendingUp,
  Brain,
  AlertCircle,
  CloudRain,
  Thermometer,
  Shield,
  Activity,
  MapPin,
  Building,
  UserCheck,
  History,
  ChevronRight,
  Download,
  Share,
  Lightbulb,
  Zap,
  FileText,
  CheckSquare,
  X,
} from "lucide-react"

interface SafetyAnnouncement {
  id: string
  title: string
  content: string
  type: "General" | "Alert" | "Emergency" | "Policy" | "Training"
  priority: "Low" | "Medium" | "High" | "Critical"
  status: "Draft" | "Published" | "Archived"
  publishDate: string
  expiryDate?: string
  author: string
  targetAudience: string[]
  readCount: number
  totalTargeted: number
  isPinned: boolean
  attachments?: string[]
  tags: string[]
}

interface NotificationSettings {
  emailEnabled: boolean
  smsEnabled: boolean
  pushEnabled: boolean
  digestFrequency: "Immediate" | "Daily" | "Weekly"
  categories: string[]
}

interface BroadcastForm {
  title: string
  message: string
  type: "General" | "Alert" | "Emergency" | "Policy" | "Training"
  priority: "Low" | "Medium" | "High" | "Critical"
  targetType: "All Projects" | "Region" | "Role" | "Project Phase" | "Custom"
  regions: string[]
  roles: string[]
  projectPhases: string[]
  customFilters: string[]
  attachments: File[]
  scheduleType: "Immediate" | "Scheduled"
  scheduledDate?: string
  scheduledTime?: string
  channels: {
    dashboard: boolean
    teams: boolean
    email: boolean
    sms: boolean
  }
}

interface DistributionHistory {
  id: string
  title: string
  sentDate: string
  recipients: number
  channels: string[]
  status: "Sent" | "Pending" | "Failed"
  readRate: number
  engagementRate: number
  author: string
}

interface AISuggestion {
  id: string
  title: string
  reason: string
  priority: "Low" | "Medium" | "High" | "Critical"
  type: "Incident-Based" | "Trend-Based" | "Weather-Based" | "Regulation-Based"
  urgency: number
  suggestedTargets: string[]
  description: string
  suggestedActions: string[]
  relatedData: string[]
  confidence: number
}

export const SafetyAnnouncements: React.FC = () => {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("announcements")
  const [broadcastForm, setBroadcastForm] = useState<BroadcastForm>({
    title: "",
    message: "",
    type: "General",
    priority: "Medium",
    targetType: "All Projects",
    regions: [],
    roles: [],
    projectPhases: [],
    customFilters: [],
    attachments: [],
    scheduleType: "Immediate",
    channels: {
      dashboard: true,
      teams: false,
      email: false,
      sms: false,
    },
  })
  const [showAISuggestions, setShowAISuggestions] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Mock announcements data
  const announcements: SafetyAnnouncement[] = [
    {
      id: "SA-001",
      title: "Updated Fall Protection Requirements",
      content:
        "New OSHA regulations require additional safety harness inspections. All workers must complete updated training by February 15th. Failure to comply may result in work suspension.",
      type: "Policy",
      priority: "High",
      status: "Published",
      publishDate: "2024-01-15",
      expiryDate: "2024-02-15",
      author: "Sarah Johnson",
      targetAudience: ["All Workers", "Supervisors"],
      readCount: 45,
      totalTargeted: 78,
      isPinned: true,
      attachments: ["fall-protection-update.pdf", "training-schedule.xlsx"],
      tags: ["Fall Protection", "OSHA", "Training", "Mandatory"],
    },
    {
      id: "SA-002",
      title: "Emergency Evacuation Drill - January 25th",
      content:
        "Mandatory emergency evacuation drill scheduled for Thursday, January 25th at 2:00 PM. All personnel must participate. Assembly point: North Parking Lot.",
      type: "Emergency",
      priority: "Critical",
      status: "Published",
      publishDate: "2024-01-18",
      expiryDate: "2024-01-25",
      author: "Mike Wilson",
      targetAudience: ["All Workers", "Supervisors", "Visitors"],
      readCount: 67,
      totalTargeted: 95,
      isPinned: true,
      tags: ["Emergency", "Evacuation", "Drill", "Mandatory"],
    },
    {
      id: "SA-003",
      title: "New Safety Award Program",
      content:
        "Introducing our monthly safety recognition program. Nominate colleagues who demonstrate exceptional safety practices. Winners receive $100 gift cards and recognition.",
      type: "General",
      priority: "Medium",
      status: "Published",
      publishDate: "2024-01-12",
      author: "Lisa Davis",
      targetAudience: ["All Workers"],
      readCount: 23,
      totalTargeted: 78,
      isPinned: false,
      tags: ["Recognition", "Awards", "Safety Culture"],
    },
    {
      id: "SA-004",
      title: "Weather Alert - High Winds Expected",
      content:
        "National Weather Service forecasts sustained winds of 35+ mph tomorrow. Crane operations suspended. Secure all loose materials. Exercise extra caution with elevated work.",
      type: "Alert",
      priority: "High",
      status: "Published",
      publishDate: "2024-01-19",
      expiryDate: "2024-01-21",
      author: "Robert Brown",
      targetAudience: ["Crane Operators", "Site Supervisors"],
      readCount: 18,
      totalTargeted: 25,
      isPinned: true,
      attachments: ["weather-forecast.pdf"],
      tags: ["Weather", "Winds", "Crane Operations", "Alert"],
    },
    {
      id: "SA-005",
      title: "PPE Inspection Reminder",
      content:
        "Weekly PPE inspection due. Check hard hats, safety glasses, gloves, and boots for damage. Report any issues to your supervisor immediately. Replacement PPE available at the tool trailer.",
      type: "General",
      priority: "Medium",
      status: "Published",
      publishDate: "2024-01-16",
      author: "Jennifer Lee",
      targetAudience: ["All Workers"],
      readCount: 34,
      totalTargeted: 78,
      isPinned: false,
      tags: ["PPE", "Inspection", "Weekly"],
    },
    {
      id: "SA-006",
      title: "Confined Space Entry Procedures Update",
      content:
        "New atmospheric monitoring requirements for confined space entry. Gas meters must be calibrated weekly. Updated entry permit forms available. Training session scheduled for February 5th.",
      type: "Training",
      priority: "High",
      status: "Draft",
      publishDate: "2024-01-20",
      author: "David Martinez",
      targetAudience: ["Confined Space Team"],
      readCount: 0,
      totalTargeted: 12,
      isPinned: false,
      tags: ["Confined Space", "Procedures", "Training", "Gas Detection"],
    },
  ]

  // Mock notification settings
  const notificationSettings: NotificationSettings = {
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true,
    digestFrequency: "Daily",
    categories: ["Emergency", "Policy", "Training"],
  }

  // New mock data for broadcast functionality
  const regions = [
    "North Region",
    "South Region",
    "East Region",
    "West Region",
    "Central Region",
    "Mountain Region",
    "Pacific Region",
  ]

  const roles = [
    "Project Manager",
    "Site Supervisor",
    "Safety Officer",
    "Foreman",
    "Crane Operator",
    "Electrical Worker",
    "Plumber",
    "Carpenter",
    "Welder",
    "Equipment Operator",
    "Laborer",
    "Quality Control",
  ]

  const projectPhases = [
    "Pre-Construction",
    "Site Preparation",
    "Foundation",
    "Framing",
    "Rough-In",
    "Drywall",
    "Finishes",
    "Final Inspection",
    "Closeout",
  ]

  // Mock distribution history
  const distributionHistory: DistributionHistory[] = [
    {
      id: "DH-001",
      title: "Emergency Evacuation Drill - January 25th",
      sentDate: "2024-01-18 14:30",
      recipients: 95,
      channels: ["Dashboard", "Teams", "Email"],
      status: "Sent",
      readRate: 89,
      engagementRate: 76,
      author: "Mike Wilson",
    },
    {
      id: "DH-002",
      title: "Updated Fall Protection Requirements",
      sentDate: "2024-01-15 09:15",
      recipients: 78,
      channels: ["Dashboard", "Email"],
      status: "Sent",
      readRate: 58,
      engagementRate: 45,
      author: "Sarah Johnson",
    },
    {
      id: "DH-003",
      title: "Weather Alert - High Winds Expected",
      sentDate: "2024-01-19 16:45",
      recipients: 25,
      channels: ["Dashboard", "Teams", "SMS"],
      status: "Sent",
      readRate: 92,
      engagementRate: 88,
      author: "Robert Brown",
    },
    {
      id: "DH-004",
      title: "Weekend Safety Reminder",
      sentDate: "2024-01-20 10:00",
      recipients: 45,
      channels: ["Dashboard"],
      status: "Pending",
      readRate: 0,
      engagementRate: 0,
      author: "Jennifer Lee",
    },
  ]

  // AI-powered priority suggestions
  const aiSuggestions: AISuggestion[] = [
    {
      id: "AI-001",
      title: "Heat Stress Prevention Alert",
      reason: "Temperature forecast shows 95°F+ for next 3 days",
      priority: "High",
      type: "Weather-Based",
      urgency: 85,
      suggestedTargets: ["All Workers", "Supervisors"],
      description:
        "Extreme heat conditions expected. Recommend immediate heat illness prevention measures including increased hydration breaks, shade requirements, and early morning start times.",
      suggestedActions: [
        "Mandatory 10-minute breaks every hour",
        "Provide electrolyte drinks",
        "Set up cooling stations",
        "Monitor workers for heat exhaustion symptoms",
      ],
      relatedData: ["Weather forecast", "Historical heat incidents"],
      confidence: 92,
    },
    {
      id: "AI-002",
      title: "Electrical Safety Refresher",
      reason: "3 electrical incidents reported across portfolio in last 30 days",
      priority: "Critical",
      type: "Incident-Based",
      urgency: 95,
      suggestedTargets: ["Electrical Workers", "Supervisors"],
      description:
        "Increased electrical incidents indicate need for immediate safety refresher training. Pattern analysis shows lockout/tagout procedures are primary concern.",
      suggestedActions: [
        "Mandatory LOTO refresher training",
        "Increased electrical safety inspections",
        "Review arc flash procedures",
        "Verify proper PPE usage",
      ],
      relatedData: ["Incident reports", "Safety training records"],
      confidence: 88,
    },
    {
      id: "AI-003",
      title: "Winter Weather Preparation",
      reason: "Seasonal weather patterns indicate ice/snow risk",
      priority: "Medium",
      type: "Weather-Based",
      urgency: 70,
      suggestedTargets: ["All Workers", "Equipment Operators"],
      description:
        "Prepare for winter conditions with enhanced safety protocols for ice, snow, and cold weather operations.",
      suggestedActions: [
        "Distribute ice cleats and winter PPE",
        "Review cold weather work procedures",
        "Inspect heating equipment",
        "Plan snow removal procedures",
      ],
      relatedData: ["Weather patterns", "Historical winter incidents"],
      confidence: 78,
    },
    {
      id: "AI-004",
      title: "Crane Safety Focus",
      reason: "Increased crane activity across 5 active projects",
      priority: "High",
      type: "Trend-Based",
      urgency: 82,
      suggestedTargets: ["Crane Operators", "Riggers", "Site Supervisors"],
      description:
        "Multiple projects entering phases with heavy crane usage. Proactive safety communication recommended.",
      suggestedActions: [
        "Daily crane safety briefings",
        "Review load charts and capacities",
        "Inspect rigging equipment",
        "Coordinate with other trades",
      ],
      relatedData: ["Project schedules", "Equipment utilization"],
      confidence: 85,
    },
  ]

  // Helper functions
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-800"
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950 dark:text-orange-200 dark:border-orange-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-200 dark:border-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-800"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-950 dark:text-gray-200 dark:border-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Emergency":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-800"
      case "Alert":
        return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950 dark:text-orange-200 dark:border-orange-800"
      case "Policy":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800"
      case "Training":
        return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-200 dark:border-purple-800"
      case "General":
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-950 dark:text-gray-200 dark:border-gray-800"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-950 dark:text-gray-200 dark:border-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-800"
      case "Draft":
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-950 dark:text-gray-200 dark:border-gray-800"
      case "Archived":
        return "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-950 dark:text-gray-400 dark:border-gray-800"
      case "Sent":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-200 dark:border-yellow-800"
      case "Failed":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-800"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-950 dark:text-gray-200 dark:border-gray-800"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "Critical":
        return <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
      case "High":
        return <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
      case "Medium":
        return <Info className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      case "Low":
        return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getAITypeIcon = (type: string) => {
    switch (type) {
      case "Incident-Based":
        return <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
      case "Weather-Based":
        return <CloudRain className="h-4 w-4 text-blue-500 dark:text-blue-400" />
      case "Trend-Based":
        return <TrendingUp className="h-4 w-4 text-purple-500 dark:text-purple-400" />
      case "Regulation-Based":
        return <FileText className="h-4 w-4 text-green-500 dark:text-green-400" />
      default:
        return <Brain className="h-4 w-4 text-muted-foreground" />
    }
  }

  // Form handlers
  const handleFormChange = (field: keyof BroadcastForm, value: any) => {
    setBroadcastForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleTargetChange = (type: string, value: string, checked: boolean) => {
    if (type === "regions") {
      setBroadcastForm((prev) => ({
        ...prev,
        regions: checked ? [...prev.regions, value] : prev.regions.filter((r) => r !== value),
      }))
    } else if (type === "roles") {
      setBroadcastForm((prev) => ({
        ...prev,
        roles: checked ? [...prev.roles, value] : prev.roles.filter((r) => r !== value),
      }))
    } else if (type === "projectPhases") {
      setBroadcastForm((prev) => ({
        ...prev,
        projectPhases: checked ? [...prev.projectPhases, value] : prev.projectPhases.filter((p) => p !== value),
      }))
    }
  }

  const handleChannelChange = (channel: keyof BroadcastForm["channels"], checked: boolean) => {
    setBroadcastForm((prev) => ({
      ...prev,
      channels: {
        ...prev.channels,
        [channel]: checked,
      },
    }))
  }

  const handleApplyAISuggestion = (suggestion: AISuggestion) => {
    setBroadcastForm((prev) => ({
      ...prev,
      title: suggestion.title,
      message: suggestion.description,
      priority: suggestion.priority,
      type: suggestion.type.includes("Weather")
        ? "Alert"
        : suggestion.type.includes("Incident")
        ? "Emergency"
        : "General",
    }))
    setActiveTab("broadcast")
    toast.success("AI suggestion applied to broadcast form")
  }

  const handleSendBroadcast = () => {
    if (!broadcastForm.title || !broadcastForm.message) {
      toast.error("Please fill in title and message")
      return
    }

    // Simulate sending broadcast
    toast.success("Safety notice broadcast sent successfully")

    // Reset form
    setBroadcastForm({
      title: "",
      message: "",
      type: "General",
      priority: "Medium",
      targetType: "All Projects",
      regions: [],
      roles: [],
      projectPhases: [],
      customFilters: [],
      attachments: [],
      scheduleType: "Immediate",
      channels: {
        dashboard: true,
        teams: false,
        email: false,
        sms: false,
      },
    })
  }

  const handleSaveDraft = () => {
    toast.success("Broadcast saved as draft")
  }

  // Render functions
  const renderAnnouncementsTab = () => (
    <div className="space-y-6">
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
                  {announcements.filter((ann) => ann.status === "Published").length}
                </p>
              </div>
              <Megaphone className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">High Priority</p>
                <p className="text-2xl font-bold text-orange-600">
                  {announcements.filter((ann) => ann.priority === "High" || ann.priority === "Critical").length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Avg Read Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(
                    announcements
                      .filter((ann) => ann.status === "Published")
                      .reduce((sum, ann) => sum + (ann.readCount / ann.totalTargeted) * 100, 0) /
                      announcements.filter((ann) => ann.status === "Published").length
                  )}
                  %
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Announcement
          </Button>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <Card key={announcement.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {announcement.isPinned && <Pin className="h-4 w-4 text-blue-600" />}
                    {getPriorityIcon(announcement.priority)}
                    <h3 className="text-lg font-semibold">{announcement.title}</h3>
                    <Badge variant="outline" className={getPriorityColor(announcement.priority)}>
                      {announcement.priority}
                    </Badge>
                    <Badge variant="outline" className={getTypeColor(announcement.type)}>
                      {announcement.type}
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(announcement.status)}>
                      {announcement.status}
                    </Badge>
                  </div>

                  <p className="text-muted-foreground mb-4 leading-relaxed">{announcement.content}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Author:</span>
                      <p className="font-medium">{announcement.author}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Published:</span>
                      <p className="font-medium">{announcement.publishDate}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Read Rate:</span>
                      <p className="font-medium">
                        {announcement.readCount}/{announcement.totalTargeted} (
                        {Math.round((announcement.readCount / announcement.totalTargeted) * 100)}%)
                      </p>
                    </div>
                  </div>

                  {announcement.expiryDate && (
                    <div className="mt-2 text-sm">
                      <span className="text-muted-foreground">Expires:</span>
                      <span className="font-medium ml-1">{announcement.expiryDate}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{announcement.targetAudience.join(", ")}</span>
                    </div>
                    {announcement.attachments && announcement.attachments.length > 0 && (
                      <div className="flex items-center gap-1">
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {announcement.attachments.length} attachment(s)
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {announcement.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-6">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  {announcement.status === "Draft" && (
                    <Button size="sm">
                      <Send className="h-4 w-4 mr-1" />
                      Publish
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Archive className="h-4 w-4 mr-1" />
                    Archive
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderBroadcastTab = () => (
    <div className="space-y-6">
      {/* AI Suggestions Panel */}
      {showAISuggestions && (
        <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                HBI Safety Notices
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowAISuggestions(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiSuggestions.map((suggestion) => (
              <Card key={suggestion.id} className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getAITypeIcon(suggestion.type)}
                        <h4 className="font-semibold text-foreground">{suggestion.title}</h4>
                        <Badge variant="outline" className={getPriorityColor(suggestion.priority)}>
                          {suggestion.priority}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200 border-blue-300 dark:border-blue-700"
                        >
                          {suggestion.type}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">{suggestion.reason}</p>
                      <p className="text-sm text-foreground mb-3">{suggestion.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-foreground">Suggested Actions:</span>
                          <ul className="mt-1 space-y-1">
                            {suggestion.suggestedActions.map((action, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <CheckSquare className="h-3 w-3 text-green-600 dark:text-green-400" />
                                <span className="text-foreground">{action}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="font-medium text-foreground">Targets:</span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {suggestion.suggestedTargets.map((target, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {target}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Confidence:</span>
                          <Progress value={suggestion.confidence} className="w-20 h-2" />
                          <span className="text-xs font-medium text-foreground">{suggestion.confidence}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Urgency:</span>
                          <Progress value={suggestion.urgency} className="w-20 h-2" />
                          <span className="text-xs font-medium text-foreground">{suggestion.urgency}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => handleApplyAISuggestion(suggestion)}>
                        <Lightbulb className="h-4 w-4 mr-1" />
                        Apply
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Broadcast Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            Create Safety Notice Broadcast
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={broadcastForm.title}
                onChange={(e) => handleFormChange("title", e.target.value)}
                placeholder="Enter notice title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={broadcastForm.type} onValueChange={(value) => handleFormChange("type", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="Alert">Alert</SelectItem>
                  <SelectItem value="Emergency">Emergency</SelectItem>
                  <SelectItem value="Policy">Policy</SelectItem>
                  <SelectItem value="Training">Training</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={broadcastForm.priority} onValueChange={(value) => handleFormChange("priority", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule">Schedule</Label>
              <Select
                value={broadcastForm.scheduleType}
                onValueChange={(value) => handleFormChange("scheduleType", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Immediate">Send Immediately</SelectItem>
                  <SelectItem value="Scheduled">Schedule for Later</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {broadcastForm.scheduleType === "Scheduled" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduledDate">Date</Label>
                <Input
                  id="scheduledDate"
                  type="date"
                  value={broadcastForm.scheduledDate}
                  onChange={(e) => handleFormChange("scheduledDate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scheduledTime">Time</Label>
                <Input
                  id="scheduledTime"
                  type="time"
                  value={broadcastForm.scheduledTime}
                  onChange={(e) => handleFormChange("scheduledTime", e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={broadcastForm.message}
              onChange={(e) => handleFormChange("message", e.target.value)}
              placeholder="Enter your safety notice message"
              rows={4}
            />
          </div>

          {/* Target Audience */}
          <div className="space-y-4">
            <Label>Target Audience</Label>
            <div className="space-y-2">
              <Label htmlFor="targetType">Target Type</Label>
              <Select value={broadcastForm.targetType} onValueChange={(value) => handleFormChange("targetType", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Projects">All Projects</SelectItem>
                  <SelectItem value="Region">By Region</SelectItem>
                  <SelectItem value="Role">By Role</SelectItem>
                  <SelectItem value="Project Phase">By Project Phase</SelectItem>
                  <SelectItem value="Custom">Custom Selection</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {broadcastForm.targetType === "Region" && (
              <div className="space-y-2">
                <Label>Select Regions</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {regions.map((region) => (
                    <div key={region} className="flex items-center space-x-2">
                      <Checkbox
                        id={region}
                        checked={broadcastForm.regions.includes(region)}
                        onCheckedChange={(checked) => handleTargetChange("regions", region, checked as boolean)}
                      />
                      <Label htmlFor={region} className="text-sm">
                        {region}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {broadcastForm.targetType === "Role" && (
              <div className="space-y-2">
                <Label>Select Roles</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {roles.map((role) => (
                    <div key={role} className="flex items-center space-x-2">
                      <Checkbox
                        id={role}
                        checked={broadcastForm.roles.includes(role)}
                        onCheckedChange={(checked) => handleTargetChange("roles", role, checked as boolean)}
                      />
                      <Label htmlFor={role} className="text-sm">
                        {role}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {broadcastForm.targetType === "Project Phase" && (
              <div className="space-y-2">
                <Label>Select Project Phases</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {projectPhases.map((phase) => (
                    <div key={phase} className="flex items-center space-x-2">
                      <Checkbox
                        id={phase}
                        checked={broadcastForm.projectPhases.includes(phase)}
                        onCheckedChange={(checked) => handleTargetChange("projectPhases", phase, checked as boolean)}
                      />
                      <Label htmlFor={phase} className="text-sm">
                        {phase}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Distribution Channels */}
          <div className="space-y-4">
            <Label>Distribution Channels</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dashboard"
                  checked={broadcastForm.channels.dashboard}
                  onCheckedChange={(checked) => handleChannelChange("dashboard", checked as boolean)}
                />
                <Label htmlFor="dashboard" className="text-sm">
                  Project Dashboards
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="teams"
                  checked={broadcastForm.channels.teams}
                  onCheckedChange={(checked) => handleChannelChange("teams", checked as boolean)}
                />
                <Label htmlFor="teams" className="text-sm">
                  Teams Channel
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="email"
                  checked={broadcastForm.channels.email}
                  onCheckedChange={(checked) => handleChannelChange("email", checked as boolean)}
                />
                <Label htmlFor="email" className="text-sm">
                  Email
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sms"
                  checked={broadcastForm.channels.sms}
                  onCheckedChange={(checked) => handleChannelChange("sms", checked as boolean)}
                />
                <Label htmlFor="sms" className="text-sm">
                  SMS
                </Label>
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <Label>Attachments</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center bg-muted/20">
              <Paperclip className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Drag and drop files here or click to browse</p>
              <Button variant="outline" size="sm" className="mt-2">
                Browse Files
              </Button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-2">
            <Button onClick={handleSendBroadcast} className="bg-[#FA4616] hover:bg-[#FA4616]/90">
              <Send className="h-4 w-4 mr-2" />
              Send Broadcast
            </Button>
            <Button variant="outline" onClick={handleSaveDraft}>
              <FileText className="h-4 w-4 mr-2" />
              Save as Draft
            </Button>
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Distribution History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Distribution History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Sent</p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {distributionHistory.length}
                      </p>
                    </div>
                    <Send className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Recipients</p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {distributionHistory.reduce((sum, item) => sum + item.recipients, 0)}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-green-500 dark:text-green-400" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Avg Read Rate</p>
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {Math.round(
                          distributionHistory
                            .filter((item) => item.status === "Sent")
                            .reduce((sum, item) => sum + item.readRate, 0) /
                            distributionHistory.filter((item) => item.status === "Sent").length
                        )}
                        %
                      </p>
                    </div>
                    <Eye className="h-8 w-8 text-purple-500 dark:text-purple-400" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Avg Engagement</p>
                      <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {Math.round(
                          distributionHistory
                            .filter((item) => item.status === "Sent")
                            .reduce((sum, item) => sum + item.engagementRate, 0) /
                            distributionHistory.filter((item) => item.status === "Sent").length
                        )}
                        %
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-orange-500 dark:text-orange-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Distribution Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Sent Date</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Channels</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Read Rate</TableHead>
                    <TableHead>Engagement</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {distributionHistory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>{item.sentDate}</TableCell>
                      <TableCell>{item.recipients}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {item.channels.map((channel) => (
                            <Badge key={channel} variant="secondary" className="text-xs">
                              {channel}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={item.readRate} className="w-16 h-2" />
                          <span className="text-xs font-medium">{item.readRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={item.engagementRate} className="w-16 h-2" />
                          <span className="text-xs font-medium">{item.engagementRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{item.author}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">Delivery Methods</h4>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={notificationSettings.emailEnabled}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Email notifications</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={notificationSettings.smsEnabled}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">SMS notifications</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={notificationSettings.pushEnabled}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Push notifications</span>
                </label>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Digest Frequency</h4>
              <div className="space-y-2">
                {["Immediate", "Daily", "Weekly"].map((frequency) => (
                  <label key={frequency} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="digestFrequency"
                      value={frequency}
                      checked={notificationSettings.digestFrequency === frequency}
                      className="text-blue-600"
                    />
                    <span className="text-sm">{frequency}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Categories to Follow</h4>
              <div className="space-y-3">
                {["Emergency", "Policy", "Training", "General", "Alert"].map((category) => (
                  <label key={category} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={notificationSettings.categories.includes(category)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button>Save Settings</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

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
          <h3 className="text-lg font-semibold">Safety Announcements & Notices</h3>
          <p className="text-sm text-muted-foreground">
            Manage safety communications, alerts, and policy announcements
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="broadcast">Broadcast</TabsTrigger>
          <TabsTrigger value="notifications">Notification Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="announcements" className="space-y-4">
          {renderAnnouncementsTab()}
        </TabsContent>
        <TabsContent value="broadcast" className="space-y-4">
          {renderBroadcastTab()}
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          {renderNotificationsTab()}
        </TabsContent>
      </Tabs>
    </div>
  )
}
