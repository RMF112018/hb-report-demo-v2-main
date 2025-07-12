/**
 * @fileoverview Field Management Content Component
 * @module FieldManagementContent
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Field operations management with sub-tools for Scheduler, Constraints Log, Permit Log, and Field Reports
 * Extracted from page-legacy.tsx and adapted for modular architecture
 */

"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { useRouter } from "next/navigation"
import {
  Calendar,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Target,
  BarChart3,
  Activity,
  Zap,
  Brain,
  Monitor,
  GitBranch,
  Shield,
  ClipboardList,
  Users,
  Building2,
  FileText,
  MapPin,
  Plus,
  RefreshCw,
  Eye,
  Settings,
  Focus,
  Package,
} from "lucide-react"

// Import the modular constraints components
import ConstraintsTableCompact from "./ConstraintsTableCompact"
import ConstraintsTimelineCompact from "./ConstraintsTimelineCompact"

// Import permit components
import { PermitTable } from "@/components/permit-log/PermitTable"
import { PermitForm } from "@/components/permit-log/PermitForm"
import { PermitCalendar } from "@/components/permit-log/PermitCalendar"
import type { Permit, PermitFormData, Inspection } from "@/types/permit-log"

// Import inspection components
import { InspectionsTable } from "./InspectionsTable"
import { InspectionForm } from "./InspectionForm"

// Import field reports components
import { DailyLogSubTab } from "@/components/field-reports/DailyLogSubTab"
import { SafetyAuditsSubTab } from "@/components/field-reports/SafetyAuditsSubTab"
import { QualityControlSubTab } from "@/components/field-reports/QualityControlSubTab"
import type { DailyLog, ManpowerRecord, SafetyAudit, QualityInspection } from "@/types/field-reports"

// Import scheduler components
import SchedulerContent from "./SchedulerContent"

// Import procurement components
import { ProcurementCommitmentsTable } from "@/components/procurement/ProcurementCommitmentsTable"
import { ProcurementOverviewWidget } from "@/components/procurement/ProcurementOverviewWidget"
import { ProcoreIntegrationPanel } from "@/components/procurement/ProcoreIntegrationPanel"
import { HbiProcurementInsights } from "@/components/procurement/HbiProcurementInsights"

interface FieldManagementContentProps {
  selectedSubTool: string
  projectData: any
  userRole: string
  projectId?: string
  onSubToolChange?: (subTool: string) => void
  onSidebarContentChange?: (content: React.ReactNode) => void
  [key: string]: any
}

