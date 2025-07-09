"use client"

import React, { useState, useEffect, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Save,
  X,
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Clock,
  XCircle,
  Phone,
  Mail,
  User,
  FileText,
  Users,
} from "lucide-react"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import type { Permit, Inspection, InspectorContact } from "@/types/permit-log"

// Form validation schema
const inspectionFormSchema = z.object({
  permitId: z.string().min(1, "Permit is required"),
  type: z.string().min(1, "Inspection type is required"),
  scheduledDate: z.string().optional(),
  completedDate: z.string().optional(),
  inspector: z.string().min(1, "Inspector name is required"),
  inspectorContact: z
    .object({
      phone: z.string().optional(),
      email: z.string().email().optional().or(z.literal("")),
      badge: z.string().optional(),
    })
    .optional(),
  result: z.enum(["passed", "failed", "conditional", "pending"]),
  complianceScore: z.number().min(0).max(100).optional(),
  issues: z.array(z.string()).optional(),
  comments: z.string().optional(),
  resolutionNotes: z.string().optional(),
  followUpRequired: z.boolean().optional(),
  duration: z.number().min(0).optional(),
})

type FormData = z.infer<typeof inspectionFormSchema>

interface InspectionFormData extends Omit<Inspection, "id" | "createdAt" | "updatedAt"> {}

interface InspectionFormProps {
  inspection?: Inspection | null
  permits: Permit[]
  open: boolean
  onClose: () => void
  onSave: (data: InspectionFormData) => void
  userRole?: string
}

const inspectionTypes = [
  "Foundation",
  "Framing",
  "Electrical Rough-in",
  "Plumbing Rough-in",
  "HVAC Rough-in",
  "Insulation",
  "Drywall",
  "Final Electrical",
  "Final Plumbing",
  "Final HVAC",
  "Fire Safety",
  "Building Final",
  "Occupancy",
  "Other",
]

const inspectionResults = [
  { value: "pending", label: "Pending", color: "bg-blue-100 text-blue-800" },
  { value: "passed", label: "Passed", color: "bg-green-100 text-green-800" },
  { value: "conditional", label: "Conditional", color: "bg-yellow-100 text-yellow-800" },
  { value: "failed", label: "Failed", color: "bg-red-100 text-red-800" },
]

