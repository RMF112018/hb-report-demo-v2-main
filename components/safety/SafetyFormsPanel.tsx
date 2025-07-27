/**
 * @fileoverview Safety Forms Panel Component
 * @module SafetyFormsPanel
 * @version 1.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Panel component for managing safety forms and documentation
 * Provides form access, completion tracking, and document management
 */

"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Progress } from "../ui/progress"
import { Input } from "../ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import {
  FileText,
  Download,
  Upload,
  Eye,
  Edit,
  Plus,
  Calendar,
  User,
  CheckCircle,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  RefreshCw,
  FileCheck,
  FilePen,
  FileX,
  Folder,
  ChevronRight,
  CheckSquare,
  Square,
  ChevronUp,
  MoreVertical,
  BarChart3,
} from "lucide-react"

interface SafetyForm {
  id: string
  name: string
  category: string
  description: string
  version: string
  lastUpdated: string
  completionRate: number
  required: boolean
  frequency: string
  status: "Active" | "Draft" | "Archived"
  submissionsCount: number
  avgCompletionTime: number
}

interface FormSubmission {
  id: string
  formId: string
  formName: string
  submittedBy: string
  submittedDate: string
  status: "Completed" | "Pending" | "Rejected"
  completionTime: number
  reviewedBy?: string
  reviewDate?: string
  comments?: string
}

// Transform safety forms into SharePoint-like document format
const transformFormsToDocuments = (forms: SafetyForm[]) => {
  return forms.map((form) => ({
    id: form.id,
    name: `${form.name}.pdf`,
    file: {
      mimeType: "application/pdf",
    },
    size: Math.floor(Math.random() * 500000) + 50000, // Mock file size
    lastModifiedDateTime: form.lastUpdated + "T10:30:00Z",
    lastModifiedBy: {
      user: {
        displayName: "Safety Team",
      },
    },
    webUrl: `#/forms/${form.id}`,
    description: form.description,
    category: form.category,
    version: form.version,
    frequency: form.frequency,
    status: form.status,
    required: form.required,
    completionRate: form.completionRate,
    submissionsCount: form.submissionsCount,
    avgCompletionTime: form.avgCompletionTime,
  }))
}

// Custom Safety Forms Library Viewer Component
interface SafetyFormsLibraryViewerProps {
  forms: SafetyForm[]
  onView: (formId: string) => void
  onEdit: (formId: string) => void
  onDownload: (formId: string) => void
  onCreateForm: () => void
}

