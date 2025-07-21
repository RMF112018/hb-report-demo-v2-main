"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Plus,
  FileText,
  Calculator,
  Send,
  Save,
  AlertTriangle,
  Info,
  DollarSign,
  Calendar,
  User,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Eye,
  MessageSquare,
  Building,
  RefreshCw,
  Download,
  Search,
  TrendingUp,
  Target,
  Users,
} from "lucide-react"
import { useStaffingStore, type SPCR } from "@/components/staffing/legacy/useStaffingStore"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface ProjectSPCRManagerProps {
  projectId: number
  projectData?: any
  userRole: string
  className?: string
}

interface SpcrComment {
  id: string
  author: string
  role: string
  comment: string
  action: "approved" | "rejected" | "forwarded" | "revised"
  timestamp: string
}

// Common position options for construction projects
const POSITION_OPTIONS = [
  "Project Manager I",
  "Project Manager II",
  "Project Manager III",
  "Senior Project Manager",
  "Assistant Project Manager",
  "Superintendent I",
  "Superintendent II",
  "Superintendent III",
  "General Superintendent",
  "Assistant Superintendent",
  "Project Executive",
  "Field Engineer",
  "Safety Manager",
  "Quality Manager",
  "Estimator I",
  "Estimator II",
  "Senior Estimator",
  "VDC Manager",
  "BIM Coordinator",
  "Scheduler",
  "Procurement Manager",
  "Project Accountant",
  "Project Administrator",
]

export const ProjectSPCRManager: React.FC<ProjectSPCRManagerProps> = ({
  projectId = 2525840, // Default to Palm Beach project
  projectData,
  userRole,
  className,
}) => {
  const {
    spcrDraft,
    setSPCRDraft,
    saveSPCRDraft,
    clearSPCRDraft,
    getSPCRsByProject,
    createSPCR,
    getStaffByProject,
    projects,
  } = useStaffingStore()

  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpcr, setSelectedSpcr] = useState<SPCR | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const project = projects.find((p) => p.project_id === projectId)
  const currentProjectStaff = getStaffByProject(projectId)
  const projectSpcrs = getSPCRsByProject(projectId)

  // Filter and search SPCRs
  const filteredSpcrs = useMemo(() => {
    let filtered = projectSpcrs

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((spcr) => {
        switch (statusFilter) {
          case "pending":
            return ["submitted", "pe-review", "executive-review"].includes(spcr.workflowStage)
          case "approved":
            return ["pe-approved", "final-approved"].includes(spcr.workflowStage)
          case "rejected":
            return ["pe-rejected", "final-rejected"].includes(spcr.workflowStage)
          default:
            return true
        }
      })
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (spcr) =>
          spcr.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
          spcr.explanation.toLowerCase().includes(searchTerm.toLowerCase()) ||
          spcr.scheduleRef.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort by creation date (newest first)
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [projectSpcrs, statusFilter, searchTerm])

  // Calculate SPCR counts and analytics
  const spcrAnalytics = useMemo(() => {
    const total = projectSpcrs.length
    const pending = projectSpcrs.filter((s) =>
      ["submitted", "pe-review", "executive-review"].includes(s.workflowStage)
    ).length
    const approved = projectSpcrs.filter((s) => ["pe-approved", "final-approved"].includes(s.workflowStage)).length
    const rejected = projectSpcrs.filter((s) => ["pe-rejected", "final-rejected"].includes(s.workflowStage)).length

    const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0
    const mostRequestedPosition = projectSpcrs.reduce((acc, spcr) => {
      acc[spcr.position] = (acc[spcr.position] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topPosition = Object.entries(mostRequestedPosition).sort(([, a], [, b]) => b - a)[0]

    return {
      total,
      pending,
      approved,
      rejected,
      approvalRate,
      topPosition: topPosition ? { position: topPosition[0], count: topPosition[1] } : null,
      avgProcessingTime: 5.2, // Mock value
    }
  }, [projectSpcrs])

  // Update draft function
  const updateDraft = (updates: Partial<SPCR>) => {
    setSPCRDraft({
      ...spcrDraft,
      project_id: projectId,
      createdBy: "current-user",
      status: "pending",
      workflowStage: "submitted",
      ...updates,
    })
  }

  // Calculate impact preview
  const impactPreview = useMemo(() => {
    if (!spcrDraft || !spcrDraft.position || !spcrDraft.startDate || !spcrDraft.endDate) {
      return null
    }

    const startDate = new Date(spcrDraft.startDate)
    const endDate = new Date(spcrDraft.endDate)
    const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const durationWeeks = Math.ceil(durationDays / 7)

    const estimatedRate = getEstimatedRateForPosition(spcrDraft.position)
    const weeklyHours = 40
    const totalCost = estimatedRate * weeklyHours * durationWeeks

    const conflicts = currentProjectStaff.filter(
      (staff) =>
        staff.position === spcrDraft.position &&
        staff.assignments.some((assignment) => {
          const assignStart = new Date(assignment.startDate)
          const assignEnd = new Date(assignment.endDate)
          return startDate <= assignEnd && endDate >= assignStart
        })
    )

    return {
      durationDays,
      durationWeeks,
      estimatedRate,
      totalCost,
      conflicts: conflicts.length,
      conflictNames: conflicts.map((staff) => staff.name),
    }
  }, [spcrDraft, currentProjectStaff])

  // Helper function to estimate labor rate
  const getEstimatedRateForPosition = (position: string): number => {
    const rateMap: Record<string, number> = {
      "Project Executive": 85,
      "Senior Project Manager": 75,
      "Project Manager III": 70,
      "Project Manager II": 65,
      "Project Manager I": 60,
      "Assistant Project Manager": 50,
      "General Superintendent": 80,
      "Superintendent III": 75,
      "Superintendent II": 65,
      "Superintendent I": 55,
      "Assistant Superintendent": 45,
      "Field Engineer": 58,
      "Safety Manager": 62,
      "Quality Manager": 60,
      "Senior Estimator": 68,
      "Estimator II": 58,
      "Estimator I": 48,
      "VDC Manager": 72,
      "BIM Coordinator": 62,
      Scheduler: 55,
      "Procurement Manager": 65,
      "Project Accountant": 52,
      "Project Administrator": 45,
    }
    return rateMap[position] || 55
  }

  // Submit SPCR
  const handleSubmit = async () => {
    if (!spcrDraft || !validateDraft()) return

    setIsSubmitting(true)
    try {
      const finalDraft = {
        ...spcrDraft,
        budget: impactPreview?.totalCost || 0,
        scheduleRef: spcrDraft.scheduleRef || `${project?.name} - ${spcrDraft.position} Assignment`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      createSPCR(finalDraft as Omit<SPCR, "id" | "createdAt" | "updatedAt">)
      clearSPCRDraft()
      setShowPreview(false)
      setShowCreateModal(false)
    } catch (error) {
      console.error("Failed to submit SPCR:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Validate draft
  const validateDraft = (): boolean => {
    return !!(
      spcrDraft?.type &&
      spcrDraft?.position &&
      spcrDraft?.startDate &&
      spcrDraft?.endDate &&
      spcrDraft?.explanation
    )
  }

  // Get workflow badge
  const getWorkflowBadge = (stage: string) => {
    switch (stage) {
      case "submitted":
        return (
          <Badge variant="secondary" className="text-xs">
            Submitted
          </Badge>
        )
      case "pe-review":
        return (
          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
            PE Review
          </Badge>
        )
      case "pe-approved":
        return (
          <Badge variant="default" className="text-xs bg-green-500">
            PE Approved
          </Badge>
        )
      case "pe-rejected":
        return (
          <Badge variant="destructive" className="text-xs">
            PE Rejected
          </Badge>
        )
      case "executive-review":
        return (
          <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
            Executive Review
          </Badge>
        )
      case "final-approved":
        return (
          <Badge variant="default" className="text-xs bg-green-600">
            Final Approved
          </Badge>
        )
      case "final-rejected":
        return (
          <Badge variant="destructive" className="text-xs">
            Final Rejected
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {stage}
          </Badge>
        )
    }
  }

  // Get type badge
  const getTypeBadge = (type: string) => {
    return type === "increase" ? (
      <Badge variant="default" className="text-xs bg-blue-500">
        Add
      </Badge>
    ) : (
      <Badge variant="outline" className="text-xs bg-orange-100 text-orange-700">
        Remove
      </Badge>
    )
  }

  // Handle view details
  const handleViewDetails = (spcr: SPCR) => {
    setSelectedSpcr(spcr)
    setShowDetailModal(true)
  }

  // Handle create modal open
  const handleCreateModalOpen = () => {
    setShowCreateModal(true)
    setShowPreview(false)
  }

  // Handle create modal close
  const handleCreateModalClose = () => {
    setShowCreateModal(false)
    setShowPreview(false)
  }

  return (
    <div className={cn("h-full w-full space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">SPCR Management</h2>
          <p className="text-sm text-muted-foreground">
            Manage staffing plan change requests for {project?.name || "this project"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button onClick={handleCreateModalOpen} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            New SPCR
          </Button>
        </div>
      </div>

      {/* Compact Analytics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-card border rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-lg font-semibold">{spcrAnalytics.total}</p>
            </div>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="bg-card border rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-lg font-semibold text-blue-600">{spcrAnalytics.pending}</p>
            </div>
            <Clock className="h-4 w-4 text-blue-600" />
          </div>
        </div>

        <div className="bg-card border rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Approval Rate</p>
              <p className="text-lg font-semibold text-green-600">{spcrAnalytics.approvalRate}%</p>
            </div>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
        </div>

        <div className="bg-card border rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Avg. Processing</p>
              <p className="text-lg font-semibold text-purple-600">{spcrAnalytics.avgProcessingTime}d</p>
            </div>
            <Target className="h-4 w-4 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 flex-1">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search SPCRs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        {spcrAnalytics.topPosition && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>
              Top: {spcrAnalytics.topPosition.position} ({spcrAnalytics.topPosition.count})
            </span>
          </div>
        )}
      </div>

      {/* SPCR Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Requests</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredSpcrs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">ID</TableHead>
                  <TableHead className="w-16">Type</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead className="w-24">Status</TableHead>
                  <TableHead className="w-24">Budget</TableHead>
                  <TableHead className="w-32">Duration</TableHead>
                  <TableHead className="w-24">Created</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSpcrs.map((spcr) => (
                  <TableRow key={spcr.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-sm">SPCR-{spcr.id.split("-")[1]}</TableCell>
                    <TableCell>{getTypeBadge(spcr.type)}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm">{spcr.position}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-48">
                          {spcr.explanation.slice(0, 60)}...
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getWorkflowBadge(spcr.workflowStage)}
                        {spcr.comments && spcr.comments.length > 0 && (
                          <MessageSquare className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">${spcr.budget.toLocaleString()}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {format(new Date(spcr.startDate), "MMM dd")} - {format(new Date(spcr.endDate), "MMM dd")}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {format(new Date(spcr.createdAt), "MMM dd")}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(spcr)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 px-6">
              <FileText className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
              <h3 className="font-medium mb-2">No SPCRs Found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "No SPCRs match your current filters."
                  : "You haven't created any SPCRs yet."}
              </p>
              <Button onClick={handleCreateModalOpen} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First SPCR
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create SPCR Modal */}
      <Dialog open={showCreateModal} onOpenChange={handleCreateModalClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-blue-50/80 dark:bg-slate-900/95 border-blue-200/30 dark:border-slate-800/50">
          <DialogHeader className="bg-gradient-to-r from-blue-100/40 dark:from-slate-800/30 to-blue-200/30 dark:to-blue-900/20 -m-6 p-6 mb-6">
            <DialogTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Create Staffing Plan Change Request
              <Badge variant="secondary" className="bg-blue-200 dark:bg-blue-800/50 text-blue-800 dark:text-blue-100">
                {project?.name || "Project"}
              </Badge>
            </DialogTitle>
            <p className="text-sm text-blue-700/80 dark:text-slate-300 mt-1">
              Request changes to your project's staffing plan for approval
            </p>
          </DialogHeader>

          <div className="space-y-6 bg-blue-50/50 dark:bg-slate-850/50 p-6 -m-6 rounded-lg">
            {/* Request Type Section */}
            <Card className="bg-blue-100/60 dark:bg-slate-800/80 border-blue-300/40 dark:border-slate-700/50">
              <CardHeader className="bg-gradient-to-r from-blue-200/30 dark:from-slate-700/20 to-blue-300/20 dark:to-blue-800/15">
                <CardTitle className="text-base text-blue-900 dark:text-blue-200 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Request Details
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-blue-150/40 dark:bg-slate-750/60 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-sm font-medium text-blue-900 dark:text-blue-200">
                      Request Type *
                    </Label>
                    <Select
                      value={spcrDraft?.type || ""}
                      onValueChange={(value) => updateDraft({ type: value as "increase" | "decrease" })}
                    >
                      <SelectTrigger className="border-blue-500/50 dark:border-blue-600/40 bg-blue-100/30 dark:bg-slate-600/20 text-blue-900 dark:text-blue-100">
                        <SelectValue placeholder="Select request type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="increase">Add Staff Member</SelectItem>
                        <SelectItem value="decrease">Remove Staff Member</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position" className="text-sm font-medium text-blue-900 dark:text-blue-200">
                      Position *
                    </Label>
                    <Select
                      value={spcrDraft?.position || ""}
                      onValueChange={(value) => updateDraft({ position: value })}
                    >
                      <SelectTrigger className="border-blue-500/50 dark:border-blue-600/40 bg-blue-100/30 dark:bg-slate-600/20 text-blue-900 dark:text-blue-100">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        {POSITION_OPTIONS.map((position) => (
                          <SelectItem key={position} value={position}>
                            {position}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Schedule Information Section */}
            <Card className="bg-blue-100/60 dark:bg-slate-800/80 border-blue-300/40 dark:border-slate-700/50">
              <CardHeader className="bg-gradient-to-r from-blue-200/30 dark:from-slate-700/20 to-blue-300/20 dark:to-blue-800/15">
                <CardTitle className="text-base text-blue-900 dark:text-blue-200 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule Information
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-blue-150/40 dark:bg-slate-750/60 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="text-sm font-medium text-blue-900 dark:text-blue-200">
                      Start Date *
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={spcrDraft?.startDate?.split("T")[0] || ""}
                      onChange={(e) => updateDraft({ startDate: e.target.value + "T00:00:00Z" })}
                      className="border-blue-500/50 dark:border-blue-600/40 bg-blue-100/30 dark:bg-slate-600/20 text-blue-900 dark:text-blue-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="text-sm font-medium text-blue-900 dark:text-blue-200">
                      End Date *
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={spcrDraft?.endDate?.split("T")[0] || ""}
                      onChange={(e) => updateDraft({ endDate: e.target.value + "T23:59:59Z" })}
                      className="border-blue-500/50 dark:border-blue-600/40 bg-blue-100/30 dark:bg-slate-600/20 text-blue-900 dark:text-blue-100"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scheduleRef" className="text-sm font-medium text-blue-900 dark:text-blue-200">
                    Schedule Activity Reference
                  </Label>
                  <Input
                    id="scheduleRef"
                    placeholder="e.g., Foundation Work - Task 152, MEP Rough-In - Phase 3"
                    value={spcrDraft?.scheduleRef || ""}
                    onChange={(e) => updateDraft({ scheduleRef: e.target.value })}
                    className="border-blue-500/50 dark:border-blue-600/40 bg-blue-100/30 dark:bg-slate-600/20 text-blue-900 dark:text-blue-100"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Justification Section */}
            <Card className="bg-blue-100/60 dark:bg-slate-800/80 border-blue-300/40 dark:border-slate-700/50">
              <CardHeader className="bg-gradient-to-r from-blue-200/30 dark:from-slate-700/20 to-blue-300/20 dark:to-blue-800/15">
                <CardTitle className="text-base text-blue-900 dark:text-blue-200 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Justification
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-blue-150/40 dark:bg-slate-750/60 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="explanation" className="text-sm font-medium text-blue-900 dark:text-blue-200">
                    Detailed Justification *
                  </Label>
                  <Textarea
                    id="explanation"
                    placeholder="Provide detailed justification for this staffing change..."
                    value={spcrDraft?.explanation || ""}
                    onChange={(e) => updateDraft({ explanation: e.target.value })}
                    rows={4}
                    className="border-blue-500/50 dark:border-blue-600/40 bg-blue-100/30 dark:bg-slate-600/20 text-blue-900 dark:text-blue-100"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Impact Preview */}
            {impactPreview && (
              <Card className="bg-blue-400/15 dark:bg-blue-950/30 border-blue-500/20 dark:border-blue-800/30">
                <CardHeader className="bg-gradient-to-r from-blue-300/20 dark:from-blue-900/20 to-blue-400/15 dark:to-blue-800/15">
                  <CardTitle className="text-base text-blue-900 dark:text-blue-200 flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Impact Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="bg-blue-300/15 dark:bg-blue-900/20 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                        {impactPreview.durationWeeks}
                      </div>
                      <div className="text-sm text-blue-700/70 dark:text-slate-400">Weeks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                        ${impactPreview.estimatedRate}
                      </div>
                      <div className="text-sm text-blue-700/70 dark:text-slate-400">Est. Rate/hr</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                        ${impactPreview.totalCost.toLocaleString()}
                      </div>
                      <div className="text-sm text-blue-700/70 dark:text-slate-400">Total Cost</div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-2xl font-bold ${
                          impactPreview.conflicts > 0
                            ? "text-red-700 dark:text-red-400"
                            : "text-green-700 dark:text-green-400"
                        }`}
                      >
                        {impactPreview.conflicts}
                      </div>
                      <div className="text-sm text-blue-700/70 dark:text-slate-400">Conflicts</div>
                    </div>
                  </div>

                  {impactPreview.conflicts > 0 && (
                    <Alert className="bg-red-100/30 dark:bg-red-900/20 border-red-400/30 dark:border-red-800/30">
                      <AlertTriangle className="h-4 w-4 text-red-700 dark:text-red-400" />
                      <AlertDescription className="text-red-800 dark:text-red-200">
                        Potential scheduling conflicts with: {impactPreview.conflictNames.join(", ")}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Validation Messages */}
            {!validateDraft() && spcrDraft && Object.keys(spcrDraft).length > 0 && (
              <Alert className="bg-orange-100/30 dark:bg-orange-900/20 border-orange-400/30 dark:border-orange-800/30">
                <Info className="h-4 w-4 text-orange-700 dark:text-orange-400" />
                <AlertDescription className="text-orange-800 dark:text-orange-200">
                  Please fill in all required fields to proceed with submission.
                </AlertDescription>
              </Alert>
            )}

            {/* Preview Section */}
            {showPreview && validateDraft() && (
              <Card className="bg-green-400/15 dark:bg-green-950/30 border-green-500/20 dark:border-green-800/30">
                <CardHeader className="bg-gradient-to-r from-green-300/20 dark:from-green-900/20 to-green-400/15 dark:to-green-800/15">
                  <CardTitle className="text-base text-green-900 dark:text-green-200 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Request Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="bg-green-300/15 dark:bg-green-900/20 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="text-green-900 dark:text-green-100">
                      <strong>Type:</strong> {spcrDraft?.type === "increase" ? "Add Staff" : "Remove Staff"}
                    </div>
                    <div className="text-green-900 dark:text-green-100">
                      <strong>Position:</strong> {spcrDraft?.position}
                    </div>
                    <div className="text-green-900 dark:text-green-100">
                      <strong>Duration:</strong>{" "}
                      {spcrDraft?.startDate &&
                        spcrDraft?.endDate &&
                        `${new Date(spcrDraft.startDate).toLocaleDateString()} - ${new Date(
                          spcrDraft.endDate
                        ).toLocaleDateString()}`}
                    </div>
                    <div className="text-green-900 dark:text-green-100">
                      <strong>Estimated Cost:</strong> ${impactPreview?.totalCost.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-green-900 dark:text-green-100">
                    <strong>Justification:</strong>
                    <p className="text-sm text-green-800 dark:text-green-200 mt-1">{spcrDraft?.explanation}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-blue-400/30 dark:border-slate-600/40">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => saveSPCRDraft()}
                  disabled={!spcrDraft || Object.keys(spcrDraft).length === 0}
                  className="border-blue-600/50 dark:border-blue-400/50 text-blue-800 dark:text-blue-200 hover:bg-blue-200/30 dark:hover:bg-blue-800/30"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save Draft
                </Button>
                <Button
                  variant="outline"
                  onClick={clearSPCRDraft}
                  disabled={!spcrDraft}
                  className="border-blue-600/50 dark:border-blue-400/50 text-blue-800 dark:text-blue-200 hover:bg-blue-200/30 dark:hover:bg-blue-800/30"
                >
                  Clear
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(!showPreview)}
                  disabled={!validateDraft()}
                  className="border-blue-600/50 dark:border-blue-400/50 text-blue-800 dark:text-blue-200 hover:bg-blue-200/30 dark:hover:bg-blue-800/30"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  {showPreview ? "Hide" : "Preview"}
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!validateDraft() || isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Send className="h-4 w-4 mr-1" />
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>SPCR Details</DialogTitle>
          </DialogHeader>
          {selectedSpcr && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">SPCR-{selectedSpcr.id.split("-")[1]}</span>
                {getWorkflowBadge(selectedSpcr.workflowStage)}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Project</label>
                  <div className="text-sm">{project?.name || "Unknown Project"}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type</label>
                  <div className="text-sm">{selectedSpcr.type === "increase" ? "Add Staff" : "Remove Staff"}</div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Position</label>
                <div className="text-sm font-medium">{selectedSpcr.position}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Start Date</label>
                  <div className="text-sm">{format(new Date(selectedSpcr.startDate), "MMM dd, yyyy")}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">End Date</label>
                  <div className="text-sm">{format(new Date(selectedSpcr.endDate), "MMM dd, yyyy")}</div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Schedule Reference</label>
                <div className="text-sm">{selectedSpcr.scheduleRef}</div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Budget Impact</label>
                <div className="text-lg font-bold">${selectedSpcr.budget.toLocaleString()}</div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Justification</label>
                <div className="text-sm">{selectedSpcr.explanation}</div>
              </div>

              {/* Workflow History */}
              {selectedSpcr.comments && selectedSpcr.comments.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Workflow History</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedSpcr.comments.map((comment) => (
                      <div key={comment.id} className="border rounded p-2 text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{comment.author}</span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(comment.timestamp), "MMM dd, yyyy")}
                          </span>
                        </div>
                        <div className="text-muted-foreground">{comment.content}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                <div>
                  <span>Created: {format(new Date(selectedSpcr.createdAt), "MMM dd, yyyy")}</span>
                </div>
                <div>
                  <span>Updated: {format(new Date(selectedSpcr.updatedAt), "MMM dd, yyyy")}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
