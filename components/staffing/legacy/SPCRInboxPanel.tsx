"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Inbox,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  DollarSign,
  Calendar,
  User,
  Building,
  ArrowRight,
  Eye,
  Filter,
  AlertTriangle,
  Info,
} from "lucide-react"
import { useStaffingStore, type SPCR } from "./useStaffingStore"
import { format } from "date-fns"

interface SPCRInboxPanelProps {
  userRole: "executive" | "project-executive" | "project-manager"
}

interface ActionModal {
  isOpen: boolean
  spcr: SPCR | null
  action: "approve" | "reject" | "view" | "implement" | "close-reject"
  comment: string
}

export const SPCRInboxPanel: React.FC<SPCRInboxPanelProps> = ({ userRole }) => {
  const { getSPCRsByRole, updateSPCR, addSPCRComment, spcrViewFilter, setSPCRViewFilter, projects } = useStaffingStore()

  const [actionModal, setActionModal] = useState<ActionModal>({
    isOpen: false,
    spcr: null,
    action: "view",
    comment: "",
  })

  const allSPCRs = getSPCRsByRole(userRole)

  // Filter SPCRs based on current filter
  const filteredSPCRs = useMemo(() => {
    let spcrs = allSPCRs

    switch (spcrViewFilter) {
      case "pending":
        if (userRole === "project-executive") {
          spcrs = spcrs.filter((spcr) => spcr.workflowStage === "pe-review")
        } else if (userRole === "executive") {
          spcrs = spcrs.filter((spcr) => spcr.workflowStage === "executive-review")
        } else {
          spcrs = spcrs.filter((spcr) => ["submitted", "pe-review", "executive-review"].includes(spcr.workflowStage))
        }
        break
      case "approved":
        spcrs = spcrs.filter((spcr) => ["pe-approved", "final-approved"].includes(spcr.workflowStage))
        break
      case "rejected":
        spcrs = spcrs.filter((spcr) => ["pe-rejected", "final-rejected"].includes(spcr.workflowStage))
        break
      case "closed":
        spcrs = spcrs.filter((spcr) => spcr.workflowStage === "closed")
        break
      default:
        // 'all' - show all except closed (which are hidden by default)
        spcrs = spcrs.filter((spcr) => spcr.workflowStage !== "closed")
        break
    }

    // Sort by creation date (newest first)
    return spcrs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [allSPCRs, spcrViewFilter, userRole])

  // Calculate counts for filter options
  const spcrCounts = useMemo(() => {
    return {
      total: allSPCRs.filter((s) => s.workflowStage !== "closed").length, // Exclude closed from total
      pending: allSPCRs.filter((s) => {
        if (userRole === "project-executive") return s.workflowStage === "pe-review"
        if (userRole === "executive") return s.workflowStage === "executive-review"
        return ["submitted", "pe-review", "executive-review"].includes(s.workflowStage)
      }).length,
      approved: allSPCRs.filter((s) => ["pe-approved", "final-approved"].includes(s.workflowStage)).length,
      rejected: allSPCRs.filter((s) => ["pe-rejected", "final-rejected"].includes(s.workflowStage)).length,
      closed: allSPCRs.filter((s) => s.workflowStage === "closed").length,
      needsAction: allSPCRs.filter(
        (s) =>
          (userRole === "project-executive" && s.workflowStage === "pe-review") ||
          (userRole === "executive" && s.workflowStage === "executive-review")
      ).length,
    }
  }, [allSPCRs, userRole])

  // Get project name
  const getProjectName = (projectId: number) => {
    const project = projects.find((p) => p.project_id === projectId)
    return project ? project.name : "Unknown Project"
  }

  // Get status badge
  const getStatusBadge = (spcr: SPCR) => {
    switch (spcr.workflowStage) {
      case "submitted":
        return <Badge variant="secondary">Submitted</Badge>
      case "pe-review":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-600">
            PE Review
          </Badge>
        )
      case "pe-approved":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-600">
            PE Approved
          </Badge>
        )
      case "pe-rejected":
        return <Badge variant="destructive">PE Rejected</Badge>
      case "executive-review":
        return (
          <Badge variant="outline" className="border-orange-500 text-orange-600">
            Executive Review
          </Badge>
        )
      case "final-approved":
        return (
          <Badge variant="default" className="bg-green-500">
            Final Approved
          </Badge>
        )
      case "final-rejected":
        return <Badge variant="destructive">Final Rejected</Badge>
      case "closed":
        return (
          <Badge variant="outline" className="border-gray-500 text-gray-600">
            Closed
          </Badge>
        )
      default:
        return <Badge variant="outline">{spcr.workflowStage}</Badge>
    }
  }

  // Get type badge
  const getTypeBadge = (type: string) => {
    return type === "increase" ? (
      <Badge variant="outline" className="border-green-500 text-green-600">
        + Add Staff
      </Badge>
    ) : (
      <Badge variant="outline" className="border-red-500 text-red-600">
        - Remove Staff
      </Badge>
    )
  }

  // Handle SPCR action
  const handleSPCRAction = (spcr: SPCR, action: "approve" | "reject" | "view" | "implement" | "close-reject") => {
    setActionModal({
      isOpen: true,
      spcr,
      action,
      comment: "",
    })
  }

  // Submit action
  const submitAction = async () => {
    if (!actionModal.spcr) return

    const { spcr, action, comment } = actionModal

    if (action === "view") {
      setActionModal({ isOpen: false, spcr: null, action: "view", comment: "" })
      return
    }

    let newWorkflowStage: SPCR["workflowStage"] = "submitted"
    let newStatus: SPCR["status"] = "pending"

    if (action === "approve") {
      if (userRole === "project-executive") {
        newWorkflowStage = "pe-approved"
        newStatus = "pending" // Still needs executive review
      } else {
        newWorkflowStage = "final-approved"
        newStatus = "approved"
      }
    } else if (action === "reject") {
      if (userRole === "project-executive") {
        newWorkflowStage = "pe-rejected"
        newStatus = "rejected"
      } else {
        newWorkflowStage = "final-rejected"
        newStatus = "rejected"
      }
    } else if (action === "implement") {
      // Executive implementing an approved SPCR
      newWorkflowStage = "closed"
      newStatus = "approved"
    } else if (action === "close-reject") {
      // Executive rejecting an approved SPCR post-approval
      newWorkflowStage = "closed"
      newStatus = "rejected"
    }

    // Update SPCR
    updateSPCR(spcr.id, {
      workflowStage: newWorkflowStage,
      status: newStatus,
    })

    // Add comment if provided
    if (comment.trim()) {
      // Map action to valid comment action type
      let commentAction: "approve" | "reject" | "forward" | undefined
      if (action === "approve") {
        commentAction = "approve"
      } else if (action === "reject") {
        commentAction = "reject"
      } else if (action === "implement" || action === "close-reject") {
        commentAction = "forward" // Map implement/close-reject to forward
      }

      addSPCRComment(spcr.id, {
        id: `comment-${Date.now()}`,
        author: "Current User", // Would use actual user name
        content: comment,
        timestamp: new Date().toISOString(),
        action: commentAction,
      })
    }

    setActionModal({ isOpen: false, spcr: null, action: "view", comment: "" })
  }

  // Get filter options based on role
  const getFilterOptions = () => {
    const baseOptions = [{ value: "all", label: "All SPCRs", count: spcrCounts.total }]

    if (userRole === "project-manager") {
      return [
        ...baseOptions,
        { value: "pending", label: "In Progress", count: spcrCounts.pending },
        { value: "approved", label: "Approved", count: spcrCounts.approved },
        { value: "rejected", label: "Rejected", count: spcrCounts.rejected },
        { value: "closed", label: "Closed", count: spcrCounts.closed },
      ]
    } else if (userRole === "project-executive") {
      return [
        { value: "pending", label: "Awaiting Review", count: spcrCounts.pending },
        ...baseOptions,
        { value: "approved", label: "Approved by Me", count: spcrCounts.approved },
        { value: "rejected", label: "Rejected by Me", count: spcrCounts.rejected },
        { value: "closed", label: "Closed", count: spcrCounts.closed },
      ]
    } else {
      return [
        { value: "approved", label: "Approved", count: spcrCounts.approved }, // Default view for executives
        { value: "pending", label: "Awaiting Review", count: spcrCounts.pending },
        ...baseOptions,
        { value: "rejected", label: "Rejected", count: spcrCounts.rejected },
        { value: "closed", label: "Closed", count: spcrCounts.closed },
      ]
    }
  }

  const getTitle = () => {
    switch (userRole) {
      case "executive":
        return "Executive SPCR Review"
      case "project-executive":
        return "Portfolio SPCR Inbox"
      case "project-manager":
        return "My SPCR Requests"
      default:
        return "SPCR Inbox"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Inbox className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            {getTitle()}
          </CardTitle>

          {spcrCounts.needsAction > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {spcrCounts.needsAction} Need Action
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{spcrCounts.pending}</div>
            <div className="text-xs text-blue-600 dark:text-blue-400">Pending</div>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-950/50 rounded-lg">
            <div className="text-xl font-bold text-green-600 dark:text-green-400">{spcrCounts.approved}</div>
            <div className="text-xs text-green-600 dark:text-green-400">Approved</div>
          </div>
          <div className="text-center p-3 bg-red-50 dark:bg-red-950/50 rounded-lg">
            <div className="text-xl font-bold text-red-600 dark:text-red-400">{spcrCounts.rejected}</div>
            <div className="text-xs text-red-600 dark:text-red-400">Rejected</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-950/50 rounded-lg">
            <div className="text-xl font-bold text-gray-600 dark:text-gray-400">{spcrCounts.closed}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Closed</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950/50 rounded-lg">
            <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{spcrCounts.needsAction}</div>
            <div className="text-xs text-yellow-600 dark:text-yellow-400">Needs Action</div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={spcrViewFilter} onValueChange={setSPCRViewFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {getFilterOptions().map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label} ({option.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* SPCR List */}
        <div className="space-y-3">
          {filteredSPCRs.length > 0 ? (
            filteredSPCRs.map((spcr) => (
              <Card key={spcr.id} className="border hover:bg-accent/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        {getTypeBadge(spcr.type)}
                        <span className="text-sm font-medium">{spcr.position}</span>
                        {getStatusBadge(spcr)}
                      </div>

                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-4 mb-1">
                          <span className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {getProjectName(spcr.project_id)}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />${spcr.budget.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(spcr.createdAt), "MMM dd, yyyy")}
                          </span>
                        </div>
                        <div className="text-xs">{spcr.explanation.slice(0, 100)}...</div>
                      </div>

                      {spcr.comments && spcr.comments.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MessageSquare className="h-3 w-3" />
                          {spcr.comments.length} comment{spcr.comments.length !== 1 ? "s" : ""}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => handleSPCRAction(spcr, "view")}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>

                      {/* Show action buttons based on role and SPCR status */}
                      {((userRole === "project-executive" && spcr.workflowStage === "pe-review") ||
                        (userRole === "executive" && spcr.workflowStage === "executive-review")) && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSPCRAction(spcr, "approve")}
                            className="border-green-500 text-green-600 hover:bg-green-50"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSPCRAction(spcr, "reject")}
                            className="border-red-500 text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}

                      {/* Executive final actions on approved SPCRs */}
                      {userRole === "executive" && ["pe-approved", "final-approved"].includes(spcr.workflowStage) && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSPCRAction(spcr, "implement")}
                            className="border-blue-500 text-blue-600 hover:bg-blue-50"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Implement
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSPCRAction(spcr, "close-reject")}
                            className="border-orange-500 text-orange-600 hover:bg-orange-50"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Close & Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Inbox className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <div className="text-sm">No SPCRs found</div>
              <div className="text-xs">
                {spcrViewFilter === "all" ? "No SPCRs in your scope" : `No ${spcrViewFilter} SPCRs`}
              </div>
            </div>
          )}
        </div>

        {filteredSPCRs.length > 8 && (
          <div className="text-center">
            <Button variant="outline" size="sm">
              View All ({filteredSPCRs.length})
            </Button>
          </div>
        )}
      </CardContent>

      {/* Action Modal */}
      <Dialog
        open={actionModal.isOpen}
        onOpenChange={(open) => !open && setActionModal({ isOpen: false, spcr: null, action: "view", comment: "" })}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {actionModal.action === "view"
                ? "SPCR Details"
                : actionModal.action === "approve"
                ? "Approve SPCR"
                : "Reject SPCR"}
            </DialogTitle>
          </DialogHeader>

          {actionModal.spcr && (
            <div className="space-y-4">
              {/* SPCR Details */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">SPCR-{actionModal.spcr.id.split("-")[1]}</span>
                  {getStatusBadge(actionModal.spcr)}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Project:</strong> {getProjectName(actionModal.spcr.project_id)}
                  </div>
                  <div>
                    <strong>Type:</strong> {actionModal.spcr.type === "increase" ? "Add Staff" : "Remove Staff"}
                  </div>
                  <div>
                    <strong>Position:</strong> {actionModal.spcr.position}
                  </div>
                  <div>
                    <strong>Budget Impact:</strong> ${actionModal.spcr.budget.toLocaleString()}
                  </div>
                  <div>
                    <strong>Start Date:</strong> {format(new Date(actionModal.spcr.startDate), "MMM dd, yyyy")}
                  </div>
                  <div>
                    <strong>End Date:</strong> {format(new Date(actionModal.spcr.endDate), "MMM dd, yyyy")}
                  </div>
                </div>

                <div>
                  <strong>Justification:</strong>
                  <p className="text-sm text-muted-foreground mt-1">{actionModal.spcr.explanation}</p>
                </div>

                {actionModal.spcr.scheduleRef && (
                  <div>
                    <strong>Schedule Reference:</strong>
                    <p className="text-sm text-muted-foreground">{actionModal.spcr.scheduleRef}</p>
                  </div>
                )}
              </div>

              {/* Comments */}
              {actionModal.spcr.comments && actionModal.spcr.comments.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Comments & History</h4>
                  {actionModal.spcr.comments.map((comment) => (
                    <div key={comment.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{comment.author}</span>
                        <div className="flex items-center gap-2">
                          {comment.action && (
                            <Badge
                              variant={comment.action === "approve" ? "default" : "destructive"}
                              className="text-xs"
                            >
                              {comment.action}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(comment.timestamp), "MMM dd, yyyy HH:mm")}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Form */}
              {actionModal.action !== "view" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {actionModal.action === "approve" ? "Approval Comments" : "Rejection Reason"}
                    </label>
                    <Textarea
                      placeholder={
                        actionModal.action === "approve"
                          ? "Add any comments for the approval..."
                          : "Please provide a reason for rejection..."
                      }
                      value={actionModal.comment}
                      onChange={(e) => setActionModal((prev) => ({ ...prev, comment: e.target.value }))}
                      rows={4}
                    />
                  </div>

                  {actionModal.action === "approve" && userRole === "project-executive" && (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        This approval will forward the SPCR to Executive review for final approval.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setActionModal({ isOpen: false, spcr: null, action: "view", comment: "" })}
                >
                  {actionModal.action === "view" ? "Close" : "Cancel"}
                </Button>

                {actionModal.action !== "view" && (
                  <Button
                    onClick={submitAction}
                    className={
                      actionModal.action === "approve"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    }
                  >
                    {actionModal.action === "approve"
                      ? userRole === "project-executive"
                        ? "Approve & Forward"
                        : "Final Approve"
                      : "Reject SPCR"}
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}
