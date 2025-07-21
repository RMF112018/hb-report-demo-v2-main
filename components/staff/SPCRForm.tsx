import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Calendar, DollarSign, Users, Building, AlertCircle, CheckCircle, Brain } from "lucide-react"

const spcrFormSchema = z.object({
  type: z.enum(["increase", "decrease"]),
  position: z.string().min(1, "Position is required"),
  projectId: z.string().min(1, "Project is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  scheduleRef: z.string().optional(),
  budget: z.number().min(0, "Budget must be positive"),
  explanation: z.string().min(10, "Explanation must be at least 10 characters"),
  urgency: z.enum(["low", "medium", "high"]).default("medium"),
  employeeId: z.string().optional(),
})

type SPCRFormData = z.infer<typeof spcrFormSchema>

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
}

interface SPCRFormProps {
  onSubmit: (data: SPCRFormData) => void
  onCancel: () => void
  initialData?: Partial<SPCRFormData>
  projects?: Array<{ id: string; name: string; status: string }>
  employees?: Array<{ id: string; name: string; position: string; availability: number }>
}

export function SPCRForm({ onSubmit, onCancel, initialData, projects = [] }: SPCRFormProps) {
  const [budgetImpact, setBudgetImpact] = useState(0)
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const form = useForm<SPCRFormData>({
    resolver: zodResolver(spcrFormSchema),
    defaultValues: {
      type: "increase",
      position: "",
      projectId: "",
      startDate: "",
      endDate: "",
      scheduleRef: "",
      budget: 0,
      explanation: "",
      urgency: "medium",
      employeeId: "",
      ...initialData,
    },
  })

  const watchedPosition = form.watch("position")
  const watchedProjectId = form.watch("projectId")

  // Calculate budget impact
  useEffect(() => {
    const budget = form.getValues("budget")
    const type = form.getValues("type")
    setBudgetImpact(type === "increase" ? budget : -budget)
  }, [form.watch("budget"), form.watch("type")])

  // Generate AI suggestions
  useEffect(() => {
    if (watchedPosition && watchedProjectId) {
      const suggestions = generateAISuggestions(watchedPosition)
      setAiSuggestions(suggestions)
      setShowSuggestions(suggestions.length > 0)
    }
  }, [watchedPosition, watchedProjectId])

  const generateAISuggestions = (position: string) => {
    // Mock AI suggestions - in real implementation, this would be AI-driven
    const suggestions = []

    if (position.toLowerCase().includes("manager")) {
      suggestions.push({
        id: "suggestion-1",
        type: "employee",
        title: "Recommended Employee",
        description: "Sarah Johnson has 85% availability and relevant experience",
        confidence: 87,
        action: "Assign Sarah Johnson",
      })
    }

    if (position.toLowerCase().includes("engineer")) {
      suggestions.push({
        id: "suggestion-2",
        type: "timing",
        title: "Optimal Start Date",
        description: "Consider starting 2 weeks earlier to align with project milestones",
        confidence: 92,
        action: "Adjust start date",
      })
    }

    return suggestions
  }

  const handleSubmit = (data: SPCRFormData) => {
    onSubmit(data)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Staffing Plan Change Request</h2>
          <p className="text-muted-foreground">Create a new SPCR with AI-powered suggestions and validation</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Brain className="h-3 w-3" />
          AI Assisted
        </Badge>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Request Type and Urgency */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Request Details
              </CardTitle>
              <CardDescription>Define the type and urgency of your staffing change request</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Request Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select request type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="increase">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              Staff Increase
                            </div>
                          </SelectItem>
                          <SelectItem value="decrease">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full" />
                              Staff Decrease
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="urgency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Urgency Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select urgency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low Priority</SelectItem>
                          <SelectItem value="medium">Medium Priority</SelectItem>
                          <SelectItem value="high">High Priority</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Position and Project */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Position & Project
              </CardTitle>
              <CardDescription>Specify the position and project for this request</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Project Manager II" {...field} />
                      </FormControl>
                      <FormDescription>Enter the specific position title</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="projectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select project" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {projects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Schedule and Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Schedule & Timeline
              </CardTitle>
              <CardDescription>Define the timeline and schedule references for this request</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="scheduleRef"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Schedule Reference</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., MEP Coordination Phase" {...field} />
                      </FormControl>
                      <FormDescription>Optional reference to specific project phase</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Budget Impact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Budget Impact
              </CardTitle>
              <CardDescription>Calculate the financial impact of this staffing change</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Budget Impact</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>Enter the annual budget impact in dollars</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Calculated Impact:</span>
                  <Badge className={budgetImpact >= 0 ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"}>
                    {budgetImpact >= 0 ? "+" : ""}${budgetImpact.toLocaleString()}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          {showSuggestions && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <Brain className="h-5 w-5" />
                  AI Suggestions
                </CardTitle>
                <CardDescription className="text-orange-700">
                  HBI-powered recommendations for your request
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {aiSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1 bg-orange-100 rounded">
                        <CheckCircle className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{suggestion.title}</div>
                        <div className="text-xs text-muted-foreground">{suggestion.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {suggestion.confidence}% confidence
                      </Badge>
                      <Button size="sm" variant="outline">
                        {suggestion.action}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Justification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Justification
              </CardTitle>
              <CardDescription>Provide detailed justification for this staffing change request</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="explanation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detailed Explanation</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Explain the business need, impact on project timeline, and any other relevant factors..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Minimum 10 characters required</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <div className="flex gap-3">
              <Button type="button" variant="outline">
                Save Draft
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                Submit SPCR
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