export function InspectionForm({ inspection, permits, open, onClose, onSave, userRole = "user" }: InspectionFormProps) {
  const [activeTab, setActiveTab] = useState("basic")
  const [newIssue, setNewIssue] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEditing = !!inspection
  const canEdit = ["admin", "project-manager", "project-executive"].includes(userRole)

  // Initialize form
  const form = useForm<FormData>({
    resolver: zodResolver(inspectionFormSchema),
    defaultValues: {
      permitId: "",
      type: "",
      scheduledDate: "",
      completedDate: "",
      inspector: "",
      inspectorContact: {
        phone: "",
        email: "",
        badge: "",
      },
      result: "pending",
      complianceScore: undefined,
      issues: [],
      comments: "",
      resolutionNotes: "",
      followUpRequired: false,
      duration: undefined,
    },
  })

  // Reset form when inspection changes
  useEffect(() => {
    if (inspection) {
      form.reset({
        permitId: inspection.permitId,
        type: inspection.type,
        scheduledDate: inspection.scheduledDate ? format(new Date(inspection.scheduledDate), "yyyy-MM-dd") : "",
        completedDate: inspection.completedDate ? format(new Date(inspection.completedDate), "yyyy-MM-dd") : "",
        inspector: inspection.inspector,
        inspectorContact: inspection.inspectorContact || {
          phone: "",
          email: "",
          badge: "",
        },
        result: inspection.result,
        complianceScore: inspection.complianceScore,
        issues: Array.isArray(inspection.issues)
          ? inspection.issues.map((issue) => (typeof issue === "string" ? issue : issue.description))
          : [],
        comments: inspection.comments || "",
        resolutionNotes: inspection.resolutionNotes || "",
        followUpRequired: inspection.followUpRequired || false,
        duration: inspection.duration,
      })
    } else {
      form.reset({
        permitId: permits.length > 0 ? permits[0].id : "",
        type: "",
        scheduledDate: "",
        completedDate: "",
        inspector: "",
        inspectorContact: {
          phone: "",
          email: "",
          badge: "",
        },
        result: "pending",
        complianceScore: undefined,
        issues: [],
        comments: "",
        resolutionNotes: "",
        followUpRequired: false,
        duration: undefined,
      })
    }
  }, [inspection, permits, form])

  // Handle form submission
  const handleSubmit = useCallback(
    async (data: FormData) => {
      if (!canEdit) return

      setIsSubmitting(true)
      try {
        const formattedData: InspectionFormData = {
          permitId: data.permitId,
          type: data.type,
          scheduledDate: data.scheduledDate || undefined,
          completedDate: data.completedDate || undefined,
          inspector: data.inspector,
          inspectorContact:
            data.inspectorContact?.phone || data.inspectorContact?.email || data.inspectorContact?.badge
              ? data.inspectorContact
              : undefined,
          result: data.result,
          complianceScore: data.complianceScore,
          issues: data.issues?.filter((issue) => issue.trim() !== ""),
          comments: data.comments || undefined,
          resolutionNotes: data.resolutionNotes || undefined,
          followUpRequired: data.followUpRequired,
          duration: data.duration,
        }

        await onSave(formattedData)
        onClose()
      } catch (error) {
        console.error("Error saving inspection:", error)
      } finally {
        setIsSubmitting(false)
      }
    },
    [canEdit, onSave, onClose]
  )

  // Handle adding issues
  const handleAddIssue = useCallback(() => {
    if (!newIssue.trim()) return

    const currentIssues = form.getValues("issues") || []
    form.setValue("issues", [...currentIssues, newIssue.trim()])
    setNewIssue("")
  }, [newIssue, form])

  // Handle removing issues
  const handleRemoveIssue = useCallback(
    (index: number) => {
      const currentIssues = form.getValues("issues") || []
      form.setValue(
        "issues",
        currentIssues.filter((_, i) => i !== index)
      )
    },
    [form]
  )

  // Get selected permit
  const selectedPermit = permits.find((p) => p.id === form.watch("permitId"))

  if (!canEdit) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Access Denied</DialogTitle>
            <DialogDescription>You don't have permission to create or edit inspections.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            {isEditing ? "Edit Inspection" : "Schedule New Inspection"}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? "Update inspection details and results" : "Schedule a new inspection for a permit"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              <ScrollArea className="h-96 pr-4">
                {/* Basic Information Tab */}
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="permitId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Permit *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select permit" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {permits.map((permit) => (
                                <SelectItem key={permit.id} value={permit.id}>
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    <span>
                                      {permit.number} - {permit.type}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Inspection Type *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select inspection type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {inspectionTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="inspector"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Inspector Name *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input placeholder="Inspector full name" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="result"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Result Status *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select result" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {inspectionResults.map((result) => (
                                <SelectItem key={result.value} value={result.value}>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className={result.color}>
                                      {result.label}
                                    </Badge>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Selected Permit Info */}
                  {selectedPermit && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Permit Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Number:</span> {selectedPermit.number}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Type:</span> {selectedPermit.type}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Authority:</span> {selectedPermit.authority}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Status:</span>
                            <Badge variant="outline" className="ml-1">
                              {selectedPermit.status}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Scheduling Tab */}
                <TabsContent value="scheduling" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="scheduledDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Scheduled Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormDescription>When is this inspection scheduled?</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="completedDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Completed Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormDescription>When was this inspection completed?</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration (minutes)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="e.g. 60"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                            />
                          </FormControl>
                          <FormDescription>How long did the inspection take?</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="followUpRequired"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Follow-up Required</FormLabel>
                            <FormDescription>Does this inspection require follow-up actions?</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Inspector Contact Information */}
                  <div className="space-y-4">
                    <Separator />
                    <h4 className="text-sm font-medium">Inspector Contact Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="inspectorContact.phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="(555) 123-4567" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="inspectorContact.email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="email"
                                  placeholder="inspector@authority.gov"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="inspectorContact.badge"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Badge Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Badge #12345" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Results Tab */}
                <TabsContent value="results" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="complianceScore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Compliance Score (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="85"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                          />
                        </FormControl>
                        <FormDescription>Overall compliance score (0-100%)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Issues */}
                  <div className="space-y-3">
                    <Label>Issues Found</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add an issue or deficiency..."
                        value={newIssue}
                        onChange={(e) => setNewIssue(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddIssue())}
                      />
                      <Button type="button" variant="outline" onClick={handleAddIssue}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {form.watch("issues")?.map((issue, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="text-sm">{issue}</span>
                          <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveIssue(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="resolutionNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resolution Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe any required corrections or follow-up actions..."
                            className="min-h-20"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Required actions to address any issues found</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Details Tab */}
                <TabsContent value="details" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="comments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comments & Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Additional comments, observations, or notes about the inspection..."
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>General comments and observations from the inspection</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </ScrollArea>
            </Tabs>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-[#003087] hover:bg-[#002066] text-white">
                {isSubmitting ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {isEditing ? "Update Inspection" : "Schedule Inspection"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
