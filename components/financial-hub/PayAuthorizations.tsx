"use client"

import React, { useState, useEffect } from "react"
import {
  CheckCircle,
  Clock,
  FileText,
  AlertTriangle,
  DollarSign,
  User,
  Calendar,
  MessageSquare,
  Download,
  Upload,
  Send,
  CheckSquare,
  Square,
  Eye,
  Edit3,
  Save,
  X,
  Plus,
  AlertCircle,
  Zap,
  ChevronDown,
  ChevronUp,
  Bot,
  TrendingUp,
  Target,
  Info,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageBoard } from "@/app/tools/productivity/components/MessageBoard"

interface PayAuthorizationsProps {
  userRole: string
  projectData: any
}

interface PaymentAuthorization {
  id: string
  projectId: string
  jobName: string
  payAppNumber: number
  periodThru: string
  dateReceived: string
  payAppValue: number
  amountReceived: number
  balanceDue: number
  invoiceNumber?: string
  invoicePeriodThru?: string
  invoiceDateReceived?: string
  invoiceValue?: number
  invoiceAmountReceived?: number
  invoiceBalanceDue?: number
  amountApprovedForPayment: number
  status: "pending" | "preliminary_approved" | "final_approved" | "rejected" | "paid"
  createdBy: string
  createdAt: string
  updatedAt: string
  projectManager: string
  accountingContact: string
  compliance: {
    correctProjectNumbers: boolean
    finalReleases: boolean
    finalReleasesNotes?: string
    timberscanApproved: boolean
    certificatesOnFile: boolean
    licensesOnFile: boolean
    executedPayApplications: boolean
  }
  comments: string
  messageThreadId?: string
  approvalHistory: {
    step: string
    status: string
    approvedBy: string
    approvedAt: string
    notes?: string
  }[]
}

export default function PayAuthorizations({ userRole, projectData }: PayAuthorizationsProps) {
  const [activeView, setActiveView] = useState<"dashboard" | "create" | "review" | "details">("dashboard")
  const [selectedAuthorization, setSelectedAuthorization] = useState<PaymentAuthorization | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showMessageThread, setShowMessageThread] = useState(false)

  // Mock data - in real app this would come from API
  const [paymentAuthorizations, setPaymentAuthorizations] = useState<PaymentAuthorization[]>([
    {
      id: "PA-001",
      projectId: "2525840",
      jobName: "PALM BEACH LUXURY ESTATE",
      payAppNumber: 25,
      periodThru: "2025-04-30",
      dateReceived: "2025-06-19",
      payAppValue: 2280257.6,
      amountReceived: 2280257.58,
      balanceDue: 0.02,
      amountApprovedForPayment: 2033723.98,
      status: "pending",
      createdBy: "accounting@company.com",
      createdAt: "2025-06-19T10:00:00Z",
      updatedAt: "2025-06-19T10:00:00Z",
      projectManager: "Wanda Johnson",
      accountingContact: "Sarah Martinez",
      compliance: {
        correctProjectNumbers: false,
        finalReleases: false,
        timberscanApproved: false,
        certificatesOnFile: false,
        licensesOnFile: false,
        executedPayApplications: false,
      },
      comments: "",
      messageThreadId: "thread-001",
      approvalHistory: [
        {
          step: "Created",
          status: "created",
          approvedBy: "Sarah Martinez",
          approvedAt: "2025-06-19T10:00:00Z",
          notes: "Payment authorization created for Pay App #25",
        },
      ],
    },
  ])

  const getPayAuthData = () => {
    const pending = paymentAuthorizations.filter((p) => p.status === "pending").length
    const preliminaryApproved = paymentAuthorizations.filter((p) => p.status === "preliminary_approved").length
    const finalApproved = paymentAuthorizations.filter((p) => p.status === "final_approved").length
    const totalValue = paymentAuthorizations.reduce((sum, p) => sum + p.amountApprovedForPayment, 0)
    const pendingValue = paymentAuthorizations
      .filter((p) => p.status === "pending" || p.status === "preliminary_approved")
      .reduce((sum, p) => sum + p.amountApprovedForPayment, 0)

    return {
      pendingApprovals: pending,
      preliminaryApproved,
      finalApproved,
      totalRequests: paymentAuthorizations.length,
      approvedAmount: totalValue - pendingValue,
      pendingAmount: pendingValue,
    }
  }

  const data = getPayAuthData()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        label: "Pending Review",
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      },
      preliminary_approved: {
        label: "Preliminary Approved",
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      },
      final_approved: {
        label: "Final Approved",
        color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      },
      rejected: { label: "Rejected", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
      paid: { label: "Paid", color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300" },
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge className={`${config.color} border-0`}>{config.label}</Badge>
  }

  const getWorkflowStep = (status: string) => {
    const steps = {
      pending: 1,
      preliminary_approved: 2,
      final_approved: 3,
      paid: 4,
    }
    return steps[status as keyof typeof steps] || 1
  }

  const ComplianceChecklistCard = ({
    authorization,
    onUpdate,
  }: {
    authorization: PaymentAuthorization
    onUpdate: (updated: PaymentAuthorization) => void
  }) => {
    const [localCompliance, setLocalCompliance] = useState(authorization.compliance)
    const [notes, setNotes] = useState(authorization.compliance.finalReleasesNotes || "")

    const handleComplianceChange = (field: keyof typeof localCompliance, value: boolean) => {
      const updatedCompliance = { ...localCompliance, [field]: value }
      setLocalCompliance(updatedCompliance)

      const updatedAuth = {
        ...authorization,
        compliance: updatedCompliance,
        updatedAt: new Date().toISOString(),
      }
      onUpdate(updatedAuth)
    }

    const handleNotesChange = (value: string) => {
      setNotes(value)
      const updatedAuth = {
        ...authorization,
        compliance: { ...localCompliance, finalReleasesNotes: value },
        updatedAt: new Date().toISOString(),
      }
      onUpdate(updatedAuth)
    }

    const allCompleted = Object.values(localCompliance)
      .filter((v) => typeof v === "boolean")
      .every(Boolean)

    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            TIMBERSCAN Compliance Verification
          </CardTitle>
          <CardDescription>Complete all items to avoid payment delays</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!allCompleted && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="font-medium text-red-600 dark:text-red-400">
                *** NOT COMPLETING THE LAST 4 ITEMS WILL DELAY THE RELEASE OF PAYMENTS ***
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="correctProjectNumbers"
                checked={localCompliance.correctProjectNumbers}
                onCheckedChange={(checked) => handleComplianceChange("correctProjectNumbers", checked as boolean)}
                disabled={!isEditing && userRole !== "project-manager"}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="correctProjectNumbers" className="text-sm font-medium">
                  Please confirm that the correct project numbers (ABOVE) were considered for the current payment.
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="finalReleases"
                  checked={localCompliance.finalReleases}
                  onCheckedChange={(checked) => handleComplianceChange("finalReleases", checked as boolean)}
                  disabled={!isEditing && userRole !== "project-manager"}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="finalReleases" className="text-sm font-medium">
                    Please indicate any FINAL RELEASES that need to be requested with the current check run.
                  </Label>
                </div>
              </div>
              <Textarea
                placeholder="Enter details about final releases needed..."
                value={notes}
                onChange={(e) => handleNotesChange(e.target.value)}
                disabled={!isEditing && userRole !== "project-manager"}
                className="mt-2"
              />
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="timberscanApproved"
                checked={localCompliance.timberscanApproved}
                onCheckedChange={(checked) => handleComplianceChange("timberscanApproved", checked as boolean)}
                disabled={!isEditing && userRole !== "project-manager"}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="timberscanApproved" className="text-sm font-medium">
                  Please confirm that ANY TIMBERSCAN items selected and/or items attached for payment for this funding
                  have been APPROVED through TIMBERSCAN. The check run will occur AFTER ALL items have been approved and
                  posted to Sage.
                </Label>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="certificatesOnFile"
                checked={localCompliance.certificatesOnFile}
                onCheckedChange={(checked) => handleComplianceChange("certificatesOnFile", checked as boolean)}
                disabled={!isEditing && userRole !== "project-manager"}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="certificatesOnFile" className="text-sm font-medium">
                  Please confirm that you have CURRENT CERTIFICATES OF INSURANCE ON FILE for all payees for this check
                  run.
                </Label>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="licensesOnFile"
                checked={localCompliance.licensesOnFile}
                onCheckedChange={(checked) => handleComplianceChange("licensesOnFile", checked as boolean)}
                disabled={!isEditing && userRole !== "project-manager"}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="licensesOnFile" className="text-sm font-medium">
                  Please confirm that you have CURRENT APPLICABLE LICENSES ON FILE for all payees for this check run.
                </Label>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="executedPayApplications"
                checked={localCompliance.executedPayApplications}
                onCheckedChange={(checked) => handleComplianceChange("executedPayApplications", checked as boolean)}
                disabled={!isEditing && userRole !== "project-manager"}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="executedPayApplications" className="text-sm font-medium">
                  Please ensure EXECUTED pay applications have been submitted AND SUB AFFIDAVIT is completed.
                </Label>
              </div>
            </div>
          </div>

          {allCompleted && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-green-600 dark:text-green-400">
                All compliance items have been verified. Payment can proceed.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    )
  }

  const PaymentDetailsForm = ({
    authorization,
    onUpdate,
  }: {
    authorization: PaymentAuthorization
    onUpdate: (updated: PaymentAuthorization) => void
  }) => {
    const [formData, setFormData] = useState(authorization)

    const handleInputChange = (field: string, value: any) => {
      const updated = { ...formData, [field]: value, updatedAt: new Date().toISOString() }
      setFormData(updated)
      onUpdate(updated)
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Authorization Details</CardTitle>
          <CardDescription>Project: {authorization.jobName}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="projectId">Project ID:</Label>
                  <Input
                    id="projectId"
                    value={formData.projectId}
                    onChange={(e) => handleInputChange("projectId", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="payAppNumber">Pay App #</Label>
                  <Input
                    id="payAppNumber"
                    type="number"
                    value={formData.payAppNumber}
                    onChange={(e) => handleInputChange("payAppNumber", parseInt(e.target.value))}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="periodThru">Period thru:</Label>
                  <Input
                    id="periodThru"
                    type="date"
                    value={formData.periodThru}
                    onChange={(e) => handleInputChange("periodThru", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="dateReceived">Date Received:</Label>
                  <Input
                    id="dateReceived"
                    type="date"
                    value={formData.dateReceived}
                    onChange={(e) => handleInputChange("dateReceived", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="payAppValue">Pay App Value:</Label>
                  <Input
                    id="payAppValue"
                    type="number"
                    step="0.01"
                    value={formData.payAppValue}
                    onChange={(e) => handleInputChange("payAppValue", parseFloat(e.target.value))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="amountReceived">Amount Received:</Label>
                  <Input
                    id="amountReceived"
                    type="number"
                    step="0.01"
                    value={formData.amountReceived}
                    onChange={(e) => handleInputChange("amountReceived", parseFloat(e.target.value))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="balanceDue">Balance Due:</Label>
                  <Input
                    id="balanceDue"
                    type="number"
                    step="0.01"
                    value={formData.balanceDue}
                    onChange={(e) => handleInputChange("balanceDue", parseFloat(e.target.value))}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="invoiceNumber">INVOICE #</Label>
                  <Input
                    id="invoiceNumber"
                    value={formData.invoiceNumber || ""}
                    onChange={(e) => handleInputChange("invoiceNumber", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="invoicePeriodThru">Period thru:</Label>
                  <Input
                    id="invoicePeriodThru"
                    type="date"
                    value={formData.invoicePeriodThru || ""}
                    onChange={(e) => handleInputChange("invoicePeriodThru", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="invoiceDateReceived">Date Received:</Label>
                <Input
                  id="invoiceDateReceived"
                  type="date"
                  value={formData.invoiceDateReceived || ""}
                  onChange={(e) => handleInputChange("invoiceDateReceived", e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="invoiceValue">Invoice Value:</Label>
                  <Input
                    id="invoiceValue"
                    type="number"
                    step="0.01"
                    value={formData.invoiceValue || ""}
                    onChange={(e) => handleInputChange("invoiceValue", parseFloat(e.target.value))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="invoiceAmountReceived">Amount Received:</Label>
                  <Input
                    id="invoiceAmountReceived"
                    type="number"
                    step="0.01"
                    value={formData.invoiceAmountReceived || ""}
                    onChange={(e) => handleInputChange("invoiceAmountReceived", parseFloat(e.target.value))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="invoiceBalanceDue">Balance Due:</Label>
                  <Input
                    id="invoiceBalanceDue"
                    type="number"
                    step="0.01"
                    value={formData.invoiceBalanceDue || 0}
                    onChange={(e) => handleInputChange("invoiceBalanceDue", parseFloat(e.target.value))}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <Label
              htmlFor="amountApprovedForPayment"
              className="text-sm font-medium text-yellow-800 dark:text-yellow-200"
            >
              Amount Approved for Payment:
            </Label>
            <div className="mt-2">
              <Input
                id="amountApprovedForPayment"
                type="number"
                step="0.01"
                value={formData.amountApprovedForPayment}
                onChange={(e) => handleInputChange("amountApprovedForPayment", parseFloat(e.target.value))}
                disabled={!isEditing}
                className="text-lg font-semibold bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700"
              />
            </div>
            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
              Please provide the total amount you authorize being paid out with this funding
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const WorkflowProgress = ({ authorization }: { authorization: PaymentAuthorization }) => {
    const currentStep = getWorkflowStep(authorization.status)
    const steps = [
      { id: 1, name: "Created", description: "Payment authorization created" },
      { id: 2, name: "Under Review", description: "Project Manager reviewing" },
      { id: 3, name: "Approved", description: "Ready for payment" },
      { id: 4, name: "Paid", description: "Payment released" },
    ]

    return (
      <Card>
        <CardHeader>
          <CardTitle>Workflow Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center space-x-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.id <= currentStep
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  {step.id <= currentStep ? <CheckCircle className="w-4 h-4" /> : step.id}
                </div>
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      step.id <= currentStep ? "text-green-800 dark:text-green-300" : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {step.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleUpdateAuthorization = (updated: PaymentAuthorization) => {
    setPaymentAuthorizations((prev) => prev.map((auth) => (auth.id === updated.id ? updated : auth)))
    setSelectedAuthorization(updated)
  }

  const handleApprovalAction = (action: "preliminary_approve" | "final_approve" | "reject") => {
    if (!selectedAuthorization) return

    const statusMap = {
      preliminary_approve: "preliminary_approved",
      final_approve: "final_approved",
      reject: "rejected",
    }

    const updatedAuth = {
      ...selectedAuthorization,
      status: statusMap[action] as PaymentAuthorization["status"],
      updatedAt: new Date().toISOString(),
      approvalHistory: [
        ...selectedAuthorization.approvalHistory,
        {
          step: action.replace("_", " "),
          status: statusMap[action],
          approvedBy: userRole,
          approvedAt: new Date().toISOString(),
          notes: `Payment ${action.replace("_", " ")} by ${userRole}`,
        },
      ],
    }

    handleUpdateAuthorization(updatedAuth)
    setIsEditing(false)
  }

  if (activeView === "details" && selectedAuthorization) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" onClick={() => setActiveView("dashboard")} className="mb-4">
              ← Back to Dashboard
            </Button>
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold">Payment Authorization {selectedAuthorization.id}</h2>
              {getStatusBadge(selectedAuthorization.status)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing && userRole === "project-manager" && (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
            {isEditing && (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={() => setIsEditing(false)}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </>
            )}
            <Button variant="outline" onClick={() => setShowMessageThread(!showMessageThread)}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Comments
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PaymentDetailsForm authorization={selectedAuthorization} onUpdate={handleUpdateAuthorization} />

            <ComplianceChecklistCard authorization={selectedAuthorization} onUpdate={handleUpdateAuthorization} />

            {userRole === "project-manager" && selectedAuthorization.status === "pending" && (
              <Card>
                <CardHeader>
                  <CardTitle>Project Manager Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprovalAction("preliminary_approve")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Preliminary Approval
                    </Button>
                    <Button variant="destructive" onClick={() => handleApprovalAction("reject")}>
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {userRole === "project-manager" && selectedAuthorization.status === "preliminary_approved" && (
              <Card>
                <CardHeader>
                  <CardTitle>Final Authorization</CardTitle>
                  <CardDescription>
                    Accounting has confirmed payment receipt from Owner. Please provide final authorization.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprovalAction("final_approve")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Final Approval
                    </Button>
                    <Button variant="destructive" onClick={() => handleApprovalAction("reject")}>
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <WorkflowProgress authorization={selectedAuthorization} />

            {showMessageThread && (
              <Card>
                <CardHeader>
                  <CardTitle>Discussion Thread</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-96">
                    <MessageBoard selectedThreadId={selectedAuthorization.messageThreadId} className="h-full" />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{data.pendingApprovals}</div>
            <div className="text-xs text-muted-foreground">Awaiting PM review</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preliminary Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data.preliminaryApproved}</div>
            <div className="text-xs text-muted-foreground">Awaiting final approval</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Approved</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(data.approvedAmount)}
            </div>
            <div className="text-xs text-muted-foreground">This period</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {formatCurrency(data.pendingAmount)}
            </div>
            <div className="text-xs text-muted-foreground">Requires authorization</div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Authorizations List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payment Authorizations</CardTitle>
              <CardDescription>Manage payment approvals and workflow</CardDescription>
            </div>
            <Button onClick={() => setActiveView("create")}>
              <Plus className="w-4 h-4 mr-2" />
              New Authorization
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentAuthorizations.map((auth) => (
              <div
                key={auth.id}
                className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => {
                  setSelectedAuthorization(auth)
                  setActiveView("details")
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">
                        {auth.id} - Pay App #{auth.payAppNumber}
                      </h4>
                      {getStatusBadge(auth.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{auth.jobName}</p>
                    <p className="text-xs text-muted-foreground">
                      PM: {auth.projectManager} • Created: {formatDate(auth.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">{formatCurrency(auth.amountApprovedForPayment)}</p>
                    <p className="text-xs text-muted-foreground">Period: {formatDate(auth.periodThru)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
