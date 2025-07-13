/**
 * QC Milestone Linker - HB Report Demo v3.0.0
 *
 * Component for linking QC programs to project milestones and major scopes
 * Features:
 * - Visual milestone timeline with QC integration points
 * - Phase-based QC requirement mapping
 * - Major scope QC procedure linking
 * - Critical path integration
 * - Progress tracking and milestone completion
 */

"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Calendar,
  MapPin,
  CheckCircle,
  Clock,
  AlertTriangle,
  Link,
  Target,
  Layers,
  Workflow,
  BarChart3,
  TrendingUp,
  Eye,
  Edit,
  Plus,
  ArrowRight,
  Flag,
  Hammer,
  Shield,
  FileText,
  Users,
  Settings,
  ChevronRight,
  ChevronDown,
  ExternalLink,
} from "lucide-react"

// Milestone and Phase Interfaces
interface ProjectPhase {
  id: string
  name: string
  startDate: string
  endDate: string
  progress: number
  status: "not_started" | "in_progress" | "completed" | "delayed"
  qcRequirements: string[]
  linkedMilestones: string[]
  criticalPath: boolean
}

interface ProjectMilestone {
  id: string
  name: string
  phase: string
  startDate: string
  endDate: string
  progress: number
  status: "not_started" | "in_progress" | "completed" | "delayed"
  qcRequirements: string[]
  linkedCheckpoints: string[]
  linkedProcedures: string[]
  linkedTesting: string[]
  dependencies: string[]
  criticalPath: boolean
  responsible: string
  stakeholders: string[]
}

interface QCMilestoneLink {
  id: string
  milestoneId: string
  qcProgramId: string
  qcComponentType: "checkpoint" | "procedure" | "testing" | "documentation"
  qcComponentId: string
  linkType: "required" | "optional" | "conditional"
  triggerCondition?: string
  completionCriteria: string[]
  status: "active" | "completed" | "pending" | "blocked"
  lastUpdated: string
}

interface MajorScopeQCLink {
  id: string
  scopeId: string
  scopeName: string
  trade: string
  phase: string
  qcProcedures: string[]
  qcCheckpoints: string[]
  qcTesting: string[]
  linkedMilestones: string[]
  progress: number
  status: "not_started" | "in_progress" | "completed" | "issues"
  responsible: string
  estimatedDuration: number
  actualDuration?: number
}

interface QCMilestoneLinkerProps {
  projectId: string
  qcProgramId: string
  onMilestoneLink: (link: QCMilestoneLink) => void
  onScopeLink: (link: MajorScopeQCLink) => void
}

