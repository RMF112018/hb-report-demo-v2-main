"use client"

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { useForm, useFieldArray, useWatch } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { DatePicker } from "@/components/ui/date-picker"
import { 
  Save, 
  X, 
  Edit, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronRight,
  DollarSign,
  Calendar,
  FileText,
  User,
  Building,
  ShieldCheck,
  Clock,
  Target,
  Menu,
  MessageSquare
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { ProcurementLogRecord } from "@/types/procurement"

interface ProcurementLogFormProps {
  record?: ProcurementLogRecord | null
  onSubmit: (data: Partial<ProcurementLogRecord>) => void
  onCancel: () => void
  projectId?: string
  commitmentId?: string
}

interface FormSection {
  id: string
  title: string
  icon: React.ComponentType<any>
  isEditing: boolean
}

export function ProcurementLogForm({ 
  record, 
  onSubmit, 
  onCancel, 
  projectId, 
  commitmentId 
}: ProcurementLogFormProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("general")
  const [editingSections, setEditingSections] = useState<Record<string, boolean>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [initialFormValues, setInitialFormValues] = useState<any>({})
  const sectionsContainerRef = useRef<HTMLDivElement>(null)

  // Form setup with comprehensive default values
  const { 
    control, 
    handleSubmit, 
    reset, 
    watch, 
    setValue, 
    formState: { errors, isValid } 
  } = useForm({
    defaultValues: {
      // Basic Information
      commitment_title: "",
      commitment_number: "",
      vendor_name: "",
      vendor_contact: {
        name: "",
        email: "",
        phone: ""
      },
      
      // CSI and Classification
      csi_code: "",
      csi_description: "",
      contract_type: "subcontract",
      procurement_method: "competitive-bid",
      
      // Financial Data
      contract_amount: 0,
      budget_amount: 0,
      variance: 0,
      variance_percentage: 0,
      retainage_percent: 0,
      link_to_budget_item: "",
      
      // Status and Workflow
      status: "planning",
      compliance_status: "compliant",
      bonds_required: false,
      insurance_verified: false,
      executed: false,
      
      // Dates
      start_date: "",
      completion_date: "",
      contract_date: "",
      signed_contract_received_date: "",
      issued_on_date: "",
      
      // Owner Approval
      owner_approval_required: false,
      owner_approval_status: "",
      owner_meeting_required: false,
      owner_meeting_date: "",
      owner_approval_date: "",
      
      // Allowances
      allowance_included: false,
      total_contract_allowances: 0,
      allowance_reconciliation_total: 0,
      allowance_variance: 0,
      allowances: [],
      
      // Value Engineering
      ve_offered: false,
      total_ve_presented: 0,
      total_ve_accepted: 0,
      total_ve_rejected: 0,
      net_ve_savings: 0,
      ve_items: [],
      
      // Long Lead Items
      long_lead_included: false,
      long_lead_released: false,
      lead_items: [],
      
      // Workflow and Approvals
      scope_review_meeting_date: "",
      spm_review_date: "",
      spm_approval_status: "",
      px_review_date: "",
      px_approval_status: "",
      vp_review_date: "",
      vp_approval_status: "",
      
      // Contract Execution
      loi_sent_date: "",
      loi_returned_date: "",
      subcontract_agreement_sent_date: "",
      fully_executed_sent_date: "",
      
      // Checklist Items
      contract_status: "N",
      schedule_a_status: "N",
      schedule_b_status: "N",
      exhibit_a_status: "N",
      exhibit_b_status: "N",
      exhibit_i_status: "N",
      labor_rates_status: "N",
      unit_rates_status: "N",
      exhibits_status: "N",
      schedule_of_values_status: "N",
      p_and_p_bond_status: "N",
      w_9_status: "N",
      license_status: "N",
      insurance_general_liability_status: "N",
      insurance_auto_status: "N",
      insurance_umbrella_liability_status: "N",
      insurance_workers_comp_status: "N",
      special_requirements_status: "N",
      compliance_manager_status: "N",
      scanned_returned_status: "N",
      
      // Team Assignments
      project_manager: "",
      project_executive: "",
      project_assistant: "",
      compliance_manager: "",
      
      // Compliance and Waivers
      insurance_requirements_to_waive: [],
      insurance_explanation: "",
      insurance_risk_justification: "",
      insurance_waiver_level: "",
      licensing_waiver_level: "",
      
      // Additional Information
      subcontract_scope: "",
      employees_on_site: "",
      procurement_notes: "",
      additional_notes_comments: "",
      
      // Bid Tab Integration
      bid_tab_link: null,
      
      // Milestones
      milestones: []
    },
    mode: "onChange"
  })

  // Watch for dynamic fields
  const allowanceIncluded = useWatch({ control, name: "allowance_included" })
  const veOffered = useWatch({ control, name: "ve_offered" })
  const longLeadIncluded = useWatch({ control, name: "long_lead_included" })
  const ownerApprovalRequired = useWatch({ control, name: "owner_approval_required" })

  // Field arrays for dynamic content
  const { fields: allowanceFields, append: appendAllowance, remove: removeAllowance } = 
    useFieldArray({ control, name: "allowances" })
  const { fields: veFields, append: appendVe, remove: removeVe } = 
    useFieldArray({ control, name: "ve_items" })
  const { fields: leadFields, append: appendLead, remove: removeLead } = 
    useFieldArray({ control, name: "lead_items" })
  const { fields: milestoneFields, append: appendMilestone, remove: removeMilestone } = 
    useFieldArray({ control, name: "milestones" })

  // Initialize form with record data
  useEffect(() => {
    if (record) {
      const formData = {
        ...record,
        vendor_contact: record.vendor_contact || { name: "", email: "", phone: "" },
        allowances: record.allowances || [],
        ve_items: record.ve_items || [],
        lead_items: record.lead_items || [],
        milestones: record.milestones || []
      }
      reset(formData)
      setInitialFormValues(formData)
    }
  }, [record, reset])

  // Section definitions
  const sections: FormSection[] = [
    { id: "general", title: "General Information", icon: FileText, isEditing: editingSections.general || false },
    { id: "financial", title: "Financial Details", icon: DollarSign, isEditing: editingSections.financial || false },
    { id: "owner", title: "Owner Approval", icon: User, isEditing: editingSections.owner || false },
    { id: "allowances", title: "Allowances", icon: Target, isEditing: editingSections.allowances || false },
    { id: "value-engineering", title: "Value Engineering", icon: Building, isEditing: editingSections["value-engineering"] || false },
    { id: "long-lead", title: "Long Lead Items", icon: Clock, isEditing: editingSections["long-lead"] || false }
  ]

  // Toggle section editing
  const toggleSectionEdit = useCallback((sectionId: string) => {
    setEditingSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }, [])

  // Save individual section
  const saveSectionData = useCallback(async (sectionId: string) => {
    const formData = watch()
    
    // Calculate derived values
    const variance = formData.contract_amount - formData.budget_amount
    const variance_percentage = formData.budget_amount !== 0 
      ? (variance / formData.budget_amount) * 100 
      : 0

    const updatedData = {
      ...formData,
      variance,
      variance_percentage,
      updated_at: new Date().toISOString()
    }

    try {
      await onSubmit(updatedData)
      setEditingSections(prev => ({ ...prev, [sectionId]: false }))
      toast({
        title: "Section Saved",
        description: `${sections.find(s => s.id === sectionId)?.title} has been saved successfully.`,
      })
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was an error saving the section. Please try again.",
        variant: "destructive",
      })
    }
  }, [watch, onSubmit, sections, toast])

  // Handle full form submission
  const onFormSubmit = async (data: any) => {
    setIsSaving(true)
    
    try {
      const variance = data.contract_amount - data.budget_amount
      const variance_percentage = data.budget_amount !== 0 
        ? (variance / data.budget_amount) * 100 
        : 0

      const formattedData = {
        ...data,
        variance,
        variance_percentage,
        vendor_contact: data.vendor_contact || { name: "", email: "", phone: "" },
        milestones: data.milestones || [],
        updated_at: new Date().toISOString()
      }

      await onSubmit(formattedData)
      
      toast({
        title: "Record Saved",
        description: "Procurement record has been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was an error saving the record. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', { 
      style: 'currency', 
      currency: 'USD', 
      minimumFractionDigits: 0 
    })
  }

  // Render section content
  const renderSectionContent = (sectionId: string) => {
    const isEditing = editingSections[sectionId]

    switch (sectionId) {
      case "general":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="commitment_title">Commitment Title *</Label>
                <Input
                  id="commitment_title"
                  {...(!isEditing && { disabled: true })}
                  defaultValue={watch("commitment_title")}
                  onChange={(e) => setValue("commitment_title", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="commitment_number">Commitment Number *</Label>
                <Input
                  id="commitment_number"
                  {...(!isEditing && { disabled: true })}
                  defaultValue={watch("commitment_number")}
                  onChange={(e) => setValue("commitment_number", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vendor_name">Vendor Name *</Label>
                <Input
                  id="vendor_name"
                  {...(!isEditing && { disabled: true })}
                  defaultValue={watch("vendor_name")}
                  onChange={(e) => setValue("vendor_name", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="csi_code">CSI Code</Label>
                <Input
                  id="csi_code"
                  placeholder="XX XX XX"
                  {...(!isEditing && { disabled: true })}
                  defaultValue={watch("csi_code")}
                  onChange={(e) => setValue("csi_code", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="csi_description">CSI Description</Label>
              <Input
                id="csi_description"
                {...(!isEditing && { disabled: true })}
                defaultValue={watch("csi_description")}
                onChange={(e) => setValue("csi_description", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select 
                  disabled={!isEditing} 
                  value={watch("status")} 
                  onValueChange={(value) => setValue("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="bidding">Bidding</SelectItem>
                    <SelectItem value="negotiation">Negotiation</SelectItem>
                    <SelectItem value="awarded">Awarded</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="pending_approval">Pending Approval</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="procurement_method">Procurement Method</Label>
                <Select 
                  disabled={!isEditing} 
                  value={watch("procurement_method")} 
                  onValueChange={(value) => setValue("procurement_method", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="competitive-bid">Competitive Bid</SelectItem>
                    <SelectItem value="negotiated">Negotiated</SelectItem>
                    <SelectItem value="sole-source">Sole Source</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="contract_type">Contract Type</Label>
                <Select 
                  disabled={!isEditing} 
                  value={watch("contract_type")} 
                  onValueChange={(value) => setValue("contract_type", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="subcontract">Subcontract</SelectItem>
                    <SelectItem value="material">Material</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  {...(!isEditing && { disabled: true })}
                  defaultValue={watch("start_date")}
                  onChange={(e) => setValue("start_date", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="completion_date">Completion Date</Label>
                <Input
                  id="completion_date"
                  type="date"
                  {...(!isEditing && { disabled: true })}
                  defaultValue={watch("completion_date")}
                  onChange={(e) => setValue("completion_date", e.target.value)}
                />
              </div>
            </div>
          </div>
        )

      case "financial":
        const contractAmount = watch("contract_amount") || 0
        const budgetAmount = watch("budget_amount") || 0
        const variance = contractAmount - budgetAmount
        const variancePercentage = budgetAmount !== 0 ? (variance / budgetAmount) * 100 : 0
        const savingsOverage = budgetAmount - contractAmount // Savings is positive when budget > contract

        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="link_to_budget_item">Buyout Budget Line Item</Label>
                {isEditing ? (
                  <Select 
                    value={watch("link_to_budget_item")} 
                    onValueChange={(value) => setValue("link_to_budget_item", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a budget line item" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="03-100-001">03-100-001 - Concrete Foundations</SelectItem>
                      <SelectItem value="05-100-001">05-100-001 - Structural Steel</SelectItem>
                      <SelectItem value="07-400-001">07-400-001 - Roofing Systems</SelectItem>
                      <SelectItem value="09-500-001">09-500-001 - Ceilings</SelectItem>
                      <SelectItem value="23-000-001">23-000-001 - HVAC Systems</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-2 rounded border bg-muted">
                    {watch("link_to_budget_item") || "No budget item linked"}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="contract_amount">Contract Value</Label>
                {isEditing ? (
                  <Input
                    id="contract_amount"
                    type="number"
                    step="0.01"
                    defaultValue={contractAmount}
                    onChange={(e) => setValue("contract_amount", parseFloat(e.target.value) || 0)}
                  />
                ) : (
                  <div className="p-2 rounded border bg-muted">
                    {formatCurrency(contractAmount)}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget_amount">Budget</Label>
                {isEditing ? (
                  <Input
                    id="budget_amount"
                    type="number"
                    step="0.01"
                    defaultValue={budgetAmount}
                    onChange={(e) => setValue("budget_amount", parseFloat(e.target.value) || 0)}
                  />
                ) : (
                  <div className="p-2 rounded border bg-muted">
                    {formatCurrency(budgetAmount)}
                  </div>
                )}
              </div>
              <div>
                <Label>Savings / Overage</Label>
                <div className={`p-2 rounded border ${savingsOverage >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <span className={savingsOverage >= 0 ? 'text-green-700' : 'text-red-700'}>
                    {savingsOverage >= 0 ? 'Savings: ' : 'Overage: '}
                    {formatCurrency(Math.abs(savingsOverage))}
                    {budgetAmount !== 0 && (
                      <span className="text-sm ml-1">
                        ({Math.abs((savingsOverage / budgetAmount) * 100).toFixed(1)}%)
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="retainage_percent">Def. Retainage %</Label>
                {isEditing ? (
                  <Input
                    id="retainage_percent"
                    type="number"
                    step="0.1"
                    max="100"
                    min="0"
                    defaultValue={watch("retainage_percent")}
                    onChange={(e) => setValue("retainage_percent", parseFloat(e.target.value) || 0)}
                  />
                ) : (
                  <div className="p-2 rounded border bg-muted">
                    {(watch("retainage_percent") || 0).toFixed(2)}%
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="executed"
                  disabled={!isEditing}
                  checked={watch("executed")}
                  onCheckedChange={(checked) => setValue("executed", checked)}
                />
                <Label htmlFor="executed">Contract Executed</Label>
              </div>
            </div>
          </div>
        )

      case "owner":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="owner_approval_required"
                disabled={!isEditing}
                checked={ownerApprovalRequired}
                onCheckedChange={(checked) => setValue("owner_approval_required", checked)}
              />
              <Label htmlFor="owner_approval_required">Owner Approval Required</Label>
            </div>

            {ownerApprovalRequired && (
              <>
                <div>
                  <Label htmlFor="owner_approval_status">Owner Approval Status</Label>
                  <Select 
                    disabled={!isEditing} 
                    value={watch("owner_approval_status")} 
                    onValueChange={(value) => setValue("owner_approval_status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="conditional">Conditional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="owner_meeting_required"
                    disabled={!isEditing}
                    checked={watch("owner_meeting_required")}
                    onCheckedChange={(checked) => setValue("owner_meeting_required", checked)}
                  />
                  <Label htmlFor="owner_meeting_required">Owner Meeting Required</Label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="owner_meeting_date">Owner Meeting Date</Label>
                    <Input
                      id="owner_meeting_date"
                      type="date"
                      {...(!isEditing && { disabled: true })}
                      defaultValue={watch("owner_meeting_date")}
                      onChange={(e) => setValue("owner_meeting_date", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="owner_approval_date">Owner Approval Date</Label>
                    <Input
                      id="owner_approval_date"
                      type="date"
                      {...(!isEditing && { disabled: true })}
                      defaultValue={watch("owner_approval_date")}
                      onChange={(e) => setValue("owner_approval_date", e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )

      case "allowances":
        const totalContractAllowances = watch("total_contract_allowances") || 0
        const allowanceReconciliationTotal = watch("allowance_reconciliation_total") || 0
        const allowanceVariance = allowanceReconciliationTotal - totalContractAllowances

        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allowance_included"
                  disabled={!isEditing}
                  checked={allowanceIncluded}
                  onCheckedChange={(checked) => setValue("allowance_included", !!checked)}
                />
                <Label htmlFor="allowance_included">Allowance Included in Contract</Label>
              </div>
              <div>
                <Label htmlFor="allowance_reconciliation_total">Reconciliation Total</Label>
                {isEditing ? (
                  <Input
                    id="allowance_reconciliation_total"
                    type="number"
                    step="0.01"
                    defaultValue={allowanceReconciliationTotal}
                    onChange={(e) => setValue("allowance_reconciliation_total", parseFloat(e.target.value) || 0)}
                  />
                ) : (
                  <div className="p-2 rounded border bg-muted">
                    {formatCurrency(allowanceReconciliationTotal)}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="total_contract_allowances">Total Contract Allowances</Label>
                {isEditing ? (
                  <Input
                    id="total_contract_allowances"
                    type="number"
                    step="0.01"
                    defaultValue={totalContractAllowances}
                    onChange={(e) => setValue("total_contract_allowances", parseFloat(e.target.value) || 0)}
                  />
                ) : (
                  <div className="p-2 rounded border bg-muted">
                    {formatCurrency(totalContractAllowances)}
                  </div>
                )}
              </div>
              <div>
                <Label>Allowance Variance</Label>
                <div className={`p-2 rounded border ${allowanceVariance >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <span className={allowanceVariance >= 0 ? 'text-green-700' : 'text-red-700'}>
                    {formatCurrency(Math.abs(allowanceVariance))} ({Math.abs(totalContractAllowances !== 0 ? (allowanceVariance / totalContractAllowances) * 100 : 0).toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>

            {allowanceIncluded && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Allowance Items</h4>
                  {isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => appendAllowance({ 
                        item: "", 
                        value: 0, 
                        reconciliation_value: 0, 
                        variance: 0,
                        status: "pending",
                        notes: ""
                      })}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Allowance Item
                    </Button>
                  )}
                </div>

                {allowanceFields.length > 0 && (
                  <div className="border rounded-lg">
                    {/* Table Header */}
                    <div className="grid grid-cols-6 gap-2 p-3 bg-muted/50 border-b font-medium text-sm">
                      <div>Allowance Item</div>
                      <div>Original Value</div>
                      <div>Reconciled</div>
                      <div>Reconciled Value</div>
                      <div>Variance</div>
                      {isEditing && <div>Actions</div>}
                    </div>

                    {/* Table Rows */}
                    {allowanceFields.map((field, index) => {
                      const itemValue = watch(`allowances.${index}.value` as any) || 0
                      const reconcileValue = watch(`allowances.${index}.reconciliation_value` as any) || 0
                      const itemVariance = reconcileValue - itemValue
                      const isReconciled = reconcileValue > 0

                      return (
                        <div key={field.id} className="grid grid-cols-6 gap-2 p-3 border-b last:border-b-0 items-center">
                          <div>
                            {isEditing ? (
                              <Input
                                placeholder="Allowance Item"
                                defaultValue={watch(`allowances.${index}.item` as any)}
                                onChange={(e) => setValue(`allowances.${index}.item` as any, e.target.value)}
                              />
                            ) : (
                              <span className="text-sm">{watch(`allowances.${index}.item` as any) || "N/A"}</span>
                            )}
                          </div>
                          <div>
                            {isEditing ? (
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                defaultValue={itemValue}
                                onChange={(e) => setValue(`allowances.${index}.value` as any, parseFloat(e.target.value) || 0)}
                              />
                            ) : (
                              <span className="text-sm">{formatCurrency(itemValue)}</span>
                            )}
                          </div>
                          <div>
                            {isEditing ? (
                              <Select 
                                value={isReconciled ? "Yes" : "No"}
                                onValueChange={(value) => {
                                  if (value === "No") {
                                    setValue(`allowances.${index}.reconciliation_value` as any, 0)
                                  }
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Yes">Yes</SelectItem>
                                  <SelectItem value="No">No</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <Badge variant={isReconciled ? "default" : "secondary"} className="text-xs">
                                {isReconciled ? "Yes" : "No"}
                              </Badge>
                            )}
                          </div>
                          <div>
                            {isEditing ? (
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                defaultValue={reconcileValue}
                                onChange={(e) => setValue(`allowances.${index}.reconciliation_value` as any, parseFloat(e.target.value) || 0)}
                              />
                            ) : (
                              <span className="text-sm">{formatCurrency(reconcileValue)}</span>
                            )}
                          </div>
                          <div>
                            <span className={`text-sm ${itemVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(Math.abs(itemVariance))}
                            </span>
                          </div>
                          {isEditing && (
                            <div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeAllowance(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}

                {allowanceFields.length === 0 && allowanceIncluded && (
                  <div className="p-6 text-center text-muted-foreground border rounded-lg border-dashed">
                    No allowance items added yet.
                    {isEditing && (
                      <p className="text-sm mt-1">Click "Add Allowance Item" to get started.</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )

      case "value-engineering":
        const totalVePresented = watch("total_ve_presented") || 0
        const totalVeAccepted = watch("total_ve_accepted") || 0
        const totalVeRejected = watch("total_ve_rejected") || 0
        const netVeSavings = totalVeAccepted - totalVeRejected

        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ve_offered"
                  disabled={!isEditing}
                  checked={veOffered}
                  onCheckedChange={(checked) => setValue("ve_offered", !!checked)}
                />
                <Label htmlFor="ve_offered">Value Engineering Offered</Label>
              </div>
              <div>
                <Label htmlFor="net_ve_savings">Net VE Savings</Label>
                <div className={`p-2 rounded border ${netVeSavings >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <span className={netVeSavings >= 0 ? 'text-green-700' : 'text-red-700'}>
                    {formatCurrency(Math.abs(netVeSavings))}
                  </span>
                </div>
              </div>
            </div>

            {veOffered && (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="total_ve_presented">Total VE Presented</Label>
                    {isEditing ? (
                      <Input
                        id="total_ve_presented"
                        type="number"
                        step="0.01"
                        defaultValue={totalVePresented}
                        onChange={(e) => setValue("total_ve_presented", parseFloat(e.target.value) || 0)}
                      />
                    ) : (
                      <div className="p-2 rounded border bg-muted">
                        {formatCurrency(totalVePresented)}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="total_ve_accepted">Total VE Accepted</Label>
                    {isEditing ? (
                      <Input
                        id="total_ve_accepted"
                        type="number"
                        step="0.01"
                        defaultValue={totalVeAccepted}
                        onChange={(e) => setValue("total_ve_accepted", parseFloat(e.target.value) || 0)}
                      />
                    ) : (
                      <div className="p-2 rounded border bg-muted">
                        {formatCurrency(totalVeAccepted)}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="total_ve_rejected">Total VE Rejected</Label>
                    {isEditing ? (
                      <Input
                        id="total_ve_rejected"
                        type="number"
                        step="0.01"
                        defaultValue={totalVeRejected}
                        onChange={(e) => setValue("total_ve_rejected", parseFloat(e.target.value) || 0)}
                      />
                    ) : (
                      <div className="p-2 rounded border bg-muted">
                        {formatCurrency(totalVeRejected)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Value Engineering Items</h4>
                    {isEditing && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                                                 onClick={() => appendVe({ 
                           description: "", 
                           original_value: 0, 
                           ve_value: 0, 
                           savings: 0,
                           status: "proposed",
                           notes: ""
                         })}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add VE Item
                      </Button>
                    )}
                  </div>

                  {veFields.length > 0 && (
                    <div className="border rounded-lg">
                      <div className="grid grid-cols-6 gap-2 p-3 bg-muted/50 border-b font-medium text-sm">
                        <div>Description</div>
                        <div>Original Value</div>
                        <div>VE Value</div>
                        <div>Savings</div>
                        <div>Status</div>
                        {isEditing && <div>Actions</div>}
                      </div>

                      {veFields.map((field, index) => {
                        const originalValue = watch(`ve_items.${index}.original_value` as any) || 0
                        const veValue = watch(`ve_items.${index}.ve_value` as any) || 0
                        const savings = originalValue - veValue

                        return (
                          <div key={field.id} className="grid grid-cols-6 gap-2 p-3 border-b last:border-b-0 items-center">
                            <div>
                              {isEditing ? (
                                <Input
                                  placeholder="VE Description"
                                  defaultValue={watch(`ve_items.${index}.description` as any)}
                                  onChange={(e) => setValue(`ve_items.${index}.description` as any, e.target.value)}
                                />
                              ) : (
                                <span className="text-sm">{watch(`ve_items.${index}.description` as any) || "N/A"}</span>
                              )}
                            </div>
                            <div>
                              {isEditing ? (
                                <Input
                                  type="number"
                                  step="0.01"
                                  defaultValue={originalValue}
                                  onChange={(e) => setValue(`ve_items.${index}.original_value` as any, parseFloat(e.target.value) || 0)}
                                />
                              ) : (
                                <span className="text-sm">{formatCurrency(originalValue)}</span>
                              )}
                            </div>
                            <div>
                              {isEditing ? (
                                <Input
                                  type="number"
                                  step="0.01"
                                  defaultValue={veValue}
                                  onChange={(e) => setValue(`ve_items.${index}.ve_value` as any, parseFloat(e.target.value) || 0)}
                                />
                              ) : (
                                <span className="text-sm">{formatCurrency(veValue)}</span>
                              )}
                            </div>
                            <div>
                              <span className={`text-sm ${savings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(Math.abs(savings))}
                              </span>
                            </div>
                            <div>
                              {isEditing ? (
                                <Select 
                                  value={watch(`ve_items.${index}.status` as any)}
                                  onValueChange={(value) => setValue(`ve_items.${index}.status` as any, value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="proposed">Proposed</SelectItem>
                                    <SelectItem value="accepted">Accepted</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Badge variant="outline" className="text-xs">
                                  {watch(`ve_items.${index}.status` as any) || "N/A"}
                                </Badge>
                              )}
                            </div>
                            {isEditing && (
                              <div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                                                     onClick={() => removeVe(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {veFields.length === 0 && veOffered && (
                    <div className="p-6 text-center text-muted-foreground border rounded-lg border-dashed">
                      No value engineering items added yet.
                      {isEditing && (
                        <p className="text-sm mt-1">Click "Add VE Item" to get started.</p>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )

      case "long-lead":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="long_lead_included"
                  disabled={!isEditing}
                  checked={longLeadIncluded}
                  onCheckedChange={(checked) => setValue("long_lead_included", !!checked)}
                />
                <Label htmlFor="long_lead_included">Long Lead Items Included</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="long_lead_released"
                  disabled={!isEditing || !longLeadIncluded}
                  checked={watch("long_lead_released")}
                  onCheckedChange={(checked) => setValue("long_lead_released", !!checked)}
                />
                <Label htmlFor="long_lead_released">Long Lead Released</Label>
              </div>
            </div>

            {longLeadIncluded && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Long Lead Items</h4>
                  {isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                                             onClick={() => appendLead({ 
                         item: "", 
                         lead_time: 0, 
                         unit: "days",
                         required_by: "",
                         procured: false,
                         supplier: "",
                         status: "pending",
                         notes: ""
                       })}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Long Lead Item
                    </Button>
                  )}
                </div>

                                 {leadFields.length > 0 && (
                  <div className="border rounded-lg">
                    <div className="grid grid-cols-6 gap-2 p-3 bg-muted/50 border-b font-medium text-sm">
                      <div>Item</div>
                      <div>Lead Time</div>
                      <div>Required By</div>
                      <div>Supplier</div>
                      <div>Procured</div>
                      {isEditing && <div>Actions</div>}
                    </div>

                                         {leadFields.map((field, index) => (
                      <div key={field.id} className="grid grid-cols-6 gap-2 p-3 border-b last:border-b-0 items-center">
                        <div>
                          {isEditing ? (
                            <Input
                              placeholder="Long lead item"
                              defaultValue={watch(`lead_items.${index}.item` as any)}
                              onChange={(e) => setValue(`lead_items.${index}.item` as any, e.target.value)}
                            />
                          ) : (
                            <span className="text-sm">{watch(`lead_items.${index}.item` as any) || "N/A"}</span>
                          )}
                        </div>
                        <div>
                          {isEditing ? (
                            <div className="flex gap-1">
                              <Input
                                type="number"
                                placeholder="0"
                                className="flex-1"
                                defaultValue={watch(`lead_items.${index}.lead_time` as any)}
                                onChange={(e) => setValue(`lead_items.${index}.lead_time` as any, parseFloat(e.target.value) || 0)}
                              />
                              <Select 
                                value={watch(`lead_items.${index}.unit` as any)}
                                onValueChange={(value) => setValue(`lead_items.${index}.unit` as any, value)}
                              >
                                <SelectTrigger className="w-20">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="days">Days</SelectItem>
                                  <SelectItem value="weeks">Weeks</SelectItem>
                                  <SelectItem value="months">Months</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          ) : (
                            <span className="text-sm">
                              {watch(`lead_items.${index}.lead_time` as any) || 0} {watch(`lead_items.${index}.unit` as any) || "days"}
                            </span>
                          )}
                        </div>
                        <div>
                          {isEditing ? (
                            <Input
                              type="date"
                              defaultValue={watch(`lead_items.${index}.required_by` as any)}
                              onChange={(e) => setValue(`lead_items.${index}.required_by` as any, e.target.value)}
                            />
                          ) : (
                            <span className="text-sm">{watch(`lead_items.${index}.required_by` as any) || "N/A"}</span>
                          )}
                        </div>
                        <div>
                          {isEditing ? (
                            <Input
                              placeholder="Supplier name"
                              defaultValue={watch(`lead_items.${index}.supplier` as any)}
                              onChange={(e) => setValue(`lead_items.${index}.supplier` as any, e.target.value)}
                            />
                          ) : (
                            <span className="text-sm">{watch(`lead_items.${index}.supplier` as any) || "N/A"}</span>
                          )}
                        </div>
                        <div>
                          {isEditing ? (
                            <Checkbox
                              checked={watch(`lead_items.${index}.procured` as any)}
                              onCheckedChange={(checked) => setValue(`lead_items.${index}.procured` as any, !!checked)}
                            />
                          ) : (
                            <Badge variant={watch(`lead_items.${index}.procured` as any) ? "default" : "secondary"} className="text-xs">
                              {watch(`lead_items.${index}.procured` as any) ? "Yes" : "No"}
                            </Badge>
                          )}
                        </div>
                        {isEditing && (
                          <div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                                                             onClick={() => removeLead(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                                 {leadFields.length === 0 && longLeadIncluded && (
                  <div className="p-6 text-center text-muted-foreground border rounded-lg border-dashed">
                    No long lead items added yet.
                    {isEditing && (
                      <p className="text-sm mt-1">Click "Add Long Lead Item" to get started.</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )

      default:
        return <div>Section content for {sectionId}</div>
    }
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-background shadow-sm">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="workflow" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Workflow
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            Compliance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <div className="space-y-4">
            {sections.map((section) => {
              const isEditing = editingSections[section.id]
              const Icon = section.icon

              return (
                <Card key={section.id}>
                  <CardHeader className="flex flex-row items-center justify-between py-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Icon className="h-5 w-5 text-[#FF6B35]" />
                      {section.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {isEditing && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleSectionEdit(section.id)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => saveSectionData(section.id)}
                            className="bg-[#FF6B35] hover:bg-[#E55A2B]"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                        </>
                      )}
                      {!isEditing && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleSectionEdit(section.id)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {renderSectionContent(section.id)}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="workflow" className="mt-6">
          <div className="space-y-6">
            {/* Scope Review Meeting */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[#FF6B35]" />
                  Scope Review Meeting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="scope_review_meeting_date">Scope Review Meeting Date</Label>
                    <Input
                      id="scope_review_meeting_date"
                      type="date"
                      defaultValue={watch("scope_review_meeting_date")}
                      onChange={(e) => setValue("scope_review_meeting_date", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contract Review and Approval Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#FF6B35]" />
                  Contract Review and Approval Dates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="spm_review_date">SPM Review Date</Label>
                      <Input
                        id="spm_review_date"
                        type="date"
                        defaultValue={watch("spm_review_date")}
                        onChange={(e) => setValue("spm_review_date", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="spm_approval_status">SPM Approval Status</Label>
                      <Select 
                        value={watch("spm_approval_status")} 
                        onValueChange={(value) => setValue("spm_approval_status", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Approved">Approved</SelectItem>
                          <SelectItem value="Disapproved">Disapproved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="px_review_date">PX Review Date</Label>
                      <Input
                        id="px_review_date"
                        type="date"
                        disabled={!watch("spm_review_date")}
                        defaultValue={watch("px_review_date")}
                        onChange={(e) => setValue("px_review_date", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="px_approval_status">PX Approval Status</Label>
                      <Select 
                        disabled={!watch("spm_review_date")}
                        value={watch("px_approval_status")} 
                        onValueChange={(value) => setValue("px_approval_status", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Approved">Approved</SelectItem>
                          <SelectItem value="Disapproved">Disapproved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="vp_review_date">VP Review Date</Label>
                      <Input
                        id="vp_review_date"
                        type="date"
                        disabled={!watch("px_review_date")}
                        defaultValue={watch("vp_review_date")}
                        onChange={(e) => setValue("vp_review_date", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="vp_approval_status">VP Approval Status</Label>
                      <Select 
                        disabled={!watch("px_review_date")}
                        value={watch("vp_approval_status")} 
                        onValueChange={(value) => setValue("vp_approval_status", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Approved">Approved</SelectItem>
                          <SelectItem value="Disapproved">Disapproved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contract Execution Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#FF6B35]" />
                  Contract Execution Dates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="contract_date">Contract Award Date</Label>
                      <Input
                        id="contract_date"
                        type="date"
                        defaultValue={watch("contract_date")}
                        onChange={(e) => setValue("contract_date", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="loi_sent_date">LOI Sent</Label>
                      <Input
                        id="loi_sent_date"
                        type="date"
                        disabled={!watch("contract_date")}
                        defaultValue={watch("loi_sent_date")}
                        onChange={(e) => setValue("loi_sent_date", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="loi_returned_date">LOI Returned</Label>
                      <Input
                        id="loi_returned_date"
                        type="date"
                        disabled={!watch("loi_sent_date")}
                        defaultValue={watch("loi_returned_date")}
                        onChange={(e) => setValue("loi_returned_date", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="subcontract_agreement_sent_date">Subcontract Agreement Sent</Label>
                      <Input
                        id="subcontract_agreement_sent_date"
                        type="date"
                        disabled={!watch("loi_returned_date")}
                        defaultValue={watch("subcontract_agreement_sent_date")}
                        onChange={(e) => setValue("subcontract_agreement_sent_date", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="signed_contract_received_date">Fully Executed by HBC</Label>
                      <Input
                        id="signed_contract_received_date"
                        type="date"
                        disabled={!watch("subcontract_agreement_sent_date")}
                        defaultValue={watch("signed_contract_received_date")}
                        onChange={(e) => setValue("signed_contract_received_date", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="fully_executed_sent_date">Fully Executed Sent to Subcontractor</Label>
                      <Input
                        id="fully_executed_sent_date"
                        type="date"
                        disabled={!watch("signed_contract_received_date")}
                        defaultValue={watch("fully_executed_sent_date")}
                        onChange={(e) => setValue("fully_executed_sent_date", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[#FF6B35]" />
                  Project Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="start_date">Start Date</Label>
                      <Input
                        id="start_date"
                        type="date"
                        defaultValue={watch("start_date")}
                        onChange={(e) => setValue("start_date", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="completion_date">Estimated Completion Date</Label>
                      <Input
                        id="completion_date"
                        type="date"
                        disabled={!watch("start_date")}
                        defaultValue={watch("completion_date")}
                        onChange={(e) => setValue("completion_date", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="issued_on_date">Issued On Date</Label>
                      <Input
                        id="issued_on_date"
                        type="date"
                        defaultValue={watch("issued_on_date")}
                        onChange={(e) => setValue("issued_on_date", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          <div className="space-y-6">
            {/* Document Checklist */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#FF6B35]" />
                  Document Checklist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="contract_status">Contract</Label>
                      <Select 
                        value={watch("contract_status")} 
                        onValueChange={(value) => setValue("contract_status", value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="N">N</SelectItem>
                          <SelectItem value="Y">Y</SelectItem>
                          <SelectItem value="N/A">N/A</SelectItem>
                          <SelectItem value="P">P</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="schedule_a_status">Schedule A (General Conditions)</Label>
                      <Select 
                        value={watch("schedule_a_status")} 
                        onValueChange={(value) => setValue("schedule_a_status", value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="N">N</SelectItem>
                          <SelectItem value="Y">Y</SelectItem>
                          <SelectItem value="N/A">N/A</SelectItem>
                          <SelectItem value="P">P</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="schedule_b_status">Schedule B (Scope of Work)</Label>
                      <Select 
                        value={watch("schedule_b_status")} 
                        onValueChange={(value) => setValue("schedule_b_status", value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="N">N</SelectItem>
                          <SelectItem value="Y">Y</SelectItem>
                          <SelectItem value="N/A">N/A</SelectItem>
                          <SelectItem value="P">P</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="exhibit_a_status">Exhibit A (Drawings)</Label>
                      <Select 
                        value={watch("exhibit_a_status")} 
                        onValueChange={(value) => setValue("exhibit_a_status", value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="N">N</SelectItem>
                          <SelectItem value="Y">Y</SelectItem>
                          <SelectItem value="N/A">N/A</SelectItem>
                          <SelectItem value="P">P</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="exhibit_b_status">Exhibit B (Project Schedule)</Label>
                      <Select 
                        value={watch("exhibit_b_status")} 
                        onValueChange={(value) => setValue("exhibit_b_status", value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="N">N</SelectItem>
                          <SelectItem value="Y">Y</SelectItem>
                          <SelectItem value="N/A">N/A</SelectItem>
                          <SelectItem value="P">P</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="exhibit_i_status">Exhibit I (OCIP Addendum)</Label>
                      <Select 
                        value={watch("exhibit_i_status")} 
                        onValueChange={(value) => setValue("exhibit_i_status", value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="N">N</SelectItem>
                          <SelectItem value="Y">Y</SelectItem>
                          <SelectItem value="N/A">N/A</SelectItem>
                          <SelectItem value="P">P</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="labor_rates_status">Labor Rates</Label>
                      <Select 
                        value={watch("labor_rates_status")} 
                        onValueChange={(value) => setValue("labor_rates_status", value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="N">N</SelectItem>
                          <SelectItem value="Y">Y</SelectItem>
                          <SelectItem value="N/A">N/A</SelectItem>
                          <SelectItem value="P">P</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="unit_rates_status">Unit Rates</Label>
                      <Select 
                        value={watch("unit_rates_status")} 
                        onValueChange={(value) => setValue("unit_rates_status", value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="N">N</SelectItem>
                          <SelectItem value="Y">Y</SelectItem>
                          <SelectItem value="N/A">N/A</SelectItem>
                          <SelectItem value="P">P</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="exhibits_status">Exhibits</Label>
                      <Select 
                        value={watch("exhibits_status")} 
                        onValueChange={(value) => setValue("exhibits_status", value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="N">N</SelectItem>
                          <SelectItem value="Y">Y</SelectItem>
                          <SelectItem value="N/A">N/A</SelectItem>
                          <SelectItem value="P">P</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="schedule_of_values_status">Schedule of Values</Label>
                      <Select 
                        value={watch("schedule_of_values_status")} 
                        onValueChange={(value) => setValue("schedule_of_values_status", value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="N">N</SelectItem>
                          <SelectItem value="Y">Y</SelectItem>
                          <SelectItem value="N/A">N/A</SelectItem>
                          <SelectItem value="P">P</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="p_and_p_bond_status">P&P Bond</Label>
                      <Select 
                        value={watch("p_and_p_bond_status")} 
                        onValueChange={(value) => setValue("p_and_p_bond_status", value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="N">N</SelectItem>
                          <SelectItem value="Y">Y</SelectItem>
                          <SelectItem value="N/A">N/A</SelectItem>
                          <SelectItem value="P">P</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="w_9_status">W-9</Label>
                      <Select 
                        value={watch("w_9_status")} 
                        onValueChange={(value) => setValue("w_9_status", value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="N">N</SelectItem>
                          <SelectItem value="Y">Y</SelectItem>
                          <SelectItem value="N/A">N/A</SelectItem>
                          <SelectItem value="P">P</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="license_status">License</Label>
                      <Select 
                        value={watch("license_status")} 
                        onValueChange={(value) => setValue("license_status", value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="N">N</SelectItem>
                          <SelectItem value="Y">Y</SelectItem>
                          <SelectItem value="N/A">N/A</SelectItem>
                          <SelectItem value="P">P</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="insurance_general_liability_status">Insurance - General Liability</Label>
                      <Select 
                        value={watch("insurance_general_liability_status")} 
                        onValueChange={(value) => setValue("insurance_general_liability_status", value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="N">N</SelectItem>
                          <SelectItem value="Y">Y</SelectItem>
                          <SelectItem value="N/A">N/A</SelectItem>
                          <SelectItem value="P">P</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="insurance_auto_status">Insurance - Auto</Label>
                      <Select 
                        value={watch("insurance_auto_status")} 
                        onValueChange={(value) => setValue("insurance_auto_status", value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="N">N</SelectItem>
                          <SelectItem value="Y">Y</SelectItem>
                          <SelectItem value="N/A">N/A</SelectItem>
                          <SelectItem value="P">P</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="insurance_umbrella_liability_status">Insurance - Umbrella Liability</Label>
                      <Select 
                        value={watch("insurance_umbrella_liability_status")} 
                        onValueChange={(value) => setValue("insurance_umbrella_liability_status", value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="N">N</SelectItem>
                          <SelectItem value="Y">Y</SelectItem>
                          <SelectItem value="N/A">N/A</SelectItem>
                          <SelectItem value="P">P</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="insurance_workers_comp_status">Insurance - Workers Comp</Label>
                      <Select 
                        value={watch("insurance_workers_comp_status")} 
                        onValueChange={(value) => setValue("insurance_workers_comp_status", value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="N">N</SelectItem>
                          <SelectItem value="Y">Y</SelectItem>
                          <SelectItem value="N/A">N/A</SelectItem>
                          <SelectItem value="P">P</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="special_requirements_status">Special Requirements</Label>
                      <Select 
                        value={watch("special_requirements_status")} 
                        onValueChange={(value) => setValue("special_requirements_status", value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="N">N</SelectItem>
                          <SelectItem value="Y">Y</SelectItem>
                          <SelectItem value="N/A">N/A</SelectItem>
                          <SelectItem value="P">P</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="compliance_manager_status">Compliance Manager Approved</Label>
                      <Select 
                        value={watch("compliance_manager_status")} 
                        onValueChange={(value) => setValue("compliance_manager_status", value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="N">N</SelectItem>
                          <SelectItem value="Y">Y</SelectItem>
                          <SelectItem value="N/A">N/A</SelectItem>
                          <SelectItem value="P">P</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="scanned_returned_status">Scanned & Returned to Sub</Label>
                      <Select 
                        value={watch("scanned_returned_status")} 
                        onValueChange={(value) => setValue("scanned_returned_status", value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="N">N</SelectItem>
                          <SelectItem value="Y">Y</SelectItem>
                          <SelectItem value="N/A">N/A</SelectItem>
                          <SelectItem value="P">P</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  <p><strong>N</strong> = No, <strong>Y</strong> = Yes, <strong>N/A</strong> = Not Applicable, <strong>P</strong> = Pending</p>
                </div>
                <div className="mt-4">
                  <Label htmlFor="additional_notes_comments">Additional Notes / Comments</Label>
                  <Textarea
                    id="additional_notes_comments"
                    defaultValue={watch("additional_notes_comments")}
                    onChange={(e) => setValue("additional_notes_comments", e.target.value)}
                    placeholder="Enter any additional notes or comments about compliance..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Bonds and Insurance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#FF6B35]" />
                  Bonds and Insurance Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="bonds_required"
                        checked={watch("bonds_required")}
                        onCheckedChange={(checked) => setValue("bonds_required", !!checked)}
                      />
                      <Label htmlFor="bonds_required">Bonds Required</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="insurance_verified"
                        checked={watch("insurance_verified")}
                        onCheckedChange={(checked) => setValue("insurance_verified", !!checked)}
                      />
                      <Label htmlFor="insurance_verified">Insurance Verified</Label>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="insurance_waiver_level">Insurance Waiver Level</Label>
                      <Input
                        id="insurance_waiver_level"
                        defaultValue={watch("insurance_waiver_level")}
                        onChange={(e) => setValue("insurance_waiver_level", e.target.value)}
                        placeholder="Enter waiver level if applicable"
                      />
                    </div>
                    <div>
                      <Label htmlFor="licensing_waiver_level">Licensing Waiver Level</Label>
                      <Input
                        id="licensing_waiver_level"
                        defaultValue={watch("licensing_waiver_level")}
                        onChange={(e) => setValue("licensing_waiver_level", e.target.value)}
                        placeholder="Enter waiver level if applicable"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="insurance_explanation">Insurance Explanation</Label>
                  <Textarea
                    id="insurance_explanation"
                    defaultValue={watch("insurance_explanation")}
                    onChange={(e) => setValue("insurance_explanation", e.target.value)}
                    placeholder="Explain any insurance requirements or waivers..."
                    rows={2}
                  />
                </div>
                <div className="mt-4">
                  <Label htmlFor="insurance_risk_justification">Insurance Risk Justification</Label>
                  <Textarea
                    id="insurance_risk_justification"
                    defaultValue={watch("insurance_risk_justification")}
                    onChange={(e) => setValue("insurance_risk_justification", e.target.value)}
                    placeholder="Justify any insurance risks or waivers..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Team Assignments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-[#FF6B35]" />
                  Team Assignments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="project_manager">Project Manager</Label>
                    <Input
                      id="project_manager"
                      defaultValue={watch("project_manager")}
                      onChange={(e) => setValue("project_manager", e.target.value)}
                      placeholder="Enter project manager name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="project_executive">Project Executive</Label>
                    <Input
                      id="project_executive"
                      defaultValue={watch("project_executive")}
                      onChange={(e) => setValue("project_executive", e.target.value)}
                      placeholder="Enter project executive name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="project_assistant">Project Assistant</Label>
                    <Input
                      id="project_assistant"
                      defaultValue={watch("project_assistant")}
                      onChange={(e) => setValue("project_assistant", e.target.value)}
                      placeholder="Enter project assistant name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="compliance_manager">Compliance Manager</Label>
                    <Input
                      id="compliance_manager"
                      defaultValue={watch("compliance_manager")}
                      onChange={(e) => setValue("compliance_manager", e.target.value)}
                      placeholder="Enter compliance manager name"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Notes Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-[#FF6B35]" />
            Procurement Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter any additional notes or comments about this procurement..."
            defaultValue={watch("procurement_notes")}
            onChange={(e) => setValue("procurement_notes", e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit(onFormSubmit)}
          disabled={isSaving}
          className="bg-[#FF6B35] hover:bg-[#E55A2B]"
        >
          {isSaving ? (
            <>
              <Save className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {record ? "Update Record" : "Create Record"}
            </>
          )}
        </Button>
      </div>
    </div>
  )
} 