/**
 * @fileoverview Toolbox Talk Generator Panel Component
 * @module ToolboxTalkPanel
 * @version 1.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Features:
 * - Automatically pulls upcoming 2-week schedule
 * - Cross-references with industry bulletins, historical safety incidents, and regional conditions
 * - AI-generated toolbox talk outlines with topics, talking points, checklists
 * - Assignment as forms or PDF export functionality
 * - Integration with regional weather and safety alert systems
 */

"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card"
import { Badge } from "../../ui/badge"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog"
import { Textarea } from "../../ui/textarea"
import { Separator } from "../../ui/separator"
import { Progress } from "../../ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table"
import { Checkbox } from "../../ui/checkbox"
import { toast } from "sonner"
import {
  Brain,
  Calendar,
  Users,
  FileText,
  Download,
  Send,
  Plus,
  RefreshCw,
  Eye,
  Edit,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  CloudRain,
  Sun,
  Thermometer,
  Wind,
  Star,
  Target,
  Lightbulb,
  Activity,
  HardHat,
  Zap,
  Building,
  Wrench,
  AlertCircle,
  TrendingUp,
  MapPin,
  Link,
  Video,
  FileImage,
  ExternalLink,
  ChevronRight,
  Paperclip,
  BookOpen,
  Shield,
  X,
  Check,
  Copy,
  Share,
  Printer,
  Mail,
  MessageSquare,
  CheckSquare,
  Square,
} from "lucide-react"

// Types
interface ScheduleActivity {
  id: string
  name: string
  trade: string
  startDate: string
  endDate: string
  phase: string
  crew: number
  location: string
  status: "upcoming" | "in-progress" | "planned"
  riskLevel: "low" | "medium" | "high" | "critical"
  equipmentNeeded: string[]
  specialRequirements?: string[]
}

interface IndustryBulletin {
  id: string
  title: string
  source: string
  dateIssued: string
  category: string
  severity: "info" | "warning" | "critical"
  summary: string
  applicableTrades: string[]
  relatedActivities: string[]
  url: string
}

interface SafetyIncident {
  id: string
  date: string
  type: string
  trade: string
  activity: string
  severity: "near-miss" | "minor" | "serious" | "fatal"
  description: string
  rootCause: string
  preventionMeasures: string[]
  lessonsLearned: string
}

interface RegionalCondition {
  id: string
  type: "weather" | "air-quality" | "natural-disaster" | "traffic" | "construction"
  title: string
  description: string
  severity: "low" | "medium" | "high" | "extreme"
  startDate: string
  endDate: string
  impactedActivities: string[]
  recommendations: string[]
}

interface ToolboxTalk {
  id: string
  title: string
  topic: string
  generatedDate: string
  targetAudience: string[]
  estimatedDuration: string
  triggers: string[]
  talkingPoints: string[]
  checklist: string[]
  mediaLinks: Array<{
    type: "video" | "image" | "document" | "link"
    title: string
    url: string
    description: string
  }>
  aiConfidence: number
  status: "generated" | "reviewed" | "assigned" | "completed"
  assignedTo?: string
  assignedDate?: string
  completedDate?: string
  notes?: string
  sourceData: {
    scheduleActivities: string[]
    industryBulletins: string[]
    safetyIncidents: string[]
    regionalConditions: string[]
  }
}

interface ToolboxTalkPanelProps {
  projectId: string
  projectData: any
  userRole: string
  user: any
}

