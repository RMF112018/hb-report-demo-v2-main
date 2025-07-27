/**
 * @fileoverview Project Safety Forms Management Component
 * @module ProjectSafetyForms
 * @version 1.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Features:
 * - List of assigned forms from safety module
 * - New form assignment dropdown (from template list)
 * - Status tracker (open, in review, submitted)
 * - Dynamic recommendations based on schedule lookahead and project phase
 * - AI-enhanced tagging for trade-specific forms
 */

"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card"
import { Badge } from "../../ui/badge"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog"
import { Separator } from "../../ui/separator"
import { Progress } from "../../ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu"
import {
  Shield,
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  Star,
  Brain,
  Users,
  Activity,
  Zap,
  AlertCircle,
  MapPin,
  Building,
  Wrench,
  HardHat,
  Settings,
  BarChart3,
  RefreshCw,
  Send,
  FileCheck,
  FilePlus,
  FileX,
  ChevronRight,
  Lightbulb,
  Target,
  TrendingUp,
  Calendar as CalendarIcon,
  User,
  Mail,
  Phone,
  Folder,
  CheckSquare,
  Square,
  ChevronUp,
  MoreVertical,
} from "lucide-react"

// Import form templates
import jhaTemplate from "../../../data/static/safety-forms/job-hazard-analysis.json"
import ssiTemplate from "../../../data/static/safety-forms/site-safety-inspection.json"
import irTemplate from "../../../data/static/safety-forms/incident-report.json"

import { useToast } from "../../../hooks/use-toast"
import { SharePointLibraryViewer } from "../../sharepoint/SharePointLibraryViewer"
import ToolboxTalkPanel from "./ToolboxTalkPanel"

// Types
interface SafetyFormTemplate {
  formId: string
  title: string
  description: string
  category: string
  version: string
  estimatedTime: string
  frequency: string
  applicablePhases: string[]
  applicableTrades: string[]
  priority: string
  triggers: Array<{
    condition: string
    values: string[]
    description: string
  }>
}

interface AssignedForm {
  id: string
  templateId: string
  title: string
  category: string
  assignedDate: string
  dueDate: string
  status: "open" | "in-progress" | "in-review" | "completed" | "overdue"
  assignedTo: string
  assignedBy: string
  priority: "low" | "medium" | "high" | "critical"
  completionDate?: string
  submittedBy?: string
  reviewedBy?: string
  notes?: string
  estimatedTime: string
  progress: number
}

interface ProjectPhaseData {
  currentPhase: string
  upcomingActivities: string[]
  activeTrades: string[]
  scheduleData: any[]
}

interface ProjectSafetyFormsProps {
  projectId: string
  projectData: any
  userRole: string
  user: any
}

// Transform safety form templates into SharePoint-like document format
const transformTemplatesToDocuments = (templates: SafetyFormTemplate[]) => {
  return templates.map((template) => ({
    id: template.formId,
    name: `${template.title}.pdf`,
    file: {
      mimeType: "application/pdf",
    },
    size: Math.floor(Math.random() * 1000000) + 100000, // Mock file size
    lastModifiedDateTime: new Date().toISOString(),
    lastModifiedBy: {
      user: {
        displayName: "Safety Team",
      },
    },
    webUrl: `#/forms/${template.formId}`,
    description: template.description,
    category: template.category,
    priority: template.priority,
    estimatedTime: template.estimatedTime,
    frequency: template.frequency,
    applicablePhases: template.applicablePhases,
    applicableTrades: template.applicableTrades,
  }))
}

// Mock schedule data for lookahead analysis
const getMockScheduleData = (projectPhase: string) => {
  const baseActivities = [
    { id: 1, name: "Site Preparation", trade: "general", startDate: "2024-12-16", status: "in-progress" },
    { id: 2, name: "Foundation Work", trade: "concrete", startDate: "2024-12-20", status: "upcoming" },
    { id: 3, name: "Structural Steel", trade: "steel", startDate: "2024-12-28", status: "upcoming" },
    { id: 4, name: "Electrical Rough-in", trade: "electrical", startDate: "2025-01-05", status: "planned" },
    { id: 5, name: "Plumbing Rough-in", trade: "plumbing", startDate: "2025-01-08", status: "planned" },
    { id: 6, name: "Roofing", trade: "roofing", startDate: "2025-01-15", status: "planned" },
  ]

  return baseActivities.filter((activity) => {
    if (projectPhase === "Pre-Construction") return activity.status === "planned"
    if (projectPhase === "Construction") return ["in-progress", "upcoming"].includes(activity.status)
    return true
  })
}

