/**
 * @fileoverview Lessons Learned Notices Management Component
 * @module LessonsLearnedNotices
 * @version 1.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Component for managing AI-generated lessons learned notices from QC issues and warranty claims
 * Features: Auto-generation, knowledge base storage, tagging, publishing, search and filtering
 */

"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Separator } from "../ui/separator"
import { ScrollArea } from "../ui/scroll-area"
import { ProtectedGrid, type GridConfig, type ProtectedColDef, type GridRow } from "../ui/protected-grid"
import { RowSelectedEvent } from "ag-grid-community"
import {
  Lightbulb,
  BookOpen,
  Share2,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Plus,
  FileText,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Users,
  Building,
  Wrench,
  Clock,
  Tag,
  ExternalLink,
  MessageSquare,
  Star,
  Target,
  Database,
  Zap,
  Shield,
  Settings,
  Calendar,
  Copy,
  Send,
  Archive,
  Trash2,
  Brain,
  BarChart3,
  PieChart,
  Activity,
  Layers,
  MapPin,
  ClipboardCheck,
  Bell,
  Mail,
  Megaphone,
  Globe,
  Lock,
  Unlock,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
  ChevronDown,
  Info,
  Upload,
  Image,
  Paperclip,
  X,
  Save,
  Wand2,
  Sparkles,
  Cpu,
  CloudUpload,
  Link,
  Hash,
  Award,
  Flag,
  Bookmark,
  History,
  GitBranch,
  TreePine,
  Workflow,
  Network,
  Radar,
  Shuffle,
  Route,
  Compass,
  Navigation,
  Map,
  Crosshair,
  Gauge,
  Thermometer,
  Droplet,
  Wind,
  Sun,
  Cloud,
  Umbrella,
  Snowflake,
  Flame,
  Zap as Lightning,
  Tornado,
  Satellite,
  Rocket,
  Plane,
  Car,
  Truck,
  Bus,
  Train,
  Bike,
  Ship,
  Anchor,
  Sailboat,
  Ambulance,
  Tractor,
  Forklift,
  Drill,
  Hammer,
  Wrench as WrenchIcon,
  Ruler,
  Anvil,
  Microwave,
  Box,
  Container,
  Package,
  Stamp,
  Mailbox,
  Store,
  Club,
  Theater,
  Timer,
  Hourglass,
  Compass as CompassIcon,
  Map as MapIcon,
  Globe as GlobeIcon,
  Earth,
  Moon,
  Star as StarIcon,
  Space,
  Orbit,
  Mountain,
  Gem,
  Diamond,
  Gauge as GaugeIcon,
  Layers as LayersIcon,
  Zap as ZapIcon,
} from "lucide-react"

// Interfaces for Lessons Learned system
interface LessonsLearnedNotice {
  id: string
  title: string
  description: string
  sourceType: "qc_issue" | "warranty_claim"
  sourceId: string
  projectId: string
  projectName: string
  reportedBy: string
  createdDate: string
  lastUpdated: string
  status: "draft" | "under_review" | "approved" | "published" | "archived"
  priority: "low" | "medium" | "high" | "critical"
  tags: {
    trades: string[]
    phases: string[]
    scopes: string[]
    disciplines: string[]
    components: string[]
    locations: string[]
  }
  rootCauseAnalysis: {
    primaryCause: string
    contributingFactors: string[]
    systemicIssues: string[]
    humanFactors: string[]
    environmentalFactors: string[]
    processBreakdowns: string[]
    aiGenerated: boolean
    confidence: number
  }
  preventionStrategies: {
    immediate: string[]
    shortTerm: string[]
    longTerm: string[]
    processChanges: string[]
    trainingNeeds: string[]
    technologySolutions: string[]
    aiGenerated: boolean
    confidence: number
  }
  checklistItems: {
    existing: string[]
    new: string[]
    updated: string[]
    priority: "critical" | "high" | "medium" | "low"
    applicablePhases: string[]
    aiGenerated: boolean
    confidence: number
  }
  riskMitigation: {
    riskLevel: "low" | "medium" | "high" | "critical"
    mitigationSteps: string[]
    monitoringRequirements: string[]
    contingencyPlans: string[]
    resourceRequirements: string[]
    timeframe: string
    aiGenerated: boolean
    confidence: number
  }
  impactAnalysis: {
    costImpact: number
    scheduleImpact: number
    qualityImpact: string
    safetyImpact: string
    reputation: string
    recurrenceRisk: number
    aiGenerated: boolean
    confidence: number
  }
  publishedTo: {
    projects: string[]
    teams: string[]
    departments: string[]
    external: boolean
    notifications: boolean
    dashboard: boolean
  }
  metrics: {
    views: number
    likes: number
    shares: number
    implementations: number
    effectiveness: number
    feedback: LessonsLearnedFeedback[]
  }
  attachments: LessonsLearnedAttachment[]
  reviews: LessonsLearnedReview[]
  aiAnalysis: {
    generated: boolean
    model: string
    version: string
    timestamp: string
    confidence: number
    suggestions: string[]
    improvements: string[]
  }
}

