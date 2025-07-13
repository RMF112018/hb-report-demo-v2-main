/**
 * QC Program Generator - HB Report Demo v3.0.0
 *
 * AI-powered generation of project-specific Quality Control Programs
 * Features:
 * - AI generation from project specs, submittals, manufacturer guidelines, building codes
 * - Comprehensive QC manual output with project-specific standards
 * - Phase milestone and major scope linking
 * - Review/approval workflow for publishing
 * - Integration with existing quality management system
 */

"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AIDataIntegrationService,
  ProjectSpecificationService,
  ApprovedSubmittalsService,
  ManufacturerGuidelinesService,
  BuildingCodeService,
  type AIDataIntegrationResult,
  type ProjectSpecificationData,
  type ApprovedSubmittalData,
  type ManufacturerGuidelineData,
  type BuildingCodeData,
} from "./QCProgramDataServices"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Bot,
  FileText,
  Settings,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Eye,
  Edit,
  Share2,
  Layers,
  Building,
  Hammer,
  Brain,
  Zap,
  Target,
  Users,
  Calendar,
  BookOpen,
  Shield,
  CheckSquare,
  Plus,
  Search,
  Filter,
  RotateCcw,
  Send,
  Archive,
  Copy,
  ExternalLink,
  Globe,
  Code,
  Database,
  Workflow,
  Star,
  Award,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react"

// Data Integration Sources
interface ProjectSpecification {
  id: string
  name: string
  section: string
  requirements: string[]
  standards: string[]
  testingRequirements: string[]
  acceptanceCriteria: string[]
  lastUpdated: string
}

interface ApprovedSubmittal {
  id: string
  productName: string
  manufacturer: string
  category: string
  specifications: string[]
  installationGuidelines: string[]
  testingProtocols: string[]
  warrantyRequirements: string[]
  approvalDate: string
}

interface ManufacturerGuideline {
  id: string
  manufacturer: string
  product: string
  installationSteps: string[]
  qualityChecks: string[]
  testingProcedures: string[]
  commonIssues: string[]
  bestPractices: string[]
}

interface BuildingCode {
  id: string
  code: string
  section: string
  requirements: string[]
  inspectionPoints: string[]
  complianceChecks: string[]
  penalties: string[]
  effectiveDate: string
}

// QC Program Structure
interface QCProgram {
  id: string
  projectId: string
  projectName: string
  programName: string
  version: string
  status: "draft" | "review" | "approved" | "published" | "archived"
  createdBy: string
  createdDate: string
  lastModified: string
  aiGenerated: boolean
  aiConfidence: number

  // Program Content
  executiveSummary: string
  scopeOfWork: string[]
  qualityObjectives: string[]
  standards: QCStandard[]
  procedures: QCProcedure[]
  checkpoints: QCCheckpoint[]
  testing: QCTesting[]
  documentation: QCDocumentation[]

  // Milestone Integration
  milestones: ProjectMilestone[]
  majorScopes: MajorScope[]

  // Review Workflow
  reviewers: Reviewer[]
  approvals: Approval[]
  publishingSettings: PublishingSettings
}

interface QCStandard {
  id: string
  category: string
  standard: string
  specification: string
  tolerance: string
  testMethod: string
  frequency: string
  responsibility: string
  documentation: string[]
}

interface QCProcedure {
  id: string
  name: string
  description: string
  steps: string[]
  tools: string[]
  materials: string[]
  safety: string[]
  qualityChecks: string[]
  documentation: string[]
  linkedMilestone?: string
}

interface QCCheckpoint {
  id: string
  name: string
  description: string
  phase: string
  milestone: string
  criteria: string[]
  testingRequired: boolean
  documentation: string[]
  responsible: string
  frequency: string
  criticalPath: boolean
}

interface QCTesting {
  id: string
  testName: string
  testType: string
  description: string
  procedure: string[]
  equipment: string[]
  acceptanceCriteria: string[]
  frequency: string
  responsibility: string
  documentation: string[]
}

interface QCDocumentation {
  id: string
  documentType: string
  name: string
  description: string
  template: string
  requirements: string[]
  retention: string
  distribution: string[]
}

interface ProjectMilestone {
  id: string
  name: string
  phase: string
  startDate: string
  endDate: string
  qcRequirements: string[]
  linkedCheckpoints: string[]
  criticalPath: boolean
}

interface MajorScope {
  id: string
  name: string
  description: string
  trade: string
  phase: string
  qcRequirements: string[]
  linkedProcedures: string[]
  testingRequired: boolean
}

interface Reviewer {
  id: string
  name: string
  role: string
  email: string
  reviewType: "technical" | "compliance" | "executive"
  status: "pending" | "in_progress" | "completed"
  comments: string
  completedDate?: string
}

interface Approval {
  id: string
  reviewerId: string
  reviewerName: string
  status: "pending" | "approved" | "rejected" | "changes_requested"
  comments: string
  date: string
}

interface PublishingSettings {
  publishToProject: boolean
  publishToTeams: string[]
  publishToTrades: string[]
  notificationSettings: {
    email: boolean
    slack: boolean
    teams: boolean
  }
  accessLevel: "project_only" | "company_wide" | "public"
}

// AI Generation Interface
interface AIGenerationRequest {
  projectId: string
  projectName: string
  projectType: string
  specifications: string[]
  submittals: string[]
  guidelines: string[]
  codes: string[]
  customRequirements: string[]
  focusAreas: string[]
  complexity: "low" | "medium" | "high"
  timeline: string
}