// Mock assigned forms data
const getMockAssignedForms = (projectId: string): AssignedForm[] => [
  {
    id: "AF-001",
    templateId: "JHA-001",
    title: "JHA - Foundation Work",
    category: "hazard-analysis",
    assignedDate: "2024-12-10",
    dueDate: "2024-12-18",
    status: "in-progress",
    assignedTo: "John Smith",
    assignedBy: "Safety Officer",
    priority: "high",
    estimatedTime: "30 minutes",
    progress: 65,
    notes: "Foundation excavation and concrete pour analysis",
  },
  {
    id: "AF-002",
    templateId: "SSI-001",
    title: "Weekly Safety Inspection - Week 50",
    category: "inspection",
    assignedDate: "2024-12-09",
    dueDate: "2024-12-16",
    status: "overdue",
    assignedTo: "Mike Davis",
    assignedBy: "Project Manager",
    priority: "high",
    estimatedTime: "45 minutes",
    progress: 0,
    notes: "Regular weekly inspection overdue",
  },
  {
    id: "AF-003",
    templateId: "JHA-001",
    title: "JHA - Electrical Rough-in",
    category: "hazard-analysis",
    assignedDate: "2024-12-12",
    dueDate: "2024-12-22",
    status: "open",
    assignedTo: "Tom Anderson",
    assignedBy: "Safety Officer",
    priority: "medium",
    estimatedTime: "25 minutes",
    progress: 0,
    notes: "Preparation for electrical work start",
  },
  {
    id: "AF-004",
    templateId: "SSI-001",
    title: "Weekly Safety Inspection - Week 49",
    category: "inspection",
    assignedDate: "2024-12-02",
    dueDate: "2024-12-09",
    status: "completed",
    assignedTo: "Mike Davis",
    assignedBy: "Project Manager",
    priority: "high",
    completionDate: "2024-12-08",
    submittedBy: "Mike Davis",
    reviewedBy: "Safety Officer",
    estimatedTime: "45 minutes",
    progress: 100,
    notes: "Completed on time, no major issues found",
  },
]

// Custom Safety Forms Library Viewer Component
interface SafetyFormsLibraryViewerProps {
  projectId: string
  projectData: any
  templates: SafetyFormTemplate[]
  templateDocuments: any[]
  loading: boolean
  onDownload: (documentId: string) => void
  onRefresh: () => void
  onAssignForm: (templateId: string) => void
}

