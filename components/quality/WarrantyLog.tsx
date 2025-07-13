/**
 * @fileoverview Enhanced Warranty Log Management Component with AI-Supported Workflow
 * @module WarrantyLog
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Component for comprehensive warranty tracking and management with AI assistance
 * Features: AI trade/vendor matching, AI-drafted letters, suggested timelines, historical insights, auto-pulled warranty data
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Separator } from "../ui/separator"
import { ScrollArea } from "../ui/scroll-area"
import { ProtectedGrid, type GridConfig, type ProtectedColDef, type GridRow } from "../ui/protected-grid"
import { RowSelectedEvent } from "ag-grid-community"
import { Alert, AlertDescription } from "../ui/alert"
import { Progress } from "../ui/progress"
import {
  Wrench,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Search,
  Filter,
  Plus,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Building,
  Phone,
  Mail,
  User,
  FileText,
  Paperclip,
  MessageSquare,
  ExternalLink,
  Hammer,
  Target,
  TrendingUp,
  AlertCircle,
  MoreHorizontal,
  Brain,
  Wand2,
  Sparkles,
  History,
  Award,
  Send,
  Copy,
  Users,
  Database,
  Cpu,
  Info,
  Lightbulb,
  Zap,
  BarChart3,
  Timer,
} from "lucide-react"

// Enhanced types with AI capabilities
interface WarrantyIssue {
  id: string
  projectId: string
  projectName: string
  title: string
  description: string
  discipline: string
  component: string
  location: string
  vendor: {
    id: string
    name: string
    contact: string
    phone: string
    email: string
    compassId?: string
  }
  assignedTrade: string
  reportedBy: string
  reportedDate: string
  deadline: string
  status: "open" | "in_progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "critical"
  daysOutstanding: number
  estimatedCost: number
  actualCost?: number
  comments: WarrantyComment[]
  attachments: WarrantyAttachment[]
  closeoutNotes?: string
  closedBy?: string
  closedDate?: string
  // AI Enhancement Fields
  aiAnalysis?: AIWarrantyAnalysis
  historicalReference?: HistoricalReference
  warrantyData?: WarrantyData
  suggestedTimeline?: SuggestedTimeline
  aiGeneratedDocuments?: AIGeneratedDocument[]
}

interface AIWarrantyAnalysis {
  tradeMatchConfidence: number
  vendorMatchConfidence: number
  suggestedTrade: string
  suggestedVendor: {
    id: string
    name: string
    contact: string
    phone: string
    email: string
    compassId?: string
    matchReason: string
  }
  riskAssessment: "low" | "medium" | "high" | "critical"
  urgencyScore: number
  similarIssuesCount: number
  generatedAt: string
}

interface HistoricalReference {
  similarIssues: SimilarIssue[]
  averageResolutionTime: number
  successRate: number
  commonCauses: string[]
  recommendedActions: string[]
  costTrends: {
    min: number
    max: number
    average: number
  }
}

interface SimilarIssue {
  id: string
  title: string
  resolutionTime: number
  status: string
  solution: string
  matchScore: number
}

interface WarrantyData {
  manufacturerWarranty: {
    provider: string
    startDate: string
    endDate: string
    coverage: string[]
    terms: string
  }
  contractorWarranty: {
    provider: string
    startDate: string
    endDate: string
    coverage: string[]
    terms: string
  }
  submittalsData: {
    submittalId: string
    productData: string
    warrantyTerms: string
    installationDate: string
  }
  autoUpdated: boolean
  lastSync: string
}

interface SuggestedTimeline {
  initialResponse: number // hours
  investigation: number // days
  resolution: number // days
  closeout: number // days
  totalDays: number
  confidenceLevel: number
  basedOn: string[]
}

interface AIGeneratedDocument {
  id: string
  type: "warranty_letter" | "claim_form" | "notice" | "demand"
  title: string
  content: string
  recipient: string
  generatedAt: string
  status: "draft" | "review" | "approved" | "sent"
  confidence: number
}

interface WarrantyComment {
  id: string
  author: string
  message: string
  timestamp: string
  isInternal: boolean
  isAIGenerated?: boolean
}

interface WarrantyAttachment {
  id: string
  name: string
  size: string
  type: string
  uploadedBy: string
  uploadedDate: string
  url: string
}

interface WarrantyFilters {
  discipline: string
  status: string
  daysOutstanding: string
  project: string
  vendor: string
  priority: string
  aiConfidence: string
}

export const WarrantyLog: React.FC = () => {
  const [mounted, setMounted] = useState(false)
  const [warrantyIssues, setWarrantyIssues] = useState<WarrantyIssue[]>([])
  const [selectedIssue, setSelectedIssue] = useState<WarrantyIssue | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isNewIssueOpen, setIsNewIssueOpen] = useState(false)
  const [isAIAnalysisOpen, setIsAIAnalysisOpen] = useState(false)
  const [isDocumentGeneratorOpen, setIsDocumentGeneratorOpen] = useState(false)
  const [aiAnalysisLoading, setAIAnalysisLoading] = useState(false)
  const [documentGenerationLoading, setDocumentGenerationLoading] = useState(false)
  const [filters, setFilters] = useState<WarrantyFilters>({
    discipline: "all",
    status: "all",
    daysOutstanding: "all",
    project: "all",
    vendor: "all",
    priority: "all",
    aiConfidence: "all",
  })

  useEffect(() => {
    setMounted(true)
    // Load warranty issues with AI analysis
    loadWarrantyIssuesWithAI()
  }, [])

  const loadWarrantyIssuesWithAI = async () => {
    // Mock data with AI enhancements
    const mockWarrantyIssues: WarrantyIssue[] = [
      {
        id: "WR-2025-001",
        projectId: "PJ-001",
        projectName: "Downtown Office Complex",
        title: "HVAC Unit Malfunction - Chiller #2",
        description: "Chiller unit #2 experiencing refrigerant leak and poor cooling performance in zones 3-5",
        discipline: "HVAC",
        component: "Chiller Unit",
        location: "Mechanical Room B - Floor 12",
        vendor: {
          id: "VN-001",
          name: "Johnson Controls",
          contact: "Mike Richardson",
          phone: "(555) 123-4567",
          email: "mike.richardson@jci.com",
          compassId: "JCI-12345",
        },
        assignedTrade: "HVAC Technician",
        reportedBy: "Sarah Chen",
        reportedDate: "2025-01-10",
        deadline: "2025-01-17",
        status: "in_progress",
        priority: "high",
        daysOutstanding: 5,
        estimatedCost: 15000,
        comments: [
          {
            id: "1",
            author: "Sarah Chen",
            message: "Initial inspection completed. Refrigerant leak confirmed at condenser unit.",
            timestamp: "2025-01-10T09:30:00Z",
            isInternal: false,
          },
          {
            id: "2",
            author: "AI Assistant",
            message:
              "Based on similar issues, this type of refrigerant leak typically requires 2-3 days for parts procurement and 1 day for repair. Recommend expedited parts order.",
            timestamp: "2025-01-10T10:15:00Z",
            isInternal: true,
            isAIGenerated: true,
          },
        ],
        attachments: [
          {
            id: "1",
            name: "chiller-inspection-report.pdf",
            size: "2.4 MB",
            type: "PDF",
            uploadedBy: "Sarah Chen",
            uploadedDate: "2025-01-10",
            url: "/attachments/chiller-inspection.pdf",
          },
        ],
        // AI Enhanced Data
        aiAnalysis: {
          tradeMatchConfidence: 95,
          vendorMatchConfidence: 88,
          suggestedTrade: "HVAC Technician",
          suggestedVendor: {
            id: "VN-001",
            name: "Johnson Controls",
            contact: "Mike Richardson",
            phone: "(555) 123-4567",
            email: "mike.richardson@jci.com",
            compassId: "JCI-12345",
            matchReason: "Original equipment manufacturer with 98% match on component model",
          },
          riskAssessment: "high",
          urgencyScore: 85,
          similarIssuesCount: 12,
          generatedAt: "2025-01-10T08:00:00Z",
        },
        historicalReference: {
          similarIssues: [
            {
              id: "WR-2024-089",
              title: "Chiller #1 Refrigerant Leak",
              resolutionTime: 4,
              status: "resolved",
              solution: "Replaced condenser coil and recharged system",
              matchScore: 92,
            },
            {
              id: "WR-2024-067",
              title: "Cooling Performance Issues - Chiller #3",
              resolutionTime: 6,
              status: "resolved",
              solution: "Repaired expansion valve and system cleaning",
              matchScore: 78,
            },
          ],
          averageResolutionTime: 4.2,
          successRate: 94,
          commonCauses: ["Condenser coil failure", "Refrigerant leaks", "Expansion valve issues"],
          recommendedActions: [
            "Expedite parts procurement",
            "Schedule after-hours repair to minimize disruption",
            "Consider preventive maintenance schedule review",
          ],
          costTrends: {
            min: 8000,
            max: 25000,
            average: 14500,
          },
        },
        warrantyData: {
          manufacturerWarranty: {
            provider: "Johnson Controls",
            startDate: "2023-06-15",
            endDate: "2028-06-15",
            coverage: ["Parts", "Labor", "Emergency Service"],
            terms: "5-year comprehensive warranty with 24/7 emergency response",
          },
          contractorWarranty: {
            provider: "HVAC Solutions Inc",
            startDate: "2023-06-15",
            endDate: "2025-06-15",
            coverage: ["Installation", "Commissioning", "Performance Guarantee"],
            terms: "2-year installation warranty with performance guarantee",
          },
          submittalsData: {
            submittalId: "SUB-2023-045",
            productData: "Johnson Controls YORK YK Centrifugal Chiller",
            warrantyTerms: "Standard 5-year parts/labor warranty",
            installationDate: "2023-06-15",
          },
          autoUpdated: true,
          lastSync: "2025-01-10T06:00:00Z",
        },
        suggestedTimeline: {
          initialResponse: 4,
          investigation: 1,
          resolution: 3,
          closeout: 1,
          totalDays: 5,
          confidenceLevel: 92,
          basedOn: ["Historical similar issues", "Vendor response times", "Parts availability"],
        },
        aiGeneratedDocuments: [
          {
            id: "DOC-001",
            type: "warranty_letter",
            title: "Warranty Claim Notice - Chiller #2",
            content:
              "Dear Johnson Controls Team,\n\nWe are writing to notify you of a warranty claim for the YORK YK Centrifugal Chiller (Serial: YK-2023-045) installed at Downtown Office Complex...",
            recipient: "Johnson Controls Warranty Department",
            generatedAt: "2025-01-10T10:30:00Z",
            status: "draft",
            confidence: 89,
          },
        ],
      },
      {
        id: "WR-2025-002",
        projectId: "PJ-002",
        projectName: "Retail Shopping Center",
        title: "Elevator Door Sensor Malfunction",
        description: "Elevator #2 door sensors not responding properly, causing safety concerns",
        discipline: "Elevator",
        component: "Door Sensor Array",
        location: "Building B - Main Elevator Bank",
        vendor: {
          id: "VN-002",
          name: "OTIS Elevator",
          contact: "Sarah Wilson",
          phone: "(555) 987-6543",
          email: "sarah.wilson@otis.com",
          compassId: "COMP-OT-002",
        },
        assignedTrade: "Elevator Technician",
        reportedBy: "Lisa Chen",
        reportedDate: "2025-01-08",
        deadline: "2025-01-20",
        status: "open",
        priority: "critical",
        daysOutstanding: 7,
        estimatedCost: 1800,
        comments: [
          {
            id: "3",
            author: "Sarah Wilson",
            message: "Scheduling emergency repair for tomorrow morning.",
            timestamp: "2025-01-09T09:15:00Z",
            isInternal: false,
          },
        ],
        attachments: [],
        // AI Enhanced Data
        aiAnalysis: {
          tradeMatchConfidence: 90,
          vendorMatchConfidence: 95,
          suggestedTrade: "Elevator Technician",
          suggestedVendor: {
            id: "VN-002",
            name: "OTIS Elevator",
            contact: "Sarah Wilson",
            phone: "(555) 987-6543",
            email: "sarah.wilson@otis.com",
            compassId: "COMP-OT-002",
            matchReason: "Original equipment manufacturer with 95% match on component model",
          },
          riskAssessment: "critical",
          urgencyScore: 92,
          similarIssuesCount: 5,
          generatedAt: "2025-01-09T10:00:00Z",
        },
        historicalReference: {
          similarIssues: [
            {
              id: "WR-2024-078",
              title: "Elevator Door Sensor Malfunction - Building A",
              resolutionTime: 2,
              status: "resolved",
              solution: "Replaced sensor array and re-calibrated system",
              matchScore: 98,
            },
          ],
          averageResolutionTime: 2.5,
          successRate: 98,
          commonCauses: ["Sensor failure", "Calibration issues", "Electrical interference"],
          recommendedActions: [
            "Ensure proper sensor installation",
            "Regularly calibrate elevator doors",
            "Monitor electrical noise in the area",
          ],
          costTrends: {
            min: 1200,
            max: 2500,
            average: 1800,
          },
        },
        warrantyData: {
          manufacturerWarranty: {
            provider: "OTIS Elevator",
            startDate: "2023-07-01",
            endDate: "2026-07-01",
            coverage: ["Parts", "Labor", "Emergency Service"],
            terms: "3-year comprehensive warranty with 24/7 emergency response",
          },
          contractorWarranty: {
            provider: "Elevator Solutions Inc",
            startDate: "2023-07-01",
            endDate: "2024-07-01",
            coverage: ["Installation", "Commissioning", "Performance Guarantee"],
            terms: "1-year installation warranty with performance guarantee",
          },
          submittalsData: {
            submittalId: "SUB-2023-046",
            productData: "OTIS Elevator E-Series Door Sensor Array",
            warrantyTerms: "Standard 1-year parts/labor warranty",
            installationDate: "2023-07-01",
          },
          autoUpdated: true,
          lastSync: "2025-01-09T08:00:00Z",
        },
        suggestedTimeline: {
          initialResponse: 2,
          investigation: 0.5,
          resolution: 1,
          closeout: 0.5,
          totalDays: 2,
          confidenceLevel: 95,
          basedOn: ["Historical similar issues", "Vendor response times"],
        },
        aiGeneratedDocuments: [
          {
            id: "DOC-002",
            type: "warranty_letter",
            title: "Warranty Claim Notice - Elevator #2",
            content:
              "Dear OTIS Elevator Team,\n\nWe are writing to formally notify you of a warranty claim for the following equipment: \n\nProject: Retail Shopping Center\nComponent: Elevator #2 Door Sensor Array\nSerial Number: [Auto-filled from submittals]\nInstallation Date: 2023-07-01\n\nISSUE DETAILS:\nDescription: Elevator #2 door sensors not responding properly, causing safety concerns\nReported By: Lisa Chen\nDate Reported: 2025-01-08\n\nREQUESTED ACTION:\n☐ Repair under warranty\n☐ Replace under warranty\n☐ Technical consultation\n☐ Emergency service\n\nEstimated Cost: $1800\nPriority Level: CRITICAL",
            recipient: "OTIS Elevator Warranty Department",
            generatedAt: "2025-01-09T10:15:00Z",
            status: "draft",
            confidence: 90,
          },
        ],
      },
      {
        id: "WR-2025-003",
        projectId: "PJ-001",
        projectName: "Downtown Office Complex",
        title: "Fire Safety Panel False Alarms",
        description: "Zone 3 smoke detectors triggering false alarms, disrupting building operations",
        discipline: "Fire Safety",
        component: "Smoke Detection System",
        location: "Building C - 3rd Floor",
        vendor: {
          id: "VN-003",
          name: "Honeywell Security",
          contact: "Robert Chen",
          phone: "(555) 456-7890",
          email: "robert.chen@honeywell.com",
          compassId: "COMP-HW-003",
        },
        assignedTrade: "Fire Safety Technician",
        reportedBy: "David Park",
        reportedDate: "2025-01-05",
        deadline: "2025-01-18",
        status: "resolved",
        priority: "medium",
        daysOutstanding: 10,
        estimatedCost: 950,
        actualCost: 875,
        comments: [
          {
            id: "4",
            author: "Robert Chen",
            message: "Sensitivity calibration completed. System tested and verified.",
            timestamp: "2025-01-14T16:45:00Z",
            isInternal: false,
          },
        ],
        attachments: [
          {
            id: "2",
            name: "fire-system-calibration-report.pdf",
            size: "1.8 MB",
            type: "PDF",
            uploadedBy: "Robert Chen",
            uploadedDate: "2025-01-14",
            url: "/attachments/fire-system-calibration.pdf",
          },
        ],
        // AI Enhanced Data
        aiAnalysis: {
          tradeMatchConfidence: 98,
          vendorMatchConfidence: 95,
          suggestedTrade: "Fire Safety Technician",
          suggestedVendor: {
            id: "VN-003",
            name: "Honeywell Security",
            contact: "Robert Chen",
            phone: "(555) 456-7890",
            email: "robert.chen@honeywell.com",
            compassId: "COMP-HW-003",
            matchReason: "Original equipment manufacturer with 98% match on component model",
          },
          riskAssessment: "low",
          urgencyScore: 70,
          similarIssuesCount: 20,
          generatedAt: "2025-01-14T10:00:00Z",
        },
        historicalReference: {
          similarIssues: [
            {
              id: "WR-2024-123",
              title: "False Alarm - Smoke Detector #1",
              resolutionTime: 1,
              status: "resolved",
              solution: "Replaced sensor and re-calibrated system",
              matchScore: 95,
            },
            {
              id: "WR-2024-111",
              title: "False Alarm - Smoke Detector #4",
              resolutionTime: 2,
              status: "resolved",
              solution: "Repaired wiring and re-calibrated system",
              matchScore: 90,
            },
          ],
          averageResolutionTime: 1.2,
          successRate: 98,
          commonCauses: ["Sensor failure", "Calibration issues", "Electrical interference"],
          recommendedActions: [
            "Regularly calibrate smoke detectors",
            "Monitor electrical noise in the area",
            "Ensure proper sensor installation",
          ],
          costTrends: {
            min: 500,
            max: 1200,
            average: 800,
          },
        },
        warrantyData: {
          manufacturerWarranty: {
            provider: "Honeywell Security",
            startDate: "2023-08-01",
            endDate: "2026-08-01",
            coverage: ["Parts", "Labor", "Emergency Service"],
            terms: "3-year comprehensive warranty with 24/7 emergency response",
          },
          contractorWarranty: {
            provider: "Security Solutions Inc",
            startDate: "2023-08-01",
            endDate: "2024-08-01",
            coverage: ["Installation", "Commissioning", "Performance Guarantee"],
            terms: "1-year installation warranty with performance guarantee",
          },
          submittalsData: {
            submittalId: "SUB-2023-047",
            productData: "Honeywell 5400 Series Smoke Detector",
            warrantyTerms: "Standard 1-year parts/labor warranty",
            installationDate: "2023-08-01",
          },
          autoUpdated: true,
          lastSync: "2025-01-14T06:00:00Z",
        },
        suggestedTimeline: {
          initialResponse: 1,
          investigation: 0.2,
          resolution: 0.5,
          closeout: 0.3,
          totalDays: 1,
          confidenceLevel: 90,
          basedOn: ["Historical similar issues", "Vendor response times"],
        },
        aiGeneratedDocuments: [
          {
            id: "DOC-003",
            type: "warranty_letter",
            title: "Warranty Claim Notice - Smoke Detector #3",
            content:
              "Dear Honeywell Security Team,\n\nWe are writing to formally notify you of a warranty claim for the following equipment: \n\nProject: Downtown Office Complex\nComponent: Smoke Detector #3\nSerial Number: [Auto-filled from submittals]\nInstallation Date: 2023-08-01\n\nISSUE DETAILS:\nDescription: Smoke Detector #3 triggering false alarms\nReported By: David Park\nDate Reported: 2025-01-05\n\nREQUESTED ACTION:\n☐ Repair under warranty\n☐ Replace under warranty\n☐ Technical consultation\n☐ Emergency service\n\nEstimated Cost: $950\nPriority Level: MEDIUM",
            recipient: "Honeywell Security Warranty Department",
            generatedAt: "2025-01-05T10:00:00Z",
            status: "draft",
            confidence: 90,
          },
        ],
      },
      {
        id: "WR-2025-004",
        projectId: "PJ-003",
        projectName: "Medical Center Expansion",
        title: "Roof Membrane Leak",
        description: "Water infiltration detected in southwest corner of roof membrane system",
        discipline: "Roofing",
        component: "Roof Membrane",
        location: "Building C - Southwest Corner",
        vendor: {
          id: "VN-004",
          name: "ABC Roofing Solutions",
          contact: "Tom Wilson",
          phone: "(555) 321-9876",
          email: "tom.wilson@abcroofing.com",
          compassId: "COMP-ABC-004",
        },
        assignedTrade: "Roofer",
        reportedBy: "Mike Davis",
        reportedDate: "2025-01-03",
        deadline: "2025-01-17",
        status: "open",
        priority: "high",
        daysOutstanding: 12,
        estimatedCost: 8500,
        comments: [],
        attachments: [],
      },
    ]
    setWarrantyIssues(mockWarrantyIssues)
  }

  // Mock warranty issues data for fallback (if needed)
  const fallbackWarrantyIssues: WarrantyIssue[] = [
    {
      id: "WI-001",
      projectId: "PJ-001",
      projectName: "Downtown Office Complex",
      title: "HVAC Unit Compressor Failure",
      description:
        "Main compressor unit AC-301 experiencing intermittent failures, affecting Building A cooling system",
      discipline: "HVAC",
      component: "Compressor Motor",
      location: "Building A - 3rd Floor Mechanical Room",
      vendor: {
        id: "VN-001",
        name: "Johnson Controls",
        contact: "Mark Stevens",
        phone: "(555) 123-4567",
        email: "mark.stevens@johnsoncontrols.com",
        compassId: "COMP-JC-001",
      },
      assignedTrade: "HVAC Technician",
      reportedBy: "Mike Johnson",
      reportedDate: "2025-01-10",
      deadline: "2025-01-25",
      status: "in_progress",
      priority: "high",
      daysOutstanding: 5,
      estimatedCost: 2500,
      comments: [
        {
          id: "C-001",
          author: "Mark Stevens",
          message: "Replacement parts ordered. ETA 3-5 business days.",
          timestamp: "2025-01-12T10:30:00",
          isInternal: false,
        },
        {
          id: "C-002",
          author: "Mike Johnson",
          message: "Temporary cooling solution implemented for Building A.",
          timestamp: "2025-01-11T14:20:00",
          isInternal: true,
        },
      ],
      attachments: [
        {
          id: "A-001",
          name: "Compressor_Diagnostic_Report.pdf",
          size: "2.4 MB",
          type: "PDF",
          uploadedBy: "Mark Stevens",
          uploadedDate: "2025-01-11",
          url: "/attachments/compressor-diagnostic.pdf",
        },
      ],
    },
    {
      id: "WI-002",
      projectId: "PJ-002",
      projectName: "Retail Shopping Center",
      title: "Elevator Door Sensor Malfunction",
      description: "Elevator #2 door sensors not responding properly, causing safety concerns",
      discipline: "Elevator",
      component: "Door Sensor Array",
      location: "Building B - Main Elevator Bank",
      vendor: {
        id: "VN-002",
        name: "OTIS Elevator",
        contact: "Sarah Wilson",
        phone: "(555) 987-6543",
        email: "sarah.wilson@otis.com",
        compassId: "COMP-OT-002",
      },
      assignedTrade: "Elevator Technician",
      reportedBy: "Lisa Chen",
      reportedDate: "2025-01-08",
      deadline: "2025-01-20",
      status: "open",
      priority: "critical",
      daysOutstanding: 7,
      estimatedCost: 1800,
      comments: [
        {
          id: "C-003",
          author: "Sarah Wilson",
          message: "Scheduling emergency repair for tomorrow morning.",
          timestamp: "2025-01-09T09:15:00",
          isInternal: false,
        },
      ],
      attachments: [],
    },
    {
      id: "WI-003",
      projectId: "PJ-001",
      projectName: "Downtown Office Complex",
      title: "Fire Safety Panel False Alarms",
      description: "Zone 3 smoke detectors triggering false alarms, disrupting building operations",
      discipline: "Fire Safety",
      component: "Smoke Detection System",
      location: "Building C - 3rd Floor",
      vendor: {
        id: "VN-003",
        name: "Honeywell Security",
        contact: "Robert Chen",
        phone: "(555) 456-7890",
        email: "robert.chen@honeywell.com",
        compassId: "COMP-HW-003",
      },
      assignedTrade: "Fire Safety Technician",
      reportedBy: "David Park",
      reportedDate: "2025-01-05",
      deadline: "2025-01-18",
      status: "resolved",
      priority: "medium",
      daysOutstanding: 10,
      estimatedCost: 950,
      actualCost: 875,
      comments: [
        {
          id: "C-004",
          author: "Robert Chen",
          message: "Sensitivity calibration completed. System tested and verified.",
          timestamp: "2025-01-14T16:45:00",
          isInternal: false,
        },
      ],
      attachments: [
        {
          id: "A-002",
          name: "Fire_System_Calibration_Report.pdf",
          size: "1.8 MB",
          type: "PDF",
          uploadedBy: "Robert Chen",
          uploadedDate: "2025-01-14",
          url: "/attachments/fire-system-calibration.pdf",
        },
      ],
      closeoutNotes:
        "System recalibrated and tested. All zones functioning normally. Warranty extended by 6 months due to inconvenience.",
      closedBy: "David Park",
      closedDate: "2025-01-14",
    },
    {
      id: "WI-004",
      projectId: "PJ-003",
      projectName: "Medical Center Expansion",
      title: "Roof Membrane Leak",
      description: "Water infiltration detected in southwest corner of roof membrane system",
      discipline: "Roofing",
      component: "TPO Membrane",
      location: "Building D - Roof Level",
      vendor: {
        id: "VN-004",
        name: "ABC Roofing Solutions",
        contact: "Lisa Johnson",
        phone: "(555) 321-9876",
        email: "lisa.johnson@abcroofing.com",
        compassId: "COMP-ABC-004",
      },
      assignedTrade: "Roofer",
      reportedBy: "Tom Wilson",
      reportedDate: "2024-12-20",
      deadline: "2025-01-15",
      status: "closed",
      priority: "high",
      daysOutstanding: 26,
      estimatedCost: 3200,
      actualCost: 2890,
      comments: [
        {
          id: "C-005",
          author: "Lisa Johnson",
          message: "Leak source identified and repaired. Warranty coverage applied.",
          timestamp: "2025-01-10T11:30:00",
          isInternal: false,
        },
      ],
      attachments: [
        {
          id: "A-003",
          name: "Roof_Repair_Photos.zip",
          size: "8.2 MB",
          type: "ZIP",
          uploadedBy: "Lisa Johnson",
          uploadedDate: "2025-01-10",
          url: "/attachments/roof-repair-photos.zip",
        },
      ],
      closeoutNotes: "Membrane patched and sealed. 5-year warranty extended. Recommended annual inspection scheduled.",
      closedBy: "Tom Wilson",
      closedDate: "2025-01-10",
    },
  ]

  // Filter and search logic
  const filteredIssues = useMemo(() => {
    return warrantyIssues.filter((issue) => {
      const matchesSearch =
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.discipline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.component.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesDiscipline = filters.discipline === "all" || issue.discipline === filters.discipline
      const matchesStatus = filters.status === "all" || issue.status === filters.status
      const matchesProject = filters.project === "all" || issue.projectId === filters.project
      const matchesVendor = filters.vendor === "all" || issue.vendor.id === filters.vendor
      const matchesPriority = filters.priority === "all" || issue.priority === filters.priority

      let matchesDaysOutstanding = true
      if (filters.daysOutstanding !== "all") {
        switch (filters.daysOutstanding) {
          case "overdue":
            matchesDaysOutstanding =
              issue.daysOutstanding > 0 && issue.status !== "closed" && issue.status !== "resolved"
            break
          case "0-7":
            matchesDaysOutstanding = issue.daysOutstanding <= 7
            break
          case "8-14":
            matchesDaysOutstanding = issue.daysOutstanding > 7 && issue.daysOutstanding <= 14
            break
          case "15+":
            matchesDaysOutstanding = issue.daysOutstanding > 14
            break
        }
      }

      return (
        matchesSearch &&
        matchesDiscipline &&
        matchesStatus &&
        matchesProject &&
        matchesVendor &&
        matchesPriority &&
        matchesDaysOutstanding
      )
    })
  }, [searchQuery, filters, warrantyIssues])

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800 border-red-200"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "resolved":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "closed":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case "in_progress":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      case "closed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getDaysText = (days: number, status: string) => {
    if (status === "closed" || status === "resolved") return "Completed"
    if (days === 0) return "Due today"
    if (days === 1) return "Due tomorrow"
    if (days > 0) return `${days} days overdue`
    return `${Math.abs(days)} days remaining`
  }

  const openCompassProfile = (compassId: string) => {
    // Integration with Compass API
    window.open(`https://compass.api.vendor/${compassId}`, "_blank")
  }

  const handleResolveWarrantyClaim = (claimId: string, failureReason: string, priority: string) => {
    console.log(`Resolving warranty claim ${claimId} with failure reason: ${failureReason}`)
    // Trigger AI-powered lessons learned generation when critical warranty claim is resolved with failure reason
    if (failureReason && failureReason.trim() !== "" && priority === "critical") {
      triggerLessonsLearnedGeneration("warranty_claim", claimId, failureReason)
    }
  }

  const triggerLessonsLearnedGeneration = (sourceType: string, sourceId: string, failureReason: string) => {
    console.log(`Triggering lessons learned generation for ${sourceType} ${sourceId}`)
    console.log(`Failure reason: ${failureReason}`)

    // This would integrate with the HBI AI model to auto-generate:
    // - Root cause analysis
    // - Recommended prevention strategies
    // - New or updated checklist items
    // - Risk mitigation recommendations

    // Mock AI generation trigger
    const aiAnalysisPrompt = {
      sourceType,
      sourceId,
      failureReason,
      projectContext: "construction warranty management",
      generateRootCause: true,
      generatePrevention: true,
      generateChecklistItems: true,
      generateRiskMitigation: true,
    }

    // In a real implementation, this would call the HBI AI API
    console.log("AI Analysis Request:", aiAnalysisPrompt)

    // Show notification that lessons learned is being generated
    // This would integrate with the LessonsLearnedNotices component
  }

  // Grid configuration
  const gridConfig: GridConfig = {
    allowExport: true,
    allowFiltering: true,
    allowSorting: true,
    allowColumnResizing: true,
    showToolbar: true,
    showStatusBar: true,
    enableRangeSelection: true,
    protectionEnabled: false,
    theme: "alpine",
    stickyColumnsCount: 2,
  }

  const gridColumnDefs: ProtectedColDef[] = [
    {
      field: "id",
      headerName: "Issue ID",
      width: 100,
      pinned: "left",
      cellRenderer: (params: any) => <span className="font-mono text-sm">{params.value}</span>,
    },
    {
      field: "title",
      headerName: "Issue Title",
      width: 200,
      pinned: "left",
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-2">
          {getStatusIcon(params.data.status)}
          <span className="font-medium">{params.value}</span>
        </div>
      ),
    },
    {
      field: "projectName",
      headerName: "Project",
      width: 150,
      cellRenderer: (params: any) => <span className="text-sm">{params.value}</span>,
    },
    {
      field: "discipline",
      headerName: "Discipline",
      width: 120,
      cellRenderer: (params: any) => (
        <Badge variant="outline" className="text-xs">
          {params.value}
        </Badge>
      ),
    },
    {
      field: "vendor",
      headerName: "Vendor",
      width: 150,
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-2">
          <span className="text-sm">{params.value.name}</span>
          {params.value.compassId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openCompassProfile(params.value.compassId!)}
              className="h-6 w-6 p-0"
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          )}
        </div>
      ),
    },
    {
      field: "assignedTrade",
      headerName: "Assigned Trade",
      width: 130,
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-2">
          <span className="text-sm">{params.value}</span>
          {params.data.aiAnalysis && (
            <Badge variant="outline" className="text-purple-600 text-xs">
              <Brain className="h-3 w-3 mr-1" />
              {params.data.aiAnalysis.tradeMatchConfidence}%
            </Badge>
          )}
        </div>
      ),
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 100,
      cellRenderer: (params: any) => <Badge className={getPriorityColor(params.value)}>{params.value}</Badge>,
    },
    {
      field: "status",
      headerName: "Status",
      width: 110,
      cellRenderer: (params: any) => (
        <Badge className={getStatusColor(params.value)}>{params.value.replace("_", " ")}</Badge>
      ),
    },
    {
      field: "aiAnalysis",
      headerName: "AI Analysis",
      width: 120,
      cellRenderer: (params: any) => {
        const ai = params.value
        if (!ai) return <span className="text-xs text-muted-foreground">No AI data</span>

        return (
          <div className="flex items-center gap-1">
            <Brain className="h-4 w-4 text-purple-500" />
            <div className="text-xs">
              <div className="font-medium">Risk: {ai.riskAssessment}</div>
              <div className="text-muted-foreground">Score: {ai.urgencyScore}</div>
            </div>
          </div>
        )
      },
    },
    {
      field: "historicalReference",
      headerName: "Historical Data",
      width: 140,
      cellRenderer: (params: any) => {
        const hist = params.value
        if (!hist) return <span className="text-xs text-muted-foreground">No data</span>

        return (
          <div className="flex items-center gap-1">
            <History className="h-4 w-4 text-blue-500" />
            <div className="text-xs">
              <div className="font-medium">Avg: {hist.averageResolutionTime}d</div>
              <div className="text-muted-foreground">{hist.similarIssues.length} similar</div>
            </div>
          </div>
        )
      },
    },
    {
      field: "daysOutstanding",
      headerName: "Days Outstanding",
      width: 130,
      cellRenderer: (params: any) => (
        <Badge variant="secondary" className="text-xs">
          {params.value}
        </Badge>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      cellRenderer: (params: any) => (
        <Badge className={`text-xs ${getStatusColor(params.value)}`}>
          {params.value.replace("_", " ").toUpperCase()}
        </Badge>
      ),
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 100,
      cellRenderer: (params: any) => (
        <Badge className={`text-xs ${getPriorityColor(params.value)}`}>{params.value.toUpperCase()}</Badge>
      ),
    },
    {
      field: "daysOutstanding",
      headerName: "Days Outstanding",
      width: 130,
      cellRenderer: (params: any) => (
        <span
          className={`text-sm ${
            params.value > 0 && params.data.status !== "closed" && params.data.status !== "resolved"
              ? "text-red-600 font-medium"
              : ""
          }`}
        >
          {getDaysText(params.value, params.data.status)}
        </span>
      ),
    },
    {
      field: "deadline",
      headerName: "Deadline",
      width: 110,
      cellRenderer: (params: any) => <span className="text-sm font-mono">{formatDate(params.value)}</span>,
    },
    {
      field: "estimatedCost",
      headerName: "Est. Cost",
      width: 100,
      cellRenderer: (params: any) => <span className="text-sm font-mono">${params.value.toLocaleString()}</span>,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => setSelectedIssue(params.data)} className="h-6 w-6 p-0">
            <Eye className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Edit className="h-3 w-3" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Add Comment</DropdownMenuItem>
              <DropdownMenuItem>Upload Attachment</DropdownMenuItem>
              <DropdownMenuItem>Update Status</DropdownMenuItem>
              <DropdownMenuItem>Close Issue</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]

  // Statistics
  const stats = {
    total: warrantyIssues.length,
    open: warrantyIssues.filter((i) => i.status === "open").length,
    inProgress: warrantyIssues.filter((i) => i.status === "in_progress").length,
    resolved: warrantyIssues.filter((i) => i.status === "resolved").length,
    closed: warrantyIssues.filter((i) => i.status === "closed").length,
    overdue: warrantyIssues.filter((i) => i.daysOutstanding > 0 && i.status !== "closed" && i.status !== "resolved")
      .length,
    avgResolutionTime: 8.5,
    totalCost: warrantyIssues.reduce((sum, issue) => sum + (issue.actualCost || issue.estimatedCost), 0),
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
          <h3 className="text-lg font-semibold">Warranty Log Management</h3>
          <p className="text-sm text-muted-foreground">
            Track warranty issues, vendor assignments, and resolution progress
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isNewIssueOpen} onOpenChange={setIsNewIssueOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Issue
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Warranty Issue</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Issue Title</Label>
                    <Input id="title" placeholder="Enter issue title" />
                  </div>
                  <div>
                    <Label htmlFor="project">Project</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PJ-001">Downtown Office Complex</SelectItem>
                        <SelectItem value="PJ-002">Retail Shopping Center</SelectItem>
                        <SelectItem value="PJ-003">Medical Center Expansion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Describe the warranty issue in detail" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="discipline">Discipline</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select discipline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HVAC">HVAC</SelectItem>
                        <SelectItem value="Electrical">Electrical</SelectItem>
                        <SelectItem value="Plumbing">Plumbing</SelectItem>
                        <SelectItem value="Fire Safety">Fire Safety</SelectItem>
                        <SelectItem value="Elevator">Elevator</SelectItem>
                        <SelectItem value="Roofing">Roofing</SelectItem>
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
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="deadline">Deadline</Label>
                    <Input id="deadline" type="date" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsNewIssueOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsNewIssueOpen(false)}>Create Issue</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Issues</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <Wrench className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Open</p>
                <p className="text-2xl font-bold text-red-600">{stats.open}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolved + stats.closed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Overdue</p>
                <p className="text-2xl font-bold text-orange-600">{stats.overdue}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Cost</p>
                <p className="text-2xl font-bold text-purple-600">${stats.totalCost.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search issues, vendors, components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Advanced
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Select value={filters.discipline} onValueChange={(value) => setFilters({ ...filters, discipline: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Discipline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Disciplines</SelectItem>
                <SelectItem value="HVAC">HVAC</SelectItem>
                <SelectItem value="Electrical">Electrical</SelectItem>
                <SelectItem value="Plumbing">Plumbing</SelectItem>
                <SelectItem value="Fire Safety">Fire Safety</SelectItem>
                <SelectItem value="Elevator">Elevator</SelectItem>
                <SelectItem value="Roofing">Roofing</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.daysOutstanding}
              onValueChange={(value) => setFilters({ ...filters, daysOutstanding: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Days Outstanding" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Days</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="0-7">0-7 days</SelectItem>
                <SelectItem value="8-14">8-14 days</SelectItem>
                <SelectItem value="15+">15+ days</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.priority} onValueChange={(value) => setFilters({ ...filters, priority: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.project} onValueChange={(value) => setFilters({ ...filters, project: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                <SelectItem value="PJ-001">Downtown Office Complex</SelectItem>
                <SelectItem value="PJ-002">Retail Shopping Center</SelectItem>
                <SelectItem value="PJ-003">Medical Center Expansion</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.vendor} onValueChange={(value) => setFilters({ ...filters, vendor: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Vendor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vendors</SelectItem>
                <SelectItem value="VN-001">Johnson Controls</SelectItem>
                <SelectItem value="VN-002">OTIS Elevator</SelectItem>
                <SelectItem value="VN-003">Honeywell Security</SelectItem>
                <SelectItem value="VN-004">ABC Roofing Solutions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Warranty Issues Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Warranty Issues ({filteredIssues.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProtectedGrid
            rowData={filteredIssues.map((issue) => ({ ...issue, id: issue.id }))}
            columnDefs={gridColumnDefs}
            config={gridConfig}
            events={{
              onRowSelected: (event) => {
                if (event.node.isSelected()) {
                  setSelectedIssue(event.data as WarrantyIssue)
                }
              },
            }}
            className="min-h-96"
          />
        </CardContent>
      </Card>

      {/* Issue Detail Modal */}
      <Dialog open={!!selectedIssue} onOpenChange={() => setSelectedIssue(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedIssue && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getStatusIcon(selectedIssue.status)}
                  {selectedIssue.title}
                  <Badge className={`ml-2 ${getPriorityColor(selectedIssue.priority)}`}>
                    {selectedIssue.priority.toUpperCase()}
                  </Badge>
                </DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="comments">Comments ({selectedIssue.comments.length})</TabsTrigger>
                  <TabsTrigger value="attachments">Attachments ({selectedIssue.attachments.length})</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Issue ID</Label>
                      <p className="text-sm font-mono">{selectedIssue.id}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Project</Label>
                      <p className="text-sm">{selectedIssue.projectName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Discipline</Label>
                      <p className="text-sm">{selectedIssue.discipline}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Component</Label>
                      <p className="text-sm">{selectedIssue.component}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Location</Label>
                      <p className="text-sm">{selectedIssue.location}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Assigned Trade</Label>
                      <p className="text-sm">{selectedIssue.assignedTrade}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Reported By</Label>
                      <p className="text-sm">{selectedIssue.reportedBy}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Reported Date</Label>
                      <p className="text-sm">{formatDate(selectedIssue.reportedDate)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Deadline</Label>
                      <p className="text-sm">{formatDate(selectedIssue.deadline)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <Badge className={`text-xs ${getStatusColor(selectedIssue.status)}`}>
                        {selectedIssue.status.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm font-medium">Description</Label>
                    <p className="text-sm mt-1">{selectedIssue.description}</p>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm font-medium">Vendor Information</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{selectedIssue.vendor.name}</span>
                        {selectedIssue.vendor.compassId && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openCompassProfile(selectedIssue.vendor.compassId!)}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View in Compass
                          </Button>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>Contact: {selectedIssue.vendor.contact}</p>
                        <p>Phone: {selectedIssue.vendor.phone}</p>
                        <p>Email: {selectedIssue.vendor.email}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Estimated Cost</Label>
                      <p className="text-sm font-mono">${selectedIssue.estimatedCost.toLocaleString()}</p>
                    </div>
                    {selectedIssue.actualCost && (
                      <div>
                        <Label className="text-sm font-medium">Actual Cost</Label>
                        <p className="text-sm font-mono">${selectedIssue.actualCost.toLocaleString()}</p>
                      </div>
                    )}
                  </div>

                  {selectedIssue.closeoutNotes && (
                    <>
                      <Separator />
                      <div>
                        <Label className="text-sm font-medium">Closeout Notes</Label>
                        <p className="text-sm mt-1">{selectedIssue.closeoutNotes}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Closed by {selectedIssue.closedBy} on {formatDate(selectedIssue.closedDate!)}
                        </p>
                      </div>
                    </>
                  )}
                </TabsContent>

                <TabsContent value="comments">
                  <div className="space-y-4">
                    {selectedIssue.comments.map((comment) => (
                      <div key={comment.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span className="text-sm font-medium">{comment.author}</span>
                            {comment.isInternal && (
                              <Badge variant="secondary" className="text-xs">
                                Internal
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{comment.message}</p>
                      </div>
                    ))}
                    <div className="space-y-2">
                      <Label htmlFor="new-comment">Add Comment</Label>
                      <Textarea id="new-comment" placeholder="Enter your comment..." />
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="internal" className="rounded" />
                          <Label htmlFor="internal" className="text-sm">
                            Internal comment
                          </Label>
                        </div>
                        <Button size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Add Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="attachments">
                  <div className="space-y-4">
                    {selectedIssue.attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{attachment.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {attachment.size} • {attachment.type} • Uploaded by {attachment.uploadedBy} on{" "}
                              {formatDate(attachment.uploadedDate)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <Paperclip className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">Drag and drop files here or click to browse</p>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Attachment
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="timeline">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Plus className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Issue Created</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(selectedIssue.reportedDate)} • {selectedIssue.reportedBy}
                        </p>
                      </div>
                    </div>

                    {selectedIssue.comments.map((comment) => (
                      <div key={comment.id} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <MessageSquare className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Comment Added</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(comment.timestamp).toLocaleString()} • {comment.author}
                          </p>
                          <p className="text-sm mt-1">{comment.message}</p>
                        </div>
                      </div>
                    ))}

                    {selectedIssue.attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Paperclip className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Attachment Added</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(attachment.uploadedDate)} • {attachment.uploadedBy}
                          </p>
                          <p className="text-sm mt-1">{attachment.name}</p>
                        </div>
                      </div>
                    ))}

                    {selectedIssue.closeoutNotes && (
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Issue Closed</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(selectedIssue.closedDate!)} • {selectedIssue.closedBy}
                          </p>
                          <p className="text-sm mt-1">{selectedIssue.closeoutNotes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
