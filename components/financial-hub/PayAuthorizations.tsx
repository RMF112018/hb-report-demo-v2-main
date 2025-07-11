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

  // Role-based API data - matching previous version requirements
  const getPayAuthData = () => {
    switch (userRole) {
      case "project-manager":
        return {
          pendingApprovals: 3,
          preliminaryApproved: 1,
          finalApproved: 8,
          totalRequests: 12,
          approvedAmount: 8500000,
          pendingAmount: 2850000,
        }
      case "project-executive":
        return {
          pendingApprovals: 12,
          preliminaryApproved: 4,
          finalApproved: 32,
          totalRequests: 48,
          approvedAmount: 45200000,
          pendingAmount: 8200000,
        }
      default:
        return {
          pendingApprovals: 23,
          preliminaryApproved: 8,
          finalApproved: 58,
          totalRequests: 89,
          approvedAmount: 85600000,
          pendingAmount: 12500000,
        }
    }
  }

  // Mock data based on role - more sophisticated structure but role-based quantities
  const generateMockData = (): PaymentAuthorization[] => {
    const roleData = getPayAuthData()
    const mockData: PaymentAuthorization[] = []

    // Generate pending authorizations based on role
    for (let i = 1; i <= roleData.pendingApprovals; i++) {
      mockData.push({
        id: `PA-${String(i).padStart(3, "0")}`,
        projectId: "2525840",
        jobName: "PALM BEACH LUXURY ESTATE",
        payAppNumber: 25 + i,
        periodThru: "2025-04-30",
        dateReceived: "2025-06-19",
        payAppValue: 2280257.6 + i * 100000,
        amountReceived: 2280257.58 + i * 100000,
        balanceDue: 0.02,
        amountApprovedForPayment: 2033723.98 + i * 90000,
        status: "pending",
        createdBy: "accounting@company.com",
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
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
        messageThreadId: `thread-${String(i).padStart(3, "0")}`,
        approvalHistory: [
          {
            step: "Created",
            status: "created",
            approvedBy: "Sarah Martinez",
            approvedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
            notes: `Payment authorization created for Pay App #${25 + i}`,
          },
        ],
      })
    }

    // Add some preliminary approved based on role
    for (let i = 1; i <= roleData.preliminaryApproved; i++) {
      mockData.push({
        id: `PA-P${String(i).padStart(2, "0")}`,
        projectId: "2525840",
        jobName: "PALM BEACH LUXURY ESTATE",
        payAppNumber: 20 + i,
        periodThru: "2025-03-31",
        dateReceived: "2025-05-19",
        payAppValue: 1800000 + i * 80000,
        amountReceived: 1800000 + i * 80000,
        balanceDue: 0,
        amountApprovedForPayment: 1650000 + i * 75000,
        status: "preliminary_approved",
        createdBy: "accounting@company.com",
        createdAt: new Date(Date.now() - (i + 10) * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - (i + 5) * 24 * 60 * 60 * 1000).toISOString(),
        projectManager: "Wanda Johnson",
        accountingContact: "Sarah Martinez",
        compliance: {
          correctProjectNumbers: true,
          finalReleases: true,
          timberscanApproved: true,
          certificatesOnFile: true,
          licensesOnFile: true,
          executedPayApplications: true,
        },
        comments: "Preliminary approval completed",
        messageThreadId: `thread-p${String(i).padStart(2, "0")}`,
        approvalHistory: [
          {
            step: "Created",
            status: "created",
            approvedBy: "Sarah Martinez",
            approvedAt: new Date(Date.now() - (i + 10) * 24 * 60 * 60 * 1000).toISOString(),
            notes: `Payment authorization created for Pay App #${20 + i}`,
          },
          {
            step: "Preliminary Approved",
            status: "preliminary_approved",
            approvedBy: userRole,
            approvedAt: new Date(Date.now() - (i + 5) * 24 * 60 * 60 * 1000).toISOString(),
            notes: "Preliminary approval granted",
          },
        ],
      })
    }

    return mockData
  }

  const [paymentAuthorizations] = useState<PaymentAuthorization[]>(generateMockData())

  const data = getPayAuthData()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
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
        color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
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
      <Card className="mt-4">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckSquare className="h-5 w-5" />
            TIMBERSCAN Compliance Verification
          </CardTitle>
          <CardDescription>Complete all items to avoid payment delays</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {!allCompleted && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="font-medium text-red-600 dark:text-red-400">
                *** NOT COMPLETING THE LAST 4 ITEMS WILL DELAY THE RELEASE OF PAYMENTS ***
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="correctProjectNumbers"
                checked={localCompliance.correctProjectNumbers}
                onCheckedChange={(checked) => handleComplianceChange("correctProjectNumbers", checked as boolean)}
                disabled={!isEditing && userRole !== "project-manager"}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="correctProjectNumbers" className="text-sm font-medium">
                  Confirm correct project numbers considered for current payment
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
                    Indicate any FINAL RELEASES needed with current check run
                  </Label>
                </div>
              </div>
              <Textarea
                placeholder="Enter details about final releases needed..."
                value={notes}
                onChange={(e) => handleNotesChange(e.target.value)}
                disabled={!isEditing && userRole !== "project-manager"}
                className="mt-2 h-20"
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
                  Confirm TIMBERSCAN items selected for payment have been APPROVED
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
                  Confirm CURRENT CERTIFICATES OF INSURANCE ON FILE for all payees
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
                  Confirm CURRENT APPLICABLE LICENSES ON FILE for all payees
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
                  Ensure EXECUTED pay applications submitted AND SUB AFFIDAVIT completed
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
        <CardHeader className="pb-4">
          <CardTitle>Payment Authorization Details</CardTitle>
          <CardDescription>Project: {authorization.jobName}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="projectId" className="text-sm">
                    Project ID:
                  </Label>
                  <Input
                    id="projectId"
                    value={formData.projectId}
                    onChange={(e) => handleInputChange("projectId", e.target.value)}
                    disabled={!isEditing}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label htmlFor="payAppNumber" className="text-sm">
                    Pay App #
                  </Label>
                  <Input
                    id="payAppNumber"
                    type="number"
                    value={formData.payAppNumber}
                    onChange={(e) => handleInputChange("payAppNumber", parseInt(e.target.value))}
                    disabled={!isEditing}
                    className="h-8"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="periodThru" className="text-sm">
                    Period thru:
                  </Label>
                  <Input
                    id="periodThru"
                    type="date"
                    value={formData.periodThru}
                    onChange={(e) => handleInputChange("periodThru", e.target.value)}
                    disabled={!isEditing}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label htmlFor="dateReceived" className="text-sm">
                    Date Received:
                  </Label>
                  <Input
                    id="dateReceived"
                    type="date"
                    value={formData.dateReceived}
                    onChange={(e) => handleInputChange("dateReceived", e.target.value)}
                    disabled={!isEditing}
                    className="h-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <Label htmlFor="payAppValue" className="text-sm">
                    Pay App Value:
                  </Label>
                  <Input
                    id="payAppValue"
                    type="number"
                    step="0.01"
                    value={formData.payAppValue}
                    onChange={(e) => handleInputChange("payAppValue", parseFloat(e.target.value))}
                    disabled={!isEditing}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label htmlFor="amountReceived" className="text-sm">
                    Amount Received:
                  </Label>
                  <Input
                    id="amountReceived"
                    type="number"
                    step="0.01"
                    value={formData.amountReceived}
                    onChange={(e) => handleInputChange("amountReceived", parseFloat(e.target.value))}
                    disabled={!isEditing}
                    className="h-8"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="invoiceNumber" className="text-sm">
                    INVOICE #
                  </Label>
                  <Input
                    id="invoiceNumber"
                    value={formData.invoiceNumber || ""}
                    onChange={(e) => handleInputChange("invoiceNumber", e.target.value)}
                    disabled={!isEditing}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label htmlFor="invoicePeriodThru" className="text-sm">
                    Period thru:
                  </Label>
                  <Input
                    id="invoicePeriodThru"
                    type="date"
                    value={formData.invoicePeriodThru || ""}
                    onChange={(e) => handleInputChange("invoicePeriodThru", e.target.value)}
                    disabled={!isEditing}
                    className="h-8"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="invoiceValue" className="text-sm">
                  Invoice Value:
                </Label>
                <Input
                  id="invoiceValue"
                  type="number"
                  step="0.01"
                  value={formData.invoiceValue || ""}
                  onChange={(e) => handleInputChange("invoiceValue", parseFloat(e.target.value))}
                  disabled={!isEditing}
                  className="h-8"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
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
                className="text-lg font-semibold bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700 h-10"
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
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Workflow Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center space-x-3">
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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" onClick={() => setActiveView("dashboard")} className="mb-2">
              ← Back to Dashboard
            </Button>
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold">Payment Authorization {selectedAuthorization.id}</h2>
              {getStatusBadge(selectedAuthorization.status)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing && userRole === "project-manager" && (
              <Button variant="outline" onClick={() => setIsEditing(true)} size="sm">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
            {isEditing && (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)} size="sm">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={() => setIsEditing(false)} size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </>
            )}
            <Button variant="outline" onClick={() => setShowMessageThread(!showMessageThread)} size="sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              Comments
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <PaymentDetailsForm authorization={selectedAuthorization} onUpdate={handleUpdateAuthorization} />

            <ComplianceChecklistCard authorization={selectedAuthorization} onUpdate={handleUpdateAuthorization} />

            {userRole === "project-manager" && selectedAuthorization.status === "pending" && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Project Manager Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprovalAction("preliminary_approve")}
                      className="bg-blue-600 hover:bg-blue-700"
                      size="sm"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Preliminary Approval
                    </Button>
                    <Button variant="destructive" onClick={() => handleApprovalAction("reject")} size="sm">
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {userRole === "project-manager" && selectedAuthorization.status === "preliminary_approved" && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Final Authorization</CardTitle>
                  <CardDescription>
                    Accounting has confirmed payment receipt from Owner. Please provide final authorization.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprovalAction("final_approve")}
                      className="bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Final Approval
                    </Button>
                    <Button variant="destructive" onClick={() => handleApprovalAction("reject")} size="sm">
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <WorkflowProgress authorization={selectedAuthorization} />

            {showMessageThread && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Discussion Thread</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-80">
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
      {/* Dashboard Overview - Role-based API data matching previous version */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{data.pendingApprovals}</div>
            <div className="text-xs text-muted-foreground">Awaiting approval</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalRequests}</div>
            <div className="text-xs text-muted-foreground">This month</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Amount</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(data.approvedAmount)}
            </div>
            <div className="text-xs text-muted-foreground">YTD approved</div>
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
            <div className="text-xs text-muted-foreground">Requires approval</div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Authorizations List - Compact Design */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payment Authorization Workflow</CardTitle>
              <CardDescription>Streamlined approval process for payment authorizations</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Approval Routing
              </Badge>
              <Badge variant="outline" className="text-xs">
                Status Tracking
              </Badge>
              <Badge variant="outline" className="text-xs">
                Audit Trail
              </Badge>
              <Button onClick={() => setActiveView("create")} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Authorization
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paymentAuthorizations.map((auth) => (
              <div
                key={auth.id}
                className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => {
                  setSelectedAuthorization(auth)
                  setActiveView("details")
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">
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

            {paymentAuthorizations.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-sm font-medium mb-1">No Payment Authorizations</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Payment authorizations will appear here as they are created and submitted for approval.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