const SafetyFormsLibraryViewer: React.FC<SafetyFormsLibraryViewerProps> = ({
  projectId,
  projectData,
  templates,
  templateDocuments,
  loading,
  onDownload,
  onRefresh,
  onAssignForm,
}) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<"name" | "modified" | "size">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  // Filter and sort documents based on search query and sort options
  const filteredDocuments = useMemo(() => {
    let docs = [...templateDocuments]

    // Apply search filter
    if (searchQuery) {
      docs = docs.filter((doc) => doc.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Sort documents
    docs.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "modified":
          comparison = new Date(a.lastModifiedDateTime).getTime() - new Date(b.lastModifiedDateTime).getTime()
          break
        case "size":
          comparison = (a.size || 0) - (b.size || 0)
          break
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    return docs
  }, [templateDocuments, searchQuery, sortBy, sortOrder])

  // Get file icon component
  const getFileIconComponent = (document: any) => {
    return <FileText className="h-4 w-4 text-red-600" />
  }

  // Handle document download
  const handleDownload = async (document: any) => {
    await onDownload(document.id)
  }

  // Handle item selection
  const handleItemSelection = (itemId: string, selected: boolean) => {
    const newSelected = new Set(selectedItems)
    if (selected) {
      newSelected.add(itemId)
    } else {
      newSelected.delete(itemId)
    }
    setSelectedItems(newSelected)
  }

  // Handle select all
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedItems(new Set(filteredDocuments.map((doc) => doc.id)))
    } else {
      setSelectedItems(new Set())
    }
  }

  // Handle sort change
  const handleSort = (column: "name" | "modified" | "size") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4 px-0">
        {/* Current Path Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-3 py-2 rounded-md">
          <Folder className="h-4 w-4" />
          <span>Safety Forms</span>
          <ChevronRight className="h-3 w-3" />
          <span>{projectData?.project_name || "Project"}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-foreground">Form Templates</span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search safety forms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Control Bar */}
        <div className="flex items-center justify-between gap-4 py-2 border-t border-border">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {filteredDocuments.length} templates
            </Badge>
            <Button variant="ghost" size="sm" onClick={onRefresh} title="Refresh">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {selectedItems.size > 0 && (
              <>
                <Badge variant="secondary" className="text-xs">
                  {selectedItems.size} selected
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    selectedItems.forEach((id) => {
                      const template = templates.find((t) => t.formId === id)
                      if (template) onAssignForm(template.formId)
                    })
                  }}
                  className="text-xs"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Assign Selected
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-0">
        {/* Documents Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => handleSelectAll(selectedItems.size !== filteredDocuments.length)}
                  >
                    {selectedItems.size === filteredDocuments.length && filteredDocuments.length > 0 ? (
                      <CheckSquare className="h-4 w-4" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="h-auto p-0 font-medium hover:bg-transparent"
                    onClick={() => handleSort("name")}
                  >
                    Form Name
                    {sortBy === "name" && (
                      <ChevronUp className={`ml-1 h-3 w-3 ${sortOrder === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </Button>
                </TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden md:table-cell">Priority</TableHead>
                <TableHead className="hidden md:table-cell">Est. Time</TableHead>
                <TableHead className="hidden md:table-cell">
                  <Button
                    variant="ghost"
                    className="h-auto p-0 font-medium hover:bg-transparent"
                    onClick={() => handleSort("size")}
                  >
                    Size
                    {sortBy === "size" && (
                      <ChevronUp className={`ml-1 h-3 w-3 ${sortOrder === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </Button>
                </TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    {searchQuery ? "No forms match your search." : "No form templates found."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredDocuments.map((document) => {
                  const template = templates.find((t) => t.formId === document.id)
                  return (
                    <TableRow
                      key={document.id}
                      className={`hover:bg-muted/50 cursor-pointer ${
                        selectedItems.has(document.id) ? "bg-muted/30" : ""
                      }`}
                      onClick={() => handleDownload(document)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleItemSelection(document.id, !selectedItems.has(document.id))}
                        >
                          {selectedItems.has(document.id) ? (
                            <CheckSquare className="h-4 w-4" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>

                      <TableCell>{getFileIconComponent(document)}</TableCell>

                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span className="truncate">{document.name}</span>
                        </div>
                      </TableCell>

                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline" className="text-xs">
                          {template?.category || "Safety"}
                        </Badge>
                      </TableCell>

                      <TableCell className="hidden md:table-cell">
                        <Badge
                          variant={
                            template?.priority === "critical"
                              ? "destructive"
                              : template?.priority === "high"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {template?.priority || "medium"}
                        </Badge>
                      </TableCell>

                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {template?.estimatedTime || "15 min"}
                      </TableCell>

                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {formatFileSize(document.size || 0)}
                      </TableCell>

                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDownload(document)
                              }}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download Template
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                onAssignForm(document.id)
                              }}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Assign Form
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer Info */}
        <div className="text-sm text-muted-foreground flex items-center justify-between">
          <span>
            {filteredDocuments.length} safety form template{filteredDocuments.length !== 1 ? "s" : ""}
            {searchQuery && ` matching "${searchQuery}"`}
          </span>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Safety Templates
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Ready to Assign
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export const ProjectSafetyForms: React.FC<ProjectSafetyFormsProps> = ({ projectId, projectData, userRole, user }) => {
  const { toast } = useToast()
  const [assignedForms, setAssignedForms] = useState<AssignedForm[]>([])
  const [templates, setTemplates] = useState<SafetyFormTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("assigned")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [showAssignForm, setShowAssignForm] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [templateDocuments, setTemplateDocuments] = useState<any[]>([])

  // Custom hook-like functions for SharePoint library integration
  const handleDocumentDownload = async (documentId: string) => {
    const template = templates.find((t) => t.formId === documentId)
    if (template) {
      toast({
        title: "Form Downloaded",
        description: `${template.title} has been downloaded as a PDF template`,
      })
      // In a real implementation, this would download the actual form PDF
      console.log(`Downloading form template: ${template.title}`)
    }
  }

  const handleDocumentSearch = (query: string) => {
    // The SharePointLibraryViewer handles its own search internally
    console.log(`Searching safety forms: ${query}`)
  }

  const refreshTemplates = async () => {
    // Refresh the templates data
    const formTemplates: SafetyFormTemplate[] = [
      jhaTemplate as SafetyFormTemplate,
      ssiTemplate as SafetyFormTemplate,
      irTemplate as SafetyFormTemplate,
    ]
    setTemplates(formTemplates)
    setTemplateDocuments(transformTemplatesToDocuments(formTemplates))
  }

  // Load templates and assigned forms
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        // Load form templates
        const formTemplates: SafetyFormTemplate[] = [
          jhaTemplate as SafetyFormTemplate,
          ssiTemplate as SafetyFormTemplate,
          irTemplate as SafetyFormTemplate,
        ]
        setTemplates(formTemplates)
        setTemplateDocuments(transformTemplatesToDocuments(formTemplates))

        // Load assigned forms for this project
        const assigned = getMockAssignedForms(projectId)
        setAssignedForms(assigned)
      } catch (error) {
        console.error("Error loading safety forms data:", error)
        toast({
          title: "Error Loading Forms",
          description: "Failed to load safety forms data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [projectId, toast])

  // Get project phase data for recommendations
  const projectPhaseData: ProjectPhaseData = useMemo(() => {
    const phase = projectData?.project_stage_name || "Construction"
    const scheduleData = getMockScheduleData(phase)

    return {
      currentPhase: phase,
      upcomingActivities: scheduleData.map((a) => a.name),
      activeTrades: [...new Set(scheduleData.map((a) => a.trade))],
      scheduleData,
    }
  }, [projectData])

  // Generate AI-enhanced recommendations
  const recommendations = useMemo(() => {
    const recs: Array<{
      templateId: string
      title: string
      reason: string
      priority: "low" | "medium" | "high" | "critical"
      trade?: string
      activity?: string
    }> = []

    // Check for trade-specific JHA requirements
    projectPhaseData.activeTrades.forEach((trade) => {
      if (["electrical", "plumbing", "roofing", "steel", "concrete"].includes(trade)) {
        const existingJHA = assignedForms.find(
          (f) => f.templateId === "JHA-001" && f.title.toLowerCase().includes(trade) && f.status !== "completed"
        )

        if (!existingJHA) {
          recs.push({
            templateId: "JHA-001",
            title: `JHA - ${trade.charAt(0).toUpperCase() + trade.slice(1)} Work`,
            reason: `${trade.charAt(0).toUpperCase() + trade.slice(1)} work starting soon - JHA required`,
            priority: "high",
            trade,
            activity: projectPhaseData.upcomingActivities.find((a) => a.toLowerCase().includes(trade)),
          })
        }
      }
    })

    // Check for weekly inspection schedule
    const lastWeeklyInspection = assignedForms
      .filter((f) => f.templateId === "SSI-001")
      .sort((a, b) => new Date(b.assignedDate).getTime() - new Date(a.assignedDate).getTime())[0]

    if (
      !lastWeeklyInspection ||
      new Date().getTime() - new Date(lastWeeklyInspection.assignedDate).getTime() > 7 * 24 * 60 * 60 * 1000
    ) {
      recs.push({
        templateId: "SSI-001",
        title: "Weekly Safety Inspection",
        reason: "Weekly safety inspection is due",
        priority: "high",
      })
    }

    // Phase-specific recommendations
    if (projectPhaseData.currentPhase === "Construction") {
      const excavationActivity = projectPhaseData.upcomingActivities.find(
        (a) => a.toLowerCase().includes("excavation") || a.toLowerCase().includes("foundation")
      )

      if (excavationActivity) {
        const existingExcavationJHA = assignedForms.find(
          (f) => f.templateId === "JHA-001" && f.title.toLowerCase().includes("foundation") && f.status !== "completed"
        )

        if (!existingExcavationJHA) {
          recs.push({
            templateId: "JHA-001",
            title: "JHA - Excavation and Foundation",
            reason: "Excavation work requires comprehensive hazard analysis",
            priority: "critical",
            activity: excavationActivity,
          })
        }
      }
    }

    return recs.slice(0, 5) // Limit to top 5 recommendations
  }, [projectPhaseData, assignedForms])

  // Filter assigned forms
  const filteredForms = useMemo(() => {
    let filtered = [...assignedForms]

    if (searchQuery) {
      filtered = filtered.filter(
        (form) =>
          form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          form.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          form.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((form) => form.status === statusFilter)
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((form) => form.priority === priorityFilter)
    }

    return filtered.sort((a, b) => {
      // Sort by priority first, then by due date
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
      const aPriority = priorityOrder[a.priority]
      const bPriority = priorityOrder[b.priority]

      if (aPriority !== bPriority) {
        return bPriority - aPriority
      }

      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })
  }, [assignedForms, searchQuery, statusFilter, priorityFilter])

  // Get status color and icon
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "open":
        return { color: "secondary", icon: FileText, label: "Open" }
      case "in-progress":
        return { color: "default", icon: Clock, label: "In Progress" }
      case "in-review":
        return { color: "secondary", icon: Eye, label: "In Review" }
      case "completed":
        return { color: "default", icon: CheckCircle, label: "Completed" }
      case "overdue":
        return { color: "destructive", icon: AlertTriangle, label: "Overdue" }
      default:
        return { color: "outline", icon: FileText, label: status }
    }
  }

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "destructive"
      case "high":
        return "secondary"
      case "medium":
        return "default"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  // Handle form assignment
  const handleAssignForm = (templateId: string, assignedTo: string) => {
    const template = templates.find((t) => t.formId === templateId)
    if (!template) return

    const newForm: AssignedForm = {
      id: `AF-${Date.now()}`,
      templateId,
      title: template.title,
      category: template.category,
      assignedDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "open",
      assignedTo,
      assignedBy: `${user.firstName} ${user.lastName}`,
      priority: template.priority as any,
      estimatedTime: template.estimatedTime,
      progress: 0,
    }

    setAssignedForms((prev) => [...prev, newForm])
    setShowAssignForm(false)
    setSelectedTemplate("")

    toast({
      title: "Form Assigned",
      description: `${template.title} has been assigned to ${assignedTo}`,
      variant: "default",
    })
  }

  // Calculate summary statistics
  const stats = useMemo(() => {
    const total = assignedForms.length
    const open = assignedForms.filter((f) => f.status === "open").length
    const inProgress = assignedForms.filter((f) => f.status === "in-progress").length
    const completed = assignedForms.filter((f) => f.status === "completed").length
    const overdue = assignedForms.filter((f) => f.status === "overdue").length
    const avgProgress = assignedForms.reduce((sum, f) => sum + f.progress, 0) / total || 0

    return { total, open, inProgress, completed, overdue, avgProgress }
  }, [assignedForms])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading safety forms...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Project Safety Forms</h2>
          <p className="text-muted-foreground">
            Manage safety forms, assignments, and compliance for {projectData?.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="default" size="sm" onClick={() => setShowAssignForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Assign Form
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Forms</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Open</p>
                <p className="text-2xl font-bold text-gray-600">{stats.open}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Avg Progress</p>
                <p className="text-2xl font-bold text-purple-600">{Math.round(stats.avgProgress)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="assigned">Assigned Forms</TabsTrigger>
          <TabsTrigger value="toolbox-talks">Toolbox Talks</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="templates">Form Templates</TabsTrigger>
        </TabsList>

        {/* Assigned Forms Tab */}
        <TabsContent value="assigned" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search forms..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="in-review">In Review</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Priorities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Actions</label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("")
                      setStatusFilter("all")
                      setPriorityFilter("all")
                    }}
                    className="w-full"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Forms List */}
          <div className="grid gap-4">
            {filteredForms.map((form) => {
              const statusDisplay = getStatusDisplay(form.status)
              const StatusIcon = statusDisplay.icon

              return (
                <Card key={form.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{form.title}</h3>
                          <Badge variant={statusDisplay.color as any} className="text-xs">
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusDisplay.label}
                          </Badge>
                          <Badge variant={getPriorityColor(form.priority) as any} className="text-xs">
                            {form.priority.charAt(0).toUpperCase() + form.priority.slice(1)}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>Assigned to: {form.assignedTo}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            <span>Due: {new Date(form.dueDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>Est. Time: {form.estimatedTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Activity className="h-4 w-4" />
                            <span>Category: {form.category}</span>
                          </div>
                        </div>

                        {form.progress > 0 && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{form.progress}%</span>
                            </div>
                            <Progress value={form.progress} className="h-2" />
                          </div>
                        )}

                        {form.notes && <p className="text-sm text-muted-foreground mb-4">{form.notes}</p>}
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        {form.status !== "completed" && (
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredForms.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Forms Found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || statusFilter !== "all" || priorityFilter !== "all"
                    ? "No forms match your current filters."
                    : "No safety forms have been assigned to this project yet."}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Toolbox Talks Tab */}
        <TabsContent value="toolbox-talks" className="space-y-4">
          <ToolboxTalkPanel projectId={projectId} projectData={projectData} userRole={userRole} user={user} />
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-500" />
                AI-Enhanced Recommendations
              </CardTitle>
              <CardDescription>
                Recommendations based on project phase ({projectPhaseData.currentPhase}), upcoming activities, and
                safety requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec, index) => {
                  const template = templates.find((t) => t.formId === rec.templateId)

                  return (
                    <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Lightbulb className="h-4 w-4 text-amber-500" />
                            <h4 className="font-medium">{rec.title}</h4>
                            <Badge variant={getPriorityColor(rec.priority) as any} className="text-xs">
                              {rec.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{rec.reason}</p>
                          {rec.trade && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <HardHat className="h-3 w-3" />
                              <span>Trade: {rec.trade}</span>
                            </div>
                          )}
                          {rec.activity && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Activity className="h-3 w-3" />
                              <span>Activity: {rec.activity}</span>
                            </div>
                          )}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedTemplate(rec.templateId)
                            setShowAssignForm(true)
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Assign
                        </Button>
                      </div>
                    </div>
                  )
                })}

                {recommendations.length === 0 && (
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Recommendations</h3>
                    <p className="text-muted-foreground">
                      All required safety forms are up to date for current project activities.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Project Context */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Context</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Current Phase
                  </h4>
                  <p className="text-sm text-muted-foreground">{projectPhaseData.currentPhase}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Active Trades
                  </h4>
                  <p className="text-sm text-muted-foreground">{projectPhaseData.activeTrades.join(", ") || "None"}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Upcoming Activities
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {projectPhaseData.upcomingActivities.length} activities scheduled
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Safety Form Templates</h3>
              <p className="text-sm text-muted-foreground">
                Browse and download standardized safety form templates for your project
              </p>
            </div>
            <Button variant="outline" onClick={() => setShowAssignForm(true)} className="ml-4">
              <Plus className="h-4 w-4 mr-2" />
              Assign Form
            </Button>
          </div>

          <SafetyFormsLibraryViewer
            projectId={projectId}
            projectData={projectData}
            templates={templates}
            templateDocuments={templateDocuments}
            loading={loading}
            onDownload={handleDocumentDownload}
            onRefresh={refreshTemplates}
            onAssignForm={(templateId: string) => {
              setSelectedTemplate(templateId)
              setShowAssignForm(true)
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Assign Form Dialog */}
      <Dialog open={showAssignForm} onOpenChange={setShowAssignForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assign Safety Form</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Form Template</label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a form template..." />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.formId} value={template.formId}>
                      {template.title} - {template.estimatedTime}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Assign To</label>
              <Select defaultValue="">
                <SelectTrigger>
                  <SelectValue placeholder="Select person to assign..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="john-smith">John Smith - Project Manager</SelectItem>
                  <SelectItem value="mike-davis">Mike Davis - Safety Officer</SelectItem>
                  <SelectItem value="tom-anderson">Tom Anderson - Electrician</SelectItem>
                  <SelectItem value="lisa-wilson">Lisa Wilson - Foreman</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedTemplate && (
              <div className="border rounded-lg p-4 bg-muted/50">
                <h4 className="font-medium mb-2">Template Details</h4>
                {(() => {
                  const template = templates.find((t) => t.formId === selectedTemplate)
                  return template ? (
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Description:</span> {template.description}
                      </p>
                      <p>
                        <span className="font-medium">Estimated Time:</span> {template.estimatedTime}
                      </p>
                      <p>
                        <span className="font-medium">Priority:</span> {template.priority}
                      </p>
                    </div>
                  ) : null
                })()}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAssignForm(false)}>
                Cancel
              </Button>
              <Button onClick={() => handleAssignForm(selectedTemplate, "John Smith")} disabled={!selectedTemplate}>
                Assign Form
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProjectSafetyForms
