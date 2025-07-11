"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Textarea } from "../../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { Checkbox } from "../../ui/checkbox"
import { ScrollArea } from "../../ui/scroll-area"
import { Separator } from "../../ui/separator"
import { Badge } from "../../ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs"
import { useToast } from "../../ui/use-toast"
import { Calendar, CalendarIcon, Plus, Save, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "../../../lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover"
import { Calendar as CalendarComponent } from "../../ui/calendar"

interface ProjectPursuitFormData {
  // Project Information
  jobName: string
  jobNumber: string
  architect: string
  proposalDueDate: Date | undefined
  proposalDueTime: string
  proposalDeliveredVia: string
  handDeliveredCopies: string
  typeOfProposal: string
  rfiFormat: string
  projectExecutive: string
  primaryContact: string
  estimatorsAssigned: string

  // Managing Information Items
  managingItems: Array<{
    id: number
    description: string
    yes: boolean
    no: boolean
    responsible: string
    deadlineFrequency: string
    notes: string
  }>

  // Estimating Preparation Items
  estimatingItems: Array<{
    id: number
    description: string
    responsible: string
    deadline: string
    notes: string
  }>

  // Final Deliverables Items
  deliverablesItems: Array<{
    id: number
    tabReqd: string
    description: string
    yes: boolean
    no: boolean
    responsible: string
    deadline: string
    notes: string
  }>
}

interface NewPursuitModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSubmit?: (data: ProjectPursuitFormData) => void
  editingData?: ProjectPursuitFormData | null
  mode?: "create" | "edit" | "view"
  children?: React.ReactNode
}

const MANAGING_ITEMS = [
  "Finalize Subcontractor Bid List in BC",
  "Send ITB to Subcontractors",
  "Phone Calls to improve Sub coverage",
  "Send Mass Messages in Building Connected to improve Sub coverage",
  "Complete Bid Packages",
  "RFI Management (Who is Point Person?)",
  "Invite Project Team to Procore",
  "Request Bid Bond from Eric Engstrom (CFO)",
  "Request CCIP proposal from Eric Engstrom (CFO)",
  "Request financials from Eric Engstrom (CFO)",
  "AIA Contract Review by Patrick Painter",
  "Are there bid forms to be used?",
  "Submit/obtain Builders Risk Insurance Quote",
  "Review other Requirements noted on ITB (Self Performance, SBE, etc.)",
  "Add Warranty line item?",
  "Milestone Schedule",
  "Detailed Precon Schedule",
  "Detailed Project Schedule",
  "Site Logistics Plan",
  "BIM Modeling or Scanning",
  "VDC-What is a reasonable number of design iterations and model updates?",
  "VDC-How quickly shall Owner's Designers respond to VDC/BIM related inqueries?",
  "Requests Revit Files from Owner/Architect",
  "Assemble Closure Document Books",
  "Submit Permit and NOC",
]

const ESTIMATING_ITEMS = [
  "HB's Proposal Due:",
  "Subcontractor Proposals Due:",
  "Schedule Pre-Submission Estimate Review",
  "Schedule Win Strategy Meeting",
  "Schedule Subcontractor Site Walk-Thru",
  "Schedule Owner Estimate Review",
]

const DELIVERABLES_ITEMS = [
  "Front Cover",
  "Executive Summary",
  "Cost Summary",
  "Detailed GC/GC Breakdown (optional)",
  "Detailed COW Breakdown (optional)",
  "List of Allowances",
  "Clarifications and Assumptions",
  "Value Analysis log",
  "Schedule",
  "Logistics Plan",
  "List of Documents",
  "Team Organization Chart and Resumes",
  "Previous Experience",
  "BIM Proposal Required",
  "By Who List",
  "Back Cover",
]