// Mock data generators
const getMockScheduleActivities = (projectId: string): ScheduleActivity[] => [
  {
    id: "SA-001",
    name: "Foundation Excavation",
    trade: "concrete",
    startDate: "2025-01-20",
    endDate: "2025-01-24",
    phase: "Foundation",
    crew: 8,
    location: "Building A - East Side",
    status: "upcoming",
    riskLevel: "high",
    equipmentNeeded: ["Excavator", "Dump Trucks", "Compaction Equipment"],
    specialRequirements: ["Confined space entry", "Heavy equipment operation", "Soil testing"],
  },
  {
    id: "SA-002",
    name: "Electrical Rough-In - Level 2",
    trade: "electrical",
    startDate: "2025-01-22",
    endDate: "2025-01-28",
    phase: "Electrical Systems",
    crew: 6,
    location: "Building A - Levels 2-3",
    status: "upcoming",
    riskLevel: "medium",
    equipmentNeeded: ["Conduit Bender", "Wire Pulling Equipment", "Lifts"],
    specialRequirements: ["Working at height", "Energized equipment nearby"],
  },
  {
    id: "SA-003",
    name: "Steel Beam Installation",
    trade: "steel",
    startDate: "2025-01-25",
    endDate: "2025-02-05",
    phase: "Structural",
    crew: 12,
    location: "Building A - Main Structure",
    status: "planned",
    riskLevel: "critical",
    equipmentNeeded: ["Tower Crane", "Welding Equipment", "Rigging Hardware"],
    specialRequirements: ["Crane operations", "Working at height", "Hot work permits"],
  },
  {
    id: "SA-004",
    name: "Roofing Installation",
    trade: "roofing",
    startDate: "2025-01-30",
    endDate: "2025-02-10",
    phase: "Building Envelope",
    crew: 10,
    location: "Building A - Roof Level",
    status: "planned",
    riskLevel: "high",
    equipmentNeeded: ["Safety Lines", "Membrane Materials", "Heat Guns"],
    specialRequirements: ["Fall protection", "Weather dependent", "Hot work"],
  },
  {
    id: "SA-005",
    name: "HVAC Ductwork Installation",
    trade: "hvac",
    startDate: "2025-02-01",
    endDate: "2025-02-14",
    phase: "MEP Systems",
    crew: 8,
    location: "Building A - All Levels",
    status: "planned",
    riskLevel: "medium",
    equipmentNeeded: ["Duct Lifts", "Cutting Tools", "Support Hardware"],
    specialRequirements: ["Working overhead", "Coordination with other trades"],
  },
]

const getMockIndustryBulletins = (): IndustryBulletin[] => [
  {
    id: "IB-001",
    title: "OSHA Alert: Winter Weather Construction Safety",
    source: "OSHA",
    dateIssued: "2025-01-10",
    category: "Weather Safety",
    severity: "warning",
    summary:
      "Increased hazards during winter construction including slips, falls, hypothermia, and equipment malfunction in cold temperatures.",
    applicableTrades: ["general", "concrete", "steel", "roofing"],
    relatedActivities: ["excavation", "concrete work", "steel erection", "roofing"],
    url: "https://osha.gov/winter-construction-safety",
  },
  {
    id: "IB-002",
    title: "NIOSH Research: Crane Safety in High Wind Conditions",
    source: "NIOSH",
    dateIssued: "2025-01-12",
    category: "Equipment Safety",
    severity: "critical",
    summary:
      "New research on crane operation wind speed limits and improved monitoring protocols for high-wind conditions.",
    applicableTrades: ["steel", "concrete", "general"],
    relatedActivities: ["crane operations", "steel erection", "concrete placement"],
    url: "https://niosh.gov/crane-wind-safety",
  },
  {
    id: "IB-003",
    title: "Industry Safety Alert: Electrical Arc Flash Incidents",
    source: "Electrical Safety Foundation International",
    dateIssued: "2025-01-08",
    category: "Electrical Safety",
    severity: "critical",
    summary:
      "Recent increase in arc flash incidents during electrical rough-in work. Updated PPE requirements and lockout procedures.",
    applicableTrades: ["electrical"],
    relatedActivities: ["electrical installation", "energized work", "panel installation"],
    url: "https://esfi.org/arc-flash-safety",
  },
  {
    id: "IB-004",
    title: "CDC Health Advisory: Air Quality During Construction",
    source: "CDC",
    dateIssued: "2025-01-15",
    category: "Health",
    severity: "warning",
    summary:
      "Guidelines for construction work during poor air quality conditions, including dust control and respiratory protection.",
    applicableTrades: ["general", "concrete", "drywall"],
    relatedActivities: ["demolition", "concrete cutting", "drywall installation"],
    url: "https://cdc.gov/construction-air-quality",
  },
]

