"use client"

/**
 * @fileoverview Pre-Construction Checklist Component
 * @module PreCOChecklist
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Pre-construction checklist component with:
 * - Permit tracking and approvals
 * - Site preparation activities
 * - Design and plan reviews
 * - Vendor and subcontractor coordination
 * - Progress tracking and reporting
 */

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { useProductivityStore } from "@/app/tools/productivity/store/useProductivityStore"
import {
  CheckSquare,
  AlertCircle,
  FileText,
  Users,
  Calendar,
  MapPin,
  Building,
  HardHat,
  FileCheck,
  ClipboardList,
  Settings,
  Plus,
  X,
  Edit,
  Trash2,
  Download,
  Upload,
  MessageSquare,
  Bell,
  Clock,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
} from "lucide-react"
import { cn } from "@/lib/utils"

export type PreCOItemStatus = "Conforming" | "Deficient" | "Neutral" | "N/A"

export interface PreCOItem {
  id: string
  title: string
  description?: string
  status: PreCOItemStatus
  assignedTo?: string
  completedDate?: Date
  dueDate?: Date
  comments?: string
  attachments?: string[]
  isRequired?: boolean
  category?: string
  priority?: "Low" | "Medium" | "High"
  dependencies?: string[]
}

export interface PreCOSection {
  id: string
  title: string
  description?: string
  items: PreCOItem[]
  icon: React.ComponentType<{ className?: string }>
  isExpanded?: boolean
}

interface PreCOChecklistProps {
  projectId: string
  projectName: string
  mode?: "editable" | "review"
  onStatusChange?: (sectionId: string, itemId: string, status: PreCOItemStatus) => void
  onProgressChange?: (progress: number) => void
  className?: string
}

// Mock users for assignment
const mockUsers = [
  { id: "u1", name: "John Smith", email: "john@company.com", role: "Project Manager" },
  { id: "u2", name: "Sarah Johnson", email: "sarah@company.com", role: "Design Manager" },
  { id: "u3", name: "Mike Davis", email: "mike@company.com", role: "Permit Coordinator" },
  { id: "u4", name: "Lisa Chen", email: "lisa@company.com", role: "Safety Manager" },
  { id: "u5", name: "Robert Wilson", email: "robert@company.com", role: "Site Manager" },
]

// Initial pre-construction sections
const initialSections: PreCOSection[] = [
  {
    id: "permits-approvals",
    title: "Permits & Approvals",
    description: "Obtain all required permits and regulatory approvals",
    icon: FileCheck,
    isExpanded: true,
    items: [
      {
        id: "pa-1",
        title: "Building permit application submitted",
        status: "Neutral",
        isRequired: true,
        category: "Permits",
        priority: "High",
        comments: "",
        attachments: [],
      },
      {
        id: "pa-2",
        title: "Zoning compliance verification",
        status: "Neutral",
        isRequired: true,
        category: "Permits",
        priority: "High",
        comments: "",
        attachments: [],
      },
      {
        id: "pa-3",
        title: "Environmental impact assessment",
        status: "Neutral",
        isRequired: false,
        category: "Environmental",
        priority: "Medium",
        comments: "",
        attachments: [],
      },
      {
        id: "pa-4",
        title: "Fire department approval",
        status: "Neutral",
        isRequired: true,
        category: "Safety",
        priority: "High",
        comments: "",
        attachments: [],
      },
      {
        id: "pa-5",
        title: "Utility permits and connections",
        status: "Neutral",
        isRequired: true,
        category: "Utilities",
        priority: "High",
        comments: "",
        attachments: [],
      },
    ],
  },
  {
    id: "site-preparation",
    title: "Site Preparation",
    description: "Prepare the construction site for mobilization",
    icon: MapPin,
    isExpanded: true,
    items: [
      {
        id: "sp-1",
        title: "Site survey and boundaries verification",
        status: "Neutral",
        isRequired: true,
        category: "Survey",
        priority: "High",
        comments: "",
        attachments: [],
      },
      {
        id: "sp-2",
        title: "Utility locates completed",
        status: "Neutral",
        isRequired: true,
        category: "Utilities",
        priority: "High",
        comments: "",
        attachments: [],
      },
      {
        id: "sp-3",
        title: "Site access and staging area setup",
        status: "Neutral",
        isRequired: true,
        category: "Access",
        priority: "Medium",
        comments: "",
        attachments: [],
      },
      {
        id: "sp-4",
        title: "Temporary facilities installation",
        status: "Neutral",
        isRequired: false,
        category: "Facilities",
        priority: "Medium",
        comments: "",
        attachments: [],
      },
      {
        id: "sp-5",
        title: "Erosion control measures",
        status: "Neutral",
        isRequired: true,
        category: "Environmental",
        priority: "Medium",
        comments: "",
        attachments: [],
      },
    ],
  },
  {
    id: "design-review",
    title: "Design & Plans Review",
    description: "Review and finalize all design documents and construction plans",
    icon: FileText,
    isExpanded: true,
    items: [
      {
        id: "dr-1",
        title: "Architectural plans review and approval",
        status: "Neutral",
        isRequired: true,
        category: "Design",
        priority: "High",
        comments: "",
        attachments: [],
      },
      {
        id: "dr-2",
        title: "Structural engineering review",
        status: "Neutral",
        isRequired: true,
        category: "Engineering",
        priority: "High",
        comments: "",
        attachments: [],
      },
      {
        id: "dr-3",
        title: "MEP systems coordination",
        status: "Neutral",
        isRequired: true,
        category: "Engineering",
        priority: "High",
        comments: "",
        attachments: [],
      },
      {
        id: "dr-4",
        title: "Construction specifications finalized",
        status: "Neutral",
        isRequired: true,
        category: "Documentation",
        priority: "Medium",
        comments: "",
        attachments: [],
      },
      {
        id: "dr-5",
        title: "Shop drawings review process established",
        status: "Neutral",
        isRequired: true,
        category: "Process",
        priority: "Medium",
        comments: "",
        attachments: [],
      },
    ],
  },
  {
    id: "procurement",
    title: "Procurement & Subcontractors",
    description: "Secure materials, equipment, and subcontractor agreements",
    icon: Users,
    isExpanded: true,
    items: [
      {
        id: "pc-1",
        title: "Major material procurement packages",
        status: "Neutral",
        isRequired: true,
        category: "Materials",
        priority: "High",
        comments: "",
        attachments: [],
      },
      {
        id: "pc-2",
        title: "Subcontractor prequalification completed",
        status: "Neutral",
        isRequired: true,
        category: "Subcontractors",
        priority: "High",
        comments: "",
        attachments: [],
      },
      {
        id: "pc-3",
        title: "Equipment rentals and delivery scheduled",
        status: "Neutral",
        isRequired: true,
        category: "Equipment",
        priority: "Medium",
        comments: "",
        attachments: [],
      },
      {
        id: "pc-4",
        title: "Insurance and bonding verification",
        status: "Neutral",
        isRequired: true,
        category: "Insurance",
        priority: "High",
        comments: "",
        attachments: [],
      },
      {
        id: "pc-5",
        title: "Vendor coordination and communication plan",
        status: "Neutral",
        isRequired: false,
        category: "Communication",
        priority: "Medium",
        comments: "",
        attachments: [],
      },
    ],
  },
  {
    id: "safety-planning",
    title: "Safety & Planning",
    description: "Establish safety protocols and project planning framework",
    icon: HardHat,
    isExpanded: true,
    items: [
      {
        id: "sp-1",
        title: "Site-specific safety plan development",
        status: "Neutral",
        isRequired: true,
        category: "Safety",
        priority: "High",
        comments: "",
        attachments: [],
      },
      {
        id: "sp-2",
        title: "Project schedule baseline established",
        status: "Neutral",
        isRequired: true,
        category: "Scheduling",
        priority: "High",
        comments: "",
        attachments: [],
      },
      {
        id: "sp-3",
        title: "Quality control procedures defined",
        status: "Neutral",
        isRequired: true,
        category: "Quality",
        priority: "Medium",
        comments: "",
        attachments: [],
      },
      {
        id: "sp-4",
        title: "Communication protocols established",
        status: "Neutral",
        isRequired: true,
        category: "Communication",
        priority: "Medium",
        comments: "",
        attachments: [],
      },
      {
        id: "sp-5",
        title: "Project kickoff meeting scheduled",
        status: "Neutral",
        isRequired: true,
        category: "Coordination",
        priority: "Medium",
        comments: "",
        attachments: [],
      },
    ],
  },
]

export const PreCOChecklist: React.FC<PreCOChecklistProps> = ({
  projectId,
  projectName,
  mode = "editable",
  onStatusChange,
  onProgressChange,
  className = "",
}) => {
  const [sections, setSections] = useState<PreCOSection[]>([])
  const [selectedItem, setSelectedItem] = useState<PreCOItem | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterAssignee, setFilterAssignee] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showCompleted, setShowCompleted] = useState(true)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [showAddItem, setShowAddItem] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  const { toast } = useToast()
  const { addTask } = useProductivityStore()

  // Initialize from localStorage or use default data
  useEffect(() => {
    const storageKey = `preco-checklist-${projectId}`
    const savedData = localStorage.getItem(storageKey)

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setSections(
          parsed.map((section: any) => ({
            ...section,
            items: section.items.map((item: any) => ({
              ...item,
              completedDate: item.completedDate ? new Date(item.completedDate) : undefined,
              dueDate: item.dueDate ? new Date(item.dueDate) : undefined,
            })),
          }))
        )
        // Initialize expanded sections from saved data
        const expandedIds = parsed.reduce((acc: string[], section: any) => {
          if (section.isExpanded) acc.push(section.id)
          return acc
        }, [])
        setExpandedSections(new Set(expandedIds))
      } catch (error) {
        console.error("Failed to parse saved PreCO checklist data:", error)
        setSections(initialSections)
        setExpandedSections(new Set(initialSections.map((s) => s.id)))
      }
    } else {
      setSections(initialSections)
      setExpandedSections(new Set(initialSections.map((s) => s.id)))
    }
  }, [projectId])

  // Save to localStorage whenever sections change
  useEffect(() => {
    if (sections.length > 0) {
      const storageKey = `preco-checklist-${projectId}`
      const sectionsToSave = sections.map((section) => ({
        ...section,
        isExpanded: expandedSections.has(section.id),
      }))
      localStorage.setItem(storageKey, JSON.stringify(sectionsToSave))
    }
  }, [sections, expandedSections, projectId])

  // Calculate overall completion statistics
  const overallStats = useMemo(() => {
    const allItems = sections.flatMap((section) => section.items)
    const totalItems = allItems.length
    const conformingItems = allItems.filter((item) => item.status === "Conforming").length
    const deficientItems = allItems.filter((item) => item.status === "Deficient").length
    const neutralItems = allItems.filter((item) => item.status === "Neutral").length
    const naItems = allItems.filter((item) => item.status === "N/A").length

    return {
      totalItems,
      conformingItems,
      deficientItems,
      neutralItems,
      naItems,
      completionRate: totalItems > 0 ? Math.round((conformingItems / totalItems) * 100) : 0,
    }
  }, [sections])

  // Report progress changes to parent component
  useEffect(() => {
    onProgressChange?.(overallStats.completionRate)
  }, [overallStats.completionRate, onProgressChange])

  // Get unique categories for filtering
  const categories = useMemo(() => {
    const allCategories = sections.flatMap((section) => section.items.map((item) => item.category)).filter(Boolean)
    return [...new Set(allCategories)]
  }, [sections])

  // Status color mapping
  const getStatusColor = (status: PreCOItemStatus) => {
    switch (status) {
      case "Conforming":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300"
      case "Deficient":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300"
      case "Neutral":
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300"
      case "N/A":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  // Priority color mapping
  const getPriorityColor = (priority: PreCOItem["priority"]) => {
    switch (priority) {
      case "High":
        return "text-red-600 dark:text-red-400"
      case "Medium":
        return "text-orange-600 dark:text-orange-400"
      case "Low":
        return "text-green-600 dark:text-green-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  // Handle status update
  const handleStatusUpdate = (sectionId: string, itemId: string, newStatus: PreCOItemStatus) => {
    if (mode === "review") return

    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map((item) =>
                item.id === itemId
                  ? {
                      ...item,
                      status: newStatus,
                      completedDate: newStatus === "Conforming" ? new Date() : undefined,
                    }
                  : item
              ),
            }
          : section
      )
    )

    onStatusChange?.(sectionId, itemId, newStatus)

    toast({
      title: "Status Updated",
      description: `Item status changed to ${newStatus}`,
    })
  }

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId)
      } else {
        newSet.add(sectionId)
      }
      return newSet
    })
  }

  // Filter items based on current filters
  const getFilteredItems = (items: PreCOItem[]) => {
    return items.filter((item) => {
      const matchesStatus = filterStatus === "all" || item.status === filterStatus
      const matchesAssignee = filterAssignee === "all" || item.assignedTo === filterAssignee
      const matchesCategory = filterCategory === "all" || item.category === filterCategory
      const matchesSearch = searchTerm === "" || item.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCompleted = showCompleted || item.status !== "Conforming"

      return matchesStatus && matchesAssignee && matchesCategory && matchesSearch && matchesCompleted
    })
  }

  return (
    <div className={cn("space-y-6 w-full max-w-full", className)}>
      {/* Header with Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Pre-Construction Checklist - {projectName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{overallStats.totalItems}</div>
              <div className="text-xs text-muted-foreground">Total Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{overallStats.conformingItems}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{overallStats.deficientItems}</div>
              <div className="text-xs text-muted-foreground">Deficient</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{overallStats.neutralItems}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{overallStats.completionRate}%</div>
              <div className="text-xs text-muted-foreground">Progress</div>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={overallStats.completionRate} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 h-9"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Conforming">Conforming</SelectItem>
                  <SelectItem value="Deficient">Deficient</SelectItem>
                  <SelectItem value="Neutral">Neutral</SelectItem>
                  <SelectItem value="N/A">N/A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Category</label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category!}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Options</label>
              <Button
                variant={showCompleted ? "default" : "outline"}
                size="sm"
                onClick={() => setShowCompleted(!showCompleted)}
                className="h-9 w-full"
              >
                {showCompleted ? <Eye className="h-4 w-4 mr-1" /> : <EyeOff className="h-4 w-4 mr-1" />}
                {showCompleted ? "Hide Completed" : "Show Completed"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checklist Sections */}
      <div className="space-y-4">
        {sections.map((section) => {
          const filteredItems = getFilteredItems(section.items)
          const sectionProgress = Math.round(
            (section.items.filter((item) => item.status === "Conforming").length / section.items.length) * 100
          )

          return (
            <Card key={section.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-center gap-3">
                    <section.icon className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-base">{section.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{section.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-medium">{sectionProgress}%</div>
                      <Progress value={sectionProgress} className="w-20 h-1" />
                    </div>
                    <Button variant="ghost" size="sm">
                      {expandedSections.has(section.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedSections.has(section.id) && (
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {filteredItems.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">No items match the current filters</div>
                    ) : (
                      filteredItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-medium truncate">{item.title}</h4>
                              {item.isRequired && (
                                <Badge variant="destructive" className="text-xs">
                                  Required
                                </Badge>
                              )}
                              {item.priority && (
                                <Badge variant="outline" className={getPriorityColor(item.priority)}>
                                  {item.priority}
                                </Badge>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-xs text-muted-foreground mb-1">{item.description}</p>
                            )}
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              {item.category && <span>Category: {item.category}</span>}
                              {item.assignedTo && (
                                <span>Assigned: {mockUsers.find((u) => u.id === item.assignedTo)?.name}</span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Select
                              value={item.status}
                              onValueChange={(value: PreCOItemStatus) => handleStatusUpdate(section.id, item.id, value)}
                              disabled={mode === "review"}
                            >
                              <SelectTrigger className="w-32 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Neutral">Neutral</SelectItem>
                                <SelectItem value="Conforming">Conforming</SelectItem>
                                <SelectItem value="Deficient">Deficient</SelectItem>
                                <SelectItem value="N/A">N/A</SelectItem>
                              </SelectContent>
                            </Select>
                            <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