interface LessonsLearnedFeedback {
  id: string
  userId: string
  userName: string
  rating: number
  comment: string
  helpful: boolean
  timestamp: string
  implemented: boolean
}

interface LessonsLearnedAttachment {
  id: string
  name: string
  type: string
  size: string
  url: string
  uploadedBy: string
  uploadedDate: string
  description: string
}

interface LessonsLearnedReview {
  id: string
  reviewerId: string
  reviewerName: string
  status: "approved" | "rejected" | "needs_revision"
  comments: string
  timestamp: string
  suggestions: string[]
}

interface LessonsLearnedFilters {
  status: string
  priority: string
  sourceType: string
  project: string
  trade: string
  phase: string
  dateRange: string
  searchTerm: string
}

// Mock data for lessons learned notices
const mockLessonsLearned: LessonsLearnedNotice[] = [
  {
    id: "LL001",
    title: "Concrete Curing Issues in Winter Conditions",
    description: "Critical concrete strength issues identified during winter pour operations",
    sourceType: "qc_issue",
    sourceId: "QC-2024-001",
    projectId: "P001",
    projectName: "Downtown Office Complex",
    reportedBy: "Sarah Johnson",
    createdDate: "2024-01-15T10:30:00Z",
    lastUpdated: "2024-01-16T14:20:00Z",
    status: "published",
    priority: "critical",
    tags: {
      trades: ["Concrete", "Structural"],
      phases: ["Foundation", "Superstructure"],
      scopes: ["Cast-in-Place", "Structural Elements"],
      disciplines: ["Civil", "Structural"],
      components: ["Footings", "Columns", "Beams"],
      locations: ["Level B1", "Level 1", "Level 2"],
    },
    rootCauseAnalysis: {
      primaryCause: "Inadequate cold weather protection during concrete curing",
      contributingFactors: [
        "Ambient temperature below 40°F during critical curing period",
        "Insufficient insulation of freshly placed concrete",
        "Lack of heated enclosures for critical structural elements",
      ],
      systemicIssues: [
        "Cold weather concreting procedures not adequately followed",
        "Insufficient monitoring of concrete temperature during curing",
      ],
      humanFactors: [
        "Crew not fully trained on cold weather procedures",
        "Supervision not present during critical curing periods",
      ],
      environmentalFactors: [
        "Unexpected temperature drop below forecasted minimum",
        "High wind conditions accelerating heat loss",
      ],
      processBreakdowns: [
        "Quality control checklist not executed properly",
        "Temperature monitoring equipment not calibrated",
      ],
      aiGenerated: true,
      confidence: 0.92,
    },
    preventionStrategies: {
      immediate: [
        "Implement mandatory temperature monitoring every 2 hours",
        "Provide heated enclosures for all critical pours",
        "Require cold weather protection plan approval before any pour",
      ],
      shortTerm: [
        "Enhance crew training on cold weather concreting",
        "Upgrade temperature monitoring equipment",
        "Establish backup heating systems",
      ],
      longTerm: [
        "Develop comprehensive cold weather standard operating procedures",
        "Implement automated temperature monitoring systems",
        "Create partnership with specialized cold weather contractors",
      ],
      processChanges: [
        "Mandatory weather review 24 hours before concrete pours",
        "Required sign-off from quality manager for cold weather pours",
        "Enhanced documentation requirements for winter operations",
      ],
      trainingNeeds: [
        "ACI 306 Cold Weather Concreting certification",
        "Temperature monitoring equipment operation",
        "Cold weather protection system installation",
      ],
      technologySolutions: [
        "IoT temperature sensors with real-time alerts",
        "Automated heating system controls",
        "Weather monitoring integration",
      ],
      aiGenerated: true,
      confidence: 0.89,
    },
    checklistItems: {
      existing: ["Verify ambient temperature before pour", "Check concrete temperature at delivery"],
      new: [
        "Confirm heated enclosure installation and operation",
        "Verify backup heating system availability",
        "Document temperature monitoring plan",
        "Obtain cold weather protection approval",
      ],
      updated: [
        "Enhanced temperature monitoring requirements (every 2 hours vs. daily)",
        "Mandatory weather forecast review 24 hours prior",
        "Required presence of qualified cold weather specialist",
      ],
      priority: "critical",
      applicablePhases: ["Foundation", "Superstructure", "Structural"],
      aiGenerated: true,
      confidence: 0.94,
    },
    riskMitigation: {
      riskLevel: "high",
      mitigationSteps: [
        "Implement real-time temperature monitoring",
        "Establish minimum temperature thresholds",
        "Create rapid response protocols for temperature deviations",
        "Maintain backup heating equipment inventory",
      ],
      monitoringRequirements: [
        "Continuous temperature monitoring during curing",
        "Daily weather forecast review",
        "Weekly equipment calibration checks",
      ],
      contingencyPlans: [
        "Emergency heating system deployment",
        "Alternative curing methods for extreme conditions",
        "Accelerated testing protocols for early strength verification",
      ],
      resourceRequirements: [
        "Specialized cold weather equipment",
        "Certified cold weather technicians",
        "Enhanced monitoring systems",
      ],
      timeframe: "Immediate implementation required",
      aiGenerated: true,
      confidence: 0.91,
    },
    impactAnalysis: {
      costImpact: 45000,
      scheduleImpact: 14,
      qualityImpact: "Significant strength reduction requiring structural repairs",
      safetyImpact: "Potential structural integrity concerns",
      reputation: "Client confidence impacted due to quality issues",
      recurrenceRisk: 0.25,
      aiGenerated: true,
      confidence: 0.87,
    },
    publishedTo: {
      projects: ["P001", "P002", "P003"],
      teams: ["Quality Control", "Concrete Crew", "Project Management"],
      departments: ["Construction", "Quality Assurance"],
      external: false,
      notifications: true,
      dashboard: true,
    },
    metrics: {
      views: 156,
      likes: 23,
      shares: 8,
      implementations: 5,
      effectiveness: 0.82,
      feedback: [],
    },
    attachments: [
      {
        id: "ATT001",
        name: "concrete_temperature_logs.pdf",
        type: "application/pdf",
        size: "2.3 MB",
        url: "/attachments/concrete_temperature_logs.pdf",
        uploadedBy: "Sarah Johnson",
        uploadedDate: "2024-01-15T10:30:00Z",
        description: "Temperature monitoring logs during failed pour",
      },
      {
        id: "ATT002",
        name: "cold_weather_procedures.docx",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: "1.8 MB",
        url: "/attachments/cold_weather_procedures.docx",
        uploadedBy: "Sarah Johnson",
        uploadedDate: "2024-01-15T11:15:00Z",
        description: "Updated cold weather concreting procedures",
      },
    ],
    reviews: [
      {
        id: "REV001",
        reviewerId: "U001",
        reviewerName: "Michael Chen",
        status: "approved",
        comments: "Comprehensive analysis with actionable recommendations",
        timestamp: "2024-01-16T09:00:00Z",
        suggestions: ["Consider adding seasonal weather pattern analysis"],
      },
    ],
    aiAnalysis: {
      generated: true,
      model: "HBI-AI-v2.1",
      version: "2.1.0",
      timestamp: "2024-01-15T12:00:00Z",
      confidence: 0.91,
      suggestions: [
        "Consider implementing predictive weather analytics",
        "Explore heated concrete admixtures for extreme conditions",
        "Develop partnerships with weather monitoring services",
      ],
      improvements: [
        "Enhanced root cause analysis depth",
        "More specific prevention strategies",
        "Better risk quantification",
      ],
    },
  },
  {
    id: "LL002",
    title: "HVAC System Warranty Claim - Refrigerant Leak",
    description: "Recurring refrigerant leaks in rooftop units causing system failures",
    sourceType: "warranty_claim",
    sourceId: "WC-2024-003",
    projectId: "P002",
    projectName: "Medical Center Expansion",
    reportedBy: "James Wilson",
    createdDate: "2024-01-10T08:45:00Z",
    lastUpdated: "2024-01-12T16:30:00Z",
    status: "approved",
    priority: "high",
    tags: {
      trades: ["HVAC", "Mechanical"],
      phases: ["Mechanical Systems", "Commissioning"],
      scopes: ["Rooftop Units", "Refrigeration Systems"],
      disciplines: ["Mechanical", "Controls"],
      components: ["Compressors", "Evaporators", "Piping"],
      locations: ["Roof Level", "Mechanical Rooms"],
    },
    rootCauseAnalysis: {
      primaryCause: "Improper brazing techniques during refrigerant line installation",
      contributingFactors: [
        "Inadequate technician training on proper brazing procedures",
        "Use of incorrect brazing materials for refrigerant applications",
        "Insufficient quality control during installation",
      ],
      systemicIssues: [
        "Lack of standardized brazing procedures",
        "No mandatory certification verification for brazing technicians",
      ],
      humanFactors: [
        "Rushed installation schedule leading to shortcuts",
        "Insufficient supervision during critical brazing operations",
      ],
      environmentalFactors: [
        "High humidity conditions affecting brazing quality",
        "Temperature fluctuations during installation",
      ],
      processBreakdowns: [
        "Pressure testing procedures not properly followed",
        "Visual inspection of brazing joints inadequate",
      ],
      aiGenerated: true,
      confidence: 0.88,
    },
    preventionStrategies: {
      immediate: [
        "Implement mandatory pressure testing for all refrigerant joints",
        "Require certified brazing technicians for all HVAC work",
        "Establish enhanced quality control checkpoints",
      ],
      shortTerm: [
        "Provide comprehensive brazing training for all HVAC technicians",
        "Upgrade brazing materials to higher quality standards",
        "Implement visual inspection protocols with documentation",
      ],
      longTerm: [
        "Develop partnership with certified HVAC training facility",
        "Implement automated leak detection systems",
        "Create comprehensive HVAC quality assurance program",
      ],
      processChanges: [
        "Mandatory technician certification verification",
        "Required dual-technician sign-off for critical joints",
        "Enhanced documentation requirements for all brazing work",
      ],
      trainingNeeds: [
        "Advanced brazing techniques certification",
        "Refrigerant handling and safety training",
        "Quality control procedures for HVAC systems",
      ],
      technologySolutions: [
        "Electronic leak detection equipment",
        "Automated pressure testing systems",
        "Digital documentation platforms",
      ],
      aiGenerated: true,
      confidence: 0.85,
    },
    checklistItems: {
      existing: ["Verify technician certifications", "Conduct pressure test on completed systems"],
      new: [
        "Document brazing material specifications",
        "Perform visual inspection of all brazing joints",
        "Verify environmental conditions during installation",
        "Conduct extended pressure testing (minimum 24 hours)",
      ],
      updated: [
        "Enhanced pressure testing requirements (24 hours vs. 4 hours)",
        "Mandatory photographic documentation of all joints",
        "Required third-party verification for critical systems",
      ],
      priority: "high",
      applicablePhases: ["Mechanical Systems", "Commissioning", "Final Inspection"],
      aiGenerated: true,
      confidence: 0.9,
    },
    riskMitigation: {
      riskLevel: "medium",
      mitigationSteps: [
        "Implement regular leak detection inspections",
        "Establish preventive maintenance schedules",
        "Create rapid response protocols for system failures",
        "Maintain emergency repair equipment inventory",
      ],
      monitoringRequirements: [
        "Monthly leak detection inspections",
        "Quarterly system performance reviews",
        "Annual comprehensive system audits",
      ],
      contingencyPlans: [
        "Emergency HVAC system isolation procedures",
        "Backup refrigerant supply agreements",
        "Alternative cooling solutions for critical areas",
      ],
      resourceRequirements: [
        "Certified leak detection equipment",
        "Emergency repair technicians",
        "Backup refrigerant inventory",
      ],
      timeframe: "Implementation within 30 days",
      aiGenerated: true,
      confidence: 0.86,
    },
    impactAnalysis: {
      costImpact: 28000,
      scheduleImpact: 7,
      qualityImpact: "System reliability concerns affecting occupant comfort",
      safetyImpact: "Potential refrigerant exposure risks",
      reputation: "Client dissatisfaction with system performance",
      recurrenceRisk: 0.15,
      aiGenerated: true,
      confidence: 0.84,
    },
    publishedTo: {
      projects: ["P002", "P004"],
      teams: ["HVAC Crew", "Mechanical Team", "Quality Control"],
      departments: ["Mechanical", "Quality Assurance"],
      external: false,
      notifications: true,
      dashboard: true,
    },
    metrics: {
      views: 89,
      likes: 15,
      shares: 4,
      implementations: 3,
      effectiveness: 0.78,
      feedback: [],
    },
    attachments: [
      {
        id: "ATT003",
        name: "hvac_leak_detection_report.pdf",
        type: "application/pdf",
        size: "3.1 MB",
        url: "/attachments/hvac_leak_detection_report.pdf",
        uploadedBy: "James Wilson",
        uploadedDate: "2024-01-10T09:00:00Z",
        description: "Comprehensive leak detection analysis report",
      },
    ],
    reviews: [
      {
        id: "REV002",
        reviewerId: "U002",
        reviewerName: "Lisa Anderson",
        status: "approved",
        comments: "Excellent technical analysis with practical solutions",
        timestamp: "2024-01-11T14:30:00Z",
        suggestions: ["Consider adding cost-benefit analysis for prevention measures"],
      },
    ],
    aiAnalysis: {
      generated: true,
      model: "HBI-AI-v2.1",
      version: "2.1.0",
      timestamp: "2024-01-10T10:30:00Z",
      confidence: 0.87,
      suggestions: [
        "Implement IoT-based continuous monitoring",
        "Explore advanced brazing technologies",
        "Develop predictive maintenance algorithms",
      ],
      improvements: [
        "More detailed cost analysis",
        "Better integration with existing systems",
        "Enhanced monitoring recommendations",
      ],
    },
  },
]

// Mock data for knowledge base statistics
const mockKnowledgeBaseStats = {
  totalNotices: 24,
  publishedNotices: 18,
  draftNotices: 4,
  underReview: 2,
  thisMonth: 6,
  totalViews: 2847,
  totalImplementations: 89,
  averageEffectiveness: 0.83,
  topTags: [
    { tag: "Concrete", count: 8 },
    { tag: "HVAC", count: 6 },
    { tag: "Electrical", count: 4 },
    { tag: "Structural", count: 7 },
    { tag: "Safety", count: 5 },
  ],
  recentActivity: [
    { action: "Published", notice: "Concrete Curing Issues", timestamp: "2024-01-16T14:20:00Z" },
    { action: "Reviewed", notice: "HVAC System Warranty", timestamp: "2024-01-15T10:30:00Z" },
    { action: "Created", notice: "Electrical Panel Issues", timestamp: "2024-01-14T16:45:00Z" },
  ],
}

export const LessonsLearnedNotices: React.FC = () => {
  const [notices, setNotices] = useState<LessonsLearnedNotice[]>(mockLessonsLearned)
  const [selectedNotice, setSelectedNotice] = useState<LessonsLearnedNotice | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showPublishDialog, setShowPublishDialog] = useState(false)
  const [showAIGenerationDialog, setShowAIGenerationDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [filters, setFilters] = useState<LessonsLearnedFilters>({
    status: "all",
    priority: "all",
    sourceType: "all",
    project: "all",
    trade: "all",
    phase: "all",
    dateRange: "all",
    searchTerm: "",
  })

  // Grid configuration for lessons learned notices
  const gridConfig: GridConfig = {}

  const columnDefs: ProtectedColDef[] = [
    {
      headerName: "Notice",
      field: "title",
      width: 250,
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0">
            {params.data.sourceType === "qc_issue" ? (
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            ) : (
              <Wrench className="h-4 w-4 text-blue-500" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">{params.value}</div>
            <div className="text-xs text-muted-foreground truncate">{params.data.projectName}</div>
          </div>
        </div>
      ),
    },
    {
      headerName: "Priority",
      field: "priority",
      width: 100,
      cellRenderer: (params: any) => {
        const priority = params.value
        const colors = {
          critical: "bg-red-100 text-red-800 border-red-200",
          high: "bg-orange-100 text-orange-800 border-orange-200",
          medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
          low: "bg-green-100 text-green-800 border-green-200",
        }
        return <Badge className={`${colors[priority as keyof typeof colors]} border`}>{priority}</Badge>
      },
    },
    {
      headerName: "Status",
      field: "status",
      width: 120,
      cellRenderer: (params: any) => {
        const status = params.value
        const colors = {
          draft: "bg-gray-100 text-gray-800 border-gray-200",
          under_review: "bg-blue-100 text-blue-800 border-blue-200",
          approved: "bg-green-100 text-green-800 border-green-200",
          published: "bg-purple-100 text-purple-800 border-purple-200",
          archived: "bg-gray-100 text-gray-600 border-gray-200",
        }
        return <Badge className={`${colors[status as keyof typeof colors]} border`}>{status.replace("_", " ")}</Badge>
      },
    },
    {
      headerName: "Source",
      field: "sourceType",
      width: 120,
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-2">
          {params.value === "qc_issue" ? (
            <ClipboardCheck className="h-4 w-4 text-orange-500" />
          ) : (
            <Wrench className="h-4 w-4 text-blue-500" />
          )}
          <span className="text-sm">{params.value === "qc_issue" ? "QC Issue" : "Warranty"}</span>
        </div>
      ),
    },
    {
      headerName: "AI Generated",
      field: "aiAnalysis.generated",
      width: 120,
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-2">
          {params.value ? <Brain className="h-4 w-4 text-purple-500" /> : <Users className="h-4 w-4 text-gray-500" />}
          <span className="text-sm">{params.value ? "AI" : "Manual"}</span>
        </div>
      ),
    },
    {
      headerName: "Created",
      field: "createdDate",
      width: 120,
      cellRenderer: (params: any) => (
        <div className="text-sm text-muted-foreground">{new Date(params.value).toLocaleDateString()}</div>
      ),
    },
    {
      headerName: "Views",
      field: "metrics.views",
      width: 80,
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-1">
          <Eye className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{params.value}</span>
        </div>
      ),
    },
    {
      headerName: "Effectiveness",
      field: "metrics.effectiveness",
      width: 120,
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${params.value * 100}%` }} />
          </div>
          <span className="text-sm">{Math.round(params.value * 100)}%</span>
        </div>
      ),
    },
  ]

  const filteredNotices = useMemo(() => {
    return notices.filter((notice) => {
      const matchesSearch =
        !filters.searchTerm ||
        notice.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        notice.description.toLowerCase().includes(filters.searchTerm.toLowerCase())

      const matchesStatus = filters.status === "all" || notice.status === filters.status
      const matchesPriority = filters.priority === "all" || notice.priority === filters.priority
      const matchesSourceType = filters.sourceType === "all" || notice.sourceType === filters.sourceType
      const matchesProject = filters.project === "all" || notice.projectId === filters.project
      const matchesTrade = filters.trade === "all" || notice.tags.trades.includes(filters.trade)
      const matchesPhase = filters.phase === "all" || notice.tags.phases.includes(filters.phase)

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesSourceType &&
        matchesProject &&
        matchesTrade &&
        matchesPhase
      )
    })
  }, [notices, filters])

  const handleRowSelected = (event: RowSelectedEvent) => {
    if (event.node.isSelected()) {
      setSelectedNotice(event.data)
    }
  }

  const handleGenerateAINotice = async (sourceType: string, sourceId: string) => {
    // Simulate AI generation
    setShowAIGenerationDialog(true)

    // Mock AI analysis generation
    setTimeout(() => {
      const newNotice: LessonsLearnedNotice = {
        id: `LL${String(notices.length + 1).padStart(3, "0")}`,
        title: "AI Generated Notice",
        description: "Automatically generated from resolved issue",
        sourceType: sourceType as "qc_issue" | "warranty_claim",
        sourceId: sourceId,
        projectId: "P001",
        projectName: "Sample Project",
        reportedBy: "HBI AI System",
        createdDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        status: "draft",
        priority: "medium",
        tags: {
          trades: ["General"],
          phases: ["Construction"],
          scopes: ["Quality"],
          disciplines: ["General"],
          components: ["Various"],
          locations: ["Site Wide"],
        },
        rootCauseAnalysis: {
          primaryCause: "AI analysis in progress...",
          contributingFactors: [],
          systemicIssues: [],
          humanFactors: [],
          environmentalFactors: [],
          processBreakdowns: [],
          aiGenerated: true,
          confidence: 0.85,
        },
        preventionStrategies: {
          immediate: [],
          shortTerm: [],
          longTerm: [],
          processChanges: [],
          trainingNeeds: [],
          technologySolutions: [],
          aiGenerated: true,
          confidence: 0.85,
        },
        checklistItems: {
          existing: [],
          new: [],
          updated: [],
          priority: "medium",
          applicablePhases: [],
          aiGenerated: true,
          confidence: 0.85,
        },
        riskMitigation: {
          riskLevel: "medium",
          mitigationSteps: [],
          monitoringRequirements: [],
          contingencyPlans: [],
          resourceRequirements: [],
          timeframe: "TBD",
          aiGenerated: true,
          confidence: 0.85,
        },
        impactAnalysis: {
          costImpact: 0,
          scheduleImpact: 0,
          qualityImpact: "Under analysis",
          safetyImpact: "Under analysis",
          reputation: "Under analysis",
          recurrenceRisk: 0,
          aiGenerated: true,
          confidence: 0.85,
        },
        publishedTo: {
          projects: [],
          teams: [],
          departments: [],
          external: false,
          notifications: false,
          dashboard: false,
        },
        metrics: {
          views: 0,
          likes: 0,
          shares: 0,
          implementations: 0,
          effectiveness: 0,
          feedback: [],
        },
        attachments: [],
        reviews: [],
        aiAnalysis: {
          generated: true,
          model: "HBI-AI-v2.1",
          version: "2.1.0",
          timestamp: new Date().toISOString(),
          confidence: 0.85,
          suggestions: [],
          improvements: [],
        },
      }

      setNotices((prev) => [...prev, newNotice])
      setShowAIGenerationDialog(false)
    }, 3000)
  }

  const handlePublishNotice = (noticeId: string) => {
    setNotices((prev) =>
      prev.map((notice) =>
        notice.id === noticeId
          ? { ...notice, status: "published" as const, lastUpdated: new Date().toISOString() }
          : notice
      )
    )
    setShowPublishDialog(false)
  }

  const clearFilters = () => {
    setFilters({
      status: "all",
      priority: "all",
      sourceType: "all",
      project: "all",
      trade: "all",
      phase: "all",
      dateRange: "all",
      searchTerm: "",
    })
  }

  const exportNotices = () => {
    console.log("Exporting lessons learned notices...")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Lightbulb className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Lessons Learned Notices</h1>
            <p className="text-muted-foreground">AI-powered insights from quality issues and warranty claims</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAIGenerationDialog(true)}
            className="flex items-center gap-2"
          >
            <Brain className="h-4 w-4" />
            Generate AI Notice
          </Button>
          <Button variant="outline" size="sm" onClick={exportNotices} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notices</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockKnowledgeBaseStats.totalNotices}</div>
            <p className="text-xs text-muted-foreground">+{mockKnowledgeBaseStats.thisMonth} this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockKnowledgeBaseStats.publishedNotices}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((mockKnowledgeBaseStats.publishedNotices / mockKnowledgeBaseStats.totalNotices) * 100)}% of
              total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockKnowledgeBaseStats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Avg {Math.round(mockKnowledgeBaseStats.totalViews / mockKnowledgeBaseStats.totalNotices)} per notice
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Effectiveness</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(mockKnowledgeBaseStats.averageEffectiveness * 100)}%</div>
            <p className="text-xs text-muted-foreground">
              {mockKnowledgeBaseStats.totalImplementations} implementations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="notices">All Notices</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="knowledge-base">Knowledge Base</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 h-auto p-4"
                  onClick={() => setShowAIGenerationDialog(true)}
                >
                  <Brain className="h-5 w-5 text-purple-500" />
                  <div className="text-left">
                    <div className="font-medium">Generate AI Notice</div>
                    <div className="text-sm text-muted-foreground">From resolved issues</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center gap-2 h-auto p-4"
                  onClick={() => setShowCreateDialog(true)}
                >
                  <Plus className="h-5 w-5 text-blue-500" />
                  <div className="text-left">
                    <div className="font-medium">Create Manual Notice</div>
                    <div className="text-sm text-muted-foreground">Custom analysis</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center gap-2 h-auto p-4"
                  onClick={() => setActiveTab("knowledge-base")}
                >
                  <Database className="h-5 w-5 text-green-500" />
                  <div className="text-left">
                    <div className="font-medium">Browse Knowledge Base</div>
                    <div className="text-sm text-muted-foreground">Search library</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Notices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Notices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notices.slice(0, 5).map((notice) => (
                  <div key={notice.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {notice.sourceType === "qc_issue" ? (
                          <AlertTriangle className="h-5 w-5 text-orange-500" />
                        ) : (
                          <Wrench className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{notice.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {notice.projectName} • {new Date(notice.createdDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={notice.status === "published" ? "default" : "secondary"}>
                        {notice.status.replace("_", " ")}
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedNotice(notice)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Top Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mockKnowledgeBaseStats.topTags.map((tag) => (
                  <Badge key={tag.tag} variant="outline" className="flex items-center gap-1">
                    <span>{tag.tag}</span>
                    <span className="text-xs text-muted-foreground">({tag.count})</span>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notices" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Search</Label>
                  <Input
                    id="search"
                    placeholder="Search notices..."
                    value={filters.searchTerm}
                    onChange={(e) => setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={filters.priority}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sourceType">Source</Label>
                  <Select
                    value={filters.sourceType}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, sourceType: value }))}
                  >
                    <SelectTrigger id="sourceType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      <SelectItem value="qc_issue">QC Issues</SelectItem>
                      <SelectItem value="warranty_claim">Warranty Claims</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project">Project</Label>
                  <Select
                    value={filters.project}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, project: value }))}
                  >
                    <SelectTrigger id="project">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Projects</SelectItem>
                      <SelectItem value="P001">Downtown Office Complex</SelectItem>
                      <SelectItem value="P002">Medical Center Expansion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trade">Trade</Label>
                  <Select
                    value={filters.trade}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, trade: value }))}
                  >
                    <SelectTrigger id="trade">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Trades</SelectItem>
                      <SelectItem value="Concrete">Concrete</SelectItem>
                      <SelectItem value="HVAC">HVAC</SelectItem>
                      <SelectItem value="Electrical">Electrical</SelectItem>
                      <SelectItem value="Structural">Structural</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phase">Phase</Label>
                  <Select
                    value={filters.phase}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, phase: value }))}
                  >
                    <SelectTrigger id="phase">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Phases</SelectItem>
                      <SelectItem value="Foundation">Foundation</SelectItem>
                      <SelectItem value="Superstructure">Superstructure</SelectItem>
                      <SelectItem value="Mechanical Systems">Mechanical Systems</SelectItem>
                      <SelectItem value="Commissioning">Commissioning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end space-y-2">
                  <Button variant="outline" onClick={clearFilters} className="w-full">
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notices Grid */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Lessons Learned Notices ({filteredNotices.length})</span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowCreateDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Notice
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportNotices}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[600px]">
                <ProtectedGrid rowData={filteredNotices} columnDefs={columnDefs} config={gridConfig} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Analytics content placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analytics Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <PieChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Analytics Coming Soon</h3>
                <p className="text-muted-foreground">
                  Advanced analytics and insights will be available in the next release
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge-base" className="space-y-6">
          {/* Knowledge Base content placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Knowledge Base
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Knowledge Base Coming Soon</h3>
                <p className="text-muted-foreground">
                  Searchable knowledge base with advanced categorization and tagging
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Notice Detail Dialog */}
      {selectedNotice && (
        <Dialog open={!!selectedNotice} onOpenChange={() => setSelectedNotice(null)}>
          <DialogContent className="max-w-6xl h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedNotice.sourceType === "qc_issue" ? (
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                ) : (
                  <Wrench className="h-5 w-5 text-blue-500" />
                )}
                {selectedNotice.title}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Header Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Project</Label>
                  <p className="text-sm text-muted-foreground">{selectedNotice.projectName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className="ml-2">{selectedNotice.status.replace("_", " ")}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Priority</Label>
                  <Badge className="ml-2">{selectedNotice.priority}</Badge>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-muted-foreground mt-1">{selectedNotice.description}</p>
              </div>

              {/* Tags */}
              <div>
                <Label className="text-sm font-medium">Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedNotice.tags.trades.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                  {selectedNotice.tags.phases.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                  {selectedNotice.tags.scopes.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Root Cause Analysis */}
              <div>
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Root Cause Analysis
                  {selectedNotice.rootCauseAnalysis.aiGenerated && (
                    <Badge variant="outline" className="text-purple-600">
                      <Brain className="h-3 w-3 mr-1" />
                      AI Generated ({Math.round(selectedNotice.rootCauseAnalysis.confidence * 100)}%)
                    </Badge>
                  )}
                </Label>
                <div className="mt-2 space-y-2">
                  <div>
                    <strong>Primary Cause:</strong> {selectedNotice.rootCauseAnalysis.primaryCause}
                  </div>
                  {selectedNotice.rootCauseAnalysis.contributingFactors.length > 0 && (
                    <div>
                      <strong>Contributing Factors:</strong>
                      <ul className="list-disc ml-6 mt-1">
                        {selectedNotice.rootCauseAnalysis.contributingFactors.map((factor, index) => (
                          <li key={index} className="text-sm">
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Prevention Strategies */}
              <div>
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Prevention Strategies
                  {selectedNotice.preventionStrategies.aiGenerated && (
                    <Badge variant="outline" className="text-purple-600">
                      <Brain className="h-3 w-3 mr-1" />
                      AI Generated ({Math.round(selectedNotice.preventionStrategies.confidence * 100)}%)
                    </Badge>
                  )}
                </Label>
                <div className="mt-2 space-y-3">
                  {selectedNotice.preventionStrategies.immediate.length > 0 && (
                    <div>
                      <strong>Immediate Actions:</strong>
                      <ul className="list-disc ml-6 mt-1">
                        {selectedNotice.preventionStrategies.immediate.map((action, index) => (
                          <li key={index} className="text-sm">
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {selectedNotice.preventionStrategies.shortTerm.length > 0 && (
                    <div>
                      <strong>Short-term Actions:</strong>
                      <ul className="list-disc ml-6 mt-1">
                        {selectedNotice.preventionStrategies.shortTerm.map((action, index) => (
                          <li key={index} className="text-sm">
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {selectedNotice.preventionStrategies.longTerm.length > 0 && (
                    <div>
                      <strong>Long-term Actions:</strong>
                      <ul className="list-disc ml-6 mt-1">
                        {selectedNotice.preventionStrategies.longTerm.map((action, index) => (
                          <li key={index} className="text-sm">
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Checklist Items */}
              <div>
                <Label className="text-sm font-medium flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4" />
                  Checklist Items
                  {selectedNotice.checklistItems.aiGenerated && (
                    <Badge variant="outline" className="text-purple-600">
                      <Brain className="h-3 w-3 mr-1" />
                      AI Generated ({Math.round(selectedNotice.checklistItems.confidence * 100)}%)
                    </Badge>
                  )}
                </Label>
                <div className="mt-2 space-y-2">
                  {selectedNotice.checklistItems.new.length > 0 && (
                    <div>
                      <strong>New Items:</strong>
                      <ul className="list-disc ml-6 mt-1">
                        {selectedNotice.checklistItems.new.map((item, index) => (
                          <li key={index} className="text-sm">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {selectedNotice.checklistItems.updated.length > 0 && (
                    <div>
                      <strong>Updated Items:</strong>
                      <ul className="list-disc ml-6 mt-1">
                        {selectedNotice.checklistItems.updated.map((item, index) => (
                          <li key={index} className="text-sm">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Risk Mitigation */}
              <div>
                <Label className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Risk Mitigation
                  {selectedNotice.riskMitigation.aiGenerated && (
                    <Badge variant="outline" className="text-purple-600">
                      <Brain className="h-3 w-3 mr-1" />
                      AI Generated ({Math.round(selectedNotice.riskMitigation.confidence * 100)}%)
                    </Badge>
                  )}
                </Label>
                <div className="mt-2 space-y-2">
                  <div>
                    <strong>Risk Level:</strong>
                    <Badge className="ml-2">{selectedNotice.riskMitigation.riskLevel}</Badge>
                  </div>
                  <div>
                    <strong>Timeframe:</strong> {selectedNotice.riskMitigation.timeframe}
                  </div>
                  {selectedNotice.riskMitigation.mitigationSteps.length > 0 && (
                    <div>
                      <strong>Mitigation Steps:</strong>
                      <ul className="list-disc ml-6 mt-1">
                        {selectedNotice.riskMitigation.mitigationSteps.map((step, index) => (
                          <li key={index} className="text-sm">
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Impact Analysis */}
              <div>
                <Label className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Impact Analysis
                  {selectedNotice.impactAnalysis.aiGenerated && (
                    <Badge variant="outline" className="text-purple-600">
                      <Brain className="h-3 w-3 mr-1" />
                      AI Generated ({Math.round(selectedNotice.impactAnalysis.confidence * 100)}%)
                    </Badge>
                  )}
                </Label>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <strong>Cost Impact:</strong> ${selectedNotice.impactAnalysis.costImpact.toLocaleString()}
                  </div>
                  <div>
                    <strong>Schedule Impact:</strong> {selectedNotice.impactAnalysis.scheduleImpact} days
                  </div>
                  <div>
                    <strong>Quality Impact:</strong> {selectedNotice.impactAnalysis.qualityImpact}
                  </div>
                  <div>
                    <strong>Safety Impact:</strong> {selectedNotice.impactAnalysis.safetyImpact}
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div>
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Metrics
                </Label>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{selectedNotice.metrics.views}</div>
                    <div className="text-sm text-muted-foreground">Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{selectedNotice.metrics.likes}</div>
                    <div className="text-sm text-muted-foreground">Likes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{selectedNotice.metrics.implementations}</div>
                    <div className="text-sm text-muted-foreground">Implementations</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{Math.round(selectedNotice.metrics.effectiveness * 100)}%</div>
                    <div className="text-sm text-muted-foreground">Effectiveness</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-4 border-t">
                {selectedNotice.status === "approved" && (
                  <Button onClick={() => handlePublishNotice(selectedNotice.id)} className="flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Publish Notice
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => console.log("Edit notice")}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={() => console.log("Share notice")}
                  className="flex items-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  onClick={() => console.log("Export notice")}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* AI Generation Dialog */}
      <Dialog open={showAIGenerationDialog} onOpenChange={setShowAIGenerationDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              Generate AI-Powered Lessons Learned Notice
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium mb-2">Analyzing Issue Data...</h3>
              <p className="text-muted-foreground">HBI AI is generating comprehensive lessons learned analysis</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">Root cause analysis complete</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">Prevention strategies identified</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
                <span className="text-sm">Generating checklist items...</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-muted-foreground">Risk mitigation recommendations</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Manual Notice Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create Manual Lessons Learned Notice
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Manual Creation Form</h3>
              <p className="text-muted-foreground">
                Manual notice creation interface will be available in the next release
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
