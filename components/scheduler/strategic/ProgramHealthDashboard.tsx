/**
 * @fileoverview Program Health Dashboard - Strategic Portfolio Management
 * @module ProgramHealthDashboard
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Strategic dashboard for monitoring program health across multiple projects
 * with matrix view, bottleneck analysis, resource allocation, and milestone harmony
 */

"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ScatterChart,
  Scatter,
  Cell,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Target,
  Zap,
  Shield,
  Activity,
  Calendar,
  BarChart3,
  Download,
  RefreshCw,
  Settings,
  Eye,
  Network,
  Flag,
  User,
  Building,
} from "lucide-react"

// Types
interface Project {
  id: string
  name: string
  pm: string
  phase: string
  progress: number
  health: "healthy" | "warning" | "critical"
  milestoneAlignment: number
  riskExposure: "low" | "medium" | "high"
  nextMilestone: string
  nextMilestoneDate: string
  daysToMilestone: number
}

interface ResourceAllocation {
  name: string
  role: string
  allocation: number
  capacity: number
  overAllocation: number
  projects: string[]
  efficiency: number
  status: "available" | "optimal" | "overallocated" | "critical"
}

interface Bottleneck {
  id: string
  type: "resource" | "dependency" | "milestone" | "approval"
  description: string
  impact: "high" | "medium" | "low"
  affectedProjects: string[]
  severity: number
  daysImpact: number
  resolution: string
}

interface MilestoneHarmony {
  date: string
  milestones: {
    project: string
    milestone: string
    criticality: "high" | "medium" | "low"
    dependencies: string[]
  }[]
  conflictLevel: number
}

// Mock Data
const projects: Project[] = [
  {
    id: "PRJ001",
    name: "Downtown Office Tower",
    pm: "Sarah Johnson",
    phase: "Construction",
    progress: 68,
    health: "healthy",
    milestoneAlignment: 92,
    riskExposure: "low",
    nextMilestone: "Structure Complete",
    nextMilestoneDate: "2025-02-15",
    daysToMilestone: 21,
  },
  {
    id: "PRJ002",
    name: "Retail Complex Phase 1",
    pm: "Mike Chen",
    phase: "Pre-Construction",
    progress: 45,
    health: "warning",
    milestoneAlignment: 78,
    riskExposure: "medium",
    nextMilestone: "Permit Approval",
    nextMilestoneDate: "2025-02-08",
    daysToMilestone: 14,
  },
  {
    id: "PRJ003",
    name: "Hospital Expansion",
    pm: "Sarah Johnson",
    phase: "Design",
    progress: 32,
    health: "critical",
    milestoneAlignment: 65,
    riskExposure: "high",
    nextMilestone: "Design Development",
    nextMilestoneDate: "2025-02-20",
    daysToMilestone: 26,
  },
  {
    id: "PRJ004",
    name: "University Dormitory",
    pm: "David Rodriguez",
    phase: "Construction",
    progress: 89,
    health: "healthy",
    milestoneAlignment: 95,
    riskExposure: "low",
    nextMilestone: "Final Inspections",
    nextMilestoneDate: "2025-02-12",
    daysToMilestone: 18,
  },
  {
    id: "PRJ005",
    name: "Mixed-Use Development",
    pm: "Mike Chen",
    phase: "Closeout",
    progress: 94,
    health: "warning",
    milestoneAlignment: 88,
    riskExposure: "medium",
    nextMilestone: "Certificate of Occupancy",
    nextMilestoneDate: "2025-02-05",
    daysToMilestone: 11,
  },
]

const resourceAllocations: ResourceAllocation[] = [
  {
    name: "Sarah Johnson",
    role: "Project Manager",
    allocation: 140,
    capacity: 100,
    overAllocation: 40,
    projects: ["PRJ001", "PRJ003"],
    efficiency: 85,
    status: "overallocated",
  },
  {
    name: "Mike Chen",
    role: "Project Manager",
    allocation: 120,
    capacity: 100,
    overAllocation: 20,
    projects: ["PRJ002", "PRJ005"],
    efficiency: 92,
    status: "overallocated",
  },
  {
    name: "David Rodriguez",
    role: "Project Manager",
    allocation: 80,
    capacity: 100,
    overAllocation: 0,
    projects: ["PRJ004"],
    efficiency: 88,
    status: "available",
  },
  {
    name: "Construction Crane #1",
    role: "Equipment",
    allocation: 95,
    capacity: 100,
    overAllocation: 0,
    projects: ["PRJ001", "PRJ004"],
    efficiency: 90,
    status: "optimal",
  },
  {
    name: "MEP Contractor",
    role: "Trade Partner",
    allocation: 110,
    capacity: 100,
    overAllocation: 10,
    projects: ["PRJ001", "PRJ002", "PRJ003"],
    efficiency: 82,
    status: "overallocated",
  },
]

const bottlenecks: Bottleneck[] = [
  {
    id: "BTL001",
    type: "resource",
    description: "PM Sarah Johnson overallocated across 2 major projects",
    impact: "high",
    affectedProjects: ["PRJ001", "PRJ003"],
    severity: 85,
    daysImpact: 12,
    resolution: "Assign assistant PM to Hospital Expansion project",
  },
  {
    id: "BTL002",
    type: "dependency",
    description: "MEP design approval blocking 3 projects simultaneously",
    impact: "high",
    affectedProjects: ["PRJ001", "PRJ002", "PRJ003"],
    severity: 92,
    daysImpact: 18,
    resolution: "Escalate to design review committee for expedited approval",
  },
]

const milestoneHarmony: MilestoneHarmony[] = [
  {
    date: "2025-02-05",
    milestones: [
      {
        project: "PRJ005",
        milestone: "Certificate of Occupancy",
        criticality: "high",
        dependencies: ["Final Inspections", "Safety Clearance"],
      },
    ],
    conflictLevel: 0,
  },
  {
    date: "2025-02-08",
    milestones: [
      {
        project: "PRJ002",
        milestone: "Permit Approval",
        criticality: "high",
        dependencies: ["MEP Design", "Structural Review"],
      },
    ],
    conflictLevel: 1,
  },
  {
    date: "2025-02-12",
    milestones: [
      {
        project: "PRJ004",
        milestone: "Final Inspections",
        criticality: "medium",
        dependencies: ["Systems Testing", "Cleanup"],
      },
    ],
    conflictLevel: 0,
  },
  {
    date: "2025-02-15",
    milestones: [
      {
        project: "PRJ001",
        milestone: "Structure Complete",
        criticality: "medium",
        dependencies: ["Concrete Cure", "Steel Inspection"],
      },
    ],
    conflictLevel: 0,
  },
  {
    date: "2025-02-20",
    milestones: [
      {
        project: "PRJ003",
        milestone: "Design Development",
        criticality: "high",
        dependencies: ["Stakeholder Review", "Code Compliance"],
      },
    ],
    conflictLevel: 2,
  },
]

// Components
const ProjectMatrixView: React.FC<{ projects: Project[] }> = ({ projects }) => {
  const getHealthColor = (health: string) => {
    switch (health) {
      case "healthy":
        return "text-green-700 bg-green-50 border-green-200"
      case "warning":
        return "text-yellow-700 bg-yellow-50 border-yellow-200"
      case "critical":
        return "text-red-700 bg-red-50 border-red-200"
      default:
        return "text-gray-700 bg-gray-50 border-gray-200"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-500"
      case "medium":
        return "bg-yellow-500"
      case "high":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5" />
          Program Matrix View
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Header Row */}
          <div className="grid grid-cols-8 gap-2 text-xs font-medium text-muted-foreground bg-muted p-2 rounded">
            <div>Project</div>
            <div>PM</div>
            <div>Phase</div>
            <div>Progress</div>
            <div>Health</div>
            <div>Milestone Align</div>
            <div>Risk Exposure</div>
            <div>Next Milestone</div>
          </div>

          {/* Project Rows */}
          {projects.map((project) => (
            <div key={project.id} className="grid grid-cols-8 gap-2 items-center p-2 border rounded hover:bg-muted/50">
              <div className="font-medium text-sm">{project.name}</div>
              <div className="text-sm">{project.pm}</div>
              <div className="text-sm">
                <Badge variant="secondary" className="text-xs">
                  {project.phase}
                </Badge>
              </div>
              <div className="space-y-1">
                <Progress value={project.progress} className="h-2" />
                <span className="text-xs text-muted-foreground">{project.progress}%</span>
              </div>
              <div>
                <Badge variant="outline" className={cn("text-xs", getHealthColor(project.health))}>
                  {project.health.toUpperCase()}
                </Badge>
              </div>
              <div className="space-y-1">
                <Progress value={project.milestoneAlignment} className="h-2" />
                <span className="text-xs text-muted-foreground">{project.milestoneAlignment}%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", getRiskColor(project.riskExposure))} />
                <span className="text-xs capitalize">{project.riskExposure}</span>
              </div>
              <div className="text-sm">
                <div className="font-medium">{project.nextMilestone}</div>
                <div className="text-xs text-muted-foreground">{project.daysToMilestone} days</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

const BottleneckAnalysis: React.FC<{ bottlenecks: Bottleneck[] }> = ({ bottlenecks }) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-red-700 bg-red-50 border-red-200"
      case "medium":
        return "text-yellow-700 bg-yellow-50 border-yellow-200"
      case "low":
        return "text-green-700 bg-green-50 border-green-200"
      default:
        return "text-gray-700 bg-gray-50 border-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "resource":
        return <Users className="h-4 w-4 text-blue-500" />
      case "dependency":
        return <Network className="h-4 w-4 text-purple-500" />
      case "milestone":
        return <Flag className="h-4 w-4 text-orange-500" />
      case "approval":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Program Bottlenecks ({bottlenecks.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bottlenecks.map((bottleneck) => (
            <div key={bottleneck.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(bottleneck.type)}
                  <div>
                    <div className="font-medium text-sm">{bottleneck.description}</div>
                    <Badge variant="outline" className={cn("text-xs mt-1", getImpactColor(bottleneck.impact))}>
                      {bottleneck.impact.toUpperCase()} IMPACT
                    </Badge>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div className="font-bold text-red-600">{bottleneck.daysImpact} days</div>
                  <div className="text-xs text-muted-foreground">Impact</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Affected Projects:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {bottleneck.affectedProjects.map((project) => (
                      <Badge key={project} variant="secondary" className="text-xs">
                        {project}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Severity Score:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={bottleneck.severity} className="h-2 flex-1" />
                    <span className="text-xs font-medium">{bottleneck.severity}/100</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="text-xs text-muted-foreground mb-1">RECOMMENDED RESOLUTION</div>
                <p className="text-sm">{bottleneck.resolution}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

const SharedResourcesPanel: React.FC<{ resources: ResourceAllocation[] }> = ({ resources }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "text-green-700 bg-green-50 border-green-200"
      case "optimal":
        return "text-blue-700 bg-blue-50 border-blue-200"
      case "overallocated":
        return "text-orange-700 bg-orange-50 border-orange-200"
      case "critical":
        return "text-red-700 bg-red-50 border-red-200"
      default:
        return "text-gray-700 bg-gray-50 border-gray-200"
    }
  }

  const overallocatedResources = resources.filter((r) => r.status === "overallocated")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Shared Resource Allocation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Overallocated Resources Alert */}
          {overallocatedResources.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">
                  {overallocatedResources.length} Resources Overallocated
                </span>
              </div>
              {overallocatedResources.map((resource) => (
                <div key={resource.name} className="text-sm text-orange-700">
                  {resource.name}: {resource.overAllocation}% over capacity
                </div>
              ))}
            </div>
          )}

          {/* Resource Details */}
          <div className="space-y-3">
            {resources.map((resource) => (
              <div key={resource.name} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <div>
                      <div className="font-medium text-sm">{resource.name}</div>
                      <div className="text-xs text-muted-foreground">{resource.role}</div>
                    </div>
                  </div>
                  <Badge variant="outline" className={cn("text-xs", getStatusColor(resource.status))}>
                    {resource.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Allocation</div>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={Math.min(resource.allocation, 150)}
                        className={cn("h-2 flex-1", resource.allocation > 100 && "[&>div]:bg-red-500")}
                      />
                      <span className="text-xs font-medium">{resource.allocation}%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Efficiency</div>
                    <div className="flex items-center gap-2">
                      <Progress value={resource.efficiency} className="h-2 flex-1" />
                      <span className="text-xs font-medium">{resource.efficiency}%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Projects</div>
                    <div className="flex flex-wrap gap-1">
                      {resource.projects.map((project) => (
                        <Badge key={project} variant="secondary" className="text-xs">
                          {project}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const MilestoneHarmonyTimeline: React.FC<{ harmony: MilestoneHarmony[] }> = ({ harmony }) => {
  const getConflictColor = (level: number) => {
    if (level === 0) return "bg-green-500"
    if (level === 1) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case "high":
        return "border-red-500 bg-red-50"
      case "medium":
        return "border-yellow-500 bg-yellow-50"
      case "low":
        return "border-green-500 bg-green-50"
      default:
        return "border-gray-500 bg-gray-50"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Milestone Harmony & Exposure
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-sm text-muted-foreground">No Conflicts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">1</div>
              <div className="text-sm text-muted-foreground">Minor Conflicts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">1</div>
              <div className="text-sm text-muted-foreground">Major Conflicts</div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            {harmony.map((item, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">{item.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", getConflictColor(item.conflictLevel))} />
                    <span className="text-xs">
                      {item.conflictLevel === 0
                        ? "No Conflict"
                        : item.conflictLevel === 1
                        ? "Minor Conflict"
                        : "Major Conflict"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {item.milestones.map((milestone, idx) => (
                    <div key={idx} className={cn("border rounded p-2", getCriticalityColor(milestone.criticality))}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium text-sm">{milestone.milestone}</div>
                        <Badge variant="secondary" className="text-xs">
                          {milestone.project}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Dependencies: {milestone.dependencies.join(", ")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const ProgramHealthDashboard: React.FC = () => {
  const [viewMode, setViewMode] = useState<"matrix" | "timeline" | "resources">("matrix")
  const [dateRange, setDateRange] = useState("month")

  const healthySummary = {
    totalProjects: projects.length,
    healthyCount: projects.filter((p) => p.health === "healthy").length,
    warningCount: projects.filter((p) => p.health === "warning").length,
    criticalCount: projects.filter((p) => p.health === "critical").length,
    avgProgress: projects.reduce((sum, p) => sum + p.progress, 0) / projects.length,
    avgMilestoneAlignment: projects.reduce((sum, p) => sum + p.milestoneAlignment, 0) / projects.length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Program Health Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Strategic oversight of portfolio performance and risk exposure
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={viewMode} onValueChange={setViewMode as (value: string) => void}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="matrix">Matrix</SelectItem>
              <SelectItem value="timeline">Timeline</SelectItem>
              <SelectItem value="resources">Resources</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{healthySummary.totalProjects}</div>
                <p className="text-sm text-muted-foreground">Active Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{Math.round(healthySummary.avgProgress)}%</div>
                <p className="text-sm text-muted-foreground">Avg Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">{Math.round(healthySummary.avgMilestoneAlignment)}%</div>
                <p className="text-sm text-muted-foreground">Milestone Harmony</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold">{bottlenecks.length}</div>
                <p className="text-sm text-muted-foreground">Active Bottlenecks</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Matrix */}
        <div className="lg:col-span-2">
          <ProjectMatrixView projects={projects} />
        </div>

        {/* Milestone Timeline */}
        <div>
          <MilestoneHarmonyTimeline harmony={milestoneHarmony} />
        </div>
      </div>

      {/* Bottlenecks and Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BottleneckAnalysis bottlenecks={bottlenecks} />
        <SharedResourcesPanel resources={resourceAllocations} />
      </div>
    </div>
  )
}

export default ProgramHealthDashboard
