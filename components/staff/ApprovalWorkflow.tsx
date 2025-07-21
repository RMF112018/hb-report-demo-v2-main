import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { CheckCircle, XCircle, Clock, User, Calendar, DollarSign, AlertTriangle, History } from "lucide-react"

export interface SPCR {
  id: string
  projectId: string
  projectName: string
  type: string
  status: string
  requestedBy: string
  requestedDate: string
  position: string
  budget: number
  justification: string
  urgency: string
  comments?: string
  approvalHistory?: ApprovalAction[]
}

export interface ApprovalAction {
  id: string
  action: "approved" | "rejected"
  approver: string
  date: string
  comment: string
}

interface ApprovalWorkflowProps {
  spcr: SPCR
  onApprove: (spcrId: string, comment: string) => void
  onReject: (spcrId: string, comment: string) => void
  onClose: () => void
}

export function ApprovalWorkflow({ spcr, onApprove, onReject, onClose }: ApprovalWorkflowProps) {
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false)
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false)
  const [approvalComment, setApprovalComment] = useState("")
  const [rejectionComment, setRejectionComment] = useState("")

  const handleApprove = () => {
    if (approvalComment.trim()) {
      onApprove(spcr.id, approvalComment)
      setApprovalComment("")
      setIsApprovalDialogOpen(false)
    }
  }

  const handleReject = () => {
    if (rejectionComment.trim()) {
      onReject(spcr.id, rejectionComment)
      setRejectionComment("")
      setIsRejectionDialogOpen(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "submitted":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      submitted: "bg-yellow-100 text-yellow-800",
      draft: "bg-gray-100 text-gray-800",
    }
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
  }

  const getTypeBadge = (type: string) => {
    return type === "increase" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Approval Workflow</h2>
          <p className="text-muted-foreground">Review and approve/reject staff planning change requests</p>
        </div>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>

      {/* SPCR Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(spcr.status)}
                SPCR #{spcr.id}
              </CardTitle>
              <CardDescription>
                {spcr.projectName} • {spcr.position}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge className={getStatusBadge(spcr.status)}>
                {spcr.status.charAt(0).toUpperCase() + spcr.status.slice(1)}
              </Badge>
              <Badge className={getTypeBadge(spcr.type)}>
                {spcr.type === "increase" ? "Staff Increase" : "Staff Decrease"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Request Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Request Details</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="font-medium">Requested by:</span> {spcr.requestedBy}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="font-medium">Requested on:</span> {spcr.requestedDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="font-medium">Budget impact:</span> ${spcr.budget.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Justification</h4>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">{spcr.justification}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Approval History */}
          {spcr.approvalHistory && spcr.approvalHistory.length > 0 && (
            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <History className="h-4 w-4" />
                Approval History
              </h4>
              <div className="space-y-3">
                {spcr.approvalHistory.map((action) => (
                  <div key={action.id} className="flex items-start gap-3 p-3 bg-muted rounded-md">
                    <div className="flex-shrink-0">
                      {action.action === "approved" ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{action.approver}</span>
                        <Badge variant="outline" className="text-xs">
                          {action.action.charAt(0).toUpperCase() + action.action.slice(1)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{action.date}</span>
                      </div>
                      {action.comment && <p className="text-sm text-muted-foreground">{action.comment}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {spcr.status === "submitted" && (
            <div className="flex gap-3 pt-4">
              <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Approve SPCR</DialogTitle>
                    <DialogDescription>Provide a comment for this approval decision.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Approval Comment</label>
                      <Textarea
                        value={approvalComment}
                        onChange={(e) => setApprovalComment(e.target.value)}
                        placeholder="Enter approval comment..."
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsApprovalDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleApprove} disabled={!approvalComment.trim()}>
                      Approve
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isRejectionDialogOpen} onOpenChange={setIsRejectionDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Reject
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reject SPCR</DialogTitle>
                    <DialogDescription>Provide a reason for rejecting this request.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Rejection Reason</label>
                      <Textarea
                        value={rejectionComment}
                        onChange={(e) => setRejectionComment(e.target.value)}
                        placeholder="Enter rejection reason..."
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsRejectionDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleReject} disabled={!rejectionComment.trim()}>
                      Reject
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
