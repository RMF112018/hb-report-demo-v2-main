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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

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
  Maximize2,
  Minimize2,
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
import {
  ProtectedGrid,
  ProtectedColDef,
  GridRow,
  createGridWithTotalsAndSticky,
  createProtectedColumn,
  createReadOnlyColumn,
  createLockedColumn,
} from "@/components/ui/protected-grid"
import { useTheme } from "next-themes"

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

  // ProtectedGrid Components for Permits and Inspections
  const PermitsProtectedGrid = ({
    permits,
    onEdit,
    onView,
    userRole,
  }: {
    permits: Permit[]
    onEdit?: (permit: Permit) => void
    onView?: (permit: Permit) => void
    userRole?: string
  }) => {
    const { theme } = useTheme()

    const columnDefs: ProtectedColDef[] = [
      createReadOnlyColumn("number", "Permit Number", {
        width: 150,
        cellRenderer: (params: any) => (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="font-mono text-sm">{params.value}</span>
            {params.data.priority === "high" && (
              <Badge variant="destructive" className="text-xs">
                High
              </Badge>
            )}
          </div>
        ),
      }),
      createReadOnlyColumn("type", "Type", {
        width: 120,
        cellRenderer: (params: any) => (
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span>{params.value}</span>
          </div>
        ),
      }),
      createReadOnlyColumn("status", "Status", {
        width: 120,
        cellRenderer: (params: any) => {
          const statusColors = {
            approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
            pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
            rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
            expired: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
          }
          return (
            <Badge
              className={`text-xs ${statusColors[params.value as keyof typeof statusColors] || statusColors.pending}`}
            >
              {params.value}
            </Badge>
          )
        },
      }),
      createReadOnlyColumn("authority", "Authority", { width: 180 }),
      createReadOnlyColumn("applicationDate", "Application Date", { width: 140 }),
      createReadOnlyColumn("approvalDate", "Approval Date", { width: 140 }),
      createReadOnlyColumn("expirationDate", "Expiration Date", { width: 140 }),
      createReadOnlyColumn("cost", "Cost", {
        width: 100,
        cellRenderer: (params: any) => <span className="font-mono">${params.value?.toLocaleString() || "0"}</span>,
      }),
      createReadOnlyColumn("inspections", "Inspections", {
        width: 100,
        cellRenderer: (params: any) => <span className="text-sm">{params.value?.length || 0}</span>,
      }),
      createReadOnlyColumn("actions", "Actions", {
        width: 120,
        cellRenderer: (params: any) => (
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" onClick={() => onView?.(params.data)} className="h-6 w-6 p-0">
              <Eye className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onEdit?.(params.data)} className="h-6 w-6 p-0">
              <Settings className="h-3 w-3" />
            </Button>
          </div>
        ),
      }),
    ]

    return (
      <ProtectedGrid
        columnDefs={columnDefs}
        rowData={permits}
        className={`h-[600px] ${theme === "dark" ? "ag-theme-alpine-dark" : "ag-theme-alpine"}`}
      />
    )
  }

  const InspectionsProtectedGrid = ({
    permits,
    onEdit,
    onView,
    userRole,
  }: {
    permits: Permit[]
    onEdit?: (permit: Permit) => void
    onView?: (permit: Permit) => void
    userRole?: string
  }) => {
    const { theme } = useTheme()

    // Transform permits data to show inspections
    const transformedInspections = React.useMemo(() => {
      const inspections: any[] = []

      permits.forEach((permit) => {
        if (permit.inspections && permit.inspections.length > 0) {
          permit.inspections.forEach((inspection) => {
            inspections.push({
              id: `${permit.id}-${inspection.id}`,
              permitNumber: permit.number,
              permitType: permit.type,
              inspectionId: inspection.id,
              inspectionType: inspection.type,
              completedDate: inspection.completedDate,
              inspector: inspection.inspector,
              result: inspection.result,
              complianceScore: inspection.complianceScore,
              comments: inspection.comments,
              permit: permit,
              inspection: inspection,
            })
          })
        }
      })

      return inspections
    }, [permits])

    const columnDefs: ProtectedColDef[] = [
      createReadOnlyColumn("permitNumber", "Permit Number", {
        width: 150,
        cellRenderer: (params: any) => (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="font-mono text-sm">{params.value}</span>
          </div>
        ),
      }),
      createReadOnlyColumn("permitType", "Permit Type", {
        width: 120,
        cellRenderer: (params: any) => (
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span>{params.value}</span>
          </div>
        ),
      }),
      createReadOnlyColumn("inspectionId", "Inspection ID", {
        width: 120,
        cellRenderer: (params: any) => <span className="font-mono text-sm">{params.value}</span>,
      }),
      createReadOnlyColumn("inspectionType", "Inspection Type", { width: 140 }),
      createReadOnlyColumn("completedDate", "Completed Date", { width: 140 }),
      createReadOnlyColumn("inspector", "Inspector", { width: 120 }),
      createReadOnlyColumn("result", "Result", {
        width: 100,
        cellRenderer: (params: any) => {
          const resultColors = {
            passed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
            failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
            pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
          }
          return (
            <Badge
              className={`text-xs ${resultColors[params.value as keyof typeof resultColors] || resultColors.pending}`}
            >
              {params.value}
            </Badge>
          )
        },
      }),
      createReadOnlyColumn("complianceScore", "Compliance Score", {
        width: 140,
        cellRenderer: (params: any) => (
          <div className="flex items-center gap-2">
            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  params.value >= 90 ? "bg-green-500" : params.value >= 70 ? "bg-yellow-500" : "bg-red-500"
                }`}
                style={{ width: `${params.value}%` }}
              />
            </div>
            <span className="text-sm font-medium">{params.value}%</span>
          </div>
        ),
      }),
      createReadOnlyColumn("comments", "Comments", { width: 200 }),
      createReadOnlyColumn("actions", "Actions", {
        width: 120,
        cellRenderer: (params: any) => (
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" onClick={() => onView?.(params.data.permit)} className="h-6 w-6 p-0">
              <Eye className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onEdit?.(params.data.permit)} className="h-6 w-6 p-0">
              <Settings className="h-3 w-3" />
            </Button>
          </div>
        ),
      }),
    ]

    return (
      <ProtectedGrid
        columnDefs={columnDefs}
        rowData={transformedInspections}
        className={`h-[600px] ${theme === "dark" ? "ag-theme-alpine-dark" : "ag-theme-alpine"}`}
      />
    )
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
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="commitments">Buyout Schedule</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="w-full max-w-full overflow-hidden">
                <ProcurementOverviewWidget
                  projectId={projectId}
                  onViewAll={() => setProcurementSubTab("commitments")}
                  onSyncProcore={() => console.log("Procore sync requested")}
                  onNewRecord={() => console.log("New procurement record")}
                />
              </TabsContent>

              <TabsContent value="commitments" className="w-full max-w-80% overflow-hidden">
                <ProcurementCommitmentsTable
                  projectId={projectId}
                  userRole={userRole}
                  onCommitmentSelect={(commitment) => console.log("Selected commitment:", commitment)}
                  onCommitmentEdit={(commitment) => console.log("Edit commitment:", commitment)}
                  onSyncProcore={() => console.log("Procore sync requested")}
                />
              </TabsContent>
            </Tabs>
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
                  {/* KPI Dashboard Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Constraints KPI */}
                    <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-red-600 dark:text-red-400">Total Constraints</p>
                            <p className="text-3xl font-bold text-red-900 dark:text-red-100">24</p>
                            <p className="text-xs text-red-600 dark:text-red-400">+5 this month</p>
                          </div>
                          <div className="h-12 w-12 bg-red-100 dark:bg-red-800 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Open Constraints KPI */}
                    <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-700">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Open</p>
                            <p className="text-3xl font-bold text-amber-900 dark:text-amber-100">12</p>
                            <p className="text-xs text-amber-600 dark:text-amber-400">50% of total</p>
                          </div>
                          <div className="h-12 w-12 bg-amber-100 dark:bg-amber-800 rounded-lg flex items-center justify-center">
                            <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Critical Issues KPI */}
                    <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Critical</p>
                            <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">3</p>
                            <p className="text-xs text-orange-600 dark:text-orange-400">12.5% of open</p>
                          </div>
                          <div className="h-12 w-12 bg-orange-100 dark:bg-orange-800 rounded-lg flex items-center justify-center">
                            <Zap className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Resolution Rate KPI */}
                    <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-green-600 dark:text-green-400">Resolution Rate</p>
                            <p className="text-3xl font-bold text-green-900 dark:text-green-100">87.5%</p>
                            <p className="text-xs text-green-600 dark:text-green-400">+5.2% vs last month</p>
                          </div>
                          <div className="h-12 w-12 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center">
                            <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Power BI Embedded Analytics Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Constraint Status Distribution - Pie Chart */}
                    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                          <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          Constraint Status Distribution
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                          Current breakdown of constraint statuses across all categories
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="h-64 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                          {/* Interactive Pie Chart */}
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              Constraint Status Distribution
                            </h4>
                            <div className="flex space-x-1">
                              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            </div>
                          </div>

                          {/* Pie Chart Visualization */}
                          <div className="relative w-32 h-32 mx-auto mb-4">
                            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 32 32">
                              {/* Open - 50% */}
                              <circle
                                cx="16"
                                cy="16"
                                r="14"
                                fill="none"
                                stroke="#F59E0B"
                                strokeWidth="3"
                                strokeDasharray={`${2 * Math.PI * 14 * 0.5} ${2 * Math.PI * 14}`}
                                className="transition-all duration-300 hover:stroke-amber-600"
                              />
                              {/* Resolved - 30% */}
                              <circle
                                cx="16"
                                cy="16"
                                r="14"
                                fill="none"
                                stroke="#10B981"
                                strokeWidth="3"
                                strokeDasharray={`${2 * Math.PI * 14 * 0.3} ${2 * Math.PI * 14}`}
                                strokeDashoffset={`-${2 * Math.PI * 14 * 0.5}`}
                                className="transition-all duration-300 hover:stroke-green-600"
                              />
                              {/* Critical - 12.5% */}
                              <circle
                                cx="16"
                                cy="16"
                                r="14"
                                fill="none"
                                stroke="#F97316"
                                strokeWidth="3"
                                strokeDasharray={`${2 * Math.PI * 14 * 0.125} ${2 * Math.PI * 14}`}
                                strokeDashoffset={`-${2 * Math.PI * 14 * 0.8}`}
                                className="transition-all duration-300 hover:stroke-orange-600"
                              />
                              {/* In Progress - 7.5% */}
                              <circle
                                cx="16"
                                cy="16"
                                r="14"
                                fill="none"
                                stroke="#3B82F6"
                                strokeWidth="3"
                                strokeDasharray={`${2 * Math.PI * 14 * 0.075} ${2 * Math.PI * 14}`}
                                strokeDashoffset={`-${2 * Math.PI * 14 * 0.925}`}
                                className="transition-all duration-300 hover:stroke-blue-600"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">24</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
                              </div>
                            </div>
                          </div>

                          {/* Legend */}
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                              <span className="text-gray-600 dark:text-gray-400">Open (12)</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span className="text-gray-600 dark:text-gray-400">Resolved (7)</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                              <span className="text-gray-600 dark:text-gray-400">Critical (3)</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              <span className="text-gray-600 dark:text-gray-400">In Progress (2)</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Constraint Resolution Timeline - Line Chart */}
                    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                          <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                          Resolution Timeline Trends
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                          Monthly constraint resolution trends and average resolution times
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="h-64 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                          {/* Interactive Line Chart */}
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              Resolution Timeline Trends
                            </h4>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Last 6 months</div>
                          </div>

                          {/* Line Chart Visualization */}
                          <div className="relative h-32 mb-4">
                            <svg className="w-full h-32" viewBox="0 0 200 120">
                              {/* Grid lines */}
                              <line x1="0" y1="30" x2="200" y2="30" stroke="#E5E7EB" strokeWidth="1" />
                              <line x1="0" y1="60" x2="200" y2="60" stroke="#E5E7EB" strokeWidth="1" />
                              <line x1="0" y1="90" x2="200" y2="90" stroke="#E5E7EB" strokeWidth="1" />

                              {/* Data line */}
                              <path
                                d="M 20 90 L 50 80 L 80 70 L 110 60 L 140 50 L 170 40"
                                fill="none"
                                stroke="#10B981"
                                strokeWidth="2"
                                className="transition-all duration-300 hover:stroke-green-600"
                              />

                              {/* Data points */}
                              <circle cx="20" cy="90" r="3" fill="#10B981" className="hover:r-4 transition-all" />
                              <circle cx="50" cy="80" r="3" fill="#10B981" className="hover:r-4 transition-all" />
                              <circle cx="80" cy="70" r="3" fill="#10B981" className="hover:r-4 transition-all" />
                              <circle cx="110" cy="60" r="3" fill="#10B981" className="hover:r-4 transition-all" />
                              <circle cx="140" cy="50" r="3" fill="#10B981" className="hover:r-4 transition-all" />
                              <circle cx="170" cy="40" r="3" fill="#10B981" className="hover:r-4 transition-all" />

                              {/* Area fill */}
                              <path
                                d="M 20 90 L 50 80 L 80 70 L 110 60 L 140 50 L 170 40 L 170 120 L 20 120 Z"
                                fill="url(#greenGradient)"
                                opacity="0.2"
                              />

                              <defs>
                                <linearGradient id="greenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.1" />
                                </linearGradient>
                              </defs>
                            </svg>

                            {/* Y-axis labels */}
                            <div className="absolute left-0 top-0 h-32 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400">
                              <span>25</span>
                              <span>20</span>
                              <span>15</span>
                              <span>10</span>
                            </div>

                            {/* X-axis labels */}
                            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                              <span>Jan</span>
                              <span>Feb</span>
                              <span>Mar</span>
                              <span>Apr</span>
                              <span>May</span>
                              <span>Jun</span>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-lg font-bold text-green-600 dark:text-green-400">3.2</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Avg Days</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-green-600 dark:text-green-400">+12%</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Improvement</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-green-600 dark:text-green-400">87.5%</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Success Rate</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Constraint Category Performance - Bar Chart */}
                    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                          <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          Category Performance
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                          Constraint resolution performance by category
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="h-64 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                          {/* Interactive Bar Chart */}
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              Category Performance
                            </h4>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Resolution Rate %</div>
                          </div>

                          {/* Bar Chart Visualization */}
                          <div className="space-y-3">
                            {/* Permits */}
                            <div className="flex items-center space-x-3">
                              <div className="w-16 text-xs text-gray-600 dark:text-gray-400">Permits</div>
                              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                                <div className="bg-green-500 h-4 rounded-full" style={{ width: "85%" }}></div>
                              </div>
                              <div className="w-8 text-xs text-gray-600 dark:text-gray-400">85%</div>
                            </div>

                            {/* AHJ */}
                            <div className="flex items-center space-x-3">
                              <div className="w-16 text-xs text-gray-600 dark:text-gray-400">AHJ</div>
                              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                                <div className="bg-amber-500 h-4 rounded-full" style={{ width: "60%" }}></div>
                              </div>
                              <div className="w-8 text-xs text-gray-600 dark:text-gray-400">60%</div>
                            </div>

                            {/* Design Dev */}
                            <div className="flex items-center space-x-3">
                              <div className="w-16 text-xs text-gray-600 dark:text-gray-400">Design</div>
                              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                                <div className="bg-blue-500 h-4 rounded-full" style={{ width: "75%" }}></div>
                              </div>
                              <div className="w-8 text-xs text-gray-600 dark:text-gray-400">75%</div>
                            </div>

                            {/* Internal Coord */}
                            <div className="flex items-center space-x-3">
                              <div className="w-16 text-xs text-gray-600 dark:text-gray-400">Internal</div>
                              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                                <div className="bg-purple-500 h-4 rounded-full" style={{ width: "90%" }}></div>
                              </div>
                              <div className="w-8 text-xs text-gray-600 dark:text-gray-400">90%</div>
                            </div>

                            {/* Construction */}
                            <div className="flex items-center space-x-3">
                              <div className="w-16 text-xs text-gray-600 dark:text-gray-400">Construction</div>
                              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                                <div className="bg-orange-500 h-4 rounded-full" style={{ width: "45%" }}></div>
                              </div>
                              <div className="w-8 text-xs text-gray-600 dark:text-gray-400">45%</div>
                            </div>

                            {/* Change Tracking */}
                            <div className="flex items-center space-x-3">
                              <div className="w-16 text-xs text-gray-600 dark:text-gray-400">Changes</div>
                              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                                <div className="bg-red-500 h-4 rounded-full" style={{ width: "70%" }}></div>
                              </div>
                              <div className="w-8 text-xs text-gray-600 dark:text-gray-400">70%</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Constraint Priority Heatmap - Heatmap Chart */}
                    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                          <Activity className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          Priority Heatmap
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                          Constraint priority distribution by category and status
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="h-64 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                          {/* Interactive Heatmap */}
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Priority Heatmap</h4>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Priority Level</div>
                          </div>

                          {/* Heatmap Visualization */}
                          <div className="grid grid-cols-4 gap-2 mb-4">
                            <div className="text-xs text-gray-600 dark:text-gray-400 text-center">Category</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 text-center">Critical</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 text-center">High</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 text-center">Medium</div>

                            {/* Permits Row */}
                            <div className="text-xs text-gray-600 dark:text-gray-400">Permits</div>
                            <div className="h-6 bg-red-500 rounded flex items-center justify-center">
                              <span className="text-xs text-white font-bold">1</span>
                            </div>
                            <div className="h-6 bg-orange-400 rounded flex items-center justify-center">
                              <span className="text-xs text-white font-bold">1</span>
                            </div>
                            <div className="h-6 bg-yellow-400 rounded flex items-center justify-center">
                              <span className="text-xs text-white font-bold">0</span>
                            </div>

                            {/* AHJ Row */}
                            <div className="text-xs text-gray-600 dark:text-gray-400">AHJ</div>
                            <div className="h-6 bg-red-500 rounded flex items-center justify-center">
                              <span className="text-xs text-white font-bold">1</span>
                            </div>
                            <div className="h-6 bg-orange-400 rounded flex items-center justify-center">
                              <span className="text-xs text-white font-bold">1</span>
                            </div>
                            <div className="h-6 bg-yellow-400 rounded flex items-center justify-center">
                              <span className="text-xs text-white font-bold">0</span>
                            </div>

                            {/* Design Row */}
                            <div className="text-xs text-gray-600 dark:text-gray-400">Design</div>
                            <div className="h-6 bg-gray-300 rounded flex items-center justify-center">
                              <span className="text-xs text-gray-600 font-bold">0</span>
                            </div>
                            <div className="h-6 bg-orange-400 rounded flex items-center justify-center">
                              <span className="text-xs text-white font-bold">1</span>
                            </div>
                            <div className="h-6 bg-yellow-400 rounded flex items-center justify-center">
                              <span className="text-xs text-white font-bold">1</span>
                            </div>

                            {/* Internal Row */}
                            <div className="text-xs text-gray-600 dark:text-gray-400">Internal</div>
                            <div className="h-6 bg-gray-300 rounded flex items-center justify-center">
                              <span className="text-xs text-gray-600 font-bold">0</span>
                            </div>
                            <div className="h-6 bg-orange-400 rounded flex items-center justify-center">
                              <span className="text-xs text-white font-bold">1</span>
                            </div>
                            <div className="h-6 bg-yellow-400 rounded flex items-center justify-center">
                              <span className="text-xs text-white font-bold">1</span>
                            </div>

                            {/* Construction Row */}
                            <div className="text-xs text-gray-600 dark:text-gray-400">Construction</div>
                            <div className="h-6 bg-red-500 rounded flex items-center justify-center">
                              <span className="text-xs text-white font-bold">1</span>
                            </div>
                            <div className="h-6 bg-orange-400 rounded flex items-center justify-center">
                              <span className="text-xs text-white font-bold">0</span>
                            </div>
                            <div className="h-6 bg-yellow-400 rounded flex items-center justify-center">
                              <span className="text-xs text-white font-bold">1</span>
                            </div>

                            {/* Changes Row */}
                            <div className="text-xs text-gray-600 dark:text-gray-400">Changes</div>
                            <div className="h-6 bg-gray-300 rounded flex items-center justify-center">
                              <span className="text-xs text-gray-600 font-bold">0</span>
                            </div>
                            <div className="h-6 bg-orange-400 rounded flex items-center justify-center">
                              <span className="text-xs text-white font-bold">1</span>
                            </div>
                            <div className="h-6 bg-yellow-400 rounded flex items-center justify-center">
                              <span className="text-xs text-white font-bold">1</span>
                            </div>
                          </div>

                          {/* Legend */}
                          <div className="flex justify-center space-x-4 text-xs">
                            <div className="flex items-center space-x-1">
                              <div className="w-3 h-3 bg-red-500 rounded"></div>
                              <span className="text-gray-600 dark:text-gray-400">Critical</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <div className="w-3 h-3 bg-orange-400 rounded"></div>
                              <span className="text-gray-600 dark:text-gray-400">High</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                              <span className="text-gray-600 dark:text-gray-400">Medium</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="log" className="w-full max-w-full overflow-hidden">
                <div className="space-y-8 w-full max-w-full">
                  {/* Open Constraints Parent Container */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xl font-bold text-foreground">Open Constraints</h2>
                      <div className="flex gap-2">
                        <Button onClick={() => setShowNewConstraintModal(true)} variant="default">
                          New Constraint
                        </Button>
                        <Button onClick={() => setShowNewCategoryModal(true)} variant="secondary">
                          New Category
                        </Button>
                      </div>
                    </div>
                    {/* Open Constraints - Permits Section */}
                    <div className="space-y-4">
                      <ProtectedGrid
                        columnDefs={[
                          createReadOnlyColumn("no", "No.", { width: 80 }),
                          createReadOnlyColumn("dateIdentified", "Date Identified", { width: 120 }),
                          createReadOnlyColumn("description", "Description", { width: 300 }),
                          createReadOnlyColumn("priority", "Priority", { width: 100 }),
                          createReadOnlyColumn("status", "Status", { width: 100 }),
                          createReadOnlyColumn("assigned", "Assigned To", { width: 120 }),
                          createReadOnlyColumn("dueDate", "Due Date", { width: 120 }),
                          createReadOnlyColumn("daysElapsed", "Days Elapsed", { width: 100 }),
                          createReadOnlyColumn("impact", "Impact", { width: 200 }),
                          createReadOnlyColumn("resolution", "Resolution", { width: 200 }),
                        ]}
                        rowData={[
                          {
                            id: "1",
                            no: "P-001",
                            dateIdentified: "2024-01-20",
                            description: "Permit approval delayed for window installation",
                            priority: "Medium",
                            status: "Open",
                            assigned: "David Lee",
                            dueDate: "2024-02-05",
                            daysElapsed: 5,
                            impact: "Facade work on hold",
                            resolution: "",
                          },
                          {
                            id: "2",
                            no: "P-002",
                            dateIdentified: "2024-01-18",
                            description: "Electrical permit requires additional documentation",
                            priority: "High",
                            status: "Open",
                            assigned: "Mike Johnson",
                            dueDate: "2024-01-28",
                            daysElapsed: 7,
                            impact: "Electrical rough-in delayed",
                            resolution: "",
                          },
                        ]}
                        config={{
                          showToolbar: true,
                          showStatusBar: false,
                          allowCellEditing: true,
                          allowExport: true,
                          rowHeight: 48,
                          stickyColumnsCount: 3,
                        }}
                        height={`${48 + 2 * 48 + 8}px`}
                        title="Permits Constraints"
                      />
                    </div>

                    {/* Open Constraints - AHJ Section */}
                    <div className="space-y-4">
                      <ProtectedGrid
                        columnDefs={[
                          createReadOnlyColumn("no", "No.", { width: 80 }),
                          createReadOnlyColumn("dateIdentified", "Date Identified", { width: 120 }),
                          createReadOnlyColumn("description", "Description", { width: 300 }),
                          createReadOnlyColumn("priority", "Priority", { width: 100 }),
                          createReadOnlyColumn("status", "Status", { width: 100 }),
                          createReadOnlyColumn("assigned", "Assigned To", { width: 120 }),
                          createReadOnlyColumn("dueDate", "Due Date", { width: 120 }),
                          createReadOnlyColumn("daysElapsed", "Days Elapsed", { width: 100 }),
                          createReadOnlyColumn("impact", "Impact", { width: 200 }),
                          createReadOnlyColumn("resolution", "Resolution", { width: 200 }),
                        ]}
                        rowData={[
                          {
                            id: "1",
                            no: "AHJ-001",
                            dateIdentified: "2024-01-15",
                            description: "Fire marshal requires additional sprinkler coverage",
                            priority: "Critical",
                            status: "Open",
                            assigned: "Sarah Wilson",
                            dueDate: "2024-01-25",
                            daysElapsed: 10,
                            impact: "Fire safety system redesign required",
                            resolution: "",
                          },
                          {
                            id: "2",
                            no: "AHJ-002",
                            dateIdentified: "2024-01-22",
                            description: "Building inspector requests structural calculations review",
                            priority: "High",
                            status: "Open",
                            assigned: "Tom Wilson",
                            dueDate: "2024-02-01",
                            daysElapsed: 3,
                            impact: "Foundation work on hold",
                            resolution: "",
                          },
                        ]}
                        config={{
                          showToolbar: true,
                          showStatusBar: false,
                          allowCellEditing: true,
                          allowExport: true,
                          rowHeight: 48,
                          stickyColumnsCount: 3,
                        }}
                        height={`${48 + 2 * 48 + 8}px`}
                        title="AHJ Constraints"
                      />
                    </div>

                    {/* Open Constraints - Design Development Section */}
                    <div className="space-y-4">
                      <ProtectedGrid
                        columnDefs={[
                          createReadOnlyColumn("no", "No.", { width: 80 }),
                          createReadOnlyColumn("dateIdentified", "Date Identified", { width: 120 }),
                          createReadOnlyColumn("description", "Description", { width: 300 }),
                          createReadOnlyColumn("priority", "Priority", { width: 100 }),
                          createReadOnlyColumn("status", "Status", { width: 100 }),
                          createReadOnlyColumn("assigned", "Assigned To", { width: 120 }),
                          createReadOnlyColumn("dueDate", "Due Date", { width: 120 }),
                          createReadOnlyColumn("daysElapsed", "Days Elapsed", { width: 100 }),
                          createReadOnlyColumn("impact", "Impact", { width: 200 }),
                          createReadOnlyColumn("resolution", "Resolution", { width: 200 }),
                        ]}
                        rowData={[
                          {
                            id: "1",
                            no: "DD-001",
                            dateIdentified: "2024-01-16",
                            description: "HVAC ductwork conflicts with sprinkler system",
                            priority: "High",
                            status: "In Progress",
                            assigned: "Mike Johnson",
                            dueDate: "2024-01-26",
                            daysElapsed: 9,
                            impact: "Requires coordination meeting",
                            resolution: "Design revision in progress",
                          },
                          {
                            id: "2",
                            no: "DD-002",
                            dateIdentified: "2024-01-19",
                            description: "Window details need architectural review",
                            priority: "Medium",
                            status: "Open",
                            assigned: "Lisa Chen",
                            dueDate: "2024-01-29",
                            daysElapsed: 6,
                            impact: "Facade detailing delayed",
                            resolution: "",
                          },
                        ]}
                        config={{
                          showToolbar: true,
                          showStatusBar: false,
                          allowCellEditing: true,
                          allowExport: true,
                          rowHeight: 48,
                          stickyColumnsCount: 3,
                        }}
                        height={`${48 + 2 * 48 + 8}px`}
                        title="Design Development Constraints"
                      />
                    </div>

                    {/* Open Constraints - Internal Coordination Section */}
                    <div className="space-y-4">
                      <ProtectedGrid
                        columnDefs={[
                          createReadOnlyColumn("no", "No.", { width: 80 }),
                          createReadOnlyColumn("dateIdentified", "Date Identified", { width: 120 }),
                          createReadOnlyColumn("description", "Description", { width: 300 }),
                          createReadOnlyColumn("priority", "Priority", { width: 100 }),
                          createReadOnlyColumn("status", "Status", { width: 100 }),
                          createReadOnlyColumn("assigned", "Assigned To", { width: 120 }),
                          createReadOnlyColumn("dueDate", "Due Date", { width: 120 }),
                          createReadOnlyColumn("daysElapsed", "Days Elapsed", { width: 100 }),
                          createReadOnlyColumn("impact", "Impact", { width: 200 }),
                          createReadOnlyColumn("resolution", "Resolution", { width: 200 }),
                        ]}
                        rowData={[
                          {
                            id: "1",
                            no: "IC-001",
                            dateIdentified: "2024-01-17",
                            description: "Electrical rough-in delayed due to structural modifications",
                            priority: "High",
                            status: "Open",
                            assigned: "John Smith",
                            dueDate: "2024-01-27",
                            daysElapsed: 8,
                            impact: "Schedule delay of 3 days",
                            resolution: "",
                          },
                          {
                            id: "2",
                            no: "IC-002",
                            dateIdentified: "2024-01-21",
                            description: "Plumbing coordination with mechanical systems",
                            priority: "Medium",
                            status: "In Progress",
                            assigned: "David Lee",
                            dueDate: "2024-01-31",
                            daysElapsed: 4,
                            impact: "Minor coordination delay",
                            resolution: "Coordination meeting scheduled",
                          },
                        ]}
                        config={{
                          showToolbar: true,
                          showStatusBar: false,
                          allowCellEditing: true,
                          allowExport: true,
                          rowHeight: 48,
                          stickyColumnsCount: 3,
                        }}
                        height={`${48 + 2 * 48 + 8}px`}
                        title="Internal Coordination Constraints"
                      />
                    </div>

                    {/* Open Constraints - Construction Progress Section */}
                    <div className="space-y-4">
                      <ProtectedGrid
                        columnDefs={[
                          createReadOnlyColumn("no", "No.", { width: 80 }),
                          createReadOnlyColumn("dateIdentified", "Date Identified", { width: 120 }),
                          createReadOnlyColumn("description", "Description", { width: 300 }),
                          createReadOnlyColumn("priority", "Priority", { width: 100 }),
                          createReadOnlyColumn("status", "Status", { width: 100 }),
                          createReadOnlyColumn("assigned", "Assigned To", { width: 120 }),
                          createReadOnlyColumn("dueDate", "Due Date", { width: 120 }),
                          createReadOnlyColumn("daysElapsed", "Days Elapsed", { width: 100 }),
                          createReadOnlyColumn("impact", "Impact", { width: 200 }),
                          createReadOnlyColumn("resolution", "Resolution", { width: 200 }),
                        ]}
                        rowData={[
                          {
                            id: "1",
                            no: "CP-001",
                            dateIdentified: "2024-01-18",
                            description: "Concrete strength test results below specification",
                            priority: "Critical",
                            status: "Open",
                            assigned: "Sarah Wilson",
                            dueDate: "2024-01-28",
                            daysElapsed: 7,
                            impact: "Potential structural rework",
                            resolution: "",
                          },
                          {
                            id: "2",
                            no: "CP-002",
                            dateIdentified: "2024-01-20",
                            description: "Weather delay affecting foundation work",
                            priority: "Medium",
                            status: "Open",
                            assigned: "Tom Wilson",
                            dueDate: "2024-01-30",
                            daysElapsed: 5,
                            impact: "Foundation schedule extended",
                            resolution: "",
                          },
                        ]}
                        config={{
                          showToolbar: true,
                          showStatusBar: false,
                          allowCellEditing: true,
                          allowExport: true,
                          rowHeight: 48,
                          stickyColumnsCount: 3,
                        }}
                        height={`${48 + 2 * 48 + 8}px`}
                        title="Construction Progress Constraints"
                      />
                    </div>

                    {/* Open Constraints - Change Tracking Section */}
                    <div className="space-y-4">
                      <ProtectedGrid
                        columnDefs={[
                          createReadOnlyColumn("no", "No.", { width: 80 }),
                          createReadOnlyColumn("dateIdentified", "Date Identified", { width: 120 }),
                          createReadOnlyColumn("description", "Description", { width: 300 }),
                          createReadOnlyColumn("priority", "Priority", { width: 100 }),
                          createReadOnlyColumn("status", "Status", { width: 100 }),
                          createReadOnlyColumn("assigned", "Assigned To", { width: 120 }),
                          createReadOnlyColumn("dueDate", "Due Date", { width: 120 }),
                          createReadOnlyColumn("daysElapsed", "Days Elapsed", { width: 100 }),
                          createReadOnlyColumn("impact", "Impact", { width: 200 }),
                          createReadOnlyColumn("resolution", "Resolution", { width: 200 }),
                        ]}
                        rowData={[
                          {
                            id: "1",
                            no: "CT-001",
                            dateIdentified: "2024-01-19",
                            description: "Owner requested additional electrical outlets",
                            priority: "Medium",
                            status: "Open",
                            assigned: "Mike Johnson",
                            dueDate: "2024-01-29",
                            daysElapsed: 6,
                            impact: "Electrical scope increase",
                            resolution: "",
                          },
                          {
                            id: "2",
                            no: "CT-002",
                            dateIdentified: "2024-01-21",
                            description: "Architectural finish changes to lobby",
                            priority: "High",
                            status: "In Progress",
                            assigned: "Lisa Chen",
                            dueDate: "2024-02-02",
                            daysElapsed: 4,
                            impact: "Lobby construction delayed",
                            resolution: "Design review in progress",
                          },
                        ]}
                        config={{
                          showToolbar: true,
                          showStatusBar: false,
                          allowCellEditing: true,
                          allowExport: true,
                          rowHeight: 48,
                          stickyColumnsCount: 3,
                        }}
                        height={`${48 + 2 * 48 + 8}px`}
                        title="Change Tracking Constraints"
                      />
                    </div>
                  </div>

                  {/* Closed Constraints - Closed this Week Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Closed Constraints - Closed this Week</h3>
                    <ProtectedGrid
                      columnDefs={[
                        createReadOnlyColumn("no", "No.", { width: 80 }),
                        createReadOnlyColumn("dateIdentified", "Date Identified", { width: 120 }),
                        createReadOnlyColumn("description", "Description", { width: 300 }),
                        createReadOnlyColumn("priority", "Priority", { width: 100 }),
                        createReadOnlyColumn("status", "Status", { width: 100 }),
                        createReadOnlyColumn("assigned", "Assigned To", { width: 120 }),
                        createReadOnlyColumn("resolvedDate", "Resolved Date", { width: 120 }),
                        createReadOnlyColumn("daysToResolve", "Days to Resolve", { width: 120 }),
                        createReadOnlyColumn("impact", "Impact", { width: 200 }),
                        createReadOnlyColumn("resolution", "Resolution", { width: 200 }),
                      ]}
                      rowData={[
                        {
                          id: "1",
                          no: "CW-001",
                          dateIdentified: "2024-01-15",
                          description: "Material delivery delayed due to supplier issues",
                          priority: "Medium",
                          status: "Resolved",
                          assigned: "Lisa Chen",
                          resolvedDate: "2024-01-22",
                          daysToResolve: 7,
                          impact: "Minor schedule adjustment",
                          resolution: "Alternative supplier secured",
                        },
                        {
                          id: "2",
                          no: "CW-002",
                          dateIdentified: "2024-01-16",
                          description: "Foundation waterproofing specification clarification",
                          priority: "Medium",
                          status: "Resolved",
                          assigned: "Tom Wilson",
                          resolvedDate: "2024-01-23",
                          daysToResolve: 7,
                          impact: "No schedule impact",
                          resolution: "Specification updated and approved",
                        },
                      ]}
                      config={{
                        showToolbar: true,
                        showStatusBar: false,
                        allowCellEditing: false,
                        allowExport: true,
                        rowHeight: 48,
                        stickyColumnsCount: 3,
                      }}
                      height={`${48 + 2 * 48 + 8}px`}
                      title="Closed this Week"
                    />
                  </div>

                  {/* Closed Constraints - Closed Previously Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Closed Constraints - Closed Previously</h3>
                    <ProtectedGrid
                      columnDefs={[
                        createReadOnlyColumn("no", "No.", { width: 80 }),
                        createReadOnlyColumn("dateIdentified", "Date Identified", { width: 120 }),
                        createReadOnlyColumn("description", "Description", { width: 300 }),
                        createReadOnlyColumn("priority", "Priority", { width: 100 }),
                        createReadOnlyColumn("status", "Status", { width: 100 }),
                        createReadOnlyColumn("assigned", "Assigned To", { width: 120 }),
                        createReadOnlyColumn("resolvedDate", "Resolved Date", { width: 120 }),
                        createReadOnlyColumn("daysToResolve", "Days to Resolve", { width: 120 }),
                        createReadOnlyColumn("impact", "Impact", { width: 200 }),
                        createReadOnlyColumn("resolution", "Resolution", { width: 200 }),
                      ]}
                      rowData={[
                        {
                          id: "1",
                          no: "CP-001",
                          dateIdentified: "2024-01-08",
                          description: "Site access coordination with neighboring property",
                          priority: "High",
                          status: "Resolved",
                          assigned: "John Smith",
                          resolvedDate: "2024-01-15",
                          daysToResolve: 7,
                          impact: "Site access secured",
                          resolution: "Access agreement signed",
                        },
                        {
                          id: "2",
                          no: "CP-002",
                          dateIdentified: "2024-01-10",
                          description: "Utility connection permit approval",
                          priority: "Medium",
                          status: "Resolved",
                          assigned: "David Lee",
                          resolvedDate: "2024-01-17",
                          daysToResolve: 7,
                          impact: "Utility work can proceed",
                          resolution: "Permit approved and issued",
                        },
                        {
                          id: "3",
                          no: "CP-003",
                          dateIdentified: "2024-01-12",
                          description: "Environmental assessment requirements",
                          priority: "Medium",
                          status: "Resolved",
                          assigned: "Sarah Wilson",
                          resolvedDate: "2024-01-19",
                          daysToResolve: 7,
                          impact: "Environmental clearance obtained",
                          resolution: "Assessment completed and approved",
                        },
                      ]}
                      config={{
                        showToolbar: true,
                        showStatusBar: false,
                        allowCellEditing: false,
                        allowExport: true,
                        rowHeight: 48,
                        stickyColumnsCount: 3,
                      }}
                      height={`${48 + 3 * 48 + 8}px`}
                      title="Closed Previously"
                    />
                  </div>
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
        <div className="space-y-6 w-full min-w-0 max-w-full overflow-hidden">
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
          <div className="space-y-4 w-full max-w-80% overflow-hidden">
            <Tabs value={permitSubTab} onValueChange={setPermitSubTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="permits">Permits</TabsTrigger>
                <TabsTrigger value="inspections">Inspections</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="w-full max-w-full overflow-hidden">
                <div className="space-y-6 w-full max-w-full">
                  {/* KPI Dashboard Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Permits KPI */}
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Permits</p>
                            <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">42</p>
                            <p className="text-xs text-blue-600 dark:text-blue-400">+3 this month</p>
                          </div>
                          <div className="h-12 w-12 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center">
                            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Approved Permits KPI */}
                    <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-green-600 dark:text-green-400">Approved</p>
                            <p className="text-3xl font-bold text-green-900 dark:text-green-100">39</p>
                            <p className="text-xs text-green-600 dark:text-green-400">92.9% approval rate</p>
                          </div>
                          <div className="h-12 w-12 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Pending Permits KPI */}
                    <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-700">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Pending</p>
                            <p className="text-3xl font-bold text-amber-900 dark:text-amber-100">
                              {fieldData.pendingPermits}
                            </p>
                            <p className="text-xs text-amber-600 dark:text-amber-400">Avg 12 days to approval</p>
                          </div>
                          <div className="h-12 w-12 bg-amber-100 dark:bg-amber-800 rounded-lg flex items-center justify-center">
                            <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Compliance Score KPI */}
                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Compliance</p>
                            <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">96.2%</p>
                            <p className="text-xs text-purple-600 dark:text-purple-400">+2.1% vs last month</p>
                          </div>
                          <div className="h-12 w-12 bg-purple-100 dark:bg-purple-800 rounded-lg flex items-center justify-center">
                            <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Power BI Embedded Analytics Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Permit Status Distribution - Pie Chart */}
                    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                          <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          Permit Status Distribution
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                          Current breakdown of permit statuses across all projects
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="h-64 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                          {/* Interactive Pie Chart */}
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              Permit Status Distribution
                            </h4>
                            <div className="flex space-x-1">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                            </div>
                          </div>

                          {/* Pie Chart Visualization */}
                          <div className="relative w-32 h-32 mx-auto mb-4">
                            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 32 32">
                              {/* Approved - 62% */}
                              <circle
                                cx="16"
                                cy="16"
                                r="14"
                                fill="none"
                                stroke="#10B981"
                                strokeWidth="3"
                                strokeDasharray={`${2 * Math.PI * 14 * 0.62} ${2 * Math.PI * 14}`}
                                className="transition-all duration-300 hover:stroke-green-600"
                              />
                              {/* Pending - 24% */}
                              <circle
                                cx="16"
                                cy="16"
                                r="14"
                                fill="none"
                                stroke="#F59E0B"
                                strokeWidth="3"
                                strokeDasharray={`${2 * Math.PI * 14 * 0.24} ${2 * Math.PI * 14}`}
                                strokeDashoffset={`-${2 * Math.PI * 14 * 0.62}`}
                                className="transition-all duration-300 hover:stroke-amber-600"
                              />
                              {/* Rejected - 10% */}
                              <circle
                                cx="16"
                                cy="16"
                                r="14"
                                fill="none"
                                stroke="#EF4444"
                                strokeWidth="3"
                                strokeDasharray={`${2 * Math.PI * 14 * 0.1} ${2 * Math.PI * 14}`}
                                strokeDashoffset={`-${2 * Math.PI * 14 * 0.86}`}
                                className="transition-all duration-300 hover:stroke-red-600"
                              />
                              {/* Expired - 4% */}
                              <circle
                                cx="16"
                                cy="16"
                                r="14"
                                fill="none"
                                stroke="#6B7280"
                                strokeWidth="3"
                                strokeDasharray={`${2 * Math.PI * 14 * 0.04} ${2 * Math.PI * 14}`}
                                strokeDashoffset={`-${2 * Math.PI * 14 * 0.96}`}
                                className="transition-all duration-300 hover:stroke-gray-600"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">42</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
                              </div>
                            </div>
                          </div>

                          {/* Legend */}
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span className="text-gray-600 dark:text-gray-400">Approved (26)</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                              <span className="text-gray-600 dark:text-gray-400">Pending (10)</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              <span className="text-gray-600 dark:text-gray-400">Rejected (4)</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                              <span className="text-gray-600 dark:text-gray-400">Expired (2)</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Permit Approval Timeline - Line Chart */}
                    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                          <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                          Approval Timeline Trends
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                          Monthly permit approval trends and processing times
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="h-64 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                          {/* Interactive Line Chart */}
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              Approval Timeline Trends
                            </h4>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Last 6 months</div>
                          </div>

                          {/* Line Chart Visualization */}
                          <div className="relative h-32 mb-4">
                            <svg className="w-full h-32" viewBox="0 0 200 120">
                              {/* Grid lines */}
                              <line x1="0" y1="30" x2="200" y2="30" stroke="#E5E7EB" strokeWidth="1" />
                              <line x1="0" y1="60" x2="200" y2="60" stroke="#E5E7EB" strokeWidth="1" />
                              <line x1="0" y1="90" x2="200" y2="90" stroke="#E5E7EB" strokeWidth="1" />

                              {/* Data line */}
                              <path
                                d="M 20 80 L 50 70 L 80 60 L 110 50 L 140 40 L 170 30"
                                fill="none"
                                stroke="#10B981"
                                strokeWidth="2"
                                className="transition-all duration-300 hover:stroke-green-600"
                              />

                              {/* Data points */}
                              <circle cx="20" cy="80" r="3" fill="#10B981" className="hover:r-4 transition-all" />
                              <circle cx="50" cy="70" r="3" fill="#10B981" className="hover:r-4 transition-all" />
                              <circle cx="80" cy="60" r="3" fill="#10B981" className="hover:r-4 transition-all" />
                              <circle cx="110" cy="50" r="3" fill="#10B981" className="hover:r-4 transition-all" />
                              <circle cx="140" cy="40" r="3" fill="#10B981" className="hover:r-4 transition-all" />
                              <circle cx="170" cy="30" r="3" fill="#10B981" className="hover:r-4 transition-all" />

                              {/* Area fill */}
                              <path
                                d="M 20 80 L 50 70 L 80 60 L 110 50 L 140 40 L 170 30 L 170 120 L 20 120 Z"
                                fill="url(#greenGradient)"
                                opacity="0.2"
                              />

                              <defs>
                                <linearGradient id="greenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.1" />
                                </linearGradient>
                              </defs>
                            </svg>

                            {/* Y-axis labels */}
                            <div className="absolute left-0 top-0 h-32 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400">
                              <span>30</span>
                              <span>20</span>
                              <span>10</span>
                              <span>0</span>
                            </div>

                            {/* X-axis labels */}
                            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                              <span>Jan</span>
                              <span>Feb</span>
                              <span>Mar</span>
                              <span>Apr</span>
                              <span>May</span>
                              <span>Jun</span>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-lg font-bold text-green-600 dark:text-green-400">12.3</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Avg Days</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-green-600 dark:text-green-400">+15%</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Improvement</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-green-600 dark:text-green-400">92%</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Success Rate</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Inspection Compliance Radar - Radar Chart */}
                    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                          <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          Inspection Compliance Radar
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                          Multi-dimensional compliance analysis across inspection categories
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="h-64 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                          {/* Interactive Radar Chart */}
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              Inspection Compliance Radar
                            </h4>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Multi-dimensional</div>
                          </div>

                          {/* Radar Chart Visualization */}
                          <div className="relative w-32 h-32 mx-auto mb-4">
                            <svg className="w-32 h-32" viewBox="0 0 100 100">
                              {/* Radar grid lines */}
                              <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="1" />
                              <circle cx="50" cy="50" r="30" fill="none" stroke="#E5E7EB" strokeWidth="1" />
                              <circle cx="50" cy="50" r="20" fill="none" stroke="#E5E7EB" strokeWidth="1" />
                              <circle cx="50" cy="50" r="10" fill="none" stroke="#E5E7EB" strokeWidth="1" />

                              {/* Axis lines */}
                              <line x1="50" y1="10" x2="50" y2="90" stroke="#E5E7EB" strokeWidth="1" />
                              <line x1="10" y1="50" x2="90" y2="50" stroke="#E5E7EB" strokeWidth="1" />
                              <line x1="20" y1="20" x2="80" y2="80" stroke="#E5E7EB" strokeWidth="1" />
                              <line x1="80" y1="20" x2="20" y2="80" stroke="#E5E7EB" strokeWidth="1" />

                              {/* Data polygon */}
                              <polygon
                                points="50,15 65,25 75,50 65,75 50,85 35,75 25,50 35,25"
                                fill="rgba(139, 92, 246, 0.2)"
                                stroke="#8B5CF6"
                                strokeWidth="2"
                                className="transition-all duration-300 hover:fill-purple-300 hover:stroke-purple-600"
                              />

                              {/* Data points */}
                              <circle cx="50" cy="15" r="2" fill="#8B5CF6" className="hover:r-3 transition-all" />
                              <circle cx="65" cy="25" r="2" fill="#8B5CF6" className="hover:r-3 transition-all" />
                              <circle cx="75" cy="50" r="2" fill="#8B5CF6" className="hover:r-3 transition-all" />
                              <circle cx="65" cy="75" r="2" fill="#8B5CF6" className="hover:r-3 transition-all" />
                              <circle cx="50" cy="85" r="2" fill="#8B5CF6" className="hover:r-3 transition-all" />
                              <circle cx="35" cy="75" r="2" fill="#8B5CF6" className="hover:r-3 transition-all" />
                              <circle cx="25" cy="50" r="2" fill="#8B5CF6" className="hover:r-3 transition-all" />
                              <circle cx="35" cy="25" r="2" fill="#8B5CF6" className="hover:r-3 transition-all" />
                            </svg>
                          </div>

                          {/* Legend */}
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                              <span className="text-gray-600 dark:text-gray-400">Safety (95%)</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                              <span className="text-gray-600 dark:text-gray-400">Quality (88%)</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                              <span className="text-gray-600 dark:text-gray-400">Structural (92%)</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                              <span className="text-gray-600 dark:text-gray-400">Electrical (85%)</span>
                            </div>
                          </div>

                          {/* Overall Score */}
                          <div className="text-center mt-2">
                            <div className="text-lg font-bold text-purple-600 dark:text-purple-400">90%</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Overall Compliance</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Authority Performance - Bar Chart */}
                    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                          <Building2 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                          Authority Performance
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                          Approval rates and processing times by authority
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="h-64 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                          {/* Interactive Bar Chart */}
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              Authority Performance
                            </h4>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Approval rates</div>
                          </div>

                          {/* Bar Chart Visualization */}
                          <div className="relative h-32 mb-4">
                            <svg className="w-full h-32" viewBox="0 0 200 120">
                              {/* Grid lines */}
                              <line x1="0" y1="30" x2="200" y2="30" stroke="#E5E7EB" strokeWidth="1" />
                              <line x1="0" y1="60" x2="200" y2="60" stroke="#E5E7EB" strokeWidth="1" />
                              <line x1="0" y1="90" x2="200" y2="90" stroke="#E5E7EB" strokeWidth="1" />

                              {/* Bars */}
                              <rect
                                x="20"
                                y="40"
                                width="25"
                                height="50"
                                fill="#F97316"
                                className="hover:fill-orange-600 transition-all"
                              />
                              <rect
                                x="55"
                                y="25"
                                width="25"
                                height="65"
                                fill="#FB923C"
                                className="hover:fill-orange-500 transition-all"
                              />
                              <rect
                                x="90"
                                y="50"
                                width="25"
                                height="40"
                                fill="#FDBA74"
                                className="hover:fill-orange-400 transition-all"
                              />
                              <rect
                                x="125"
                                y="35"
                                width="25"
                                height="55"
                                fill="#FED7AA"
                                className="hover:fill-orange-300 transition-all"
                              />
                              <rect
                                x="160"
                                y="45"
                                width="25"
                                height="45"
                                fill="#FFEDD5"
                                className="hover:fill-orange-200 transition-all"
                              />

                              {/* Value labels */}
                              <text x="32" y="35" fontSize="8" fill="#6B7280" textAnchor="middle">
                                95%
                              </text>
                              <text x="67" y="20" fontSize="8" fill="#6B7280" textAnchor="middle">
                                88%
                              </text>
                              <text x="102" y="45" fontSize="8" fill="#6B7280" textAnchor="middle">
                                82%
                              </text>
                              <text x="137" y="30" fontSize="8" fill="#6B7280" textAnchor="middle">
                                91%
                              </text>
                              <text x="172" y="40" fontSize="8" fill="#6B7280" textAnchor="middle">
                                85%
                              </text>
                            </svg>

                            {/* X-axis labels */}
                            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                              <span>City</span>
                              <span>County</span>
                              <span>State</span>
                              <span>Federal</span>
                              <span>Other</span>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-lg font-bold text-orange-600 dark:text-orange-400">88.2%</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Avg Rate</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-orange-600 dark:text-orange-400">12.3d</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Avg Time</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-orange-600 dark:text-orange-400">+8%</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">vs Last Year</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Additional Analytics Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Permit Type Distribution - Donut Chart */}
                    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                          <Package className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          Permit Type Distribution
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                          Breakdown by permit categories and types
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="h-48 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                          {/* Interactive Donut Chart */}
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              Permit Type Distribution
                            </h4>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Categories</div>
                          </div>

                          {/* Donut Chart Visualization */}
                          <div className="relative w-24 h-24 mx-auto mb-3">
                            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 24 24">
                              {/* Building - 35% */}
                              <circle
                                cx="12"
                                cy="12"
                                r="10"
                                fill="none"
                                stroke="#6366F1"
                                strokeWidth="2"
                                strokeDasharray={`${2 * Math.PI * 10 * 0.35} ${2 * Math.PI * 10}`}
                                className="transition-all duration-300 hover:stroke-indigo-600"
                              />
                              {/* Electrical - 25% */}
                              <circle
                                cx="12"
                                cy="12"
                                r="10"
                                fill="none"
                                stroke="#8B5CF6"
                                strokeWidth="2"
                                strokeDasharray={`${2 * Math.PI * 10 * 0.25} ${2 * Math.PI * 10}`}
                                strokeDashoffset={`-${2 * Math.PI * 10 * 0.35}`}
                                className="transition-all duration-300 hover:stroke-purple-600"
                              />
                              {/* Plumbing - 20% */}
                              <circle
                                cx="12"
                                cy="12"
                                r="10"
                                fill="none"
                                stroke="#EC4899"
                                strokeWidth="2"
                                strokeDasharray={`${2 * Math.PI * 10 * 0.2} ${2 * Math.PI * 10}`}
                                strokeDashoffset={`-${2 * Math.PI * 10 * 0.6}`}
                                className="transition-all duration-300 hover:stroke-pink-600"
                              />
                              {/* Mechanical - 15% */}
                              <circle
                                cx="12"
                                cy="12"
                                r="10"
                                fill="none"
                                stroke="#F59E0B"
                                strokeWidth="2"
                                strokeDasharray={`${2 * Math.PI * 10 * 0.15} ${2 * Math.PI * 10}`}
                                strokeDashoffset={`-${2 * Math.PI * 10 * 0.8}`}
                                className="transition-all duration-300 hover:stroke-amber-600"
                              />
                              {/* Other - 5% */}
                              <circle
                                cx="12"
                                cy="12"
                                r="10"
                                fill="none"
                                stroke="#6B7280"
                                strokeWidth="2"
                                strokeDasharray={`${2 * Math.PI * 10 * 0.05} ${2 * Math.PI * 10}`}
                                strokeDashoffset={`-${2 * Math.PI * 10 * 0.95}`}
                                className="transition-all duration-300 hover:stroke-gray-600"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">42</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
                              </div>
                            </div>
                          </div>

                          {/* Legend */}
                          <div className="grid grid-cols-1 gap-1 text-xs">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                <span className="text-gray-600 dark:text-gray-400">Building</span>
                              </div>
                              <span className="text-gray-500 dark:text-gray-400">35%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span className="text-gray-600 dark:text-gray-400">Electrical</span>
                              </div>
                              <span className="text-gray-500 dark:text-gray-400">25%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                                <span className="text-gray-600 dark:text-gray-400">Plumbing</span>
                              </div>
                              <span className="text-gray-500 dark:text-gray-400">20%</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Compliance Heatmap - Heatmap Chart */}
                    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                          <Activity className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                          Compliance Heatmap
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                          Risk assessment and compliance intensity by area
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="h-48 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                          {/* Interactive Heatmap */}
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Compliance Heatmap</h4>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Risk intensity</div>
                          </div>

                          {/* Heatmap Visualization */}
                          <div className="grid grid-cols-6 gap-1 mb-3">
                            {/* High risk areas */}
                            <div
                              className="w-4 h-4 bg-red-500 rounded-sm hover:bg-red-600 transition-all cursor-pointer"
                              title="Foundation - High Risk"
                            ></div>
                            <div
                              className="w-4 h-4 bg-red-400 rounded-sm hover:bg-red-500 transition-all cursor-pointer"
                              title="Electrical - High Risk"
                            ></div>
                            <div
                              className="w-4 h-4 bg-orange-500 rounded-sm hover:bg-orange-600 transition-all cursor-pointer"
                              title="Plumbing - Medium Risk"
                            ></div>
                            <div
                              className="w-4 h-4 bg-yellow-400 rounded-sm hover:bg-yellow-500 transition-all cursor-pointer"
                              title="HVAC - Low Risk"
                            ></div>
                            <div
                              className="w-4 h-4 bg-green-400 rounded-sm hover:bg-green-500 transition-all cursor-pointer"
                              title="Roofing - Low Risk"
                            ></div>
                            <div
                              className="w-4 h-4 bg-green-500 rounded-sm hover:bg-green-600 transition-all cursor-pointer"
                              title="Interior - Low Risk"
                            ></div>

                            <div
                              className="w-4 h-4 bg-red-400 rounded-sm hover:bg-red-500 transition-all cursor-pointer"
                              title="Structural - High Risk"
                            ></div>
                            <div
                              className="w-4 h-4 bg-orange-400 rounded-sm hover:bg-orange-500 transition-all cursor-pointer"
                              title="Fire Safety - Medium Risk"
                            ></div>
                            <div
                              className="w-4 h-4 bg-yellow-300 rounded-sm hover:bg-yellow-400 transition-all cursor-pointer"
                              title="Accessibility - Low Risk"
                            ></div>
                            <div
                              className="w-4 h-4 bg-green-300 rounded-sm hover:bg-green-400 transition-all cursor-pointer"
                              title="Landscaping - Low Risk"
                            ></div>
                            <div
                              className="w-4 h-4 bg-green-400 rounded-sm hover:bg-green-500 transition-all cursor-pointer"
                              title="Parking - Low Risk"
                            ></div>
                            <div
                              className="w-4 h-4 bg-green-500 rounded-sm hover:bg-green-600 transition-all cursor-pointer"
                              title="Signage - Low Risk"
                            ></div>

                            <div
                              className="w-4 h-4 bg-orange-500 rounded-sm hover:bg-orange-600 transition-all cursor-pointer"
                              title="Mechanical - Medium Risk"
                            ></div>
                            <div
                              className="w-4 h-4 bg-yellow-400 rounded-sm hover:bg-yellow-500 transition-all cursor-pointer"
                              title="Security - Low Risk"
                            ></div>
                            <div
                              className="w-4 h-4 bg-green-400 rounded-sm hover:bg-green-500 transition-all cursor-pointer"
                              title="Lighting - Low Risk"
                            ></div>
                            <div
                              className="w-4 h-4 bg-green-500 rounded-sm hover:bg-green-600 transition-all cursor-pointer"
                              title="Drainage - Low Risk"
                            ></div>
                            <div
                              className="w-4 h-4 bg-green-400 rounded-sm hover:bg-green-500 transition-all cursor-pointer"
                              title="Utilities - Low Risk"
                            ></div>
                            <div
                              className="w-4 h-4 bg-green-300 rounded-sm hover:bg-green-400 transition-all cursor-pointer"
                              title="Finishing - Low Risk"
                            ></div>
                          </div>

                          {/* Risk Legend */}
                          <div className="flex justify-between text-xs">
                            <div className="flex items-center space-x-1">
                              <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                              <span className="text-gray-600 dark:text-gray-400">High</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
                              <span className="text-gray-600 dark:text-gray-400">Medium</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <div className="w-3 h-3 bg-yellow-400 rounded-sm"></div>
                              <span className="text-gray-600 dark:text-gray-400">Low</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                              <span className="text-gray-600 dark:text-gray-400">Safe</span>
                            </div>
                          </div>

                          {/* Risk Summary */}
                          <div className="text-center mt-2">
                            <div className="text-sm font-bold text-teal-600 dark:text-teal-400">3 High Risk Areas</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Require attention</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Cost Analysis - Area Chart */}
                    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                          <Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                          Cost Analysis
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                          Permit costs and fee trends over time
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="h-48 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                          {/* Interactive Area Chart */}
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Cost Analysis</h4>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Fee trends</div>
                          </div>

                          {/* Area Chart Visualization */}
                          <div className="relative h-24 mb-3">
                            <svg className="w-full h-24" viewBox="0 0 200 80">
                              {/* Grid lines */}
                              <line x1="0" y1="20" x2="200" y2="20" stroke="#E5E7EB" strokeWidth="1" />
                              <line x1="0" y1="40" x2="200" y2="40" stroke="#E5E7EB" strokeWidth="1" />
                              <line x1="0" y1="60" x2="200" y2="60" stroke="#E5E7EB" strokeWidth="1" />

                              {/* Area fill */}
                              <path
                                d="M 0 60 L 30 50 L 60 45 L 90 35 L 120 30 L 150 25 L 180 20 L 200 15 L 200 80 L 0 80 Z"
                                fill="url(#yellowGradient)"
                                opacity="0.3"
                              />

                              {/* Data line */}
                              <path
                                d="M 0 60 L 30 50 L 60 45 L 90 35 L 120 30 L 150 25 L 180 20 L 200 15"
                                fill="none"
                                stroke="#EAB308"
                                strokeWidth="2"
                                className="transition-all duration-300 hover:stroke-yellow-600"
                              />

                              {/* Data points */}
                              <circle cx="0" cy="60" r="2" fill="#EAB308" className="hover:r-3 transition-all" />
                              <circle cx="30" cy="50" r="2" fill="#EAB308" className="hover:r-3 transition-all" />
                              <circle cx="60" cy="45" r="2" fill="#EAB308" className="hover:r-3 transition-all" />
                              <circle cx="90" cy="35" r="2" fill="#EAB308" className="hover:r-3 transition-all" />
                              <circle cx="120" cy="30" r="2" fill="#EAB308" className="hover:r-3 transition-all" />
                              <circle cx="150" cy="25" r="2" fill="#EAB308" className="hover:r-3 transition-all" />
                              <circle cx="180" cy="20" r="2" fill="#EAB308" className="hover:r-3 transition-all" />
                              <circle cx="200" cy="15" r="2" fill="#EAB308" className="hover:r-3 transition-all" />

                              <defs>
                                <linearGradient id="yellowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                  <stop offset="0%" stopColor="#EAB308" stopOpacity="0.4" />
                                  <stop offset="100%" stopColor="#EAB308" stopOpacity="0.1" />
                                </linearGradient>
                              </defs>
                            </svg>

                            {/* Y-axis labels */}
                            <div className="absolute left-0 top-0 h-24 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400">
                              <span>$50K</span>
                              <span>$30K</span>
                              <span>$10K</span>
                              <span>$0</span>
                            </div>

                            {/* X-axis labels */}
                            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                              <span>Q1</span>
                              <span>Q2</span>
                              <span>Q3</span>
                              <span>Q4</span>
                            </div>
                          </div>

                          {/* Cost Summary */}
                          <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                              <div className="text-sm font-bold text-yellow-600 dark:text-yellow-400">$127K</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Total Cost</div>
                            </div>
                            <div>
                              <div className="text-sm font-bold text-yellow-600 dark:text-yellow-400">-12%</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">vs Last Year</div>
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

                  {/* ProtectedGrid for Permits */}
                  <PermitsProtectedGrid
                    permits={permits}
                    onEdit={handleEditPermit}
                    onView={handleEditPermit}
                    userRole={userRole}
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

                  {/* ProtectedGrid for Inspections */}
                  <InspectionsProtectedGrid
                    permits={permits}
                    onEdit={handleEditPermit}
                    onView={handleEditPermit}
                    userRole={userRole}
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
                  {/* KPI Dashboard Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Daily Reports KPI */}
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Daily Reports</p>
                            <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">145</p>
                            <p className="text-xs text-blue-600 dark:text-blue-400">+28 this week</p>
                          </div>
                          <div className="h-12 w-12 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center">
                            <ClipboardList className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Safety Audits KPI */}
                    <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-red-600 dark:text-red-400">Safety Audits</p>
                            <p className="text-3xl font-bold text-red-900 dark:text-red-100">12</p>
                            <p className="text-xs text-red-600 dark:text-red-400">95.2% compliance rate</p>
                          </div>
                          <div className="h-12 w-12 bg-red-100 dark:bg-red-800 rounded-lg flex items-center justify-center">
                            <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quality Checks KPI */}
                    <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-green-600 dark:text-green-400">Quality Checks</p>
                            <p className="text-3xl font-bold text-green-900 dark:text-green-100">89</p>
                            <p className="text-xs text-green-600 dark:text-green-400">98.7% pass rate</p>
                          </div>
                          <div className="h-12 w-12 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Manpower Efficiency KPI */}
                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Efficiency</p>
                            <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">87.5%</p>
                            <p className="text-xs text-purple-600 dark:text-purple-400">+2.3% vs last week</p>
                          </div>
                          <div className="h-12 w-12 bg-purple-100 dark:bg-purple-800 rounded-lg flex items-center justify-center">
                            <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Interactive Analytics Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Daily Reports Activity - Line Chart */}
                    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                          <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          Daily Reports Activity
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                          Weekly submission trends and compliance rates
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="h-64 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                          {/* Interactive Line Chart */}
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Weekly Submissions</h4>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Last 4 weeks</div>
                          </div>

                          {/* Line Chart Visualization */}
                          <div className="relative h-32 mb-4">
                            <svg className="w-full h-32" viewBox="0 0 200 120">
                              {/* Grid lines */}
                              <line x1="0" y1="30" x2="200" y2="30" stroke="#E5E7EB" strokeWidth="1" />
                              <line x1="0" y1="60" x2="200" y2="60" stroke="#E5E7EB" strokeWidth="1" />
                              <line x1="0" y1="90" x2="200" y2="90" stroke="#E5E7EB" strokeWidth="1" />

                              {/* Data line */}
                              <path
                                d="M 20 70 L 60 60 L 100 50 L 140 40 L 180 35"
                                fill="none"
                                stroke="#3B82F6"
                                strokeWidth="2"
                                className="transition-all duration-300 hover:stroke-blue-600"
                              />

                              {/* Data points */}
                              <circle cx="20" cy="70" r="3" fill="#3B82F6" className="hover:r-4 transition-all" />
                              <circle cx="60" cy="60" r="3" fill="#3B82F6" className="hover:r-4 transition-all" />
                              <circle cx="100" cy="50" r="3" fill="#3B82F6" className="hover:r-4 transition-all" />
                              <circle cx="140" cy="40" r="3" fill="#3B82F6" className="hover:r-4 transition-all" />
                              <circle cx="180" cy="35" r="3" fill="#3B82F6" className="hover:r-4 transition-all" />

                              {/* Area fill */}
                              <path
                                d="M 20 70 L 60 60 L 100 50 L 140 40 L 180 35 L 180 120 L 20 120 Z"
                                fill="url(#blueGradient)"
                                opacity="0.2"
                              />

                              <defs>
                                <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
                                </linearGradient>
                              </defs>
                            </svg>

                            {/* Y-axis labels */}
                            <div className="absolute left-0 top-0 h-32 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400">
                              <span>100%</span>
                              <span>75%</span>
                              <span>50%</span>
                              <span>25%</span>
                            </div>

                            {/* X-axis labels */}
                            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                              <span>Week 1</span>
                              <span>Week 2</span>
                              <span>Week 3</span>
                              <span>Week 4</span>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">98.2%</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Compliance</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">28</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">This Week</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">+5%</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Improvement</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Safety Compliance - Radar Chart */}
                    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                          <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
                          Safety Compliance Radar
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                          Multi-dimensional safety compliance analysis
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="h-64 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                          {/* Interactive Radar Chart */}
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Safety Dimensions</h4>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Compliance scores</div>
                          </div>

                          {/* Radar Chart Visualization */}
                          <div className="relative w-32 h-32 mx-auto mb-4">
                            <svg className="w-32 h-32" viewBox="0 0 100 100">
                              {/* Radar grid lines */}
                              <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="1" />
                              <circle cx="50" cy="50" r="30" fill="none" stroke="#E5E7EB" strokeWidth="1" />
                              <circle cx="50" cy="50" r="20" fill="none" stroke="#E5E7EB" strokeWidth="1" />
                              <circle cx="50" cy="50" r="10" fill="none" stroke="#E5E7EB" strokeWidth="1" />

                              {/* Axis lines */}
                              <line x1="50" y1="10" x2="50" y2="90" stroke="#E5E7EB" strokeWidth="1" />
                              <line x1="10" y1="50" x2="90" y2="50" stroke="#E5E7EB" strokeWidth="1" />
                              <line x1="20" y1="20" x2="80" y2="80" stroke="#E5E7EB" strokeWidth="1" />
                              <line x1="80" y1="20" x2="20" y2="80" stroke="#E5E7EB" strokeWidth="1" />

                              {/* Data polygon */}
                              <polygon
                                points="50,20 70,30 75,50 70,70 50,80 30,70 25,50 30,30"
                                fill="rgba(239, 68, 68, 0.2)"
                                stroke="#EF4444"
                                strokeWidth="2"
                                className="transition-all duration-300 hover:fill-red-300 hover:stroke-red-600"
                              />

                              {/* Data points */}
                              <circle cx="50" cy="20" r="2" fill="#EF4444" className="hover:r-3 transition-all" />
                              <circle cx="70" cy="30" r="2" fill="#EF4444" className="hover:r-3 transition-all" />
                              <circle cx="75" cy="50" r="2" fill="#EF4444" className="hover:r-3 transition-all" />
                              <circle cx="70" cy="70" r="2" fill="#EF4444" className="hover:r-3 transition-all" />
                              <circle cx="50" cy="80" r="2" fill="#EF4444" className="hover:r-3 transition-all" />
                              <circle cx="30" cy="70" r="2" fill="#EF4444" className="hover:r-3 transition-all" />
                              <circle cx="25" cy="50" r="2" fill="#EF4444" className="hover:r-3 transition-all" />
                              <circle cx="30" cy="30" r="2" fill="#EF4444" className="hover:r-3 transition-all" />
                            </svg>
                          </div>

                          {/* Legend */}
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              <span className="text-gray-600 dark:text-gray-400">PPE (95%)</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              <span className="text-gray-600 dark:text-gray-400">Training (92%)</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              <span className="text-gray-600 dark:text-gray-400">Equipment (88%)</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              <span className="text-gray-600 dark:text-gray-400">Procedures (90%)</span>
                            </div>
                          </div>

                          {/* Overall Score */}
                          <div className="text-center mt-2">
                            <div className="text-lg font-bold text-red-600 dark:text-red-400">91.3%</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Overall Safety Score</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Additional Analytics Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Quality Control - Bar Chart */}
                    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                          Quality Control Metrics
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                          Quality inspection results by category
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="h-48 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                          {/* Interactive Bar Chart */}
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Pass Rates</h4>
                            <div className="text-xs text-gray-500 dark:text-gray-400">By category</div>
                          </div>

                          {/* Bar Chart Visualization */}
                          <div className="relative h-24 mb-3">
                            <svg className="w-full h-24" viewBox="0 0 200 80">
                              {/* Grid lines */}
                              <line x1="0" y1="20" x2="200" y2="20" stroke="#E5E7EB" strokeWidth="1" />
                              <line x1="0" y1="40" x2="200" y2="40" stroke="#E5E7EB" strokeWidth="1" />
                              <line x1="0" y1="60" x2="200" y2="60" stroke="#E5E7EB" strokeWidth="1" />

                              {/* Bars */}
                              <rect
                                x="20"
                                y="25"
                                width="25"
                                height="35"
                                fill="#10B981"
                                className="hover:fill-green-600 transition-all"
                              />
                              <rect
                                x="55"
                                y="30"
                                width="25"
                                height="30"
                                fill="#34D399"
                                className="hover:fill-green-500 transition-all"
                              />
                              <rect
                                x="90"
                                y="35"
                                width="25"
                                height="25"
                                fill="#6EE7B7"
                                className="hover:fill-green-400 transition-all"
                              />
                              <rect
                                x="125"
                                y="20"
                                width="25"
                                height="40"
                                fill="#A7F3D0"
                                className="hover:fill-green-300 transition-all"
                              />
                              <rect
                                x="160"
                                y="40"
                                width="25"
                                height="20"
                                fill="#D1FAE5"
                                className="hover:fill-green-200 transition-all"
                              />

                              {/* Value labels */}
                              <text x="32" y="20" fontSize="8" fill="#6B7280" textAnchor="middle">
                                98%
                              </text>
                              <text x="67" y="25" fontSize="8" fill="#6B7280" textAnchor="middle">
                                95%
                              </text>
                              <text x="102" y="30" fontSize="8" fill="#6B7280" textAnchor="middle">
                                92%
                              </text>
                              <text x="137" y="15" fontSize="8" fill="#6B7280" textAnchor="middle">
                                99%
                              </text>
                              <text x="172" y="35" fontSize="8" fill="#6B7280" textAnchor="middle">
                                88%
                              </text>
                            </svg>

                            {/* X-axis labels */}
                            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                              <span>Structural</span>
                              <span>Electrical</span>
                              <span>Plumbing</span>
                              <span>HVAC</span>
                              <span>Finishing</span>
                            </div>
                          </div>

                          {/* Quality Summary */}
                          <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                              <div className="text-sm font-bold text-green-600 dark:text-green-400">98.7%</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Overall Pass Rate</div>
                            </div>
                            <div>
                              <div className="text-sm font-bold text-green-600 dark:text-green-400">89</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Total Inspections</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Manpower Efficiency - Donut Chart */}
                    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                          <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          Manpower Efficiency
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                          Workforce utilization and productivity
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="h-48 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                          {/* Interactive Donut Chart */}
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Utilization</h4>
                            <div className="text-xs text-gray-500 dark:text-gray-400">By trade</div>
                          </div>

                          {/* Donut Chart Visualization */}
                          <div className="relative w-24 h-24 mx-auto mb-3">
                            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 24 24">
                              {/* High utilization - 40% */}
                              <circle
                                cx="12"
                                cy="12"
                                r="10"
                                fill="none"
                                stroke="#8B5CF6"
                                strokeWidth="2"
                                strokeDasharray={`${2 * Math.PI * 10 * 0.4} ${2 * Math.PI * 10}`}
                                className="transition-all duration-300 hover:stroke-purple-600"
                              />
                              {/* Medium utilization - 35% */}
                              <circle
                                cx="12"
                                cy="12"
                                r="10"
                                fill="none"
                                stroke="#A78BFA"
                                strokeWidth="2"
                                strokeDasharray={`${2 * Math.PI * 10 * 0.35} ${2 * Math.PI * 10}`}
                                strokeDashoffset={`-${2 * Math.PI * 10 * 0.4}`}
                                className="transition-all duration-300 hover:stroke-purple-500"
                              />
                              {/* Low utilization - 25% */}
                              <circle
                                cx="12"
                                cy="12"
                                r="10"
                                fill="none"
                                stroke="#C4B5FD"
                                strokeWidth="2"
                                strokeDasharray={`${2 * Math.PI * 10 * 0.25} ${2 * Math.PI * 10}`}
                                strokeDashoffset={`-${2 * Math.PI * 10 * 0.75}`}
                                className="transition-all duration-300 hover:stroke-purple-400"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">87.5%</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Avg</div>
                              </div>
                            </div>
                          </div>

                          {/* Legend */}
                          <div className="grid grid-cols-1 gap-1 text-xs">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span className="text-gray-600 dark:text-gray-400">High (90%+)</span>
                              </div>
                              <span className="text-gray-500 dark:text-gray-400">40%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                <span className="text-gray-600 dark:text-gray-400">Medium (75-90%)</span>
                              </div>
                              <span className="text-gray-500 dark:text-gray-400">35%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                                <span className="text-gray-600 dark:text-gray-400">Low (75% and below)</span>
                              </div>
                              <span className="text-gray-500 dark:text-gray-400">25%</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Safety Incidents - Heatmap */}
                    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                          <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                          Safety Incidents Heatmap
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                          Incident frequency by area and severity
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="h-48 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                          {/* Interactive Heatmap */}
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Incident Frequency</h4>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Last 30 days</div>
                          </div>

                          {/* Heatmap Visualization */}
                          <div className="grid grid-cols-6 gap-1 mb-3">
                            {/* High incident areas */}
                            <div
                              className="w-4 h-4 bg-red-500 rounded-sm hover:bg-red-600 transition-all cursor-pointer"
                              title="Foundation - 3 incidents"
                            ></div>
                            <div
                              className="w-4 h-4 bg-red-400 rounded-sm hover:bg-red-500 transition-all cursor-pointer"
                              title="Electrical - 2 incidents"
                            ></div>
                            <div
                              className="w-4 h-4 bg-orange-500 rounded-sm hover:bg-orange-600 transition-all cursor-pointer"
                              title="Plumbing - 1 incident"
                            ></div>
                            <div
                              className="w-4 h-4 bg-yellow-400 rounded-sm hover:bg-yellow-500 transition-all cursor-pointer"
                              title="HVAC - 0 incidents"
                            ></div>
                            <div
                              className="w-4 h-4 bg-green-400 rounded-sm hover:bg-green-500 transition-all cursor-pointer"
                              title="Roofing - 0 incidents"
                            ></div>
                            <div
                              className="w-4 h-4 bg-green-500 rounded-sm hover:bg-green-600 transition-all cursor-pointer"
                              title="Interior - 0 incidents"
                            ></div>

                            <div
                              className="w-4 h-4 bg-red-400 rounded-sm hover:bg-red-500 transition-all cursor-pointer"
                              title="Structural - 2 incidents"
                            ></div>
                            <div
                              className="w-4 h-4 bg-orange-400 rounded-sm hover:bg-orange-500 transition-all cursor-pointer"
                              title="Fire Safety - 1 incident"
                            ></div>
                            <div
                              className="w-4 h-4 bg-yellow-300 rounded-sm hover:bg-yellow-400 transition-all cursor-pointer"
                              title="Accessibility - 0 incidents"
                            ></div>
                            <div
                              className="w-4 h-4 bg-green-300 rounded-sm hover:bg-green-400 transition-all cursor-pointer"
                              title="Landscaping - 0 incidents"
                            ></div>
                            <div
                              className="w-4 h-4 bg-green-400 rounded-sm hover:bg-green-500 transition-all cursor-pointer"
                              title="Parking - 0 incidents"
                            ></div>
                            <div
                              className="w-4 h-4 bg-green-500 rounded-sm hover:bg-green-600 transition-all cursor-pointer"
                              title="Signage - 0 incidents"
                            ></div>

                            <div
                              className="w-4 h-4 bg-orange-500 rounded-sm hover:bg-orange-600 transition-all cursor-pointer"
                              title="Mechanical - 1 incident"
                            ></div>
                            <div
                              className="w-4 h-4 bg-yellow-400 rounded-sm hover:bg-yellow-500 transition-all cursor-pointer"
                              title="Security - 0 incidents"
                            ></div>
                            <div
                              className="w-4 h-4 bg-green-400 rounded-sm hover:bg-green-500 transition-all cursor-pointer"
                              title="Lighting - 0 incidents"
                            ></div>
                            <div
                              className="w-4 h-4 bg-green-500 rounded-sm hover:bg-green-600 transition-all cursor-pointer"
                              title="Drainage - 0 incidents"
                            ></div>
                            <div
                              className="w-4 h-4 bg-green-400 rounded-sm hover:bg-green-500 transition-all cursor-pointer"
                              title="Utilities - 0 incidents"
                            ></div>
                            <div
                              className="w-4 h-4 bg-green-300 rounded-sm hover:bg-green-400 transition-all cursor-pointer"
                              title="Finishing - 0 incidents"
                            ></div>
                          </div>

                          {/* Risk Legend */}
                          <div className="flex justify-between text-xs">
                            <div className="flex items-center space-x-1">
                              <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                              <span className="text-gray-600 dark:text-gray-400">High</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
                              <span className="text-gray-600 dark:text-gray-400">Medium</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <div className="w-3 h-3 bg-yellow-400 rounded-sm"></div>
                              <span className="text-gray-600 dark:text-gray-400">Low</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                              <span className="text-gray-600 dark:text-gray-400">Safe</span>
                            </div>
                          </div>

                          {/* Incident Summary */}
                          <div className="text-center mt-2">
                            <div className="text-sm font-bold text-orange-600 dark:text-orange-400">
                              9 Total Incidents
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Last 30 days</div>
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

  const [showNewConstraintModal, setShowNewConstraintModal] = useState(false)
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false)
  const [newConstraintCategory, setNewConstraintCategory] = useState("")
  const [newConstraintFields, setNewConstraintFields] = useState({
    category: "",
    description: "",
    priority: "Medium",
    assigned: "",
    dueDate: "",
  })
  const [newCategoryName, setNewCategoryName] = useState("")
  const [categories, setCategories] = useState([
    { value: "Permits", label: "Permits" },
    { value: "AHJ", label: "AHJ" },
    { value: "Design Development", label: "Design Development" },
    { value: "Internal Coordination", label: "Internal Coordination" },
    { value: "Construction Progress", label: "Construction Progress" },
    { value: "Change Tracking", label: "Change Tracking" },
  ])

  return (
    <div
      className={`space-y-6 w-full max-w-full overflow-hidden h-full flex flex-col min-h-0 ${
        isFocusMode ? "fixed inset-0 z-[200] bg-background pt-16 p-6 overflow-y-auto" : ""
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
          <Button variant="outline" size="sm" onClick={handleFocusToggle} className="h-8 px-3 text-xs">
            {isFocusMode ? (
              <>
                <Minimize2 className="h-3 w-3 mr-1" />
                Exit Focus
              </>
            ) : (
              <>
                <Maximize2 className="h-3 w-3 mr-1" />
                Focus
              </>
            )}
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
      <div className="w-full min-w-0 max-w-full overflow-hidden flex-1 min-h-0">
        <div className="w-full min-w-0 max-w-full overflow-hidden h-full flex flex-col min-h-0">
          <div className="w-full min-w-0 max-w-full overflow-x-auto overflow-y-visible h-full">
            <div style={{ width: "100%", minWidth: 0, maxWidth: "100%", height: "100%" }}>{renderContent()}</div>
          </div>
        </div>
      </div>

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

      {/* New Constraint Modal */}
      <Dialog open={showNewConstraintModal} onOpenChange={setShowNewConstraintModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Constraint</DialogTitle>
            <DialogDescription>Create a new constraint and assign it to a category.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select
              value={newConstraintFields.category}
              onValueChange={(v) => setNewConstraintFields((f) => ({ ...f, category: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Description"
              value={newConstraintFields.description}
              onChange={(e) => setNewConstraintFields((f) => ({ ...f, description: e.target.value }))}
            />
            <Select
              value={newConstraintFields.priority}
              onValueChange={(v) => setNewConstraintFields((f) => ({ ...f, priority: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Assigned To"
              value={newConstraintFields.assigned}
              onChange={(e) => setNewConstraintFields((f) => ({ ...f, assigned: e.target.value }))}
            />
            <Input
              type="date"
              placeholder="Due Date"
              value={newConstraintFields.dueDate}
              onChange={(e) => setNewConstraintFields((f) => ({ ...f, dueDate: e.target.value }))}
            />
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                /* handle create constraint */ setShowNewConstraintModal(false)
              }}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Category Modal */}
      <Dialog open={showNewCategoryModal} onOpenChange={setShowNewCategoryModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Constraint Category</DialogTitle>
            <DialogDescription>Create a new constraint category. This will generate a new grid.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setCategories((cats) => [...cats, { value: newCategoryName, label: newCategoryName }])
                setNewCategoryName("")
                setShowNewCategoryModal(false)
                // Optionally, add logic to generate a new grid for this category
              }}
            >
              Create Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default FieldManagementContent