export const QCMilestoneLinker: React.FC<QCMilestoneLinkerProps> = ({
  projectId,
  qcProgramId,
  onMilestoneLink,
  onScopeLink,
}) => {
  // State Management
  const [projectPhases, setProjectPhases] = useState<ProjectPhase[]>([])
  const [projectMilestones, setProjectMilestones] = useState<ProjectMilestone[]>([])
  const [qcMilestoneLinks, setQcMilestoneLinks] = useState<QCMilestoneLink[]>([])
  const [majorScopeLinks, setMajorScopeLinks] = useState<MajorScopeQCLink[]>([])
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null)
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"timeline" | "phases" | "scopes" | "links">("timeline")
  const [showLinkingDialog, setShowLinkingDialog] = useState(false)

  // Load project milestone data
  useEffect(() => {
    loadProjectMilestones()
    loadQCMilestoneLinks()
    loadMajorScopeLinks()
  }, [projectId, qcProgramId])

  const loadProjectMilestones = async () => {
    // Mock project phases data
    const mockPhases: ProjectPhase[] = [
      {
        id: "PHASE-001",
        name: "Pre-Construction",
        startDate: "2025-01-15",
        endDate: "2025-02-28",
        progress: 75,
        status: "in_progress",
        qcRequirements: [
          "Site survey verification",
          "Permit compliance review",
          "Submittal approval tracking",
          "Safety plan approval",
        ],
        linkedMilestones: ["MS-001", "MS-002"],
        criticalPath: true,
      },
      {
        id: "PHASE-002",
        name: "Foundation",
        startDate: "2025-03-01",
        endDate: "2025-04-15",
        progress: 0,
        status: "not_started",
        qcRequirements: ["Excavation inspection", "Concrete testing", "Rebar inspection", "Waterproofing verification"],
        linkedMilestones: ["MS-003", "MS-004"],
        criticalPath: true,
      },
      {
        id: "PHASE-003",
        name: "Structural",
        startDate: "2025-04-16",
        endDate: "2025-07-30",
        progress: 0,
        status: "not_started",
        qcRequirements: [
          "Steel erection inspection",
          "Concrete placement monitoring",
          "Welding inspection",
          "Structural testing",
        ],
        linkedMilestones: ["MS-005", "MS-006", "MS-007"],
        criticalPath: true,
      },
      {
        id: "PHASE-004",
        name: "MEP Rough-In",
        startDate: "2025-06-01",
        endDate: "2025-09-15",
        progress: 0,
        status: "not_started",
        qcRequirements: [
          "Electrical rough-in inspection",
          "Plumbing pressure testing",
          "HVAC ductwork inspection",
          "Fire protection testing",
        ],
        linkedMilestones: ["MS-008", "MS-009"],
        criticalPath: false,
      },
      {
        id: "PHASE-005",
        name: "Envelope",
        startDate: "2025-07-01",
        endDate: "2025-10-30",
        progress: 0,
        status: "not_started",
        qcRequirements: [
          "Insulation installation verification",
          "Air barrier testing",
          "Glazing installation inspection",
          "Roofing system testing",
        ],
        linkedMilestones: ["MS-010", "MS-011"],
        criticalPath: false,
      },
      {
        id: "PHASE-006",
        name: "Interior Finishes",
        startDate: "2025-10-01",
        endDate: "2025-12-15",
        progress: 0,
        status: "not_started",
        qcRequirements: [
          "Drywall inspection",
          "Flooring installation verification",
          "Paint finish inspection",
          "Fixture installation testing",
        ],
        linkedMilestones: ["MS-012", "MS-013"],
        criticalPath: false,
      },
    ]

    // Mock project milestones data
    const mockMilestones: ProjectMilestone[] = [
      {
        id: "MS-001",
        name: "Permits Approved",
        phase: "PHASE-001",
        startDate: "2025-01-15",
        endDate: "2025-02-15",
        progress: 90,
        status: "in_progress",
        qcRequirements: [
          "Building permit compliance verification",
          "Utility permit approval confirmation",
          "Environmental permit validation",
        ],
        linkedCheckpoints: ["CP-001"],
        linkedProcedures: ["PROC-001"],
        linkedTesting: [],
        dependencies: [],
        criticalPath: true,
        responsible: "Project Manager",
        stakeholders: ["Design Team", "Client", "Regulatory"],
      },
      {
        id: "MS-002",
        name: "Site Preparation Complete",
        phase: "PHASE-001",
        startDate: "2025-02-16",
        endDate: "2025-02-28",
        progress: 0,
        status: "not_started",
        qcRequirements: [
          "Site survey verification",
          "Utility locating confirmation",
          "Temporary facilities inspection",
          "Safety perimeter establishment",
        ],
        linkedCheckpoints: ["CP-002"],
        linkedProcedures: ["PROC-002"],
        linkedTesting: ["TEST-001"],
        dependencies: ["MS-001"],
        criticalPath: true,
        responsible: "Site Supervisor",
        stakeholders: ["General Contractor", "Utilities", "Safety"],
      },
      {
        id: "MS-003",
        name: "Foundation Excavation Complete",
        phase: "PHASE-002",
        startDate: "2025-03-01",
        endDate: "2025-03-15",
        progress: 0,
        status: "not_started",
        qcRequirements: [
          "Excavation depth verification",
          "Soil bearing capacity testing",
          "Dewatering system inspection",
          "Shoring system verification",
        ],
        linkedCheckpoints: ["CP-003"],
        linkedProcedures: ["PROC-003"],
        linkedTesting: ["TEST-002", "TEST-003"],
        dependencies: ["MS-002"],
        criticalPath: true,
        responsible: "Foundation Contractor",
        stakeholders: ["Structural Engineer", "Geotechnical", "Safety"],
      },
      {
        id: "MS-004",
        name: "Foundation Concrete Complete",
        phase: "PHASE-002",
        startDate: "2025-03-16",
        endDate: "2025-04-15",
        progress: 0,
        status: "not_started",
        qcRequirements: [
          "Concrete strength testing",
          "Waterproofing inspection",
          "Anchor bolt verification",
          "Curing process monitoring",
        ],
        linkedCheckpoints: ["CP-004"],
        linkedProcedures: ["PROC-004"],
        linkedTesting: ["TEST-004", "TEST-005"],
        dependencies: ["MS-003"],
        criticalPath: true,
        responsible: "Concrete Contractor",
        stakeholders: ["Structural Engineer", "Waterproofing", "QC"],
      },
    ]

    setProjectPhases(mockPhases)
    setProjectMilestones(mockMilestones)
  }

  const loadQCMilestoneLinks = async () => {
    // Mock QC milestone links
    const mockLinks: QCMilestoneLink[] = [
      {
        id: "LINK-001",
        milestoneId: "MS-001",
        qcProgramId: qcProgramId,
        qcComponentType: "checkpoint",
        qcComponentId: "CP-001",
        linkType: "required",
        completionCriteria: ["Permit approval verified", "Compliance documentation complete"],
        status: "active",
        lastUpdated: "2025-01-15",
      },
      {
        id: "LINK-002",
        milestoneId: "MS-002",
        qcProgramId: qcProgramId,
        qcComponentType: "procedure",
        qcComponentId: "PROC-002",
        linkType: "required",
        completionCriteria: ["Site survey complete", "Safety measures implemented"],
        status: "pending",
        lastUpdated: "2025-01-15",
      },
      {
        id: "LINK-003",
        milestoneId: "MS-003",
        qcProgramId: qcProgramId,
        qcComponentType: "testing",
        qcComponentId: "TEST-002",
        linkType: "required",
        completionCriteria: ["Soil bearing capacity confirmed", "Excavation depth verified"],
        status: "pending",
        lastUpdated: "2025-01-15",
      },
    ]

    setQcMilestoneLinks(mockLinks)
  }

  const loadMajorScopeLinks = async () => {
    // Mock major scope QC links
    const mockScopeLinks: MajorScopeQCLink[] = [
      {
        id: "SCOPE-001",
        scopeId: "SCOPE-CONCRETE",
        scopeName: "Concrete Work",
        trade: "Concrete Contractor",
        phase: "PHASE-002",
        qcProcedures: ["PROC-003", "PROC-004"],
        qcCheckpoints: ["CP-003", "CP-004"],
        qcTesting: ["TEST-002", "TEST-003", "TEST-004"],
        linkedMilestones: ["MS-003", "MS-004"],
        progress: 0,
        status: "not_started",
        responsible: "QC Manager",
        estimatedDuration: 45,
      },
      {
        id: "SCOPE-002",
        scopeId: "SCOPE-STEEL",
        scopeName: "Structural Steel",
        trade: "Steel Erector",
        phase: "PHASE-003",
        qcProcedures: ["PROC-005", "PROC-006"],
        qcCheckpoints: ["CP-005", "CP-006"],
        qcTesting: ["TEST-006", "TEST-007"],
        linkedMilestones: ["MS-005", "MS-006"],
        progress: 0,
        status: "not_started",
        responsible: "QC Manager",
        estimatedDuration: 60,
      },
      {
        id: "SCOPE-003",
        scopeId: "SCOPE-MEP",
        scopeName: "MEP Systems",
        trade: "MEP Contractor",
        phase: "PHASE-004",
        qcProcedures: ["PROC-007", "PROC-008"],
        qcCheckpoints: ["CP-007", "CP-008"],
        qcTesting: ["TEST-008", "TEST-009"],
        linkedMilestones: ["MS-008", "MS-009"],
        progress: 0,
        status: "not_started",
        responsible: "QC Manager",
        estimatedDuration: 90,
      },
    ]

    setMajorScopeLinks(mockScopeLinks)
  }

  // Helper functions
  const getPhaseStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "delayed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPhaseStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "in_progress":
        return <Clock className="h-4 w-4" />
      case "delayed":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const getMilestoneStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "delayed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const calculateOverallProgress = () => {
    const totalMilestones = projectMilestones.length
    const completedMilestones = projectMilestones.filter((m) => m.status === "completed").length
    const inProgressMilestones = projectMilestones.filter((m) => m.status === "in_progress")
    const inProgressWeight = inProgressMilestones.reduce((sum, m) => sum + m.progress, 0) / 100

    return totalMilestones > 0 ? ((completedMilestones + inProgressWeight) / totalMilestones) * 100 : 0
  }

  const getQCLinksForMilestone = (milestoneId: string) => {
    return qcMilestoneLinks.filter((link) => link.milestoneId === milestoneId)
  }

  const getActivePhasesCount = () => {
    return projectPhases.filter((phase) => phase.status === "in_progress").length
  }

  const getCriticalPathMilestones = () => {
    return projectMilestones.filter((milestone) => milestone.criticalPath)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Link className="h-5 w-5 text-blue-600" />
            QC Milestone Integration
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Link quality control activities to project milestones and phases
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View Dependencies
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Link
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Overall Progress</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{Math.round(calculateOverallProgress())}%</span>
                <Badge variant="outline">{projectMilestones.length} Milestones</Badge>
              </div>
              <Progress value={calculateOverallProgress()} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Active Phases</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{getActivePhasesCount()}</span>
                <Badge variant="outline">{projectPhases.length} Total</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                {getActivePhasesCount()} phase{getActivePhasesCount() !== 1 ? "s" : ""} in progress
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Flag className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Critical Path</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{getCriticalPathMilestones().length}</span>
                <Badge variant="outline">Critical</Badge>
              </div>
              <div className="text-sm text-muted-foreground">High priority milestones</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Link className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">QC Links</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{qcMilestoneLinks.length}</span>
                <Badge variant="outline">Active</Badge>
              </div>
              <div className="text-sm text-muted-foreground">Quality control integrations</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: "timeline", label: "Timeline", icon: Calendar },
            { id: "phases", label: "Phases", icon: Layers },
            { id: "scopes", label: "Major Scopes", icon: Hammer },
            { id: "links", label: "QC Links", icon: Link },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "timeline" && (
        <div className="space-y-4">
          {/* Timeline View */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Project Timeline with QC Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {projectPhases.map((phase) => (
                  <div key={phase.id} className="relative">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        {getPhaseStatusIcon(phase.status)}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{phase.name}</h4>
                            <Badge className={getPhaseStatusColor(phase.status)}>
                              {phase.status.replace("_", " ")}
                            </Badge>
                            {phase.criticalPath && (
                              <Badge variant="destructive" className="text-xs">
                                Critical Path
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {phase.startDate} - {phase.endDate}
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{phase.progress}%</span>
                          </div>
                          <Progress value={phase.progress} className="h-2" />
                        </div>

                        {/* Phase QC Requirements */}
                        <div className="mb-3">
                          <span className="text-sm font-medium text-muted-foreground">QC Requirements:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {phase.qcRequirements.map((req, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                {req}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Phase Milestones */}
                        <div className="pl-4 border-l-2 border-gray-200">
                          <div className="text-sm font-medium mb-2">Milestones:</div>
                          <div className="space-y-3">
                            {projectMilestones
                              .filter((milestone) => milestone.phase === phase.id)
                              .map((milestone) => (
                                <div key={milestone.id} className="p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <Flag className="h-4 w-4 text-muted-foreground" />
                                      <span className="font-medium">{milestone.name}</span>
                                      <Badge className={getMilestoneStatusColor(milestone.status)}>
                                        {milestone.status.replace("_", " ")}
                                      </Badge>
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                      {milestone.startDate} - {milestone.endDate}
                                    </span>
                                  </div>

                                  <div className="mb-2">
                                    <Progress value={milestone.progress} className="h-1" />
                                  </div>

                                  {/* Milestone QC Links */}
                                  <div className="flex flex-wrap gap-1">
                                    {getQCLinksForMilestone(milestone.id).map((link) => (
                                      <Badge key={link.id} variant="outline" className="text-xs">
                                        <Link className="h-3 w-3 mr-1" />
                                        {link.qcComponentType}: {link.qcComponentId}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "phases" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projectPhases.map((phase) => (
            <Card key={phase.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    {phase.name}
                  </CardTitle>
                  <Badge className={getPhaseStatusColor(phase.status)}>{phase.status.replace("_", " ")}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>
                      Duration: {phase.startDate} - {phase.endDate}
                    </span>
                    <span>Progress: {phase.progress}%</span>
                  </div>

                  <Progress value={phase.progress} className="h-2" />

                  <div>
                    <div className="text-sm font-medium mb-2">QC Requirements:</div>
                    <div className="space-y-1">
                      {phase.qcRequirements.map((req, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {req}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-2">Linked Milestones:</div>
                    <div className="flex flex-wrap gap-1">
                      {phase.linkedMilestones.map((milestoneId) => (
                        <Badge key={milestoneId} variant="outline" className="text-xs">
                          <Target className="h-3 w-3 mr-1" />
                          {milestoneId}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {phase.criticalPath && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        This phase is on the critical path. Any delays will impact project completion.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "scopes" && (
        <div className="space-y-4">
          {majorScopeLinks.map((scope) => (
            <Card key={scope.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Hammer className="h-4 w-4" />
                    {scope.scopeName}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{scope.trade}</Badge>
                    <Badge className={getPhaseStatusColor(scope.status)}>{scope.status.replace("_", " ")}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium mb-1">Phase:</div>
                      <div className="text-sm">{scope.phase}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Responsible:</div>
                      <div className="text-sm">{scope.responsible}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Estimated Duration:</div>
                      <div className="text-sm">{scope.estimatedDuration} days</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Progress:</div>
                      <div className="text-sm">{scope.progress}%</div>
                    </div>
                  </div>

                  <Progress value={scope.progress} className="h-2" />

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm font-medium mb-2">QC Procedures:</div>
                      <div className="space-y-1">
                        {scope.qcProcedures.map((proc, index) => (
                          <Badge key={index} variant="outline" className="text-xs block w-fit">
                            <FileText className="h-3 w-3 mr-1" />
                            {proc}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-2">QC Checkpoints:</div>
                      <div className="space-y-1">
                        {scope.qcCheckpoints.map((checkpoint, index) => (
                          <Badge key={index} variant="outline" className="text-xs block w-fit">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {checkpoint}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-2">QC Testing:</div>
                      <div className="space-y-1">
                        {scope.qcTesting.map((test, index) => (
                          <Badge key={index} variant="outline" className="text-xs block w-fit">
                            <BarChart3 className="h-3 w-3 mr-1" />
                            {test}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-2">Linked Milestones:</div>
                    <div className="flex flex-wrap gap-1">
                      {scope.linkedMilestones.map((milestoneId) => (
                        <Badge key={milestoneId} variant="outline" className="text-xs">
                          <Target className="h-3 w-3 mr-1" />
                          {milestoneId}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "links" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">QC Milestone Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {qcMilestoneLinks.map((link) => (
                  <div key={link.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Link className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">
                          {link.milestoneId} → {link.qcComponentId}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{link.qcComponentType}</Badge>
                        <Badge
                          className={
                            link.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : link.status === "active"
                              ? "bg-blue-100 text-blue-800"
                              : link.status === "blocked"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {link.status}
                        </Badge>
                        <Badge variant={link.linkType === "required" ? "destructive" : "outline"}>
                          {link.linkType}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-2">Completion Criteria:</div>
                      <div className="space-y-1">
                        {link.completionCriteria.map((criteria, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {criteria}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last updated: {link.lastUpdated}</span>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