interface AIGenerationResponse {
  programId: string
  confidence: number
  generatedProgram: QCProgram
  recommendations: string[]
  warnings: string[]
  estimatedEffort: string
  completionTime: string
}

// Component State
interface QCProgramFilters {
  project: string
  status: string
  aiGenerated: string
  dateRange: string
  reviewer: string
}

export const QCProgramGenerator: React.FC = () => {
  // State Management
  const [qcPrograms, setQcPrograms] = useState<QCProgram[]>([])
  const [selectedProgram, setSelectedProgram] = useState<QCProgram | null>(null)
  const [filters, setFilters] = useState<QCProgramFilters>({
    project: "all",
    status: "all",
    aiGenerated: "all",
    dateRange: "all",
    reviewer: "all",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [showGenerationDialog, setShowGenerationDialog] = useState(false)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [showPublishDialog, setShowPublishDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [generationRequest, setGenerationRequest] = useState<AIGenerationRequest>({
    projectId: "",
    projectName: "",
    projectType: "",
    specifications: [],
    submittals: [],
    guidelines: [],
    codes: [],
    customRequirements: [],
    focusAreas: [],
    complexity: "medium",
    timeline: "",
  })

  // Load QC Programs Data
  useEffect(() => {
    loadQCPrograms()
  }, [])

  const loadQCPrograms = async () => {
    // Mock data for comprehensive QC programs
    const mockPrograms: QCProgram[] = [
      {
        id: "QCP-001",
        projectId: "PJ-001",
        projectName: "Downtown Office Complex",
        programName: "Comprehensive Quality Control Program",
        version: "1.2",
        status: "published",
        createdBy: "Sarah Johnson",
        createdDate: "2024-12-15",
        lastModified: "2025-01-10",
        aiGenerated: true,
        aiConfidence: 94,

        executiveSummary:
          "This comprehensive QC program ensures all construction activities meet or exceed specified quality standards for the Downtown Office Complex project. The program incorporates AI-generated procedures based on project specifications, approved submittals, manufacturer guidelines, and current building codes.",

        scopeOfWork: [
          "Structural concrete and steel work",
          "MEP systems installation and testing",
          "Envelope and waterproofing",
          "Interior finishes and specialties",
          "Fire life safety systems",
          "Elevator and escalator installation",
        ],

        qualityObjectives: [
          "Achieve 99.5% first-time pass rate on inspections",
          "Maintain zero safety incidents related to quality issues",
          "Complete all milestone deliverables on schedule",
          "Ensure 100% compliance with building codes and standards",
          "Minimize rework and change orders due to quality issues",
        ],

        standards: [
          {
            id: "STD-001",
            category: "Concrete",
            standard: "ACI 318",
            specification: "4000 PSI minimum compressive strength",
            tolerance: "±200 PSI",
            testMethod: "ASTM C39",
            frequency: "Every 50 CY",
            responsibility: "QC Manager",
            documentation: ["Test Reports", "Certificates of Compliance"],
          },
          {
            id: "STD-002",
            category: "Steel",
            standard: "AISC 360",
            specification: "Grade 50 steel minimum yield strength 50 ksi",
            tolerance: "±2 ksi",
            testMethod: "ASTM A572",
            frequency: "Per shipment",
            responsibility: "Structural Engineer",
            documentation: ["Mill Test Certificates", "Inspection Reports"],
          },
        ],

        procedures: [
          {
            id: "PROC-001",
            name: "Concrete Pour Quality Control",
            description: "Comprehensive quality control procedure for concrete pours",
            steps: [
              "Verify concrete mix design approval",
              "Check weather conditions and temperature",
              "Inspect formwork and reinforcement",
              "Sample concrete for testing",
              "Monitor pour progress and consolidation",
              "Document all activities and test results",
            ],
            tools: ["Thermometer", "Slump Cone", "Sampling Equipment"],
            materials: ["Test Cylinders", "Sampling Forms"],
            safety: ["PPE Required", "Fall Protection", "Equipment Guards"],
            qualityChecks: ["Slump Test", "Temperature Check", "Visual Inspection"],
            documentation: ["Pour Records", "Test Results", "Photos"],
            linkedMilestone: "ML-003",
          },
        ],

        checkpoints: [
          {
            id: "CP-001",
            name: "Foundation Inspection",
            description: "Critical checkpoint before concrete pour",
            phase: "Foundation",
            milestone: "ML-001",
            criteria: [
              "Excavation to proper depth and grade",
              "Reinforcement placement verified",
              "Formwork secure and aligned",
              "Utilities located and protected",
            ],
            testingRequired: true,
            documentation: ["Inspection Checklist", "Photos", "Test Results"],
            responsible: "QC Manager",
            frequency: "Each foundation element",
            criticalPath: true,
          },
        ],

        testing: [
          {
            id: "TEST-001",
            testName: "Concrete Compressive Strength",
            testType: "Destructive",
            description: "Test concrete cylinders for compressive strength",
            procedure: [
              "Cure cylinders per ASTM C31",
              "Test at 7, 28, and 56 days",
              "Document results and compare to specifications",
              "Report any non-conformances immediately",
            ],
            equipment: ["Compression Testing Machine", "Calipers"],
            acceptanceCriteria: ["Minimum 4000 PSI at 28 days"],
            frequency: "Every 50 CY or daily minimum",
            responsibility: "Testing Laboratory",
            documentation: ["Test Reports", "Certificates"],
          },
        ],

        documentation: [
          {
            id: "DOC-001",
            documentType: "Inspection Report",
            name: "Daily Quality Inspection Report",
            description: "Comprehensive daily inspection documentation",
            template: "QC-INSP-001",
            requirements: [
              "Weather conditions",
              "Work activities performed",
              "Quality issues identified",
              "Corrective actions taken",
              "Photo documentation",
            ],
            retention: "7 years",
            distribution: ["Project Manager", "QC Manager", "Client"],
          },
        ],

        milestones: [
          {
            id: "ML-001",
            name: "Foundation Complete",
            phase: "Foundation",
            startDate: "2025-02-01",
            endDate: "2025-02-28",
            qcRequirements: [
              "All concrete tests passed",
              "Foundation inspection complete",
              "Waterproofing inspection approved",
            ],
            linkedCheckpoints: ["CP-001", "CP-002"],
            criticalPath: true,
          },
        ],

        majorScopes: [
          {
            id: "MS-001",
            name: "Structural Steel Erection",
            description: "Complete structural steel frame installation",
            trade: "Ironworkers",
            phase: "Structure",
            qcRequirements: [
              "Shop drawing approval",
              "Material certifications",
              "Welding procedures qualified",
              "Erection tolerance verification",
            ],
            linkedProcedures: ["PROC-002", "PROC-003"],
            testingRequired: true,
          },
        ],

        reviewers: [
          {
            id: "REV-001",
            name: "Michael Chen",
            role: "Chief Quality Officer",
            email: "mchen@company.com",
            reviewType: "technical",
            status: "completed",
            comments: "Comprehensive program with excellent AI integration",
            completedDate: "2025-01-08",
          },
        ],

        approvals: [
          {
            id: "APP-001",
            reviewerId: "REV-001",
            reviewerName: "Michael Chen",
            status: "approved",
            comments: "Approved for publication",
            date: "2025-01-08",
          },
        ],

        publishingSettings: {
          publishToProject: true,
          publishToTeams: ["Quality", "Project Management", "Field Operations"],
          publishToTrades: ["Concrete", "Steel", "MEP"],
          notificationSettings: {
            email: true,
            slack: true,
            teams: false,
          },
          accessLevel: "project_only",
        },
      },
      {
        id: "QCP-002",
        projectId: "PJ-002",
        projectName: "Retail Shopping Center",
        programName: "Retail Construction QC Program",
        version: "1.0",
        status: "review",
        createdBy: "Jennifer Davis",
        createdDate: "2025-01-12",
        lastModified: "2025-01-14",
        aiGenerated: true,
        aiConfidence: 88,

        executiveSummary:
          "Specialized QC program for retail construction focusing on fast-track delivery, tenant improvements, and MEP coordination.",

        scopeOfWork: [
          "Retail space buildout",
          "Tenant improvement coordination",
          "MEP systems for multiple tenants",
          "Storefront and glazing systems",
          "Specialty retail fixtures",
        ],

        qualityObjectives: [
          "Meet aggressive tenant delivery schedules",
          "Ensure coordination between multiple trades",
          "Maintain quality standards despite fast-track schedule",
          "Minimize tenant disruption during construction",
        ],

        standards: [],
        procedures: [],
        checkpoints: [],
        testing: [],
        documentation: [],
        milestones: [],
        majorScopes: [],
        reviewers: [],
        approvals: [],
        publishingSettings: {
          publishToProject: true,
          publishToTeams: ["Quality", "Project Management"],
          publishToTrades: [],
          notificationSettings: {
            email: true,
            slack: false,
            teams: true,
          },
          accessLevel: "project_only",
        },
      },
    ]

    setQcPrograms(mockPrograms)
  }

  // AI Generation Process
  const handleGenerateQCProgram = async () => {
    setIsGenerating(true)
    setGenerationProgress(0)
    setShowGenerationDialog(false)

    try {
      // Step 1: Integrate project data
      setGenerationProgress(10)
      const integratedData = await AIDataIntegrationService.integrateProjectData(
        generationRequest.projectId,
        generationRequest.focusAreas
      )

      // Step 2: Analyze project specifications
      setGenerationProgress(20)
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Step 3: Process approved submittals
      setGenerationProgress(30)
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Step 4: Integrate manufacturer guidelines
      setGenerationProgress(40)
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Step 5: Check building codes and standards
      setGenerationProgress(50)
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Step 6: Generate quality procedures
      setGenerationProgress(60)
      const generatedProcedures = generateQualityProcedures(integratedData)
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Step 7: Create checkpoint schedules
      setGenerationProgress(70)
      const generatedCheckpoints = generateQualityCheckpoints(integratedData)
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Step 8: Generate testing protocols
      setGenerationProgress(80)
      const generatedTesting = generateTestingProtocols(integratedData)
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Step 9: Finalize documentation requirements
      setGenerationProgress(90)
      const generatedDocumentation = generateDocumentationRequirements(integratedData)
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Step 10: Generate comprehensive QC program
      setGenerationProgress(100)
      const newProgram: QCProgram = {
        id: `QCP-${Date.now()}`,
        projectId: generationRequest.projectId,
        projectName: generationRequest.projectName,
        programName: `${generationRequest.projectName} Quality Control Program`,
        version: "1.0",
        status: "draft",
        createdBy: "AI Assistant",
        createdDate: new Date().toISOString().split("T")[0],
        lastModified: new Date().toISOString().split("T")[0],
        aiGenerated: true,
        aiConfidence: integratedData.integrationSummary.integrationConfidence,

        executiveSummary: generateExecutiveSummary(generationRequest, integratedData),
        scopeOfWork: generateScopeOfWork(integratedData),
        qualityObjectives: generateQualityObjectives(generationRequest),
        standards: generateQualityStandards(integratedData),
        procedures: generatedProcedures,
        checkpoints: generatedCheckpoints,
        testing: generatedTesting,
        documentation: generatedDocumentation,
        milestones: generateProjectMilestones(integratedData),
        majorScopes: generateMajorScopes(integratedData),
        reviewers: generateReviewers(generationRequest),
        approvals: [],
        publishingSettings: {
          publishToProject: true,
          publishToTeams: ["Quality", "Project Management"],
          publishToTrades: [],
          notificationSettings: {
            email: true,
            slack: false,
            teams: false,
          },
          accessLevel: "project_only",
        },
      }

      setQcPrograms((prev) => [newProgram, ...prev])
      setSelectedProgram(newProgram)
      setActiveTab("program")
    } catch (error) {
      console.error("Error generating QC program:", error)
    } finally {
      setIsGenerating(false)
      setGenerationProgress(0)
    }
  }

  // AI Generation Helper Functions
  const generateExecutiveSummary = (request: AIGenerationRequest, data: AIDataIntegrationResult): string => {
    return `This comprehensive quality control program for ${request.projectName} has been generated using AI analysis of ${data.integrationSummary.totalSpecifications} project specifications, ${data.integrationSummary.totalSubmittals} approved submittals, ${data.integrationSummary.totalGuidelines} manufacturer guidelines, and ${data.integrationSummary.totalCodes} building code requirements. The program ensures consistent quality delivery through systematic quality control procedures, testing protocols, and documentation requirements tailored to the specific project requirements and industry best practices.`
  }

  const generateScopeOfWork = (data: AIDataIntegrationResult): string[] => {
    const scopeItems: string[] = []

    // Add scope items based on project specifications
    data.projectSpecifications.forEach((spec) => {
      scopeItems.push(`${spec.sectionTitle} (${spec.sectionNumber})`)
    })

    // Add scope items based on approved submittals
    const categories = [...new Set(data.approvedSubmittals.map((s) => s.category))]
    categories.forEach((category) => {
      scopeItems.push(`${category} systems quality control`)
    })

    return scopeItems
  }

  const generateQualityObjectives = (request: AIGenerationRequest): string[] => {
    const baseObjectives = [
      "Achieve 99% first-time inspection pass rate",
      "Maintain zero safety incidents related to quality issues",
      "Complete all deliverables on schedule",
      "Ensure 100% code compliance",
    ]

    // Add complexity-specific objectives
    if (request.complexity === "high") {
      baseObjectives.push("Implement enhanced quality verification procedures")
      baseObjectives.push("Conduct additional third-party quality audits")
    }

    return baseObjectives
  }

  const generateQualityStandards = (data: AIDataIntegrationResult): QCStandard[] => {
    const standards: QCStandard[] = []

    data.projectSpecifications.forEach((spec, index) => {
      spec.standards.forEach((standard, stdIndex) => {
        standards.push({
          id: `STD-${index}-${stdIndex}`,
          category: spec.division,
          standard: standard,
          specification: spec.requirements[0] || "As specified",
          tolerance: "Per standard requirements",
          testMethod: spec.testingRequirements[0] || "Visual inspection",
          frequency: "Per specification requirements",
          responsibility: "QC Manager",
          documentation: ["Test Reports", "Inspection Records"],
        })
      })
    })

    return standards
  }

  const generateQualityProcedures = (data: AIDataIntegrationResult): QCProcedure[] => {
    const procedures: QCProcedure[] = []

    data.projectSpecifications.forEach((spec, index) => {
      procedures.push({
        id: `PROC-${index + 1}`,
        name: `${spec.sectionTitle} Quality Control`,
        description: `Comprehensive quality control procedure for ${spec.sectionTitle}`,
        steps:
          spec.qualityAssuranceRequirements.length > 0
            ? spec.qualityAssuranceRequirements
            : ["Verify material compliance", "Inspect installation", "Document results"],
        tools: ["Measuring instruments", "Testing equipment", "Documentation forms"],
        materials: ["Test samples", "Inspection forms"],
        safety: ["PPE Required", "Safety protocols per OSHA"],
        qualityChecks:
          spec.acceptanceCriteria.length > 0
            ? spec.acceptanceCriteria
            : ["Visual inspection", "Dimensional verification"],
        documentation: ["Inspection reports", "Test results", "Photos"],
        linkedMilestone: `ML-${index + 1}`,
      })
    })

    return procedures
  }

  const generateQualityCheckpoints = (data: AIDataIntegrationResult): QCCheckpoint[] => {
    const checkpoints: QCCheckpoint[] = []

    data.projectSpecifications.forEach((spec, index) => {
      checkpoints.push({
        id: `CP-${index + 1}`,
        name: `${spec.sectionTitle} Inspection`,
        description: `Critical quality checkpoint for ${spec.sectionTitle}`,
        phase: spec.division.split(" - ")[1] || "Construction",
        milestone: `ML-${index + 1}`,
        criteria:
          spec.acceptanceCriteria.length > 0
            ? spec.acceptanceCriteria
            : ["Meet specification requirements", "Pass all tests"],
        testingRequired: spec.testingRequirements.length > 0,
        documentation: ["Inspection checklist", "Test results", "Photos"],
        responsible: "QC Manager",
        frequency: "Each installation phase",
        criticalPath: true,
      })
    })

    return checkpoints
  }

  const generateTestingProtocols = (data: AIDataIntegrationResult): QCTesting[] => {
    const testing: QCTesting[] = []

    data.projectSpecifications.forEach((spec, index) => {
      spec.testingRequirements.forEach((testReq, testIndex) => {
        testing.push({
          id: `TEST-${index}-${testIndex}`,
          testName: `${spec.sectionTitle} - ${testReq}`,
          testType: "Verification",
          description: `${testReq} for ${spec.sectionTitle}`,
          procedure: [
            "Prepare test setup",
            "Conduct test per standard",
            "Document results",
            "Report any non-conformances",
          ],
          equipment: ["Testing equipment", "Measuring devices"],
          acceptanceCriteria:
            spec.acceptanceCriteria.length > 0 ? spec.acceptanceCriteria : ["Meet specification requirements"],
          frequency: "Per specification",
          responsibility: "Testing Laboratory",
          documentation: ["Test reports", "Certificates"],
        })
      })
    })

    return testing
  }

  const generateDocumentationRequirements = (data: AIDataIntegrationResult): QCDocumentation[] => {
    const documentation: QCDocumentation[] = []

    data.projectSpecifications.forEach((spec, index) => {
      documentation.push({
        id: `DOC-${index + 1}`,
        documentType: "Inspection Report",
        name: `${spec.sectionTitle} Inspection Report`,
        description: `Quality inspection documentation for ${spec.sectionTitle}`,
        template: `QC-${spec.sectionNumber}`,
        requirements: [
          "Installation compliance verification",
          "Test results documentation",
          "Photo documentation",
          "Non-conformance reporting",
        ],
        retention: "7 years",
        distribution: ["Project Manager", "QC Manager", "Client"],
      })
    })

    return documentation
  }

  const generateProjectMilestones = (data: AIDataIntegrationResult): ProjectMilestone[] => {
    const milestones: ProjectMilestone[] = []

    data.projectSpecifications.forEach((spec, index) => {
      milestones.push({
        id: `ML-${index + 1}`,
        name: `${spec.sectionTitle} Complete`,
        phase: spec.division.split(" - ")[1] || "Construction",
        startDate: "2025-02-01",
        endDate: "2025-02-28",
        qcRequirements:
          spec.qualityAssuranceRequirements.length > 0
            ? spec.qualityAssuranceRequirements
            : ["Quality inspection complete", "All tests passed"],
        linkedCheckpoints: [`CP-${index + 1}`],
        criticalPath: true,
      })
    })

    return milestones
  }

  const generateMajorScopes = (data: AIDataIntegrationResult): MajorScope[] => {
    const scopes: MajorScope[] = []

    data.approvedSubmittals.forEach((submittal, index) => {
      scopes.push({
        id: `MS-${index + 1}`,
        name: submittal.productName,
        description: `Installation of ${submittal.productName}`,
        trade: submittal.category,
        phase: "Construction",
        qcRequirements:
          submittal.qualityControlRequirements.length > 0
            ? submittal.qualityControlRequirements
            : ["Material verification", "Installation inspection"],
        linkedProcedures: [`PROC-${index + 1}`],
        testingRequired: submittal.testingProtocols.length > 0,
      })
    })

    return scopes
  }

  const generateReviewers = (request: AIGenerationRequest): Reviewer[] => {
    const baseReviewers: Reviewer[] = [
      {
        id: "REV-001",
        name: "Quality Control Manager",
        role: "QC Manager",
        email: "qc.manager@company.com",
        reviewType: "technical",
        status: "pending",
        comments: "",
      },
      {
        id: "REV-002",
        name: "Project Manager",
        role: "Project Manager",
        email: "project.manager@company.com",
        reviewType: "compliance",
        status: "pending",
        comments: "",
      },
    ]

    // Add additional reviewers for high complexity projects
    if (request.complexity === "high") {
      baseReviewers.push({
        id: "REV-003",
        name: "Senior Quality Engineer",
        role: "Senior QE",
        email: "senior.qe@company.com",
        reviewType: "technical",
        status: "pending",
        comments: "",
      })
    }

    return baseReviewers
  }

  // Filter and search logic
  const filteredPrograms = useMemo(() => {
    return qcPrograms.filter((program) => {
      const matchesSearch =
        program.programName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.createdBy.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesProject = filters.project === "all" || program.projectId === filters.project
      const matchesStatus = filters.status === "all" || program.status === filters.status
      const matchesAI =
        filters.aiGenerated === "all" ||
        (filters.aiGenerated === "true" && program.aiGenerated) ||
        (filters.aiGenerated === "false" && !program.aiGenerated)

      return matchesSearch && matchesProject && matchesStatus && matchesAI
    })
  }, [qcPrograms, searchQuery, filters])

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "approved":
        return "bg-blue-100 text-blue-800"
      case "review":
        return "bg-yellow-100 text-yellow-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "archived":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle className="h-4 w-4" />
      case "approved":
        return <CheckSquare className="h-4 w-4" />
      case "review":
        return <Clock className="h-4 w-4" />
      case "draft":
        return <Edit className="h-4 w-4" />
      case "archived":
        return <Archive className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600"
    if (confidence >= 80) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="h-6 w-6 text-blue-600" />
            QC Program Generator
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered generation of project-specific Quality Control Programs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={showGenerationDialog} onOpenChange={setShowGenerationDialog}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Brain className="h-4 w-4 mr-2" />
                Generate QC Program
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Generate Project-Specific QC Program</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="projectId">Project ID</Label>
                    <Input
                      id="projectId"
                      value={generationRequest.projectId}
                      onChange={(e) =>
                        setGenerationRequest({
                          ...generationRequest,
                          projectId: e.target.value,
                        })
                      }
                      placeholder="PJ-001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="projectName">Project Name</Label>
                    <Input
                      id="projectName"
                      value={generationRequest.projectName}
                      onChange={(e) =>
                        setGenerationRequest({
                          ...generationRequest,
                          projectName: e.target.value,
                        })
                      }
                      placeholder="Enter project name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="projectType">Project Type</Label>
                  <Select
                    value={generationRequest.projectType}
                    onValueChange={(value) => setGenerationRequest({ ...generationRequest, projectType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="mixed-use">Mixed Use</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="complexity">Project Complexity</Label>
                  <Select
                    value={generationRequest.complexity}
                    onValueChange={(value: "low" | "medium" | "high") =>
                      setGenerationRequest({ ...generationRequest, complexity: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select complexity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Standard construction</SelectItem>
                      <SelectItem value="medium">Medium - Complex systems</SelectItem>
                      <SelectItem value="high">High - Specialized/Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="focusAreas">Focus Areas (comma-separated)</Label>
                  <Textarea
                    id="focusAreas"
                    placeholder="e.g., Structural, MEP, Envelope, Fire Safety, Code Compliance"
                    className="min-h-20"
                  />
                </div>

                <div>
                  <Label htmlFor="customRequirements">Custom Requirements</Label>
                  <Textarea
                    id="customRequirements"
                    placeholder="Enter any specific quality requirements or standards"
                    className="min-h-20"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowGenerationDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleGenerateQCProgram}>
                    <Zap className="h-4 w-4 mr-2" />
                    Generate Program
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Generation Progress */}
      {isGenerating && (
        <Alert>
          <Bot className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Generating QC Program...</span>
                <span className="text-sm text-muted-foreground">{Math.round(generationProgress)}%</span>
              </div>
              <Progress value={generationProgress} className="w-full" />
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">QC Programs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search programs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={filters.project} onValueChange={(value) => setFilters({ ...filters, project: value })}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                <SelectItem value="PJ-001">Downtown Office Complex</SelectItem>
                <SelectItem value="PJ-002">Retail Shopping Center</SelectItem>
                <SelectItem value="PJ-003">Medical Center Expansion</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.aiGenerated}
              onValueChange={(value) => setFilters({ ...filters, aiGenerated: value })}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="AI Generated" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">AI Generated</SelectItem>
                <SelectItem value="false">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Programs List */}
          <div className="space-y-4">
            {filteredPrograms.map((program) => (
              <Card
                key={program.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedProgram(program)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(program.status)}
                        <div>
                          <h3 className="font-semibold">{program.programName}</h3>
                          <p className="text-sm text-muted-foreground">{program.projectName}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(program.status)}>{program.status}</Badge>

                        {program.aiGenerated && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Brain className="h-3 w-3" />
                            AI Generated
                            <span className={`ml-1 ${getConfidenceColor(program.aiConfidence)}`}>
                              ({program.aiConfidence}%)
                            </span>
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        v{program.version} • {program.createdBy} • {program.lastModified}
                      </span>

                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Program Details Dialog */}
      {selectedProgram && (
        <Dialog open={!!selectedProgram} onOpenChange={() => setSelectedProgram(null)}>
          <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getStatusIcon(selectedProgram.status)}
                {selectedProgram.programName}
                <Badge className={getStatusColor(selectedProgram.status)}>{selectedProgram.status}</Badge>
                {selectedProgram.aiGenerated && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Brain className="h-3 w-3" />
                    AI Generated ({selectedProgram.aiConfidence}%)
                  </Badge>
                )}
              </DialogTitle>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="program">Program</TabsTrigger>
                <TabsTrigger value="procedures">Procedures</TabsTrigger>
                <TabsTrigger value="testing">Testing</TabsTrigger>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
                <TabsTrigger value="review">Review</TabsTrigger>
                <TabsTrigger value="publish">Publish</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Project Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <Label className="text-xs">Project</Label>
                          <p className="text-sm">{selectedProgram.projectName}</p>
                        </div>
                        <div>
                          <Label className="text-xs">Program Version</Label>
                          <p className="text-sm">v{selectedProgram.version}</p>
                        </div>
                        <div>
                          <Label className="text-xs">Created By</Label>
                          <p className="text-sm">{selectedProgram.createdBy}</p>
                        </div>
                        <div>
                          <Label className="text-xs">Last Modified</Label>
                          <p className="text-sm">{selectedProgram.lastModified}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Program Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs">Standards</span>
                          <span className="text-sm font-medium">{selectedProgram.standards.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs">Procedures</span>
                          <span className="text-sm font-medium">{selectedProgram.procedures.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs">Checkpoints</span>
                          <span className="text-sm font-medium">{selectedProgram.checkpoints.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs">Testing Protocols</span>
                          <span className="text-sm font-medium">{selectedProgram.testing.length}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Review Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs">Total Reviewers</span>
                          <span className="text-sm font-medium">{selectedProgram.reviewers.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs">Completed</span>
                          <span className="text-sm font-medium text-green-600">
                            {selectedProgram.reviewers.filter((r) => r.status === "completed").length}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs">Pending</span>
                          <span className="text-sm font-medium text-yellow-600">
                            {selectedProgram.reviewers.filter((r) => r.status === "pending").length}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs">Approved</span>
                          <span className="text-sm font-medium text-blue-600">
                            {selectedProgram.approvals.filter((a) => a.status === "approved").length}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Executive Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{selectedProgram.executiveSummary}</p>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Scope of Work</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {selectedProgram.scopeOfWork.map((item, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Quality Objectives</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {selectedProgram.qualityObjectives.map((objective, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <Target className="h-4 w-4 text-blue-500" />
                            {objective}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="program" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Quality Standards</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedProgram.standards.length > 0 ? (
                      <div className="space-y-4">
                        {selectedProgram.standards.map((standard) => (
                          <Card key={standard.id} className="p-4">
                            <div className="grid grid-cols-4 gap-4">
                              <div>
                                <Label className="text-xs">Category</Label>
                                <p className="text-sm font-medium">{standard.category}</p>
                              </div>
                              <div>
                                <Label className="text-xs">Standard</Label>
                                <p className="text-sm">{standard.standard}</p>
                              </div>
                              <div>
                                <Label className="text-xs">Specification</Label>
                                <p className="text-sm">{standard.specification}</p>
                              </div>
                              <div>
                                <Label className="text-xs">Tolerance</Label>
                                <p className="text-sm">{standard.tolerance}</p>
                              </div>
                              <div>
                                <Label className="text-xs">Test Method</Label>
                                <p className="text-sm">{standard.testMethod}</p>
                              </div>
                              <div>
                                <Label className="text-xs">Frequency</Label>
                                <p className="text-sm">{standard.frequency}</p>
                              </div>
                              <div>
                                <Label className="text-xs">Responsibility</Label>
                                <p className="text-sm">{standard.responsibility}</p>
                              </div>
                              <div>
                                <Label className="text-xs">Documentation</Label>
                                <div className="flex flex-wrap gap-1">
                                  {standard.documentation.map((doc, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {doc}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Shield className="h-12 w-12 mx-auto mb-4" />
                        <p>No quality standards defined</p>
                        <p className="text-sm">Standards will be generated based on project specifications</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="procedures" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Quality Control Procedures</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedProgram.procedures.length > 0 ? (
                      <div className="space-y-4">
                        {selectedProgram.procedures.map((procedure) => (
                          <Card key={procedure.id} className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">{procedure.name}</h4>
                                {procedure.linkedMilestone && (
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {procedure.linkedMilestone}
                                  </Badge>
                                )}
                              </div>

                              <p className="text-sm text-muted-foreground">{procedure.description}</p>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-xs">Procedure Steps</Label>
                                  <ul className="text-sm space-y-1 mt-1">
                                    {procedure.steps.map((step, index) => (
                                      <li key={index} className="flex items-start gap-2">
                                        <span className="text-xs bg-blue-100 text-blue-800 rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">
                                          {index + 1}
                                        </span>
                                        {step}
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div className="space-y-3">
                                  <div>
                                    <Label className="text-xs">Tools Required</Label>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {procedure.tools.map((tool, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                          {tool}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <Label className="text-xs">Quality Checks</Label>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {procedure.qualityChecks.map((check, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                          <CheckCircle className="h-3 w-3 mr-1" />
                                          {check}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Workflow className="h-12 w-12 mx-auto mb-4" />
                        <p>No procedures defined</p>
                        <p className="text-sm">Procedures will be generated based on project requirements</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="testing" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Testing Protocols</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedProgram.testing.length > 0 ? (
                      <div className="space-y-4">
                        {selectedProgram.testing.map((test) => (
                          <Card key={test.id} className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">{test.testName}</h4>
                                <Badge variant="outline">{test.testType}</Badge>
                              </div>

                              <p className="text-sm text-muted-foreground">{test.description}</p>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-xs">Test Procedure</Label>
                                  <ul className="text-sm space-y-1 mt-1">
                                    {test.procedure.map((step, index) => (
                                      <li key={index} className="flex items-start gap-2">
                                        <span className="text-xs bg-green-100 text-green-800 rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">
                                          {index + 1}
                                        </span>
                                        {step}
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div className="space-y-3">
                                  <div>
                                    <Label className="text-xs">Equipment Required</Label>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {test.equipment.map((item, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                          {item}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <Label className="text-xs">Acceptance Criteria</Label>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {test.acceptanceCriteria.map((criteria, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                          <CheckSquare className="h-3 w-3 mr-1" />
                                          {criteria}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <Label className="text-xs">Frequency</Label>
                                      <p className="text-sm">{test.frequency}</p>
                                    </div>
                                    <div>
                                      <Label className="text-xs">Responsibility</Label>
                                      <p className="text-sm">{test.responsibility}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Activity className="h-12 w-12 mx-auto mb-4" />
                        <p>No testing protocols defined</p>
                        <p className="text-sm">Testing protocols will be generated based on specifications</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="milestones" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Project Milestones</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedProgram.milestones.length > 0 ? (
                        <div className="space-y-3">
                          {selectedProgram.milestones.map((milestone) => (
                            <Card key={milestone.id} className="p-3">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium">{milestone.name}</h4>
                                {milestone.criticalPath && (
                                  <Badge variant="destructive" className="text-xs">
                                    Critical Path
                                  </Badge>
                                )}
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span>
                                    {milestone.startDate} - {milestone.endDate}
                                  </span>
                                </div>

                                <div>
                                  <Label className="text-xs">QC Requirements</Label>
                                  <ul className="text-sm space-y-1 mt-1">
                                    {milestone.qcRequirements.map((req, index) => (
                                      <li key={index} className="flex items-center gap-2">
                                        <CheckCircle className="h-3 w-3 text-green-500" />
                                        {req}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Calendar className="h-12 w-12 mx-auto mb-4" />
                          <p>No milestones linked</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Major Scopes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedProgram.majorScopes.length > 0 ? (
                        <div className="space-y-3">
                          {selectedProgram.majorScopes.map((scope) => (
                            <Card key={scope.id} className="p-3">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium">{scope.name}</h4>
                                <Badge variant="outline">{scope.trade}</Badge>
                              </div>

                              <p className="text-sm text-muted-foreground mb-2">{scope.description}</p>

                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                  <Layers className="h-4 w-4 text-muted-foreground" />
                                  <span>Phase: {scope.phase}</span>
                                </div>

                                <div>
                                  <Label className="text-xs">QC Requirements</Label>
                                  <ul className="text-sm space-y-1 mt-1">
                                    {scope.qcRequirements.map((req, index) => (
                                      <li key={index} className="flex items-center gap-2">
                                        <CheckSquare className="h-3 w-3 text-blue-500" />
                                        {req}
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {scope.testingRequired && (
                                  <Badge variant="outline" className="text-xs">
                                    <Activity className="h-3 w-3 mr-1" />
                                    Testing Required
                                  </Badge>
                                )}
                              </div>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Layers className="h-12 w-12 mx-auto mb-4" />
                          <p>No major scopes defined</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="review" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Review & Approval Workflow</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <Card className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-4 w-4 text-yellow-500" />
                            <Label className="text-sm">Pending Review</Label>
                          </div>
                          <p className="text-2xl font-bold">
                            {selectedProgram.reviewers.filter((r) => r.status === "pending").length}
                          </p>
                        </Card>

                        <Card className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <Label className="text-sm">Completed</Label>
                          </div>
                          <p className="text-2xl font-bold text-green-600">
                            {selectedProgram.reviewers.filter((r) => r.status === "completed").length}
                          </p>
                        </Card>

                        <Card className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckSquare className="h-4 w-4 text-blue-500" />
                            <Label className="text-sm">Approved</Label>
                          </div>
                          <p className="text-2xl font-bold text-blue-600">
                            {selectedProgram.approvals.filter((a) => a.status === "approved").length}
                          </p>
                        </Card>
                      </div>

                      <Separator />

                      <div>
                        <Label className="text-sm font-medium mb-2 block">Reviewers</Label>
                        <div className="space-y-3">
                          {selectedProgram.reviewers.map((reviewer) => (
                            <Card key={reviewer.id} className="p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Users className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <p className="font-medium">{reviewer.name}</p>
                                    <p className="text-sm text-muted-foreground">{reviewer.role}</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {reviewer.reviewType}
                                  </Badge>
                                  <Badge
                                    className={
                                      reviewer.status === "completed"
                                        ? "bg-green-100 text-green-800"
                                        : reviewer.status === "in_progress"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-gray-100 text-gray-800"
                                    }
                                  >
                                    {reviewer.status}
                                  </Badge>
                                </div>
                              </div>

                              {reviewer.comments && (
                                <div className="mt-2 p-2 bg-gray-50 rounded text-sm">{reviewer.comments}</div>
                              )}
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="publish" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Publishing Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="publishToProject" checked={selectedProgram.publishingSettings.publishToProject} />
                        <Label htmlFor="publishToProject" className="text-sm">
                          Publish to Project
                        </Label>
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-2 block">Teams</Label>
                        <div className="flex flex-wrap gap-2">
                          {selectedProgram.publishingSettings.publishToTeams.map((team, index) => (
                            <Badge key={index} variant="secondary">
                              {team}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-2 block">Notification Settings</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="emailNotifications"
                              checked={selectedProgram.publishingSettings.notificationSettings.email}
                            />
                            <Label htmlFor="emailNotifications" className="text-sm">
                              Email Notifications
                            </Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="slackNotifications"
                              checked={selectedProgram.publishingSettings.notificationSettings.slack}
                            />
                            <Label htmlFor="slackNotifications" className="text-sm">
                              Slack Notifications
                            </Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="teamsNotifications"
                              checked={selectedProgram.publishingSettings.notificationSettings.teams}
                            />
                            <Label htmlFor="teamsNotifications" className="text-sm">
                              Microsoft Teams
                            </Label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-2 block">Access Level</Label>
                        <Select value={selectedProgram.publishingSettings.accessLevel}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="project_only">Project Only</SelectItem>
                            <SelectItem value="company_wide">Company Wide</SelectItem>
                            <SelectItem value="public">Public</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button>
                          <Send className="h-4 w-4 mr-2" />
                          Publish Program
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