const NewPursuitModal: React.FC<NewPursuitModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  editingData,
  mode = "create",
  children,
}) => {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("managing")
  const [formData, setFormData] = useState<ProjectPursuitFormData>({
    jobName: "",
    jobNumber: "",
    architect: "",
    proposalDueDate: undefined,
    proposalDueTime: "",
    proposalDeliveredVia: "",
    handDeliveredCopies: "",
    typeOfProposal: "",
    rfiFormat: "",
    projectExecutive: "",
    primaryContact: "",
    estimatorsAssigned: "",
    managingItems: MANAGING_ITEMS.map((desc, index) => ({
      id: index + 1,
      description: desc,
      yes: false,
      no: false,
      responsible: "",
      deadlineFrequency: "",
      notes: "",
    })),
    estimatingItems: ESTIMATING_ITEMS.map((desc, index) => ({
      id: index + 1,
      description: desc,
      responsible: "",
      deadline: "",
      notes: "",
    })),
    deliverablesItems: DELIVERABLES_ITEMS.map((desc, index) => ({
      id: index + 1,
      tabReqd: "N",
      description: desc,
      yes: false,
      no: false,
      responsible: "",
      deadline: "",
      notes: "",
    })),
  })

  // Initialize form data when editing
  useEffect(() => {
    if (editingData && mode !== "create") {
      setFormData(editingData)
    }
  }, [editingData, mode])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.jobName.trim() || !formData.jobNumber.trim()) {
      toast({
        title: "Validation Error",
        description: "Job Name and Job Number are required fields.",
        variant: "destructive",
      })
      return
    }

    onSubmit?.(formData)

    toast({
      title: mode === "create" ? "Pursuit Created" : "Pursuit Updated",
      description:
        mode === "create" ? "New pursuit has been added successfully." : "Pursuit details have been updated.",
    })

    if (onOpenChange) {
      onOpenChange(false)
    }
  }

  const handleAddDeliverable = () => {
    const newId = Math.max(...formData.deliverablesItems.map((item) => item.id)) + 1
    setFormData((prev) => ({
      ...prev,
      deliverablesItems: [
        ...prev.deliverablesItems,
        {
          id: newId,
          tabReqd: "N",
          description: "",
          yes: false,
          no: false,
          responsible: "",
          deadline: "",
          notes: "",
        },
      ],
    }))
  }

  const updateManagingItem = (id: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      managingItems: prev.managingItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }))
  }

  const updateEstimatingItem = (id: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      estimatingItems: prev.estimatingItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }))
  }

  const updateDeliverablesItem = (id: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      deliverablesItems: prev.deliverablesItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }))
  }

  const modalTitle = mode === "create" ? "New Pursuit" : mode === "edit" ? "Edit Pursuit" : "View Pursuit Details"
  const isReadonly = mode === "view"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent
        className="max-w-6xl w-[95vw] flex flex-col p-0"
        style={{
          position: "fixed",
          top: "1rem",
          bottom: "1rem",
          left: "50%",
          transform: "translateX(-50%)",
          height: "calc(100vh - 2rem)",
          margin: "0",
        }}
      >
        <DialogHeader className="px-4 py-2 border-b flex-shrink-0">
          <DialogTitle className="flex items-center justify-between text-lg">
            {modalTitle}
            {mode !== "view" && (
              <Badge variant="outline" className="ml-2 text-xs px-2 py-0.5">
                {mode === "create" ? "New" : "Editing"}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-4 py-3">
              {/* Project Information Section */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold border-b pb-1">Project Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-3">
                    <Label htmlFor="jobName" className="text-sm font-medium w-24 flex-shrink-0">
                      Job Name *
                    </Label>
                    <Input
                      id="jobName"
                      value={formData.jobName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, jobName: e.target.value }))}
                      placeholder="Enter job name"
                      disabled={isReadonly}
                      required
                      className="flex-1"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <Label htmlFor="jobNumber" className="text-sm font-medium w-24 flex-shrink-0">
                      Job Number *
                    </Label>
                    <Input
                      id="jobNumber"
                      value={formData.jobNumber}
                      onChange={(e) => setFormData((prev) => ({ ...prev, jobNumber: e.target.value }))}
                      placeholder="Enter job number"
                      disabled={isReadonly}
                      required
                      className="flex-1"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <Label htmlFor="architect" className="text-sm font-medium w-24 flex-shrink-0">
                      Architect
                    </Label>
                    <Input
                      id="architect"
                      value={formData.architect}
                      onChange={(e) => setFormData((prev) => ({ ...prev, architect: e.target.value }))}
                      placeholder="Enter architect"
                      disabled={isReadonly}
                      className="flex-1"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <Label className="text-sm font-medium w-24 flex-shrink-0">Due Date</Label>
                    <div className="flex space-x-2 flex-1">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "flex-1 justify-start text-left font-normal",
                              !formData.proposalDueDate && "text-muted-foreground"
                            )}
                            disabled={isReadonly}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.proposalDueDate ? (
                              format(formData.proposalDueDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={formData.proposalDueDate}
                            onSelect={(date) => setFormData((prev) => ({ ...prev, proposalDueDate: date }))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <Input
                        type="time"
                        value={formData.proposalDueTime}
                        onChange={(e) => setFormData((prev) => ({ ...prev, proposalDueTime: e.target.value }))}
                        disabled={isReadonly}
                        className="w-32"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Label htmlFor="proposalDeliveredVia" className="text-sm font-medium w-24 flex-shrink-0">
                      Delivery Via
                    </Label>
                    <Input
                      id="proposalDeliveredVia"
                      value={formData.proposalDeliveredVia}
                      onChange={(e) => setFormData((prev) => ({ ...prev, proposalDeliveredVia: e.target.value }))}
                      placeholder="Enter delivery method"
                      disabled={isReadonly}
                      className="flex-1"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <Label htmlFor="handDeliveredCopies" className="text-sm font-medium w-24 flex-shrink-0">
                      Copies
                    </Label>
                    <Input
                      id="handDeliveredCopies"
                      value={formData.handDeliveredCopies}
                      onChange={(e) => setFormData((prev) => ({ ...prev, handDeliveredCopies: e.target.value }))}
                      placeholder="Enter number of copies"
                      disabled={isReadonly}
                      className="flex-1"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <Label htmlFor="typeOfProposal" className="text-sm font-medium w-24 flex-shrink-0">
                      Proposal Type
                    </Label>
                    <Input
                      id="typeOfProposal"
                      value={formData.typeOfProposal}
                      onChange={(e) => setFormData((prev) => ({ ...prev, typeOfProposal: e.target.value }))}
                      placeholder="Enter proposal type"
                      disabled={isReadonly}
                      className="flex-1"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <Label htmlFor="rfiFormat" className="text-sm font-medium w-24 flex-shrink-0">
                      RFI Format
                    </Label>
                    <Input
                      id="rfiFormat"
                      value={formData.rfiFormat}
                      onChange={(e) => setFormData((prev) => ({ ...prev, rfiFormat: e.target.value }))}
                      placeholder="Enter RFI format"
                      disabled={isReadonly}
                      className="flex-1"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <Label htmlFor="projectExecutive" className="text-sm font-medium w-24 flex-shrink-0">
                      Proj Executive
                    </Label>
                    <Input
                      id="projectExecutive"
                      value={formData.projectExecutive}
                      onChange={(e) => setFormData((prev) => ({ ...prev, projectExecutive: e.target.value }))}
                      placeholder="Enter project executive"
                      disabled={isReadonly}
                      className="flex-1"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <Label htmlFor="primaryContact" className="text-sm font-medium w-24 flex-shrink-0">
                      Primary Contact
                    </Label>
                    <Input
                      id="primaryContact"
                      value={formData.primaryContact}
                      onChange={(e) => setFormData((prev) => ({ ...prev, primaryContact: e.target.value }))}
                      placeholder="Enter primary contact"
                      disabled={isReadonly}
                      className="flex-1"
                    />
                  </div>

                  <div className="flex items-center space-x-3 md:col-span-2">
                    <Label htmlFor="estimatorsAssigned" className="text-sm font-medium w-24 flex-shrink-0">
                      Estimators
                    </Label>
                    <Input
                      id="estimatorsAssigned"
                      value={formData.estimatorsAssigned}
                      onChange={(e) => setFormData((prev) => ({ ...prev, estimatorsAssigned: e.target.value }))}
                      placeholder="Enter assigned estimators"
                      disabled={isReadonly}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <Separator className="my-2" />

              {/* Tabbed Content */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-2">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="managing">Managing Information</TabsTrigger>
                  <TabsTrigger value="estimating">Estimating Preparation</TabsTrigger>
                  <TabsTrigger value="deliverables">Final Deliverables</TabsTrigger>
                </TabsList>

                {/* Managing Information Tab */}
                <TabsContent value="managing" className="space-y-4">
                  <div className="overflow-x-auto max-h-[250px] overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
                          <th className="border border-gray-200 dark:border-gray-700 px-2 py-2 text-xs font-semibold w-16">
                            Item No.
                          </th>
                          <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left text-xs font-semibold min-w-[300px]">
                            Description
                          </th>
                          <th className="border border-gray-200 dark:border-gray-700 px-2 py-2 text-center text-xs font-semibold w-16">
                            Yes
                          </th>
                          <th className="border border-gray-200 dark:border-gray-700 px-2 py-2 text-center text-xs font-semibold w-16">
                            No
                          </th>
                          <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left text-xs font-semibold w-32">
                            Responsible
                          </th>
                          <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left text-xs font-semibold w-32">
                            Deadline/Frequency
                          </th>
                          <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left text-xs font-semibold min-w-[200px]">
                            Notes
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.managingItems.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td className="border border-gray-200 dark:border-gray-700 px-2 py-2 text-center text-xs">
                              {item.id}
                            </td>
                            <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-xs">
                              {item.description}
                            </td>
                            <td className="border border-gray-200 dark:border-gray-700 px-2 py-2 text-center">
                              <Checkbox
                                checked={item.yes}
                                onCheckedChange={(checked) => updateManagingItem(item.id, "yes", !!checked)}
                                disabled={isReadonly}
                                className="h-4 w-4"
                              />
                            </td>
                            <td className="border border-gray-200 dark:border-gray-700 px-2 py-2 text-center">
                              <Checkbox
                                checked={item.no}
                                onCheckedChange={(checked) => updateManagingItem(item.id, "no", !!checked)}
                                disabled={isReadonly}
                                className="h-4 w-4"
                              />
                            </td>
                            <td className="border border-gray-200 dark:border-gray-700 px-1 py-1">
                              <Input
                                value={item.responsible}
                                onChange={(e) => updateManagingItem(item.id, "responsible", e.target.value)}
                                disabled={isReadonly}
                                className="h-6 text-xs border-0 bg-transparent"
                              />
                            </td>
                            <td className="border border-gray-200 dark:border-gray-700 px-1 py-1">
                              <Input
                                value={item.deadlineFrequency}
                                onChange={(e) => updateManagingItem(item.id, "deadlineFrequency", e.target.value)}
                                disabled={isReadonly}
                                className="h-6 text-xs border-0 bg-transparent"
                              />
                            </td>
                            <td className="border border-gray-200 dark:border-gray-700 px-1 py-1">
                              <Textarea
                                value={item.notes}
                                onChange={(e) => updateManagingItem(item.id, "notes", e.target.value)}
                                disabled={isReadonly}
                                className="min-h-6 text-xs border-0 bg-transparent resize-none"
                                rows={1}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>

                {/* Estimating Preparation Tab */}
                <TabsContent value="estimating" className="space-y-4">
                  <div className="overflow-x-auto max-h-[250px] overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
                          <th className="border border-gray-200 dark:border-gray-700 px-2 py-2 text-xs font-semibold w-16">
                            Item No.
                          </th>
                          <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left text-xs font-semibold min-w-[300px]">
                            Description
                          </th>
                          <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left text-xs font-semibold w-32">
                            Responsible
                          </th>
                          <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left text-xs font-semibold w-32">
                            Deadline
                          </th>
                          <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left text-xs font-semibold min-w-[200px]">
                            Notes
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.estimatingItems.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td className="border border-gray-200 dark:border-gray-700 px-2 py-2 text-center text-xs">
                              {item.id}
                            </td>
                            <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-xs">
                              {item.description}
                            </td>
                            <td className="border border-gray-200 dark:border-gray-700 px-1 py-1">
                              <Input
                                value={item.responsible}
                                onChange={(e) => updateEstimatingItem(item.id, "responsible", e.target.value)}
                                disabled={isReadonly}
                                className="h-6 text-xs border-0 bg-transparent"
                              />
                            </td>
                            <td className="border border-gray-200 dark:border-gray-700 px-1 py-1">
                              <Input
                                value={item.deadline}
                                onChange={(e) => updateEstimatingItem(item.id, "deadline", e.target.value)}
                                disabled={isReadonly}
                                className="h-6 text-xs border-0 bg-transparent"
                              />
                            </td>
                            <td className="border border-gray-200 dark:border-gray-700 px-1 py-1">
                              <Textarea
                                value={item.notes}
                                onChange={(e) => updateEstimatingItem(item.id, "notes", e.target.value)}
                                disabled={isReadonly}
                                className="min-h-6 text-xs border-0 bg-transparent resize-none"
                                rows={1}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>

                {/* Final Deliverables Tab */}
                <TabsContent value="deliverables" className="space-y-4">
                  <div className="overflow-x-auto max-h-[250px] overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
                          <th className="border border-gray-200 dark:border-gray-700 px-2 py-2 text-xs font-semibold w-16">
                            Item No.
                          </th>
                          <th className="border border-gray-200 dark:border-gray-700 px-2 py-2 text-center text-xs font-semibold w-20">
                            Tab Req'd
                          </th>
                          <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left text-xs font-semibold min-w-[300px]">
                            Description
                          </th>
                          <th className="border border-gray-200 dark:border-gray-700 px-2 py-2 text-center text-xs font-semibold w-16">
                            Yes
                          </th>
                          <th className="border border-gray-200 dark:border-gray-700 px-2 py-2 text-center text-xs font-semibold w-16">
                            No
                          </th>
                          <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left text-xs font-semibold w-32">
                            Responsible
                          </th>
                          <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left text-xs font-semibold w-32">
                            Deadline
                          </th>
                          <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left text-xs font-semibold min-w-[200px]">
                            Notes
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.deliverablesItems.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td className="border border-gray-200 dark:border-gray-700 px-2 py-2 text-center text-xs">
                              {item.id}
                            </td>
                            <td className="border border-gray-200 dark:border-gray-700 px-1 py-1">
                              <Select
                                value={item.tabReqd}
                                onValueChange={(value) => updateDeliverablesItem(item.id, "tabReqd", value)}
                                disabled={isReadonly}
                              >
                                <SelectTrigger className="h-6 text-xs border-0 bg-transparent">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Y">Y</SelectItem>
                                  <SelectItem value="N">N</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-xs">
                              {item.description || (
                                <Input
                                  value={item.description}
                                  onChange={(e) => updateDeliverablesItem(item.id, "description", e.target.value)}
                                  disabled={isReadonly}
                                  placeholder="Enter description"
                                  className="h-6 text-xs border-0 bg-transparent"
                                />
                              )}
                            </td>
                            <td className="border border-gray-200 dark:border-gray-700 px-2 py-2 text-center">
                              <Checkbox
                                checked={item.yes}
                                onCheckedChange={(checked) => updateDeliverablesItem(item.id, "yes", !!checked)}
                                disabled={isReadonly}
                                className="h-4 w-4"
                              />
                            </td>
                            <td className="border border-gray-200 dark:border-gray-700 px-2 py-2 text-center">
                              <Checkbox
                                checked={item.no}
                                onCheckedChange={(checked) => updateDeliverablesItem(item.id, "no", !!checked)}
                                disabled={isReadonly}
                                className="h-4 w-4"
                              />
                            </td>
                            <td className="border border-gray-200 dark:border-gray-700 px-1 py-1">
                              <Input
                                value={item.responsible}
                                onChange={(e) => updateDeliverablesItem(item.id, "responsible", e.target.value)}
                                disabled={isReadonly}
                                className="h-6 text-xs border-0 bg-transparent"
                              />
                            </td>
                            <td className="border border-gray-200 dark:border-gray-700 px-1 py-1">
                              <Input
                                value={item.deadline}
                                onChange={(e) => updateDeliverablesItem(item.id, "deadline", e.target.value)}
                                disabled={isReadonly}
                                className="h-6 text-xs border-0 bg-transparent"
                              />
                            </td>
                            <td className="border border-gray-200 dark:border-gray-700 px-1 py-1">
                              <Textarea
                                value={item.notes}
                                onChange={(e) => updateDeliverablesItem(item.id, "notes", e.target.value)}
                                disabled={isReadonly}
                                className="min-h-6 text-xs border-0 bg-transparent resize-none"
                                rows={1}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {!isReadonly && (
                    <div className="flex justify-start">
                      <Button type="button" variant="outline" onClick={handleAddDeliverable} className="text-xs">
                        <Plus className="h-3 w-3 mr-1" />
                        Add Deliverable
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>

          {/* Footer Actions */}
          <div className="flex justify-end space-x-2 px-6 py-4 border-t bg-background flex-shrink-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange?.(false)}>
              Cancel
            </Button>
            {!isReadonly && (
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                {mode === "create" ? "Create Pursuit" : "Update Pursuit"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default NewPursuitModal
export type { ProjectPursuitFormData }