const getMockSafetyIncidents = (): SafetyIncident[] => [
  {
    id: "SI-001",
    date: "2024-12-18",
    type: "Fall from Height",
    trade: "electrical",
    activity: "Electrical rough-in work",
    severity: "serious",
    description: "Electrician fell 8 feet from scissor lift while installing conduit. Inadequate fall protection.",
    rootCause: "Failure to use fall protection equipment on scissor lift platform",
    preventionMeasures: [
      "Mandatory fall protection training refresher",
      "Daily equipment inspections",
      "Supervisor presence during aerial lift work",
    ],
    lessonsLearned: "Fall protection is required on all aerial lifts regardless of height",
  },
  {
    id: "SI-002",
    date: "2024-12-22",
    type: "Struck by Object",
    trade: "steel",
    activity: "Steel beam installation",
    severity: "minor",
    description: "Ironworker struck by falling bolt during crane operations. Minor head injury.",
    rootCause: "Inadequate barricading of crane operation area",
    preventionMeasures: [
      "Expanded exclusion zones during crane operations",
      "Enhanced communication protocols",
      "Tool tethering requirements",
    ],
    lessonsLearned: "All personnel must stay clear of crane operations unless essential",
  },
  {
    id: "SI-003",
    date: "2024-12-28",
    type: "Near Miss - Equipment",
    trade: "concrete",
    activity: "Foundation excavation",
    severity: "near-miss",
    description: "Excavator boom came within 3 feet of overhead power line during excavation work.",
    rootCause: "Inadequate pre-work planning and utility coordination",
    preventionMeasures: [
      "Enhanced utility location procedures",
      "Mandatory pre-work briefings near utilities",
      "Designated spotters for equipment near utilities",
    ],
    lessonsLearned: "Always verify utility locations before equipment operation",
  },
]

const getMockRegionalConditions = (): RegionalCondition[] => [
  {
    id: "RC-001",
    type: "weather",
    title: "High Wind Warning",
    description: "Sustained winds 25-35 mph with gusts up to 50 mph expected for next 48 hours",
    severity: "high",
    startDate: "2025-01-20",
    endDate: "2025-01-22",
    impactedActivities: ["crane operations", "roofing work", "exterior work"],
    recommendations: [
      "Suspend crane operations when winds exceed 25 mph",
      "Secure all loose materials and equipment",
      "Postpone roofing and exterior work until winds subside",
    ],
  },
  {
    id: "RC-002",
    type: "weather",
    title: "Cold Temperature Alert",
    description: "Temperatures dropping to 15°F (-9°C) with wind chill values as low as -5°F",
    severity: "medium",
    startDate: "2025-01-23",
    endDate: "2025-01-25",
    impactedActivities: ["concrete work", "outdoor work", "equipment operation"],
    recommendations: [
      "Implement cold weather concrete procedures",
      "Increase warm-up break frequency",
      "Check equipment cold weather starting procedures",
    ],
  },
  {
    id: "RC-003",
    type: "air-quality",
    title: "Air Quality Advisory - Particulate Matter",
    description:
      "Elevated PM2.5 levels due to regional wildfires. AQI forecasted 101-150 (Unhealthy for Sensitive Groups)",
    severity: "medium",
    startDate: "2025-01-21",
    endDate: "2025-01-24",
    impactedActivities: ["outdoor work", "demolition", "cutting operations"],
    recommendations: [
      "Provide N95 or better respiratory protection",
      "Limit outdoor exposure for sensitive individuals",
      "Enhance dust control measures",
    ],
  },
]

// AI-powered toolbox talk generator
const generateToolboxTalks = (
  scheduleActivities: ScheduleActivity[],
  industryBulletins: IndustryBulletin[],
  safetyIncidents: SafetyIncident[],
  regionalConditions: RegionalCondition[]
): ToolboxTalk[] => {
  const talks: ToolboxTalk[] = []

  // Talk 1: Based on high-risk upcoming activity (Foundation Excavation)
  talks.push({
    id: "TT-001",
    title: "Excavation Safety and Confined Space Awareness",
    topic: "Foundation Excavation Safety",
    generatedDate: "2025-01-18",
    targetAudience: ["concrete", "general", "equipment-operators"],
    estimatedDuration: "15 minutes",
    triggers: ["High-risk excavation work starting Jan 20", "Confined space requirements"],
    talkingPoints: [
      "Review excavation safety plan and emergency procedures",
      "Identify confined space entry requirements for foundation work",
      "Discuss soil conditions and shoring requirements",
      "Review equipment inspection procedures for excavators",
      "Establish communication protocols between equipment operators and ground crew",
      "Identify emergency evacuation routes and assembly points",
    ],
    checklist: [
      "Verify excavation permits are in place",
      "Confirm utilities have been located and marked",
      "Inspect shoring equipment and materials",
      "Check confined space entry equipment and procedures",
      "Verify emergency communication devices are functional",
      "Confirm all crew members have required confined space training",
    ],
    mediaLinks: [
      {
        type: "video",
        title: "OSHA Excavation Safety Training Video",
        url: "https://osha.gov/excavation-safety-video",
        description: "15-minute video covering excavation hazards and safety procedures",
      },
      {
        type: "document",
        title: "Confined Space Entry Permit Template",
        url: "/safety/documents/confined-space-permit.pdf",
        description: "Standard permit form for confined space entry",
      },
      {
        type: "image",
        title: "Excavation Safety Poster",
        url: "/safety/images/excavation-safety-poster.jpg",
        description: "Visual reminder of key excavation safety practices",
      },
    ],
    aiConfidence: 92,
    status: "generated",
    sourceData: {
      scheduleActivities: ["SA-001"],
      industryBulletins: ["IB-001"],
      safetyIncidents: ["SI-003"],
      regionalConditions: ["RC-001"],
    },
  })

  // Talk 2: Based on industry bulletin and upcoming electrical work
  talks.push({
    id: "TT-002",
    title: "Electrical Safety: Arc Flash Prevention and PPE",
    topic: "Electrical Safety - Arc Flash Prevention",
    generatedDate: "2025-01-18",
    targetAudience: ["electrical", "general"],
    estimatedDuration: "12 minutes",
    triggers: ["Recent industry arc flash incidents", "Electrical rough-in starting Jan 22"],
    talkingPoints: [
      "Review recent arc flash incidents in the industry",
      "Identify arc flash hazards in upcoming electrical work",
      "Discuss proper PPE selection and inspection procedures",
      "Review lockout/tagout procedures for electrical work",
      "Establish safe approach boundaries for energized equipment",
      "Identify emergency response procedures for electrical incidents",
    ],
    checklist: [
      "Verify all electrical workers have current arc flash training",
      "Inspect arc flash PPE for damage or wear",
      "Confirm lockout/tagout devices are available and functional",
      "Check that incident energy calculations are current",
      "Verify emergency shutdown procedures are posted",
      "Confirm first aid supplies for electrical burns are available",
    ],
    mediaLinks: [
      {
        type: "link",
        title: "ESFI Arc Flash Safety Guidelines",
        url: "https://esfi.org/arc-flash-safety",
        description: "Latest industry guidelines on arc flash prevention",
      },
      {
        type: "video",
        title: "Arc Flash Incident Recreation",
        url: "https://safety-videos.com/arc-flash-demo",
        description: "Demonstration of arc flash event and proper PPE usage",
      },
      {
        type: "document",
        title: "Lockout/Tagout Checklist",
        url: "/safety/documents/loto-checklist.pdf",
        description: "Step-by-step LOTO procedure checklist",
      },
    ],
    aiConfidence: 88,
    status: "generated",
    sourceData: {
      scheduleActivities: ["SA-002"],
      industryBulletins: ["IB-003"],
      safetyIncidents: ["SI-001"],
      regionalConditions: [],
    },
  })

  // Talk 3: Based on regional weather conditions and multiple upcoming activities
  talks.push({
    id: "TT-003",
    title: "High Wind Operations and Weather Safety",
    topic: "Weather-Related Safety - High Winds",
    generatedDate: "2025-01-18",
    targetAudience: ["steel", "roofing", "crane-operators", "general"],
    estimatedDuration: "10 minutes",
    triggers: ["High wind warning Jan 20-22", "Crane operations scheduled", "Roofing work planned"],
    talkingPoints: [
      "Review high wind warning for January 20-22",
      "Discuss wind speed limits for crane operations (25 mph limit)",
      "Identify activities that must be suspended during high winds",
      "Review procedures for securing loose materials and equipment",
      "Establish communication protocols for weather monitoring",
      "Discuss alternative work activities during weather delays",
    ],
    checklist: [
      "Check weather forecast before starting work each day",
      "Verify crane wind speed monitoring equipment is functional",
      "Secure all loose materials, tools, and equipment",
      "Identify indoor work alternatives during high wind periods",
      "Confirm emergency weather shelters are accessible",
      "Review evacuation procedures from elevated work areas",
    ],
    mediaLinks: [
      {
        type: "link",
        title: "Weather.gov Construction Weather Alerts",
        url: "https://weather.gov/construction-alerts",
        description: "Real-time weather alerts for construction sites",
      },
      {
        type: "document",
        title: "High Wind Operations Procedure",
        url: "/safety/documents/high-wind-procedure.pdf",
        description: "Company procedure for high wind conditions",
      },
      {
        type: "image",
        title: "Wind Speed Reference Chart",
        url: "/safety/images/wind-speed-chart.jpg",
        description: "Visual guide to wind speeds and construction impacts",
      },
    ],
    aiConfidence: 85,
    status: "generated",
    sourceData: {
      scheduleActivities: ["SA-003", "SA-004"],
      industryBulletins: ["IB-002"],
      safetyIncidents: [],
      regionalConditions: ["RC-001"],
    },
  })

  return talks
}

export const ToolboxTalkPanel: React.FC<ToolboxTalkPanelProps> = ({ projectId, projectData, userRole, user }) => {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("generated")
  const [toolboxTalks, setToolboxTalks] = useState<ToolboxTalk[]>([])
  const [scheduleActivities, setScheduleActivities] = useState<ScheduleActivity[]>([])
  const [industryBulletins, setIndustryBulletins] = useState<IndustryBulletin[]>([])
  const [safetyIncidents, setSafetyIncidents] = useState<SafetyIncident[]>([])
  const [regionalConditions, setRegionalConditions] = useState<RegionalCondition[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTalk, setSelectedTalk] = useState<ToolboxTalk | null>(null)
  const [showAssignDialog, setShowAssignDialog] = useState(false)
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        // Load all data sources
        const activities = getMockScheduleActivities(projectId)
        const bulletins = getMockIndustryBulletins()
        const incidents = getMockSafetyIncidents()
        const conditions = getMockRegionalConditions()

        setScheduleActivities(activities)
        setIndustryBulletins(bulletins)
        setSafetyIncidents(incidents)
        setRegionalConditions(conditions)

        // Generate AI-powered toolbox talks
        const generatedTalks = generateToolboxTalks(activities, bulletins, incidents, conditions)
        setToolboxTalks(generatedTalks)
      } catch (error) {
        console.error("Error loading toolbox talk data:", error)
        toast.error("Failed to load toolbox talk data")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [projectId])

  // Filter toolbox talks based on search
  const filteredTalks = useMemo(() => {
    if (!searchQuery) return toolboxTalks

    return toolboxTalks.filter(
      (talk) =>
        talk.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        talk.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        talk.targetAudience.some((audience) => audience.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [toolboxTalks, searchQuery])

  // Get risk level color
  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical":
        return "text-red-600 dark:text-red-400"
      case "high":
        return "text-orange-600 dark:text-orange-400"
      case "medium":
        return "text-yellow-600 dark:text-yellow-400"
      case "low":
        return "text-green-600 dark:text-green-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  // Get severity color for bulletins/conditions
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-800"
      case "warning":
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950 dark:text-orange-200 dark:border-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-200 dark:border-yellow-800"
      case "info":
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-950 dark:text-gray-200 dark:border-gray-800"
    }
  }

  // Handle talk assignment
  const handleAssignTalk = (talk: ToolboxTalk, assignedTo: string) => {
    setToolboxTalks((prev) =>
      prev.map((t) =>
        t.id === talk.id
          ? { ...t, status: "assigned", assignedTo, assignedDate: new Date().toISOString().split("T")[0] }
          : t
      )
    )
    setShowAssignDialog(false)
    toast.success(`Toolbox talk "${talk.title}" assigned to ${assignedTo}`)
  }

  // Handle PDF export
  const handleExportPDF = (talk: ToolboxTalk) => {
    // In a real implementation, this would generate and download a PDF
    toast.success(`Exporting "${talk.title}" as PDF`)
    console.log("Exporting toolbox talk as PDF:", talk)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Generating AI-powered toolbox talks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-foreground">AI-Generated Toolbox Talks</h3>
          <p className="text-sm text-muted-foreground">
            Smart toolbox talks based on schedule, industry alerts, incidents, and regional conditions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Regenerate
          </Button>
        </div>
      </div>

      {/* Data Sources Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Schedule Activities</p>
                <p className="text-2xl font-bold text-blue-600">{scheduleActivities.length}</p>
                <p className="text-xs text-muted-foreground">Next 2 weeks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Industry Bulletins</p>
                <p className="text-2xl font-bold text-orange-600">{industryBulletins.length}</p>
                <p className="text-xs text-muted-foreground">Recent alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">Safety Incidents</p>
                <p className="text-2xl font-bold text-red-600">{safetyIncidents.length}</p>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CloudRain className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Regional Conditions</p>
                <p className="text-2xl font-bold text-purple-600">{regionalConditions.length}</p>
                <p className="text-xs text-muted-foreground">Active alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="generated">Generated Talks ({filteredTalks.length})</TabsTrigger>
          <TabsTrigger value="sources">Data Sources</TabsTrigger>
          <TabsTrigger value="schedule">Schedule Impact</TabsTrigger>
          <TabsTrigger value="assigned">Assigned Talks</TabsTrigger>
        </TabsList>

        {/* Generated Talks Tab */}
        <TabsContent value="generated" className="space-y-4">
          {/* Search */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search toolbox talks by title, topic, or audience..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Toolbox Talks List */}
          <div className="space-y-4">
            {filteredTalks.map((talk) => (
              <Card key={talk.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h4 className="text-lg font-semibold text-foreground">{talk.title}</h4>
                        <Badge
                          variant="outline"
                          className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200"
                        >
                          <Brain className="h-3 w-3 mr-1" />
                          AI Generated
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium">{talk.aiConfidence}% Confidence</span>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">{talk.topic}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <span className="font-medium text-foreground">Duration:</span>
                          <p className="text-muted-foreground">{talk.estimatedDuration}</p>
                        </div>
                        <div>
                          <span className="font-medium text-foreground">Audience:</span>
                          <p className="text-muted-foreground">{talk.targetAudience.join(", ")}</p>
                        </div>
                        <div>
                          <span className="font-medium text-foreground">Talking Points:</span>
                          <p className="text-muted-foreground">{talk.talkingPoints.length} items</p>
                        </div>
                        <div>
                          <span className="font-medium text-foreground">Media Links:</span>
                          <p className="text-muted-foreground">{talk.mediaLinks.length} resources</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <span className="text-sm font-medium text-foreground">Generated from:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {talk.triggers.map((trigger, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {trigger}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedTalk(talk)
                          setShowPreviewDialog(true)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedTalk(talk)
                          setShowAssignDialog(true)
                        }}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Assign
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleExportPDF(talk)}>
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTalks.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Toolbox Talks Generated</h3>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? "No talks match your search criteria."
                    : "No data sources available for AI generation."}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Data Sources Tab */}
        <TabsContent value="sources" className="space-y-6">
          {/* Schedule Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Schedule Activities (Next 2 Weeks)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduleActivities.map((activity) => (
                  <div key={activity.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-foreground">{activity.name}</h4>
                          <Badge variant="outline" className={getRiskColor(activity.riskLevel)}>
                            {activity.riskLevel} risk
                          </Badge>
                          <Badge variant="secondary">{activity.trade}</Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium text-foreground">Dates:</span>
                            <p>
                              {activity.startDate} - {activity.endDate}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-foreground">Crew Size:</span>
                            <p>{activity.crew} workers</p>
                          </div>
                          <div>
                            <span className="font-medium text-foreground">Location:</span>
                            <p>{activity.location}</p>
                          </div>
                          <div>
                            <span className="font-medium text-foreground">Equipment:</span>
                            <p>{activity.equipmentNeeded.join(", ")}</p>
                          </div>
                        </div>
                        {activity.specialRequirements && (
                          <div className="mt-2">
                            <span className="text-sm font-medium text-foreground">Special Requirements:</span>
                            <p className="text-sm text-muted-foreground">{activity.specialRequirements.join(", ")}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Industry Bulletins */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Recent Industry Safety Bulletins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {industryBulletins.map((bulletin) => (
                  <div key={bulletin.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-foreground">{bulletin.title}</h4>
                          <Badge variant="outline" className={getSeverityColor(bulletin.severity)}>
                            {bulletin.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{bulletin.summary}</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-foreground">Source:</span>
                            <p className="text-muted-foreground">{bulletin.source}</p>
                          </div>
                          <div>
                            <span className="font-medium text-foreground">Date:</span>
                            <p className="text-muted-foreground">{bulletin.dateIssued}</p>
                          </div>
                          <div>
                            <span className="font-medium text-foreground">Trades:</span>
                            <p className="text-muted-foreground">{bulletin.applicableTrades.join(", ")}</p>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={bulletin.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Safety Incidents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Recent Safety Incidents (Internal)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {safetyIncidents.map((incident) => (
                  <div key={incident.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-foreground">{incident.type}</h4>
                          <Badge variant="outline" className={getSeverityColor(incident.severity)}>
                            {incident.severity}
                          </Badge>
                          <Badge variant="secondary">{incident.trade}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{incident.description}</p>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium text-foreground">Root Cause:</span>
                            <p className="text-muted-foreground">{incident.rootCause}</p>
                          </div>
                          <div>
                            <span className="font-medium text-foreground">Lessons Learned:</span>
                            <p className="text-muted-foreground">{incident.lessonsLearned}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Regional Conditions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CloudRain className="h-5 w-5" />
                Current Regional Conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regionalConditions.map((condition) => (
                  <div key={condition.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-foreground">{condition.title}</h4>
                          <Badge variant="outline" className={getSeverityColor(condition.severity)}>
                            {condition.severity}
                          </Badge>
                          <Badge variant="secondary">{condition.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{condition.description}</p>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium text-foreground">Duration:</span>
                            <p className="text-muted-foreground">
                              {condition.startDate} - {condition.endDate}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-foreground">Impacted Activities:</span>
                            <p className="text-muted-foreground">{condition.impactedActivities.join(", ")}</p>
                          </div>
                          <div>
                            <span className="font-medium text-foreground">Recommendations:</span>
                            <ul className="text-muted-foreground list-disc list-inside">
                              {condition.recommendations.map((rec, index) => (
                                <li key={index}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Impact Tab */}
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Impact Analysis</CardTitle>
              <CardDescription>How upcoming activities and conditions affect safety requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Risk Analysis */}
                <div>
                  <h4 className="font-medium text-foreground mb-3">Risk Level Distribution</h4>
                  <div className="grid grid-cols-4 gap-4">
                    {["critical", "high", "medium", "low"].map((level) => {
                      const count = scheduleActivities.filter((a) => a.riskLevel === level).length
                      return (
                        <div key={level} className="text-center">
                          <div className={`text-2xl font-bold ${getRiskColor(level)}`}>{count}</div>
                          <div className="text-sm text-muted-foreground capitalize">{level} Risk</div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <Separator />

                {/* Trade Activity Timeline */}
                <div>
                  <h4 className="font-medium text-foreground mb-3">Trade Activity Timeline</h4>
                  <div className="space-y-3">
                    {scheduleActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="w-24 text-sm text-muted-foreground">{activity.startDate}</div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">{activity.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {activity.trade} • {activity.crew} workers
                          </div>
                        </div>
                        <Badge variant="outline" className={getRiskColor(activity.riskLevel)}>
                          {activity.riskLevel}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assigned Talks Tab */}
        <TabsContent value="assigned" className="space-y-4">
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Assigned Talks</h3>
              <p className="text-muted-foreground">
                Assigned toolbox talks will appear here once you assign them to team members.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTalk ? `Preview: ${selectedTalk.title}` : "Toolbox Talk Preview"}</DialogTitle>
          </DialogHeader>
          {selectedTalk && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-foreground">Topic:</span>
                  <p className="text-sm text-muted-foreground">{selectedTalk.topic}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground">Duration:</span>
                  <p className="text-sm text-muted-foreground">{selectedTalk.estimatedDuration}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground">Target Audience:</span>
                  <p className="text-sm text-muted-foreground">{selectedTalk.targetAudience.join(", ")}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground">AI Confidence:</span>
                  <p className="text-sm text-muted-foreground">{selectedTalk.aiConfidence}%</p>
                </div>
              </div>

              {/* Talking Points */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Talking Points</h4>
                <ul className="space-y-2">
                  {selectedTalk.talkingPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-sm font-medium text-muted-foreground mt-0.5">{index + 1}.</span>
                      <span className="text-sm text-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Checklist */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Safety Checklist</h4>
                <div className="space-y-2">
                  {selectedTalk.checklist.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Square className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <span className="text-sm text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Media Links */}
              {selectedTalk.mediaLinks.length > 0 && (
                <div>
                  <h4 className="font-medium text-foreground mb-3">Additional Resources</h4>
                  <div className="space-y-3">
                    {selectedTalk.mediaLinks.map((link, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className="mt-1">
                          {link.type === "video" && <Video className="h-4 w-4 text-blue-500" />}
                          {link.type === "image" && <FileImage className="h-4 w-4 text-green-500" />}
                          {link.type === "document" && <FileText className="h-4 w-4 text-red-500" />}
                          {link.type === "link" && <Link className="h-4 w-4 text-purple-500" />}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">{link.title}</div>
                          <div className="text-sm text-muted-foreground">{link.description}</div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={link.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Source Data */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Generated From</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-foreground">Schedule Activities:</span>
                    <p className="text-muted-foreground">
                      {selectedTalk.sourceData.scheduleActivities.length} activities
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Industry Bulletins:</span>
                    <p className="text-muted-foreground">
                      {selectedTalk.sourceData.industryBulletins.length} bulletins
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Safety Incidents:</span>
                    <p className="text-muted-foreground">{selectedTalk.sourceData.safetyIncidents.length} incidents</p>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Regional Conditions:</span>
                    <p className="text-muted-foreground">
                      {selectedTalk.sourceData.regionalConditions.length} conditions
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => handleExportPDF(selectedTalk)}>
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button
                  onClick={() => {
                    setShowPreviewDialog(false)
                    setShowAssignDialog(true)
                  }}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Assign
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Assignment Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assign Toolbox Talk</DialogTitle>
          </DialogHeader>
          {selectedTalk && (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium text-foreground">{selectedTalk.title}</h4>
                <p className="text-sm text-muted-foreground">{selectedTalk.topic}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Assign to Team Member</label>
                <Select defaultValue="">
                  <SelectTrigger>
                    <SelectValue placeholder="Select person to assign..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john-smith">John Smith - Project Manager</SelectItem>
                    <SelectItem value="mike-davis">Mike Davis - Safety Officer</SelectItem>
                    <SelectItem value="tom-anderson">Tom Anderson - Foreman</SelectItem>
                    <SelectItem value="lisa-wilson">Lisa Wilson - Superintendent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Scheduled Date</label>
                <Input type="date" defaultValue={new Date().toISOString().split("T")[0]} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Additional Notes</label>
                <Textarea placeholder="Add any specific instructions or context..." />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => handleAssignTalk(selectedTalk, "John Smith")}>Assign Toolbox Talk</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ToolboxTalkPanel
