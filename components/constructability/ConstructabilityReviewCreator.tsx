/**
 * @fileoverview Constructability Review Creator Component
 * @module ConstructabilityReviewCreator
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-12-20
 */

"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Send,
  Upload,
  FileText,
  User,
  Calendar,
  Star,
  Target,
  CheckCircle,
  AlertTriangle,
  Building,
  ClipboardList,
  MessageSquare,
  X,
  Plus,
  Eye,
  RefreshCw,
  Clock,
  Users,
} from "lucide-react"

interface ScoringCriteria {
  designFeasibility: { weight: number; description: string }
  coordinationClarity: { weight: number; description: string }
  codeCompliance: { weight: number; description: string }
  costScheduleImpact: { weight: number; description: string }
  constructabilityRisk: { weight: number; description: string }
  bimReviewQuality: { weight: number; description: string }
}

interface ReviewTemplate {
  id: string
  name: string
  projectStage: string
  description: string
  scoringCriteria: ScoringCriteria
  requiredFields: string[]
  estimatedDuration: number
}

interface FormData {
  // Basic Information
  reviewType: string
  projectStage: string
  reviewerName: string
  reviewerRole: string
  reviewDate: string
  estimatedDuration: number
  priority: "high" | "medium" | "low"
  tags: string[]

  // Scoring
  scoring: {
    designFeasibility: number
    coordinationClarity: number
    codeCompliance: number
    costScheduleImpact: number
    constructabilityRisk: number
    bimReviewQuality: number
  }

  // Comments and Recommendations
  comments: string
  recommendations: string[]

  // Attachments
  attachments: File[]

  // Issues Tracking
  issuesIdentified: {
    description: string
    severity: "low" | "medium" | "high"
    category: string
    location: string
    recommendation: string
  }[]

  // Review Settings
  requiresFollowUp: boolean
  followUpDate: string
  notifyStakeholders: boolean
  stakeholderEmails: string[]

  // Additional Fields
  reviewObjectives: string[]
  reviewScope: string
  reviewLimitations: string
  qualityChecklist: { item: string; checked: boolean }[]
}

interface ConstructabilityReviewCreatorProps {
  projectId: string
  projectData: any
  userRole: string
  user: any
  onClose?: () => void
}

const ConstructabilityReviewCreator: React.FC<ConstructabilityReviewCreatorProps> = ({
  projectId,
  projectData,
  userRole,
  user,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    reviewType: "",
    projectStage: "",
    reviewerName: user?.name || "",
    reviewerRole: userRole,
    reviewDate: new Date().toISOString().split("T")[0],
    estimatedDuration: 4,
    priority: "medium",
    tags: [],
    scoring: {
      designFeasibility: 0,
      coordinationClarity: 0,
      codeCompliance: 0,
      costScheduleImpact: 0,
      constructabilityRisk: 0,
      bimReviewQuality: 0,
    },
    comments: "",
    recommendations: [],
    attachments: [],
    issuesIdentified: [],
    requiresFollowUp: false,
    followUpDate: "",
    notifyStakeholders: false,
    stakeholderEmails: [],
    reviewObjectives: [],
    reviewScope: "",
    reviewLimitations: "",
    qualityChecklist: [],
  })

  const [templates, setTemplates] = useState<ReviewTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<ReviewTemplate | null>(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isDraft, setIsDraft] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  const totalSteps = 6
  const stepProgress = (currentStep / totalSteps) * 100

  // Load templates
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const mockTemplates: ReviewTemplate[] = [
          {
            id: "sd-review",
            name: "Schematic Design Review",
            projectStage: "Schematic Design",
            description: "Comprehensive review of schematic design for constructability",
            scoringCriteria: {
              designFeasibility: { weight: 25, description: "Feasibility and practicality of the design approach" },
              coordinationClarity: { weight: 20, description: "Clarity of design coordination and integration" },
              codeCompliance: { weight: 15, description: "Compliance with building codes and regulations" },
              costScheduleImpact: { weight: 20, description: "Impact on project cost and schedule" },
              constructabilityRisk: { weight: 15, description: "Risk assessment for construction execution" },
              bimReviewQuality: { weight: 5, description: "Quality of BIM model and documentation" },
            },
            requiredFields: ["reviewScope", "designFeasibility", "coordinationClarity"],
            estimatedDuration: 6,
          },
          {
            id: "dd-review",
            name: "Design Development Review",
            projectStage: "Design Development",
            description: "Detailed review of design development documents",
            scoringCriteria: {
              designFeasibility: { weight: 20, description: "Feasibility and practicality of the design approach" },
              coordinationClarity: { weight: 25, description: "Clarity of design coordination and integration" },
              codeCompliance: { weight: 20, description: "Compliance with building codes and regulations" },
              costScheduleImpact: { weight: 15, description: "Impact on project cost and schedule" },
              constructabilityRisk: { weight: 15, description: "Risk assessment for construction execution" },
              bimReviewQuality: { weight: 5, description: "Quality of BIM model and documentation" },
            },
            requiredFields: ["reviewScope", "designFeasibility", "coordinationClarity", "codeCompliance"],
            estimatedDuration: 8,
          },
          {
            id: "cd-review",
            name: "Construction Documents Review",
            projectStage: "Construction Documents",
            description: "Final review of construction documents for buildability",
            scoringCriteria: {
              designFeasibility: { weight: 15, description: "Feasibility and practicality of the design approach" },
              coordinationClarity: { weight: 20, description: "Clarity of design coordination and integration" },
              codeCompliance: { weight: 20, description: "Compliance with building codes and regulations" },
              costScheduleImpact: { weight: 20, description: "Impact on project cost and schedule" },
              constructabilityRisk: { weight: 20, description: "Risk assessment for construction execution" },
              bimReviewQuality: { weight: 5, description: "Quality of BIM model and documentation" },
            },
            requiredFields: [
              "reviewScope",
              "designFeasibility",
              "coordinationClarity",
              "codeCompliance",
              "constructabilityRisk",
            ],
            estimatedDuration: 10,
          },
        ]

        setTemplates(mockTemplates)
      } catch (error) {
        console.error("Error loading templates:", error)
      }
    }

    loadTemplates()
  }, [])

  // Update form data when template changes
  useEffect(() => {
    if (selectedTemplate) {
      setFormData((prev) => ({
        ...prev,
        reviewType: selectedTemplate.name,
        projectStage: selectedTemplate.projectStage,
        estimatedDuration: selectedTemplate.estimatedDuration,
        qualityChecklist: selectedTemplate.requiredFields.map((field) => ({
          item: field,
          checked: false,
        })),
      }))
    }
  }, [selectedTemplate])

  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {}

    switch (step) {
      case 1:
        if (!formData.reviewType) newErrors.reviewType = "Review type is required"
        if (!formData.projectStage) newErrors.projectStage = "Project stage is required"
        if (!formData.reviewerName) newErrors.reviewerName = "Reviewer name is required"
        break
      case 2:
        if (!formData.reviewScope) newErrors.reviewScope = "Review scope is required"
        if (formData.reviewObjectives.length === 0) newErrors.reviewObjectives = "At least one objective is required"
        break
      case 3:
        const hasValidScore = Object.values(formData.scoring).some((score) => score > 0)
        if (!hasValidScore) newErrors.scoring = "At least one scoring category must be rated"
        break
      case 4:
        if (!formData.comments) newErrors.comments = "Comments are required"
        if (formData.recommendations.length === 0) newErrors.recommendations = "At least one recommendation is required"
        break
      case 5:
        // Issues are optional, no validation needed
        break
      case 6:
        // Review settings are optional, no validation needed
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleScoreChange = (category: keyof typeof formData.scoring, value: number) => {
    setFormData((prev) => ({
      ...prev,
      scoring: {
        ...prev.scoring,
        [category]: value,
      },
    }))
  }

  const addRecommendation = () => {
    setFormData((prev) => ({
      ...prev,
      recommendations: [...prev.recommendations, ""],
    }))
  }

  const updateRecommendation = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      recommendations: prev.recommendations.map((rec, i) => (i === index ? value : rec)),
    }))
  }

  const removeRecommendation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      recommendations: prev.recommendations.filter((_, i) => i !== index),
    }))
  }

  const addIssue = () => {
    setFormData((prev) => ({
      ...prev,
      issuesIdentified: [
        ...prev.issuesIdentified,
        {
          description: "",
          severity: "medium",
          category: "",
          location: "",
          recommendation: "",
        },
      ],
    }))
  }

  const updateIssue = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      issuesIdentified: prev.issuesIdentified.map((issue, i) => (i === index ? { ...issue, [field]: value } : issue)),
    }))
  }

  const removeIssue = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      issuesIdentified: prev.issuesIdentified.filter((_, i) => i !== index),
    }))
  }

  const addObjective = () => {
    setFormData((prev) => ({
      ...prev,
      reviewObjectives: [...prev.reviewObjectives, ""],
    }))
  }

  const updateObjective = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      reviewObjectives: prev.reviewObjectives.map((obj, i) => (i === index ? value : obj)),
    }))
  }

  const removeObjective = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      reviewObjectives: prev.reviewObjectives.filter((_, i) => i !== index),
    }))
  }

  const addStakeholderEmail = () => {
    setFormData((prev) => ({
      ...prev,
      stakeholderEmails: [...prev.stakeholderEmails, ""],
    }))
  }

  const updateStakeholderEmail = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      stakeholderEmails: prev.stakeholderEmails.map((email, i) => (i === index ? value : email)),
    }))
  }

  const removeStakeholderEmail = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      stakeholderEmails: prev.stakeholderEmails.filter((_, i) => i !== index),
    }))
  }

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }))
    }
  }

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }))
  }

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files)
      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...newFiles],
      }))
    }
  }

  const removeAttachment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }))
  }

  const saveDraft = async () => {
    setLoading(true)
    setIsDraft(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Draft saved:", formData)
      // Show success message
    } catch (error) {
      console.error("Error saving draft:", error)
    } finally {
      setLoading(false)
    }
  }

  const submitReview = async () => {
    if (!validateStep(currentStep)) return

    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Calculate overall score
      const totalScore = Object.values(formData.scoring).reduce((sum, score) => sum + score, 0)
      const averageScore = totalScore / Object.keys(formData.scoring).length

      console.log("Review submitted:", {
        ...formData,
        overallScore: averageScore,
        status: "completed",
        submittedAt: new Date().toISOString(),
      })

      // Show success message and close
      onClose?.()
    } catch (error) {
      console.error("Error submitting review:", error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600"
    if (score >= 6) return "text-yellow-600"
    if (score >= 4) return "text-orange-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 9) return "Excellent"
    if (score >= 8) return "Good"
    if (score >= 6) return "Satisfactory"
    if (score >= 4) return "Needs Improvement"
    return "Poor"
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <p className="text-sm text-muted-foreground">
                Start by selecting a review template and providing basic details
              </p>
            </div>

            {/* Template Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Select Review Template</CardTitle>
                <CardDescription>Choose a template that matches your review type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedTemplate?.id === template.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">{template.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{template.description}</p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Building className="h-3 w-3" />
                        <span>{template.projectStage}</span>
                        <Clock className="h-3 w-3 ml-2" />
                        <span>{template.estimatedDuration}h</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Basic Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Review Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reviewType">Review Type *</Label>
                    <Input
                      id="reviewType"
                      value={formData.reviewType}
                      onChange={(e) => setFormData((prev) => ({ ...prev, reviewType: e.target.value }))}
                      placeholder="e.g., 100% DD Review"
                    />
                    {errors.reviewType && <p className="text-xs text-red-500">{errors.reviewType}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="projectStage">Project Stage *</Label>
                    <Select
                      value={formData.projectStage}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, projectStage: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select project stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Schematic Design">Schematic Design</SelectItem>
                        <SelectItem value="Design Development">Design Development</SelectItem>
                        <SelectItem value="Construction Documents">Construction Documents</SelectItem>
                        <SelectItem value="Pre-Construction">Pre-Construction</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.projectStage && <p className="text-xs text-red-500">{errors.projectStage}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reviewerName">Reviewer Name *</Label>
                    <Input
                      id="reviewerName"
                      value={formData.reviewerName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, reviewerName: e.target.value }))}
                      placeholder="Enter reviewer name"
                    />
                    {errors.reviewerName && <p className="text-xs text-red-500">{errors.reviewerName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reviewerRole">Reviewer Role</Label>
                    <Input
                      id="reviewerRole"
                      value={formData.reviewerRole}
                      onChange={(e) => setFormData((prev) => ({ ...prev, reviewerRole: e.target.value }))}
                      placeholder="e.g., Project Manager"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reviewDate">Review Date</Label>
                    <Input
                      id="reviewDate"
                      type="date"
                      value={formData.reviewDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, reviewDate: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value: any) => setFormData((prev) => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimatedDuration">Estimated Duration (hours)</Label>
                  <Input
                    id="estimatedDuration"
                    type="number"
                    value={formData.estimatedDuration}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, estimatedDuration: parseInt(e.target.value) || 0 }))
                    }
                    min="1"
                    max="40"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="ml-1 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Add tag..."
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addTag(e.currentTarget.value)
                          e.currentTarget.value = ""
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement
                        addTag(input.value)
                        input.value = ""
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Review Scope & Objectives</h3>
              <p className="text-sm text-muted-foreground">
                Define the scope and objectives of your constructability review
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Review Scope</CardTitle>
                <CardDescription>Describe what will be reviewed and any limitations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reviewScope">Scope Description *</Label>
                  <Textarea
                    id="reviewScope"
                    value={formData.reviewScope}
                    onChange={(e) => setFormData((prev) => ({ ...prev, reviewScope: e.target.value }))}
                    placeholder="Describe the scope of the review, including specific areas, systems, or components to be evaluated..."
                    rows={4}
                  />
                  {errors.reviewScope && <p className="text-xs text-red-500">{errors.reviewScope}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reviewLimitations">Limitations & Exclusions</Label>
                  <Textarea
                    id="reviewLimitations"
                    value={formData.reviewLimitations}
                    onChange={(e) => setFormData((prev) => ({ ...prev, reviewLimitations: e.target.value }))}
                    placeholder="List any limitations, exclusions, or assumptions for this review..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Review Objectives</CardTitle>
                <CardDescription>Define specific objectives for this review</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {formData.reviewObjectives.map((objective, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="flex-1">
                        <Input
                          value={objective}
                          onChange={(e) => updateObjective(index, e.target.value)}
                          placeholder="Enter review objective..."
                        />
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeObjective(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addObjective}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Objective
                </Button>
                {errors.reviewObjectives && <p className="text-xs text-red-500">{errors.reviewObjectives}</p>}
              </CardContent>
            </Card>

            {/* Pre-defined Quality Checklist */}
            {selectedTemplate && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quality Checklist</CardTitle>
                  <CardDescription>Template-specific quality requirements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {formData.qualityChecklist.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox
                          id={`checklist-${index}`}
                          checked={item.checked}
                          onCheckedChange={(checked) => {
                            setFormData((prev) => ({
                              ...prev,
                              qualityChecklist: prev.qualityChecklist.map((checkItem, i) =>
                                i === index ? { ...checkItem, checked: !!checked } : checkItem
                              ),
                            }))
                          }}
                        />
                        <Label htmlFor={`checklist-${index}`} className="text-sm">
                          {item.item.replace(/([A-Z])/g, " $1").trim()}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Scoring Assessment</h3>
              <p className="text-sm text-muted-foreground">Rate each category based on your review findings</p>
            </div>

            {/* Scoring Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedTemplate &&
                Object.entries(selectedTemplate.scoringCriteria).map(([key, criteria]) => (
                  <Card key={key}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</CardTitle>
                      <CardDescription className="text-xs">
                        {criteria.description} (Weight: {criteria.weight}%)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Score Slider */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">Score</Label>
                            <div className="flex items-center space-x-2">
                              <span
                                className={`text-lg font-bold ${getScoreColor(
                                  formData.scoring[key as keyof typeof formData.scoring]
                                )}`}
                              >
                                {formData.scoring[key as keyof typeof formData.scoring]}/10
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {getScoreLabel(formData.scoring[key as keyof typeof formData.scoring])}
                              </Badge>
                            </div>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="10"
                            step="0.5"
                            value={formData.scoring[key as keyof typeof formData.scoring]}
                            onChange={(e) =>
                              handleScoreChange(key as keyof typeof formData.scoring, parseFloat(e.target.value))
                            }
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>0</span>
                            <span>5</span>
                            <span>10</span>
                          </div>
                        </div>

                        {/* Star Rating */}
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleScoreChange(key as keyof typeof formData.scoring, star * 2)}
                              className="text-yellow-400 hover:text-yellow-500 transition-colors"
                            >
                              <Star
                                className={`h-4 w-4 ${
                                  formData.scoring[key as keyof typeof formData.scoring] >= star * 2
                                    ? "fill-current"
                                    : "stroke-current"
                                }`}
                              />
                            </button>
                          ))}
                        </div>

                        {/* Visual Progress */}
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              formData.scoring[key as keyof typeof formData.scoring] >= 8
                                ? "bg-green-500"
                                : formData.scoring[key as keyof typeof formData.scoring] >= 6
                                ? "bg-yellow-500"
                                : formData.scoring[key as keyof typeof formData.scoring] >= 4
                                ? "bg-orange-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${(formData.scoring[key as keyof typeof formData.scoring] / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            {/* Overall Score Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Overall Score Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Overall Score</span>
                      <span
                        className={`text-2xl font-bold ${getScoreColor(
                          Object.values(formData.scoring).reduce((sum, score) => sum + score, 0) /
                            Object.keys(formData.scoring).length
                        )}`}
                      >
                        {(
                          Object.values(formData.scoring).reduce((sum, score) => sum + score, 0) /
                          Object.keys(formData.scoring).length
                        ).toFixed(1)}
                        /10
                      </span>
                    </div>
                    <Progress
                      value={
                        (Object.values(formData.scoring).reduce((sum, score) => sum + score, 0) /
                          Object.keys(formData.scoring).length) *
                        10
                      }
                      className="h-3"
                    />
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full border-4 border-primary/20 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">
                        {Math.round(
                          (Object.values(formData.scoring).reduce((sum, score) => sum + score, 0) /
                            Object.keys(formData.scoring).length) *
                            10
                        )}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {errors.scoring && <p className="text-xs text-red-500">{errors.scoring}</p>}
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Comments & Recommendations</h3>
              <p className="text-sm text-muted-foreground">Provide detailed comments and actionable recommendations</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Review Comments</CardTitle>
                <CardDescription>Provide comprehensive comments on your findings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="comments">Comments *</Label>
                  <Textarea
                    id="comments"
                    value={formData.comments}
                    onChange={(e) => setFormData((prev) => ({ ...prev, comments: e.target.value }))}
                    placeholder="Provide detailed comments on the review findings, including strengths, weaknesses, and overall assessment..."
                    rows={6}
                  />
                  {errors.comments && <p className="text-xs text-red-500">{errors.comments}</p>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recommendations</CardTitle>
                <CardDescription>Provide specific, actionable recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {formData.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-xs text-primary font-medium">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <Textarea
                          value={recommendation}
                          onChange={(e) => updateRecommendation(index, e.target.value)}
                          placeholder="Enter specific recommendation..."
                          rows={2}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRecommendation(index)}
                        className="mt-1"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addRecommendation}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Recommendation
                </Button>
                {errors.recommendations && <p className="text-xs text-red-500">{errors.recommendations}</p>}
              </CardContent>
            </Card>

            {/* Attachments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Attachments</CardTitle>
                <CardDescription>Upload supporting documents, images, or files</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                    id="file-upload"
                  />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload files or drag and drop</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, Word, Excel, Images (max 10MB each)</p>
                  </Label>
                </div>

                {formData.attachments.length > 0 && (
                  <div className="space-y-2">
                    <Label>Uploaded Files</Label>
                    <div className="space-y-2">
                      {formData.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{file.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {(file.size / 1024 / 1024).toFixed(1)}MB
                            </Badge>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeAttachment(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Issues Tracking</h3>
              <p className="text-sm text-muted-foreground">Document specific issues identified during the review</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Identified Issues</CardTitle>
                <CardDescription>Record specific constructability issues found</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.issuesIdentified.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No issues recorded yet</p>
                    <p className="text-xs">Click "Add Issue" to document constructability concerns</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.issuesIdentified.map((issue, index) => (
                      <Card key={index} className="border-l-4 border-l-orange-500">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <AlertTriangle className="h-4 w-4 text-orange-500" />
                              <span className="font-medium text-sm">Issue #{index + 1}</span>
                            </div>
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeIssue(index)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-xs">Description</Label>
                              <Textarea
                                value={issue.description}
                                onChange={(e) => updateIssue(index, "description", e.target.value)}
                                placeholder="Describe the issue..."
                                rows={3}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs">Recommendation</Label>
                              <Textarea
                                value={issue.recommendation}
                                onChange={(e) => updateIssue(index, "recommendation", e.target.value)}
                                placeholder="Recommended solution..."
                                rows={3}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs">Category</Label>
                              <Input
                                value={issue.category}
                                onChange={(e) => updateIssue(index, "category", e.target.value)}
                                placeholder="e.g., Structural, MEP, etc."
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs">Location</Label>
                              <Input
                                value={issue.location}
                                onChange={(e) => updateIssue(index, "location", e.target.value)}
                                placeholder="e.g., Level 3, Grid A-B"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs">Severity</Label>
                              <Select
                                value={issue.severity}
                                onValueChange={(value: any) => updateIssue(index, "severity", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="low">Low</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                <Button type="button" variant="outline" size="sm" onClick={addIssue} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Issue
                </Button>
              </CardContent>
            </Card>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Review Settings</h3>
              <p className="text-sm text-muted-foreground">Configure follow-up actions and notifications</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Follow-up Actions</CardTitle>
                <CardDescription>Set up follow-up requirements and dates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requiresFollowUp"
                    checked={formData.requiresFollowUp}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, requiresFollowUp: !!checked }))}
                  />
                  <Label htmlFor="requiresFollowUp">This review requires follow-up</Label>
                </div>

                {formData.requiresFollowUp && (
                  <div className="space-y-2">
                    <Label htmlFor="followUpDate">Follow-up Date</Label>
                    <Input
                      id="followUpDate"
                      type="date"
                      value={formData.followUpDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, followUpDate: e.target.value }))}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notifications</CardTitle>
                <CardDescription>Configure stakeholder notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="notifyStakeholders"
                    checked={formData.notifyStakeholders}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, notifyStakeholders: !!checked }))}
                  />
                  <Label htmlFor="notifyStakeholders">Notify stakeholders when review is submitted</Label>
                </div>

                {formData.notifyStakeholders && (
                  <div className="space-y-3">
                    <Label>Stakeholder Email Addresses</Label>
                    {formData.stakeholderEmails.map((email, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="flex-1">
                          <Input
                            type="email"
                            value={email}
                            onChange={(e) => updateStakeholderEmail(index, e.target.value)}
                            placeholder="Enter email address..."
                          />
                        </div>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeStakeholderEmail(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={addStakeholderEmail}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Email
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Review Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Review Summary</CardTitle>
                <CardDescription>Final review before submission</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Review Type</Label>
                    <p className="font-medium">{formData.reviewType}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Project Stage</Label>
                    <p className="font-medium">{formData.projectStage}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Reviewer</Label>
                    <p className="font-medium">{formData.reviewerName}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Overall Score</Label>
                    <p
                      className={`font-bold text-lg ${getScoreColor(
                        Object.values(formData.scoring).reduce((sum, score) => sum + score, 0) /
                          Object.keys(formData.scoring).length
                      )}`}
                    >
                      {(
                        Object.values(formData.scoring).reduce((sum, score) => sum + score, 0) /
                        Object.keys(formData.scoring).length
                      ).toFixed(1)}
                      /10
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Issues Identified</Label>
                    <p className="font-medium">{formData.issuesIdentified.length}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Recommendations</Label>
                    <p className="font-medium">{formData.recommendations.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Create Review</h3>
          <p className="text-sm text-muted-foreground">
            Create a comprehensive constructability review with detailed scoring and recommendations
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={saveDraft} disabled={loading}>
            {loading && isDraft ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Draft
          </Button>
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(stepProgress)}% Complete</span>
          </div>
          <Progress value={stepProgress} className="h-2" />
          <div className="flex justify-between mt-2">
            <span className="text-xs text-muted-foreground">Basic Info</span>
            <span className="text-xs text-muted-foreground">Scope</span>
            <span className="text-xs text-muted-foreground">Scoring</span>
            <span className="text-xs text-muted-foreground">Comments</span>
            <span className="text-xs text-muted-foreground">Issues</span>
            <span className="text-xs text-muted-foreground">Settings</span>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {renderStepContent()}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setPreviewMode(true)} disabled={currentStep < 3}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>

          {currentStep < totalSteps ? (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={submitReview} disabled={loading}>
              {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
              Submit Review
            </Button>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      <Dialog open={previewMode} onOpenChange={setPreviewMode}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Preview</DialogTitle>
            <DialogDescription>Preview your review before submission</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Review Header */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold">{formData.reviewType}</h3>
              <p className="text-sm text-muted-foreground">
                {formData.projectStage} • {formData.reviewerName} • {new Date(formData.reviewDate).toLocaleDateString()}
              </p>
            </div>

            {/* Scoring Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(formData.scoring).map(([key, score]) => (
                <div key={key} className="text-center">
                  <p className="text-sm font-medium capitalize mb-1">{key.replace(/([A-Z])/g, " $1").trim()}</p>
                  <p className={`text-xl font-bold ${getScoreColor(score)}`}>{score.toFixed(1)}/10</p>
                </div>
              ))}
            </div>

            {/* Overall Score */}
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Overall Score</p>
              <p
                className={`text-3xl font-bold ${getScoreColor(
                  Object.values(formData.scoring).reduce((sum, score) => sum + score, 0) /
                    Object.keys(formData.scoring).length
                )}`}
              >
                {(
                  Object.values(formData.scoring).reduce((sum, score) => sum + score, 0) /
                  Object.keys(formData.scoring).length
                ).toFixed(1)}
                /10
              </p>
            </div>

            {/* Comments */}
            <div>
              <h4 className="font-medium mb-2">Comments</h4>
              <p className="text-sm text-muted-foreground">{formData.comments}</p>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="font-medium mb-2">Recommendations</h4>
              <ol className="list-decimal list-inside space-y-1">
                {formData.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm">
                    {rec}
                  </li>
                ))}
              </ol>
            </div>

            {/* Issues */}
            {formData.issuesIdentified.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Issues Identified</h4>
                <div className="space-y-2">
                  {formData.issuesIdentified.map((issue, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{issue.description}</span>
                        <Badge
                          variant={
                            issue.severity === "high"
                              ? "destructive"
                              : issue.severity === "medium"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {issue.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{issue.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ConstructabilityReviewCreator
export { ConstructabilityReviewCreator }