const SafetyFormsLibraryViewer: React.FC<SafetyFormsLibraryViewerProps> = ({
  forms,
  onView,
  onEdit,
  onDownload,
  onCreateForm,
}) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<"name" | "modified" | "completionRate">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const formDocuments = useMemo(() => transformFormsToDocuments(forms), [forms])

  // Filter and sort documents based on search query and sort options
  const filteredDocuments = useMemo(() => {
    let docs = [...formDocuments]

    // Apply search filter
    if (searchQuery) {
      docs = docs.filter(
        (doc) =>
          doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
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
        case "completionRate":
          comparison = a.completionRate - b.completionRate
          break
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    return docs
  }, [formDocuments, searchQuery, sortBy, sortOrder])

  // Get file icon component
  const getFileIconComponent = () => {
    return <FileText className="h-4 w-4 text-red-600" />
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
  const handleSort = (column: "name" | "modified" | "completionRate") => {
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
          <span>Safety</span>
          <ChevronRight className="h-3 w-3" />
          <span>Forms & Documentation</span>
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-foreground">Forms Library</span>
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
              {filteredDocuments.length} forms
            </Badge>
            <Button variant="ghost" size="sm" title="Refresh">
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
                    selectedItems.forEach((id) => onDownload(id))
                  }}
                  className="text-xs"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download Selected
                </Button>
              </>
            )}
            <Button variant="ghost" size="sm" onClick={onCreateForm} className="text-xs">
              <Plus className="h-4 w-4 mr-1" />
              Create Form
            </Button>
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
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">
                  <Button
                    variant="ghost"
                    className="h-auto p-0 font-medium hover:bg-transparent"
                    onClick={() => handleSort("completionRate")}
                  >
                    Completion
                    {sortBy === "completionRate" && (
                      <ChevronUp className={`ml-1 h-3 w-3 ${sortOrder === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </Button>
                </TableHead>
                <TableHead className="hidden md:table-cell">Frequency</TableHead>
                <TableHead className="hidden md:table-cell">Submissions</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    {searchQuery ? "No forms match your search." : "No safety forms found."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredDocuments.map((document) => {
                  const form = forms.find((f) => f.id === document.id)
                  return (
                    <TableRow
                      key={document.id}
                      className={`hover:bg-muted/50 cursor-pointer ${
                        selectedItems.has(document.id) ? "bg-muted/30" : ""
                      }`}
                      onClick={() => onView(document.id)}
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

                      <TableCell>{getFileIconComponent()}</TableCell>

                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span className="truncate">{document.name}</span>
                          {document.required && (
                            <Badge variant="destructive" className="text-xs">
                              Required
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline" className="text-xs">
                          {document.category}
                        </Badge>
                      </TableCell>

                      <TableCell className="hidden md:table-cell">
                        <Badge
                          variant={
                            document.status === "Active"
                              ? "default"
                              : document.status === "Draft"
                              ? "secondary"
                              : "outline"
                          }
                          className="text-xs"
                        >
                          {document.status}
                        </Badge>
                      </TableCell>

                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <Progress value={document.completionRate} className="w-16 h-2" />
                          <span className="text-xs text-muted-foreground">{document.completionRate}%</span>
                        </div>
                      </TableCell>

                      <TableCell className="hidden md:table-cell text-muted-foreground text-xs">
                        {document.frequency}
                      </TableCell>

                      <TableCell className="hidden md:table-cell text-muted-foreground text-xs">
                        {document.submissionsCount}
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
                                onView(document.id)
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                onEdit(document.id)
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Form
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                onDownload(document.id)
                              }}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download PDF
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
            {filteredDocuments.length} safety form{filteredDocuments.length !== 1 ? "s" : ""}
            {searchQuery && ` matching "${searchQuery}"`}
          </span>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Forms Library
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {forms.filter((f) => f.status === "Active").length} Active
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export const SafetyFormsPanel: React.FC = () => {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("forms")

  useEffect(() => {
    setMounted(true)
  }, [])

  // Handler functions for form actions
  const handleViewForm = (formId: string) => {
    console.log(`Viewing form: ${formId}`)
    // In a real implementation, this would open the form in a modal or navigate to a detail page
    alert(`View form: ${formId}`)
  }

  const handleEditForm = (formId: string) => {
    console.log(`Editing form: ${formId}`)
    // In a real implementation, this would open the form editor
    alert(`Edit form: ${formId}`)
  }

  const handleDownloadForm = (formId: string) => {
    console.log(`Downloading form: ${formId}`)
    // In a real implementation, this would download the form as PDF
    alert(`Download form: ${formId}`)
  }

  const handleCreateForm = () => {
    console.log("Creating new form")
    // In a real implementation, this would open the form creator
    alert("Create new form")
  }

  // Mock safety forms data
  const safetyForms: SafetyForm[] = [
    {
      id: "SF-001",
      name: "Incident Report Form",
      category: "Incident Management",
      description: "Report workplace incidents, near-misses, and safety concerns",
      version: "2.1",
      lastUpdated: "2024-01-15",
      completionRate: 95,
      required: true,
      frequency: "As needed",
      status: "Active",
      submissionsCount: 12,
      avgCompletionTime: 8,
    },
    {
      id: "SF-002",
      name: "Safety Inspection Checklist",
      category: "Inspections",
      description: "Daily safety inspection checklist for work areas",
      version: "1.8",
      lastUpdated: "2024-01-10",
      completionRate: 88,
      required: true,
      frequency: "Daily",
      status: "Active",
      submissionsCount: 156,
      avgCompletionTime: 12,
    },
    {
      id: "SF-003",
      name: "PPE Compliance Form",
      category: "PPE",
      description: "Personal protective equipment compliance verification",
      version: "1.5",
      lastUpdated: "2023-12-20",
      completionRate: 92,
      required: true,
      frequency: "Weekly",
      status: "Active",
      submissionsCount: 45,
      avgCompletionTime: 5,
    },
    {
      id: "SF-004",
      name: "Safety Training Record",
      category: "Training",
      description: "Record of safety training completion and assessment",
      version: "2.0",
      lastUpdated: "2024-01-05",
      completionRate: 78,
      required: true,
      frequency: "Monthly",
      status: "Active",
      submissionsCount: 34,
      avgCompletionTime: 15,
    },
    {
      id: "SF-005",
      name: "Hazard Communication Form",
      category: "Hazard Management",
      description: "Communicate identified hazards and mitigation measures",
      version: "1.3",
      lastUpdated: "2023-11-15",
      completionRate: 85,
      required: false,
      frequency: "As needed",
      status: "Active",
      submissionsCount: 8,
      avgCompletionTime: 10,
    },
    {
      id: "SF-006",
      name: "Emergency Response Drill",
      category: "Emergency Preparedness",
      description: "Record emergency response drill participation and performance",
      version: "1.2",
      lastUpdated: "2023-10-30",
      completionRate: 100,
      required: true,
      frequency: "Monthly",
      status: "Active",
      submissionsCount: 3,
      avgCompletionTime: 20,
    },
  ]

  // Mock form submissions data
  const formSubmissions: FormSubmission[] = [
    {
      id: "SUB-001",
      formId: "SF-001",
      formName: "Incident Report Form",
      submittedBy: "John Smith",
      submittedDate: "2024-01-18",
      status: "Completed",
      completionTime: 8,
      reviewedBy: "Sarah Johnson",
      reviewDate: "2024-01-19",
      comments: "Thorough documentation, corrective actions implemented",
    },
    {
      id: "SUB-002",
      formId: "SF-002",
      formName: "Safety Inspection Checklist",
      submittedBy: "Mike Wilson",
      submittedDate: "2024-01-18",
      status: "Pending",
      completionTime: 12,
    },
    {
      id: "SUB-003",
      formId: "SF-003",
      formName: "PPE Compliance Form",
      submittedBy: "Lisa Davis",
      submittedDate: "2024-01-17",
      status: "Completed",
      completionTime: 5,
      reviewedBy: "Robert Brown",
      reviewDate: "2024-01-18",
      comments: "All PPE requirements met",
    },
    {
      id: "SUB-004",
      formId: "SF-004",
      formName: "Safety Training Record",
      submittedBy: "Jennifer Lee",
      submittedDate: "2024-01-16",
      status: "Rejected",
      completionTime: 15,
      reviewedBy: "Sarah Johnson",
      reviewDate: "2024-01-17",
      comments: "Missing assessment scores, please resubmit",
    },
    {
      id: "SUB-005",
      formId: "SF-002",
      formName: "Safety Inspection Checklist",
      submittedBy: "David Martinez",
      submittedDate: "2024-01-16",
      status: "Completed",
      completionTime: 10,
      reviewedBy: "Mike Wilson",
      reviewDate: "2024-01-17",
      comments: "Good attention to detail",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200"
      case "Draft":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "Archived":
        return "bg-gray-100 text-gray-600 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4" />
      case "Pending":
        return <Clock className="h-4 w-4" />
      case "Rejected":
        return <FileX className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const renderFormsTab = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Forms</p>
                <p className="text-2xl font-bold text-blue-600">{safetyForms.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Active Forms</p>
                <p className="text-2xl font-bold text-green-600">
                  {safetyForms.filter((form) => form.status === "Active").length}
                </p>
              </div>
              <FileCheck className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Avg Completion</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(safetyForms.reduce((sum, form) => sum + form.completionRate, 0) / safetyForms.length)}%
                </p>
              </div>
              <FilePen className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Submissions</p>
                <p className="text-2xl font-bold text-orange-600">
                  {safetyForms.reduce((sum, form) => sum + form.submissionsCount, 0)}
                </p>
              </div>
              <Upload className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SharePoint-Style Forms Library */}
      <SafetyFormsLibraryViewer
        forms={safetyForms}
        onView={handleViewForm}
        onEdit={handleEditForm}
        onDownload={handleDownloadForm}
        onCreateForm={handleCreateForm}
      />
    </div>
  )

  const renderSubmissionsTab = () => (
    <div className="space-y-6">
      {/* Submissions Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Submissions</p>
                <p className="text-2xl font-bold text-blue-600">{formSubmissions.length}</p>
              </div>
              <Upload className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {formSubmissions.filter((sub) => sub.status === "Completed").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {formSubmissions.filter((sub) => sub.status === "Pending").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {formSubmissions.filter((sub) => sub.status === "Rejected").length}
                </p>
              </div>
              <FileX className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Submissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Recent Submissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {formSubmissions.map((submission) => (
              <div key={submission.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">{submission.formName}</h4>
                      <Badge variant="outline" className={getStatusColor(submission.status)}>
                        {getStatusIcon(submission.status)}
                        <span className="ml-1">{submission.status}</span>
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Submitted by:</span>
                        <p className="font-medium">{submission.submittedBy}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Date:</span>
                        <p className="font-medium">{submission.submittedDate}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Completion Time:</span>
                        <p className="font-medium">{submission.completionTime} min</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Reviewed by:</span>
                        <p className="font-medium">{submission.reviewedBy || "Pending"}</p>
                      </div>
                    </div>
                    {submission.comments && (
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Comments:</p>
                        <p className="text-sm">{submission.comments}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Safety Forms & Documentation</h3>
          <p className="text-sm text-muted-foreground">
            Manage safety forms, track submissions, and monitor compliance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Form
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="forms">Forms Library</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
        </TabsList>
        <TabsContent value="forms" className="space-y-4">
          {renderFormsTab()}
        </TabsContent>
        <TabsContent value="submissions" className="space-y-4">
          {renderSubmissionsTab()}
        </TabsContent>
      </Tabs>
    </div>
  )
}