export const FieldManagementContent: React.FC<FieldManagementContentProps> = ({
  selectedSubTool,
  projectData,
  userRole,
  projectId,
  onSubToolChange,
  onSidebarContentChange,
  ...props
}) => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(selectedSubTool || "procurement")
  const [constraintsSubTab, setConstraintsSubTab] = useState("overview")
  const [permitSubTab, setPermitSubTab] = useState("overview")
  const [fieldReportsSubTab, setFieldReportsSubTab] = useState("overview")
  const [schedulerSubTab, setSchedulerSubTab] = useState("overview")
  const [procurementSubTab, setProcurementSubTab] = useState("overview")
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Mobile detection
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Focus mode toggle handler
  const handleFocusToggle = () => {
    setIsFocusMode(!isFocusMode)
    // Apply focus mode styles to prevent body scroll when in focus mode
    if (!isFocusMode) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
  }

  // Cleanup effect to restore body scroll when component unmounts
  React.useEffect(() => {
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  // Permit state management
  const [permits, setPermits] = useState<Permit[]>([])
  const [showPermitForm, setShowPermitForm] = useState(false)
  const [selectedPermit, setSelectedPermit] = useState<Permit | null>(null)

  // Inspection state management
  const [showInspectionForm, setShowInspectionForm] = useState(false)
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null)
  const [inspectionSubTab, setInspectionSubTab] = useState("overview")

  // Calendar-specific mock data
  const [calendarPermits, setCalendarPermits] = useState<Permit[]>([])

  // Field reports state management
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([])
  const [manpowerRecords, setManpowerRecords] = useState<ManpowerRecord[]>([])
  const [safetyAudits, setSafetyAudits] = useState<SafetyAudit[]>([])
  const [qualityInspections, setQualityInspections] = useState<QualityInspection[]>([])

  // Mock permit data initialization
  React.useEffect(() => {
    const mockPermits: Permit[] = [
      {
        id: "permit-001",
        projectId: projectId || "2525840",
        number: "BLDG-2024-001",
        type: "Building",
        status: "approved",
        priority: "high",
        authority: "City Building Department",
        authorityContact: {
          name: "John Smith",
          phone: "(555) 123-4567",
          email: "j.smith@citybuilding.gov",
        },
        applicationDate: "2024-01-15",
        approvalDate: "2024-02-01",
        expirationDate: "2025-02-01",
        cost: 2500,
        bondAmount: 5000,
        description: "Commercial building construction permit for new office complex",
        comments: "Approved with standard conditions",
        conditions: ["Must pass all inspections", "Complete within 12 months"],
        tags: ["commercial", "new-construction"],
        inspections: [
          {
            id: "insp-001",
            permitId: "permit-001",
            type: "Foundation",
            completedDate: "2024-02-15",
            inspector: "Mike Johnson",
            result: "passed",
            complianceScore: 95,
            comments: "Foundation meets all requirements",
            createdAt: "2024-02-15T09:00:00Z",
            updatedAt: "2024-02-15T09:00:00Z",
          },
        ],
        createdBy: "system",
        createdAt: "2024-01-15T08:00:00Z",
        updatedBy: "system",
        updatedAt: "2024-02-01T10:00:00Z",
      },
      {
        id: "permit-002",
        projectId: projectId || "2525840",
        number: "ELEC-2024-002",
        type: "Electrical",
        status: "pending",
        priority: "medium",
        authority: "City Electrical Department",
        applicationDate: "2024-02-20",
        expirationDate: "2025-02-20",
        cost: 1200,
        description: "Electrical system installation permit",
        inspections: [],
        createdBy: "system",
        createdAt: "2024-02-20T08:00:00Z",
        updatedBy: "system",
        updatedAt: "2024-02-20T08:00:00Z",
      },
    ]
    setPermits(mockPermits)
  }, [projectId])

  // Calendar-specific mock data with dates around current system date
  React.useEffect(() => {
    const today = new Date()
    const formatDate = (date: Date) => date.toISOString().split("T")[0]

    // Helper function to add days to date
    const addDays = (date: Date, days: number) => {
      const result = new Date(date)
      result.setDate(result.getDate() + days)
      return result
    }

    const calendarMockPermits: Permit[] = [
      {
        id: "cal-permit-001",
        projectId: projectId || "2525840",
        number: "BLDG-2024-101",
        type: "Building",
        status: "approved",
        priority: "high",
        authority: "City Building Department",
        authorityContact: {
          name: "Sarah Wilson",
          phone: "(555) 234-5678",
          email: "s.wilson@citybuilding.gov",
        },
        applicationDate: formatDate(addDays(today, -15)),
        approvalDate: formatDate(addDays(today, -8)),
        expirationDate: formatDate(addDays(today, 350)),
        cost: 3500,
        bondAmount: 7000,
        description: "Foundation and framing permit for residential construction",
        comments: "Approved with standard conditions",
        conditions: ["Foundation inspection required", "Complete within 18 months"],
        tags: ["residential", "foundation"],
        inspections: [
          {
            id: "cal-insp-001",
            permitId: "cal-permit-001",
            type: "Foundation",
            scheduledDate: formatDate(addDays(today, 3)),
            inspector: "David Chen",
            result: "pending",
            complianceScore: 0,
            comments: "Scheduled for foundation inspection",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "cal-insp-002",
            permitId: "cal-permit-001",
            type: "Framing",
            scheduledDate: formatDate(addDays(today, 14)),
            inspector: "David Chen",
            result: "pending",
            complianceScore: 0,
            comments: "Scheduled for framing inspection",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        createdBy: "system",
        createdAt: new Date().toISOString(),
        updatedBy: "system",
        updatedAt: new Date().toISOString(),
      },
      {
        id: "cal-permit-002",
        projectId: projectId || "2525840",
        number: "ELEC-2024-201",
        type: "Electrical",
        status: "pending",
        priority: "medium",
        authority: "City Electrical Department",
        applicationDate: formatDate(addDays(today, -5)),
        expirationDate: formatDate(addDays(today, 360)),
        cost: 1800,
        description: "Electrical rough-in and final inspection permit",
        inspections: [
          {
            id: "cal-insp-003",
            permitId: "cal-permit-002",
            type: "Electrical Rough-In",
            scheduledDate: formatDate(addDays(today, 7)),
            inspector: "Jennifer Martinez",
            result: "pending",
            complianceScore: 0,
            comments: "Scheduled for electrical rough-in inspection",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        createdBy: "system",
        createdAt: new Date().toISOString(),
        updatedBy: "system",
        updatedAt: new Date().toISOString(),
      },
      {
        id: "cal-permit-003",
        projectId: projectId || "2525840",
        number: "PLMB-2024-301",
        type: "Plumbing",
        status: "approved",
        priority: "high",
        authority: "City Plumbing Department",
        applicationDate: formatDate(addDays(today, -12)),
        approvalDate: formatDate(addDays(today, -3)),
        expirationDate: formatDate(addDays(today, 355)),
        cost: 2200,
        description: "Plumbing rough-in and final inspection permit",
        inspections: [
          {
            id: "cal-insp-004",
            permitId: "cal-permit-003",
            type: "Plumbing Rough-In",
            completedDate: formatDate(addDays(today, -1)),
            inspector: "Robert Kim",
            result: "passed",
            complianceScore: 92,
            comments: "Plumbing rough-in meets all requirements",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "cal-insp-005",
            permitId: "cal-permit-003",
            type: "Plumbing Final",
            scheduledDate: formatDate(addDays(today, 21)),
            inspector: "Robert Kim",
            result: "pending",
            complianceScore: 0,
            comments: "Scheduled for plumbing final inspection",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        createdBy: "system",
        createdAt: new Date().toISOString(),
        updatedBy: "system",
        updatedAt: new Date().toISOString(),
      },
      {
        id: "cal-permit-004",
        projectId: projectId || "2525840",
        number: "HVAC-2024-401",
        type: "HVAC",
        status: "approved",
        priority: "medium",
        authority: "City Mechanical Department",
        applicationDate: formatDate(addDays(today, -8)),
        approvalDate: formatDate(today),
        expirationDate: formatDate(addDays(today, 365)),
        cost: 2800,
        description: "HVAC system installation and testing permit",
        inspections: [
          {
            id: "cal-insp-006",
            permitId: "cal-permit-004",
            type: "HVAC Rough-In",
            scheduledDate: formatDate(addDays(today, 10)),
            inspector: "Emily Rodriguez",
            result: "pending",
            complianceScore: 0,
            comments: "Scheduled for HVAC rough-in inspection",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        createdBy: "system",
        createdAt: new Date().toISOString(),
        updatedBy: "system",
        updatedAt: new Date().toISOString(),
      },
      {
        id: "cal-permit-005",
        projectId: projectId || "2525840",
        number: "FIRE-2024-501",
        type: "Fire Safety",
        status: "expired",
        priority: "critical",
        authority: "Fire Department",
        applicationDate: formatDate(addDays(today, -45)),
        approvalDate: formatDate(addDays(today, -30)),
        expirationDate: formatDate(addDays(today, -2)),
        cost: 1500,
        description: "Fire safety system inspection and certification",
        inspections: [
          {
            id: "cal-insp-007",
            permitId: "cal-permit-005",
            type: "Fire Safety Final",
            completedDate: formatDate(addDays(today, -5)),
            inspector: "Michael Thompson",
            result: "failed",
            complianceScore: 65,
            comments: "Fire safety system needs additional sprinkler coverage",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        createdBy: "system",
        createdAt: new Date().toISOString(),
        updatedBy: "system",
        updatedAt: new Date().toISOString(),
      },
      {
        id: "cal-permit-006",
        projectId: projectId || "2525840",
        number: "DEMO-2024-601",
        type: "Demolition",
        status: "pending",
        priority: "high",
        authority: "City Building Department",
        applicationDate: formatDate(addDays(today, -2)),
        expirationDate: formatDate(addDays(today, 90)),
        cost: 4200,
        description: "Partial demolition permit for interior renovation",
        inspections: [
          {
            id: "cal-insp-008",
            permitId: "cal-permit-006",
            type: "Pre-Demolition",
            scheduledDate: formatDate(addDays(today, 5)),
            inspector: "Lisa Park",
            result: "pending",
            complianceScore: 0,
            comments: "Scheduled for pre-demolition safety inspection",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        createdBy: "system",
        createdAt: new Date().toISOString(),
        updatedBy: "system",
        updatedAt: new Date().toISOString(),
      },
    ]

    setCalendarPermits(calendarMockPermits)
  }, [projectId])

  // Mock field reports data initialization
  React.useEffect(() => {
    const today = new Date()
    const formatDate = (date: Date) => date.toISOString().split("T")[0]
    const addDays = (date: Date, days: number) => {
      const result = new Date(date)
      result.setDate(result.getDate() + days)
      return result
    }

    const mockDailyLogs: DailyLog[] = [
      {
        id: "log-001",
        projectId: projectId || "2525840",
        projectName: "Downtown Office Complex",
        date: formatDate(today),
        submittedBy: "John Doe",
        status: "submitted",
        totalWorkers: 24,
        totalHours: 184,
        weatherConditions: {
          temperature: 72,
          conditions: "Sunny",
          windSpeed: 5,
        },
        activities: [
          {
            id: "act-001",
            type: "task",
            description: "Foundation Pour - East Wing",
            status: "completed",
            responsibleParty: "Concrete Crew A",
          },
          {
            id: "act-002",
            type: "task",
            description: "Rebar Installation - West Wing",
            status: "in-progress",
            responsibleParty: "Steel Crew B",
          },
        ],
        comments: "Good progress on foundation work. Weather conditions favorable.",
        manpowerEntries: [
          {
            id: "man-001",
            contactCompany: "ABC Concrete Co",
            workers: 8,
            hours: 64,
            totalHours: 64,
            location: "Foundation - East Wing",
            comments: "Completed pour successfully",
            trade: "Concrete",
          },
          {
            id: "man-002",
            contactCompany: "Steel Works Inc",
            workers: 6,
            hours: 48,
            totalHours: 48,
            location: "Foundation - West Wing",
            comments: "Rebar installation in progress",
            trade: "Structural Steel",
          },
        ],
      },
      {
        id: "log-002",
        projectId: projectId || "2525840",
        projectName: "Downtown Office Complex",
        date: formatDate(addDays(today, -1)),
        submittedBy: "Jane Smith",
        status: "submitted",
        totalWorkers: 18,
        totalHours: 140,
        weatherConditions: {
          temperature: 68,
          conditions: "Partly Cloudy",
          windSpeed: 8,
        },
        activities: [
          {
            id: "act-003",
            type: "task",
            description: "Framing Progress - Level 1",
            status: "completed",
            responsibleParty: "Framing Team A",
          },
        ],
        comments: "Framing work progressing well. Minor delays due to material delivery.",
        manpowerEntries: [
          {
            id: "man-003",
            contactCompany: "Frame Masters LLC",
            workers: 10,
            hours: 80,
            totalHours: 80,
            location: "Level 1 Framing",
            comments: "Good progress on framing",
            trade: "Carpentry",
          },
        ],
      },
      {
        id: "log-003",
        projectId: projectId || "2525840",
        projectName: "Downtown Office Complex",
        date: formatDate(addDays(today, -2)),
        submittedBy: "Mike Johnson",
        status: "overdue",
        totalWorkers: 15,
        totalHours: 112,
        weatherConditions: {
          temperature: 65,
          conditions: "Rain",
          windSpeed: 12,
        },
        activities: [
          {
            id: "act-004",
            type: "task",
            description: "Weather Delay - Concrete Work",
            status: "planned",
            responsibleParty: "Site Supervisor",
          },
        ],
        comments: "Weather delay affected concrete work. Rescheduled for next day.",
        manpowerEntries: [
          {
            id: "man-004",
            contactCompany: "Weather Shield Co",
            workers: 5,
            hours: 32,
            totalHours: 32,
            location: "Site Protection",
            comments: "Weather protection measures",
            trade: "General",
          },
        ],
      },
    ]

    const mockManpowerRecords: ManpowerRecord[] = [
      {
        id: "mp-001",
        projectId: projectId || "2525840",
        projectName: "Downtown Office Complex",
        date: formatDate(today),
        contractor: "ABC Concrete Co",
        workers: 8,
        hours: 64,
        totalHours: 64,
        location: "Foundation - East Wing",
        comments: "Completed pour successfully",
        trade: "Concrete",
        efficiency: 95,
        costPerHour: 75,
      },
      {
        id: "mp-002",
        projectId: projectId || "2525840",
        projectName: "Downtown Office Complex",
        date: formatDate(today),
        contractor: "Steel Works Inc",
        workers: 6,
        hours: 48,
        totalHours: 48,
        location: "Foundation - West Wing",
        comments: "Rebar installation in progress",
        trade: "Structural Steel",
        efficiency: 88,
        costPerHour: 85,
      },
      {
        id: "mp-003",
        projectId: projectId || "2525840",
        projectName: "Downtown Office Complex",
        date: formatDate(addDays(today, -1)),
        contractor: "Frame Masters LLC",
        workers: 10,
        hours: 80,
        totalHours: 80,
        location: "Level 1 Framing",
        comments: "Good progress on framing",
        trade: "Carpentry",
        efficiency: 92,
        costPerHour: 70,
      },
    ]

    setDailyLogs(mockDailyLogs)
    setManpowerRecords(mockManpowerRecords)

    // Mock safety audit data
    const mockSafetyAudits: SafetyAudit[] = [
      {
        id: "safety-001",
        projectId: projectId || "2525840",
        projectName: "Downtown Office Complex",
        date: formatDate(today),
        type: "Weekly Safety Audit",
        trade: "General",
        status: "pass",
        location: "Foundation Level",
        createdBy: "Safety Manager",
        description: "Comprehensive safety inspection of foundation work area",
        responses: [
          { question: "Are all workers wearing proper PPE?", response: "Safe" },
          { question: "Are fall protection systems in place?", response: "Safe" },
          { question: "Are electrical hazards properly marked?", response: "Safe" },
          { question: "Are emergency exits clearly marked?", response: "Safe" },
          { question: "Are first aid supplies readily available?", response: "Safe" },
        ],
        violations: 0,
        atRiskItems: 0,
        complianceScore: 100,
        attachments: [],
      },
      {
        id: "safety-002",
        projectId: projectId || "2525840",
        projectName: "Downtown Office Complex",
        date: formatDate(addDays(today, -3)),
        type: "Site Safety Inspection",
        trade: "Electrical",
        status: "fail",
        location: "Second Floor",
        createdBy: "Safety Inspector",
        description: "Electrical safety inspection with violations found",
        responses: [
          { question: "Are electrical panels properly labeled?", response: "At Risk" },
          { question: "Are GFCI outlets installed in wet locations?", response: "Safe" },
          { question: "Are extension cords in good condition?", response: "At Risk" },
          { question: "Are lockout/tagout procedures followed?", response: "Safe" },
          { question: "Are electrical hazards properly marked?", response: "Safe" },
        ],
        violations: 2,
        atRiskItems: 2,
        complianceScore: 60,
        attachments: [],
      },
      {
        id: "safety-003",
        projectId: projectId || "2525840",
        projectName: "Downtown Office Complex",
        date: formatDate(addDays(today, -7)),
        type: "PPE Compliance Audit",
        trade: "Concrete",
        status: "pass",
        location: "Parking Garage",
        createdBy: "Safety Manager",
        description: "Personal protective equipment compliance check",
        responses: [
          { question: "Are hard hats worn at all times?", response: "Safe" },
          { question: "Are safety glasses provided and used?", response: "Safe" },
          { question: "Are steel-toed boots required?", response: "Safe" },
          { question: "Are high-visibility vests worn?", response: "Safe" },
          { question: "Are hearing protection devices available?", response: "Safe" },
        ],
        violations: 0,
        atRiskItems: 0,
        complianceScore: 100,
        attachments: [],
      },
    ]

    setSafetyAudits(mockSafetyAudits)

    // Initialize quality inspections mock data
    const mockQualityInspections: QualityInspection[] = [
      {
        id: "quality-001",
        projectId: projectId || "2525840",
        projectName: "Downtown Office Complex",
        date: formatDate(addDays(today, -2)),
        type: "Structural Framing",
        trade: "Structural Steel",
        status: "pass",
        location: "Level 3 - East Wing",
        createdBy: "Quality Inspector",
        description: "Structural framing inspection for steel beams and connections",
        checklist: [
          { question: "Are all bolts properly torqued?", response: "Yes" },
          { question: "Are welds meeting specifications?", response: "Yes" },
          { question: "Are connections properly aligned?", response: "Yes" },
          { question: "Are fireproofing requirements met?", response: "Yes" },
          { question: "Are dimensions within tolerance?", response: "Yes" },
        ],
        defects: 0,
        issues: [],
        attachments: [],
      },
      {
        id: "quality-002",
        projectId: projectId || "2525840",
        projectName: "Downtown Office Complex",
        date: formatDate(addDays(today, -5)),
        type: "Concrete Pour",
        trade: "Concrete",
        status: "fail",
        location: "Foundation - North Section",
        createdBy: "Quality Inspector",
        description: "Concrete foundation pour inspection with defects found",
        checklist: [
          { question: "Is concrete strength adequate?", response: "No" },
          { question: "Are forms properly aligned?", response: "Yes" },
          { question: "Is reinforcement placement correct?", response: "No" },
          { question: "Are joints properly sealed?", response: "Yes" },
          { question: "Is surface finish acceptable?", response: "Yes" },
        ],
        defects: 2,
        issues: [
          "Concrete strength test failed - 2800 psi vs required 3000 psi",
          "Reinforcement spacing exceeded tolerance by 2 inches",
        ],
        attachments: [],
      },
      {
        id: "quality-003",
        projectId: projectId || "2525840",
        projectName: "Downtown Office Complex",
        date: formatDate(addDays(today, -1)),
        type: "Electrical Rough-In",
        trade: "Electrical",
        status: "pending",
        location: "Level 2 - West Wing",
        createdBy: "Quality Inspector",
        description: "Electrical rough-in inspection scheduled",
        checklist: [
          { question: "Are conduits properly secured?", response: "Yes" },
          { question: "Are boxes at correct elevations?", response: "Yes" },
          { question: "Are proper wire sizes used?", response: "Yes" },
          { question: "Are grounding requirements met?", response: "Yes" },
          { question: "Are code clearances maintained?", response: "Yes" },
        ],
        defects: 0,
        issues: [],
        attachments: [],
      },
      {
        id: "quality-004",
        projectId: projectId || "2525840",
        projectName: "Downtown Office Complex",
        date: formatDate(addDays(today, -10)),
        type: "Drywall Installation",
        trade: "Drywall",
        status: "pass",
        location: "Level 1 - Conference Rooms",
        createdBy: "Quality Inspector",
        description: "Drywall installation and finish inspection",
        checklist: [
          { question: "Are joints properly taped?", response: "Yes" },
          { question: "Is surface texture consistent?", response: "Yes" },
          { question: "Are corners square and true?", response: "Yes" },
          { question: "Are fasteners properly set?", response: "Yes" },
          { question: "Are electrical boxes cut cleanly?", response: "Yes" },
        ],
        defects: 0,
        issues: [],
        attachments: [],
      },
      {
        id: "quality-005",
        projectId: projectId || "2525840",
        projectName: "Downtown Office Complex",
        date: formatDate(addDays(today, -3)),
        type: "HVAC Installation",
        trade: "HVAC",
        status: "fail",
        location: "Mechanical Room - Basement",
        createdBy: "Quality Inspector",
        description: "HVAC equipment installation with issues",
        checklist: [
          { question: "Are units properly leveled?", response: "No" },
          { question: "Are connections leak-free?", response: "Yes" },
          { question: "Are electrical connections proper?", response: "Yes" },
          { question: "Are vibration pads installed?", response: "No" },
          { question: "Are controls calibrated?", response: "Yes" },
        ],
        defects: 2,
        issues: [
          "Main air handler not properly leveled - 1.5 degree slope",
          "Vibration isolation pads missing on secondary units",
        ],
        attachments: [],
      },
    ]

    setQualityInspections(mockQualityInspections)
  }, [projectId])

  // Handle permit form actions
  const handleNewPermit = () => {
    setSelectedPermit(null)
    setShowPermitForm(true)
  }

  const handleEditPermit = (permit: Permit) => {
    setSelectedPermit(permit)
    setShowPermitForm(true)
  }

  const handleSavePermit = (permitData: PermitFormData) => {
    if (selectedPermit) {
      // Update existing permit
      setPermits((prevPermits) =>
        prevPermits.map((p) =>
          p.id === selectedPermit.id ? { ...p, ...permitData, updatedAt: new Date().toISOString() } : p
        )
      )
    } else {
      // Create new permit
      const newPermit: Permit = {
        ...permitData,
        id: `permit-${Date.now()}`,
        projectId: projectId || "2525840",
        inspections: [],
        createdBy: "current-user",
        createdAt: new Date().toISOString(),
        updatedBy: "current-user",
        updatedAt: new Date().toISOString(),
      }
      setPermits((prevPermits) => [...prevPermits, newPermit])
    }
    setShowPermitForm(false)
    setSelectedPermit(null)
  }

  const handleClosePermitForm = () => {
    setShowPermitForm(false)
    setSelectedPermit(null)
  }

  // Handle inspection form actions
  const handleNewInspection = () => {
    setSelectedInspection(null)
    setShowInspectionForm(true)
  }

  const handleEditInspection = (inspection: Inspection, permit: Permit) => {
    setSelectedInspection(inspection)
    setShowInspectionForm(true)
  }

  const handleViewInspection = (inspection: Inspection, permit: Permit) => {
    setSelectedInspection(inspection)
    setShowInspectionForm(true)
  }

  const handleSaveInspection = (inspectionData: Omit<Inspection, "id" | "createdAt" | "updatedAt">) => {
    if (selectedInspection) {
      // Update existing inspection
      setPermits((prevPermits) =>
        prevPermits.map((permit) => ({
          ...permit,
          inspections:
            permit.inspections?.map((inspection) =>
              inspection.id === selectedInspection.id
                ? { ...inspection, ...inspectionData, updatedAt: new Date().toISOString() }
                : inspection
            ) || [],
        }))
      )
    } else {
      // Create new inspection
      const newInspection: Inspection = {
        ...inspectionData,
        id: `insp-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setPermits((prevPermits) =>
        prevPermits.map((permit) =>
          permit.id === inspectionData.permitId
            ? { ...permit, inspections: [...(permit.inspections || []), newInspection] }
            : permit
        )
      )
    }
    setShowInspectionForm(false)
    setSelectedInspection(null)
  }

  const handleCloseInspectionForm = () => {
    setShowInspectionForm(false)
    setSelectedInspection(null)
  }

  // Update internal state when selectedSubTool changes
  React.useEffect(() => {
    setActiveTab(selectedSubTool || "overview")
  }, [selectedSubTool])

  // Handle tab changes
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    if (onSubToolChange) {
      onSubToolChange(tabId)
    }
  }

  // Handle constraint click - routes to full constraint details
  const handleConstraintClick = (constraint: any) => {
    // Navigate to the full constraints log page with the specific constraint
    if (projectId) {
      router.push(`/dashboard/constraints-log?project_id=${projectId}&constraint_id=${constraint.id}`)
    } else {
      router.push(`/dashboard/constraints-log?constraint_id=${constraint.id}`)
    }
  }

  const getProjectScope = () => {
    const fieldOperationsScore = 92
    const activeConstraints = 7
    const pendingPermits = 3
    const dailyReports = 145
    const fieldEfficiency = 87.5

    return {
      fieldOperationsScore,
      activeConstraints,
      pendingPermits,
      dailyReports,
      fieldEfficiency,
    }
  }

  // Calculate field reports stats
  const getFieldReportsStats = () => {
    const totalLogs = dailyLogs.length
    const completedLogs = dailyLogs.filter((log) => log.status === "submitted").length
    const businessDaysInMonth = 22 // Approximate business days in a month
    const businessDaysToDate = 15 // Approximate business days to current date
    const expectedLogs = businessDaysToDate
    const logComplianceRate = expectedLogs > 0 ? (completedLogs / expectedLogs) * 100 : 100

    const totalWorkers = manpowerRecords.reduce((sum, record) => sum + record.workers, 0)
    const averageEfficiency =
      manpowerRecords.length > 0
        ? manpowerRecords.reduce((sum, record) => sum + record.efficiency, 0) / manpowerRecords.length
        : 0

    // Calculate safety audit stats
    const totalAudits = safetyAudits.length
    const passedAudits = safetyAudits.filter((audit) => audit.status === "pass").length
    const safetyComplianceRate = totalAudits > 0 ? (passedAudits / totalAudits) * 100 : 100
    const safetyViolations = safetyAudits.reduce((sum, audit) => sum + (audit.violations || 0), 0)
    const atRiskSafetyItems = safetyAudits.reduce((sum, audit) => sum + (audit.atRiskItems || 0), 0)
    const averageComplianceScore =
      safetyAudits.length > 0
        ? safetyAudits.reduce((sum, audit) => sum + (audit.complianceScore || 0), 0) / safetyAudits.length
        : 0

    // Calculate quality control stats
    const totalInspections = qualityInspections.length
    const passedInspections = qualityInspections.filter((inspection) => inspection.status === "pass").length
    const failedInspections = qualityInspections.filter((inspection) => inspection.status === "fail").length
    const qualityPassRate = totalInspections > 0 ? (passedInspections / totalInspections) * 100 : 100
    const qualityDefects = qualityInspections.reduce((sum, inspection) => sum + (inspection.defects || 0), 0)
    const averageQualityScore = totalInspections > 0 ? Math.max(0, 100 - (qualityDefects / totalInspections) * 10) : 100

    return {
      totalLogs,
      logComplianceRate,
      expectedLogs,
      completedLogs,
      totalWorkers,
      averageEfficiency,
      businessDaysInMonth,
      businessDaysToDate,
      totalAudits,
      safetyComplianceRate,
      safetyViolations,
      atRiskSafetyItems,
      averageComplianceScore,
      totalInspections,
      qualityPassRate,
      qualityDefects,
      averageQualityScore,
    }
  }

  const fieldData = getProjectScope()
  const fieldReportsStats = getFieldReportsStats()

  const renderContent = () => {
    // Handle procurement sub-tab
    if (activeTab === "procurement") {
      return (
        <div className="space-y-6">
          {/* Procurement Sub-tabs */}
          <div className="space-y-4 w-full max-w-full overflow-hidden">
            <Tabs value={procurementSubTab} onValueChange={setProcurementSubTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="commitments">Commitments</TabsTrigger>
                <TabsTrigger value="integration">Procore Sync</TabsTrigger>
                <TabsTrigger value="insights">AI Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="w-full max-w-full overflow-hidden">
                <ProcurementOverviewWidget
                  projectId={projectId}
                  onViewAll={() => setProcurementSubTab("commitments")}
                  onSyncProcore={() => setProcurementSubTab("integration")}
                  onNewRecord={() => console.log("New procurement record")}
                />
              </TabsContent>

              <TabsContent value="commitments" className="w-full max-w-full overflow-hidden">
                <ProcurementCommitmentsTable
                  projectId={projectId}
                  userRole={userRole}
                  onCommitmentSelect={(commitment) => console.log("Selected commitment:", commitment)}
                  onCommitmentEdit={(commitment) => console.log("Edit commitment:", commitment)}
                  onSyncProcore={() => setProcurementSubTab("integration")}
                />
              </TabsContent>

              <TabsContent value="integration" className="w-full max-w-full overflow-hidden">
                <ProcoreIntegrationPanel
                  projectId={projectId}
                  onSyncTriggered={() => console.log("Sync triggered")}
                  onViewInProcore={() => window.open("https://app.procore.com/commitments", "_blank")}
                />
              </TabsContent>

              <TabsContent value="insights" className="w-full max-w-full overflow-hidden">
                <HbiProcurementInsights
                  procurementStats={{
                    totalValue: 12450000,
                    activeProcurements: 24,
                    completedProcurements: 18,
                    pendingApprovals: 8,
                    linkedToBidTabs: 22,
                    avgCycleTime: 14,
                    complianceRate: 95,
                    totalRecords: 24,
                  }}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )
    }

    if (!activeTab || activeTab === "overview") {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Field Operations Overview
                </CardTitle>
                <CardDescription>Comprehensive view of field management activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Field Score</p>
                      <p className="font-medium text-lg text-foreground">{fieldData.fieldOperationsScore}%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Efficiency</p>
                      <p className="font-medium text-lg text-foreground">{fieldData.fieldEfficiency}%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Key Metrics
                </CardTitle>
                <CardDescription>Current field management status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Active Constraints</p>
                      <p className="font-medium text-lg text-foreground">{fieldData.activeConstraints}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Pending Permits</p>
                      <p className="font-medium text-lg text-foreground">{fieldData.pendingPermits}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }

    // Handle constraints log sub-tab
    if (activeTab === "constraints-log") {
      return (
        <div className="space-y-6">
          {/* Constraints Log Sub-tabs */}
          <div className="space-y-4 w-full max-w-full overflow-hidden">
            <Tabs value={constraintsSubTab} onValueChange={setConstraintsSubTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="log">Log</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="w-full max-w-full overflow-hidden">
                <div className="space-y-6 w-full max-w-full">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5" />
                          Constraints Overview
                        </CardTitle>
                        <CardDescription>Summary of project constraints and their status</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                                Active Constraints
                              </p>
                              <p className="font-medium text-lg text-foreground">{fieldData.activeConstraints}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                                Resolved This Month
                              </p>
                              <p className="font-medium text-lg text-foreground">28</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                                Avg Resolution Time
                              </p>
                              <p className="font-medium text-lg text-foreground">3.2d</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground uppercase tracking-wide">Critical Issues</p>
                              <p className="font-medium text-lg text-foreground">2</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="h-5 w-5" />
                          Recent Activity
                        </CardTitle>
                        <CardDescription>Latest constraints activity and updates</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Weather delay extended</p>
                              <p className="text-xs text-muted-foreground">2 hours ago</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Permit approved</p>
                              <p className="text-xs text-muted-foreground">4 hours ago</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Material delivery delayed</p>
                              <p className="text-xs text-muted-foreground">1 day ago</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="log" className="w-full max-w-full overflow-hidden">
                <div className="space-y-6 w-full max-w-full">
                  <ConstraintsTableCompact
                    projectId={projectId}
                    userRole={userRole}
                    onConstraintClick={handleConstraintClick}
                  />
                </div>
              </TabsContent>
              <TabsContent value="timeline" className="w-full max-w-full overflow-hidden">
                <div className="space-y-6 w-full max-w-full">
                  <ConstraintsTimelineCompact
                    projectId={projectId}
                    userRole={userRole}
                    onConstraintClick={handleConstraintClick}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )
    }

    // Handle scheduler sub-tab
    if (activeTab === "scheduler") {
      return (
        <div className="space-y-6">
          <SchedulerContent
            selectedSubTool={schedulerSubTab}
            projectData={projectData}
            userRole={userRole}
            projectId={projectId}
            onSubToolChange={setSchedulerSubTab}
            onSidebarContentChange={onSidebarContentChange}
          />
        </div>
      )
    }

    // Handle permit log sub-tab
    if (activeTab === "permit-log") {
      return (
        <div className="space-y-6">
          {/* Permit Log Sub-tabs */}
          <div className="space-y-4 w-full max-w-full overflow-hidden">
            <Tabs value={permitSubTab} onValueChange={setPermitSubTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="permits">Permits</TabsTrigger>
                <TabsTrigger value="inspections">Inspections</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="w-full max-w-full overflow-hidden">
                <div className="space-y-6 w-full max-w-full">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5" />
                          Permit Overview
                        </CardTitle>
                        <CardDescription>Summary of project permits and their status</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Permits</p>
                              <p className="font-medium text-lg text-foreground">42</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground uppercase tracking-wide">Approved</p>
                              <p className="font-medium text-lg text-foreground">39</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground uppercase tracking-wide">Pending</p>
                              <p className="font-medium text-lg text-foreground">{fieldData.pendingPermits}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground uppercase tracking-wide">Avg Approval Time</p>
                              <p className="font-medium text-lg text-foreground">12d</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5" />
                          Inspection Status
                        </CardTitle>
                        <CardDescription>Current inspection schedule and status</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Foundation inspection scheduled</p>
                              <p className="text-xs text-muted-foreground">Tomorrow 10:00 AM</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Electrical rough-in passed</p>
                              <p className="text-xs text-muted-foreground">Yesterday</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Plumbing rough-in pending</p>
                              <p className="text-xs text-muted-foreground">Awaiting schedule</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="permits" className="w-full max-w-full overflow-hidden">
                <div className="space-y-6 w-full max-w-full">
                  {/* Header with New Permit Button */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Permit Management</h3>
                      <p className="text-sm text-muted-foreground">Manage and track all project permits</p>
                    </div>
                    <Button onClick={handleNewPermit} className="bg-[#003087] hover:bg-[#002066] text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      New Permit
                    </Button>
                  </div>

                  {/* Permit Table */}
                  <PermitTable
                    permits={permits}
                    onEdit={handleEditPermit}
                    onView={handleEditPermit}
                    userRole={userRole}
                    compact={false}
                  />
                </div>
              </TabsContent>
              <TabsContent value="inspections" className="w-full max-w-full overflow-hidden">
                <div className="space-y-6 w-full max-w-full">
                  {/* Header with Add Inspection Button */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Inspection Management</h3>
                      <p className="text-sm text-muted-foreground">Schedule and track all project inspections</p>
                    </div>
                    <Button onClick={handleNewInspection} className="bg-[#003087] hover:bg-[#002066] text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Inspection
                    </Button>
                  </div>

                  {/* Inspections Table */}
                  <InspectionsTable
                    permits={permits}
                    onEditInspection={handleEditInspection}
                    onViewInspection={handleViewInspection}
                    userRole={userRole}
                    compact={false}
                  />
                </div>
              </TabsContent>
              <TabsContent value="calendar" className="w-full max-w-full overflow-hidden">
                <div className="space-y-6 w-full max-w-full">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Permit & Inspection Calendar</h3>
                      <p className="text-sm text-muted-foreground">
                        Calendar view of permit deadlines and inspection scheduling
                      </p>
                    </div>
                  </div>

                  {/* Calendar Component */}
                  <div className="h-[600px]">
                    <PermitCalendar
                      permits={calendarPermits}
                      onEditPermit={handleEditPermit}
                      onViewPermit={handleEditPermit}
                      userRole={userRole}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )
    }

    // Handle field reports sub-tab
    if (activeTab === "field-reports") {
      return (
        <div className="space-y-6">
          {/* Field Reports Sub-tabs */}
          <div className="space-y-4 w-full max-w-full overflow-hidden">
            <Tabs value={fieldReportsSubTab} onValueChange={setFieldReportsSubTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="daily-logs">Daily Logs</TabsTrigger>
                <TabsTrigger value="safety-audits">Safety Audits</TabsTrigger>
                <TabsTrigger value="quality-control">Quality Control</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="w-full max-w-full overflow-hidden">
                <div className="space-y-6 w-full max-w-full">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <ClipboardList className="h-5 w-5" />
                          Field Reports Overview
                        </CardTitle>
                        <CardDescription>Summary of field reporting activities</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground uppercase tracking-wide">Daily Reports</p>
                              <p className="font-medium text-lg text-foreground">145</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground uppercase tracking-wide">This Week</p>
                              <p className="font-medium text-lg text-foreground">28</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground uppercase tracking-wide">Safety Audits</p>
                              <p className="font-medium text-lg text-foreground">12</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground uppercase tracking-wide">Quality Checks</p>
                              <p className="font-medium text-lg text-foreground">89</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="h-5 w-5" />
                          Report Status
                        </CardTitle>
                        <CardDescription>Current field reporting status</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Today's daily log submitted</p>
                              <p className="text-xs text-muted-foreground">2 hours ago</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Weekly safety audit scheduled</p>
                              <p className="text-xs text-muted-foreground">Tomorrow 9:00 AM</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Quality control pending</p>
                              <p className="text-xs text-muted-foreground">3 items awaiting review</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="daily-logs" className="w-full max-w-full overflow-hidden">
                <div className="space-y-6 w-full max-w-full">
                  <DailyLogSubTab
                    data={{
                      dailyLogs: dailyLogs,
                      manpower: manpowerRecords,
                    }}
                    stats={fieldReportsStats}
                    userRole={userRole}
                    onRefresh={() => {
                      // Use Next.js App Router refresh instead of full page reload
                      // This preserves browser history and React state while refreshing data
                      router.refresh()
                    }}
                  />
                </div>
              </TabsContent>
              <TabsContent value="safety-audits" className="w-full max-w-full overflow-hidden">
                <div className="space-y-6 w-full max-w-full">
                  <SafetyAuditsSubTab
                    data={{
                      safetyAudits: safetyAudits,
                    }}
                    stats={fieldReportsStats}
                    userRole={userRole}
                    onRefresh={() => {
                      // Use Next.js App Router refresh instead of full page reload
                      // This preserves browser history and React state while refreshing data
                      router.refresh()
                    }}
                  />
                </div>
              </TabsContent>
              <TabsContent value="quality-control" className="w-full max-w-full overflow-hidden">
                <div className="space-y-6 w-full max-w-full">
                  <QualityControlSubTab
                    data={{
                      qualityInspections: qualityInspections,
                    }}
                    stats={fieldReportsStats}
                    userRole={userRole}
                    onRefresh={() => {
                      // Refresh logic would be implemented here
                    }}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )
    }

    // Default content for other sub-tools
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Field Management Tools
            </CardTitle>
            <CardDescription>Content for {activeTab} will be displayed here</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This content will be populated with specific components for {activeTab} in future development phases.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Define available tabs - all tabs shown to all roles for consistent experience
  const getTabsForRole = () => {
    const allTabs = [
      { id: "procurement", label: "Procurement", icon: Package },
      { id: "scheduler", label: "Scheduler", icon: Calendar },
      { id: "constraints-log", label: "Constraints Log", icon: AlertTriangle },
      { id: "permit-log", label: "Permit Log", icon: Shield },
      { id: "field-reports", label: "Field Reports", icon: ClipboardList },
    ]

    // All roles now see all tabs (matching project-manager access)
    return allTabs
  }

  const availableTabs = getTabsForRole()

  return (
    <div
      className={`space-y-6 w-full max-w-full overflow-hidden ${
        isFocusMode ? "fixed inset-0 z-50 bg-background pt-16 p-6 overflow-y-auto" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Field Management Tools</h3>
          <p className="text-sm text-muted-foreground">
            Manage field operations, scheduling, constraints, permits, and reporting
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleFocusToggle}
            className={
              isFocusMode
                ? "bg-[#FA4616] text-white border-[#FA4616] hover:bg-[#FA4616]/90"
                : "hover:bg-[#FA4616]/10 hover:border-[#FA4616]/30"
            }
          >
            <Focus className="h-4 w-4 mr-2" />
            {isFocusMode ? "Exit Focus" : "Focus"}
          </Button>
        </div>
      </div>

      {/* Horizontal Navigation Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {availableTabs.map((tab) => {
          const IconComponent = tab.icon
          const isActive = activeTab === tab.id

          return (
            <Card
              key={tab.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isActive
                  ? "border-[#FA4616] bg-[#FA4616]/5 ring-1 ring-[#FA4616]/20"
                  : "hover:border-[#FA4616]/50 hover:bg-[#FA4616]/5"
              }`}
              onClick={() => handleTabChange(tab.id)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="relative">
                    <IconComponent
                      className={`h-6 w-6 ${isActive ? "text-[#FA4616]" : "text-gray-600 dark:text-gray-400"}`}
                    />
                  </div>
                  <div>
                    <p
                      className={`text-xs font-medium ${
                        isActive ? "text-[#FA4616]" : "text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      {tab.label}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Content */}
      <div className="w-full max-w-full overflow-hidden">{renderContent()}</div>

      {/* Permit Form Modal */}
      <PermitForm
        permit={selectedPermit}
        open={showPermitForm}
        onClose={handleClosePermitForm}
        onSave={handleSavePermit}
        userRole={userRole}
      />

      {/* Inspection Form Modal */}
      <InspectionForm
        inspection={selectedInspection}
        permits={permits}
        open={showInspectionForm}
        onClose={handleCloseInspectionForm}
        onSave={handleSaveInspection}
        userRole={userRole}
      />
    </div>
  )
}

export default FieldManagementContent
