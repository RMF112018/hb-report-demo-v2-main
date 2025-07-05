"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  MinusCircle,
  ChevronDown,
  ChevronRight,
  FileText,
  Camera,
  MessageSquare,
  User,
  Calendar,
  Download,
  Filter,
  Search,
  Eye,
  EyeOff,
  Settings,
  Bell,
  AlertTriangle,
  CheckSquare,
  ClipboardList,
  FileCheck,
  Building,
  Handshake,
  Archive,
  Edit,
  Trash2,
  Plus,
  Paperclip,
  X,
} from "lucide-react"
import { format } from "date-fns"
import { useProductivityStore } from "@/app/tools/productivity/store/useProductivityStore"

// Types
export type CloseoutItemStatus = "Conforming" | "Deficient" | "Neutral" | "N/A"

export interface CloseoutItem {
  id: string
  title: string
  description?: string
  status: CloseoutItemStatus
  assignedTo?: string
  completedDate?: Date
  comments?: string
  attachments?: string[]
  isRequired?: boolean
  category?: string
}

export interface CloseoutSection {
  id: string
  title: string
  description?: string
  items: CloseoutItem[]
  icon: React.ReactNode
}

interface CloseoutChecklistProps {
  projectId: string
  mode?: "full" | "compact"
  onStatusChange?: (itemId: string, status: CloseoutItemStatus) => void
  onCommentAdd?: (itemId: string, comment: string) => void
  onTaskGenerate?: (itemId: string) => void
  onConstraintCreate?: (itemId: string) => void
  onNotificationSend?: (itemId: string, type: "email" | "teams") => void
  userRole?: "pm" | "superintendent" | "admin" | "viewer"
}

// Mock users for assignment
const mockUsers = [
  { id: "1", name: "John Smith", role: "Project Manager" },
  { id: "2", name: "Sarah Johnson", role: "Superintendent" },
  { id: "3", name: "Mike Davis", role: "Assistant PM" },
  { id: "4", name: "Lisa Chen", role: "Quality Control" },
  { id: "5", name: "Robert Wilson", role: "Safety Manager" },
]

export default function CloseoutChecklist({
  projectId,
  mode = "full",
  onStatusChange,
  onCommentAdd,
  onTaskGenerate,
  onConstraintCreate,
  onNotificationSend,
  userRole = "pm",
}: CloseoutChecklistProps) {
  const [sections, setSections] = useState<CloseoutSection[]>([])
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [filterStatus, setFilterStatus] = useState<CloseoutItemStatus | "all">("all")
  const [filterAssignee, setFilterAssignee] = useState<string>("all")
  const [filterCompleted, setFilterCompleted] = useState<"all" | "completed" | "pending">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showCompactView, setShowCompactView] = useState(mode === "compact")

  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [showAddItem, setShowAddItem] = useState<string | null>(null)
  const [currentUserRole, setCurrentUserRole] = useState<"pm" | "superintendent" | "admin" | "viewer">(userRole)
  const [currentMode, setCurrentMode] = useState<"editable" | "review">(userRole === "viewer" ? "review" : "editable")

  const { addTask } = useProductivityStore()
  const { toast } = useToast()

  // Initialize sections with closeout items
  useEffect(() => {
    const storageKey = `closeout-checklist-${projectId}`
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
            })),
          }))
        )
        return
      } catch (error) {
        console.error("Failed to parse saved closeout data:", error)
      }
    }

    const initialSections: CloseoutSection[] = [
      {
        id: "task-closure",
        title: "Task Closure",
        description: "Complete all outstanding project tasks and documentation",
        icon: <CheckSquare className="h-4 w-4" />,
        items: [
          {
            id: "tc-1",
            title: "Fire Alarm / Elevator phone line installation (by Owner)",
            status: "Neutral",
            isRequired: true,
            category: "Owner Responsibility",
            comments: "",
            attachments: [],
          },
          {
            id: "tc-2",
            title: "All RFIs closed",
            status: "Neutral",
            isRequired: true,
            category: "Documentation",
            comments: "",
            attachments: [],
          },
          {
            id: "tc-3",
            title: "All submittals approved",
            status: "Neutral",
            isRequired: true,
            category: "Documentation",
            comments: "",
            attachments: [],
          },
          {
            id: "tc-4",
            title: "All change orders approved",
            status: "Neutral",
            isRequired: true,
            category: "Documentation",
            comments: "",
            attachments: [],
          },
          {
            id: "tc-5",
            title: "Request all as-builts from subcontractors",
            status: "Neutral",
            isRequired: true,
            category: "Documentation",
            comments: "",
            attachments: [],
          },
        ],
      },
      {
        id: "document-tracking",
        title: "Document Tracking",
        description: "Collect and verify all required project documentation",
        icon: <FileCheck className="h-4 w-4" />,
        items: [
          {
            id: "dt-1",
            title: "Soil investigation / building pad certification (if required)",
            status: "Neutral",
            category: "Site Documentation",
            comments: "",
            attachments: [],
          },
          {
            id: "dt-2",
            title: "Termite/soil poison letter from shell contractor",
            status: "Neutral",
            isRequired: true,
            category: "Site Documentation",
            comments: "",
            attachments: [],
          },
          {
            id: "dt-3",
            title: "Insulation certificate",
            status: "Neutral",
            isRequired: true,
            category: "Building Systems",
            comments: "",
            attachments: [],
          },
          {
            id: "dt-4",
            title: "Form board survey",
            status: "Neutral",
            isRequired: true,
            category: "Surveying",
            comments: "",
            attachments: [],
          },
          {
            id: "dt-5",
            title: "Tie-in survey w/ setbacks + elevation",
            status: "Neutral",
            isRequired: true,
            category: "Surveying",
            comments: "",
            attachments: [],
          },
          {
            id: "dt-6",
            title: "Final survey + elevation certificate",
            status: "Neutral",
            isRequired: true,
            category: "Surveying",
            comments: "",
            attachments: [],
          },
          {
            id: "dt-7",
            title: "Fire-treated lumber letter (if applicable)",
            status: "Neutral",
            category: "Building Systems",
            comments: "",
            attachments: [],
          },
          {
            id: "dt-8",
            title: "Fire alarm monitoring letter (from Owner)",
            status: "Neutral",
            isRequired: true,
            category: "Owner Responsibility",
            comments: "",
            attachments: [],
          },
          {
            id: "dt-9",
            title: "Structural engineer letter on as-builts",
            status: "Neutral",
            isRequired: true,
            category: "Engineering",
            comments: "",
            attachments: [],
          },
          {
            id: "dt-10",
            title: "Certificate of Substantial Completion (Architect)",
            status: "Neutral",
            isRequired: true,
            category: "Professional Services",
            comments: "",
            attachments: [],
          },
          {
            id: "dt-11",
            title: "Engineer cert for sitework (paving/utilities)",
            status: "Neutral",
            isRequired: true,
            category: "Engineering",
            comments: "",
            attachments: [],
          },
          {
            id: "dt-12",
            title: "Threshold inspection reports",
            status: "Neutral",
            isRequired: true,
            category: "Inspections",
            comments: "",
            attachments: [],
          },
          {
            id: "dt-13",
            title: "Final landscape acceptance letter",
            status: "Neutral",
            category: "Site Documentation",
            comments: "",
            attachments: [],
          },
        ],
      },
      {
        id: "inspections",
        title: "Inspections",
        description: "Complete all required inspections and approvals",
        icon: <ClipboardList className="h-4 w-4" />,
        items: [
          {
            id: "ins-1",
            title: "All plan changes submitted/approved",
            status: "Neutral",
            isRequired: true,
            category: "Plan Review",
            comments: "",
            attachments: [],
          },
          {
            id: "ins-2",
            title: "Health Dept approval (water/sewer)",
            status: "Neutral",
            isRequired: true,
            category: "Utilities",
            comments: "",
            attachments: [],
          },
          {
            id: "ins-3",
            title: "Utility company approval (water/sewer)",
            status: "Neutral",
            isRequired: true,
            category: "Utilities",
            comments: "",
            attachments: [],
          },
          {
            id: "ins-4",
            title: "Demo final",
            status: "Neutral",
            category: "Trade Finals",
            comments: "",
            attachments: [],
          },
          {
            id: "ins-5",
            title: "Plumbing final",
            status: "Neutral",
            isRequired: true,
            category: "Trade Finals",
            comments: "",
            attachments: [],
          },
          {
            id: "ins-6",
            title: "HVAC final",
            status: "Neutral",
            isRequired: true,
            category: "Trade Finals",
            comments: "",
            attachments: [],
          },
          {
            id: "ins-7",
            title: "Electrical final",
            status: "Neutral",
            isRequired: true,
            category: "Trade Finals",
            comments: "",
            attachments: [],
          },
          {
            id: "ins-8",
            title: "Fire alarm & fire sprinkler final",
            status: "Neutral",
            isRequired: true,
            category: "Trade Finals",
            comments: "",
            attachments: [],
          },
          {
            id: "ins-9",
            title: "Building final",
            status: "Neutral",
            isRequired: true,
            category: "Final Inspections",
            comments: "",
            attachments: [],
          },
          {
            id: "ins-10",
            title: "Complete pre-C.O. checklist",
            status: "Neutral",
            isRequired: true,
            category: "Final Inspections",
            comments: "",
            attachments: [],
          },
          {
            id: "ins-11",
            title: "Obtain Certificate of Occupancy or Certificate of Completion",
            status: "Neutral",
            isRequired: true,
            category: "Final Inspections",
            comments: "",
            attachments: [],
          },
        ],
      },
      {
        id: "turnover",
        title: "Turnover",
        description: "Complete project turnover and final deliverables",
        icon: <Handshake className="h-4 w-4" />,
        items: [
          {
            id: "to-1",
            title: "Send C.O. to Owner/Rep",
            status: "Neutral",
            isRequired: true,
            category: "Owner Communication",
            comments: "",
            attachments: [],
          },
          {
            id: "to-2",
            title: "Schedule Architect/Owner punch walk",
            status: "Neutral",
            isRequired: true,
            category: "Punch List",
            comments: "",
            attachments: [],
          },
          {
            id: "to-3",
            title: "Complete punch list",
            status: "Neutral",
            isRequired: true,
            category: "Punch List",
            comments: "",
            attachments: [],
          },
          {
            id: "to-4",
            title: "Finalize as-built drawings",
            status: "Neutral",
            isRequired: true,
            category: "Documentation",
            comments: "",
            attachments: [],
          },
          {
            id: "to-5",
            title: "Schedule turnover meeting",
            status: "Neutral",
            isRequired: true,
            category: "Owner Communication",
            comments: "",
            attachments: [],
          },
          {
            id: "to-6",
            title: "Deliver subcontractor list + warranty letters",
            status: "Neutral",
            isRequired: true,
            category: "Documentation",
            comments: "",
            attachments: [],
          },
          {
            id: "to-7",
            title: "Deliver O&M manuals",
            status: "Neutral",
            isRequired: true,
            category: "Documentation",
            comments: "",
            attachments: [],
          },
          {
            id: "to-8",
            title: "Deliver attic stock",
            status: "Neutral",
            category: "Materials",
            comments: "",
            attachments: [],
          },
          {
            id: "to-9",
            title: "Send appreciation letter to Owner",
            status: "Neutral",
            category: "Owner Communication",
            comments: "",
            attachments: [],
          },
          {
            id: "to-10",
            title: "Order plant delivery (symbolic gesture)",
            status: "Neutral",
            category: "Owner Communication",
            comments: "",
            attachments: [],
          },
          {
            id: "to-11",
            title: "Prepare PR announcement",
            status: "Neutral",
            category: "Marketing",
            comments: "",
            attachments: [],
          },
          {
            id: "to-12",
            title: "Final pay forms for all subs",
            status: "Neutral",
            isRequired: true,
            category: "Financial",
            comments: "",
            attachments: [],
          },
          {
            id: "to-13",
            title: "Record date of last contractual work",
            status: "Neutral",
            isRequired: true,
            category: "Financial",
            comments: "",
            attachments: [],
          },
          {
            id: "to-14",
            title: "Track 80-day lien deadline from last work date",
            status: "Neutral",
            isRequired: true,
            category: "Financial",
            comments: "",
            attachments: [],
          },
          {
            id: "to-15",
            title: "Obtain final lien releases from subs",
            status: "Neutral",
            isRequired: true,
            category: "Financial",
            comments: "",
            attachments: [],
          },
        ],
      },
      {
        id: "post-turnover",
        title: "Post-Turnover",
        description: "Follow-up activities after project completion",
        icon: <Archive className="h-4 w-4" />,
        items: [
          {
            id: "pt-1",
            title: "If final payment not received, send intent to lien",
            status: "Neutral",
            category: "Financial",
            comments: "",
            attachments: [],
          },
          {
            id: "pt-2",
            title: "File lien if unpaid by 88 days",
            status: "Neutral",
            category: "Financial",
            comments: "",
            attachments: [],
          },
          {
            id: "pt-3",
            title: "Deliver 6-month post-completion photo archive",
            status: "Neutral",
            category: "Documentation",
            comments: "",
            attachments: [],
          },
          {
            id: "pt-4",
            title: "Request recommendation letter from Owner",
            status: "Neutral",
            category: "Owner Communication",
            comments: "",
            attachments: [],
          },
          {
            id: "pt-5",
            title: "Return all files, permit plans, and permit cards to Estimating",
            status: "Neutral",
            isRequired: true,
            category: "Documentation",
            comments: "",
            attachments: [],
          },
        ],
      },
      {
        id: "px-closeout",
        title: "PX Closeout Docs",
        description: "Complete PX-specific closeout documentation",
        icon: <Building className="h-4 w-4" />,
        items: [
          {
            id: "px-1",
            title: "Completed Closeout Checklist",
            status: "Neutral",
            isRequired: true,
            category: "PX Documentation",
            comments: "",
            attachments: [],
          },
          {
            id: "px-2",
            title: "Project Recap Form",
            status: "Neutral",
            isRequired: true,
            category: "PX Documentation",
            comments: "",
            attachments: [],
          },
          {
            id: "px-3",
            title: "Subcontractor Evaluation Form",
            status: "Neutral",
            isRequired: true,
            category: "PX Documentation",
            comments: "",
            attachments: [],
          },
          {
            id: "px-4",
            title: "Cost Variance Report",
            status: "Neutral",
            isRequired: true,
            category: "PX Documentation",
            comments: "",
            attachments: [],
          },
          {
            id: "px-5",
            title: "Lessons Learned submitted",
            status: "Neutral",
            isRequired: true,
            category: "PX Documentation",
            comments: "",
            attachments: [],
          },
        ],
      },
    ]

    setSections(initialSections)
    setExpandedSections(new Set(initialSections.map((s) => s.id)))
  }, [])

  // Save to localStorage whenever sections change
  useEffect(() => {
    if (sections.length > 0) {
      const storageKey = `closeout-checklist-${projectId}`
      localStorage.setItem(storageKey, JSON.stringify(sections))
    }
  }, [sections, projectId])

  // Status badge component
  const StatusBadge = ({ status }: { status: CloseoutItemStatus }) => {
    const configs = {
      Conforming: { icon: CheckCircle, color: "bg-green-500", text: "text-white" },
      Deficient: { icon: XCircle, color: "bg-red-500", text: "text-white" },
      Neutral: { icon: MinusCircle, color: "bg-gray-500", text: "text-white" },
      "N/A": { icon: AlertCircle, color: "bg-yellow-500", text: "text-white" },
    }

    const config = configs[status]
    const Icon = config.icon

    return (
      <Badge className={`${config.color} ${config.text} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    )
  }

  // Calculate progress
  const calculateProgress = () => {
    const allItems = sections.flatMap((section) => section.items)
    const completedItems = allItems.filter((item) => item.status === "Conforming").length
    return allItems.length > 0 ? (completedItems / allItems.length) * 100 : 0
  }

  const getProgressBySection = (section: CloseoutSection) => {
    const completedItems = section.items.filter((item) => item.status === "Conforming").length
    return section.items.length > 0 ? (completedItems / section.items.length) * 100 : 0
  }

  // Filter items
  const getFilteredItems = (items: CloseoutItem[]) => {
    return items.filter((item) => {
      const matchesStatus = filterStatus === "all" || item.status === filterStatus
      const matchesAssignee = filterAssignee === "all" || item.assignedTo === filterAssignee
      const matchesCompleted =
        filterCompleted === "all" ||
        (filterCompleted === "completed" && item.status === "Conforming") ||
        (filterCompleted === "pending" && item.status !== "Conforming")
      const matchesSearch = searchTerm === "" || item.title.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesStatus && matchesAssignee && matchesCompleted && matchesSearch
    })
  }

  // Handle status change
  const handleStatusChange = (sectionId: string, itemId: string, newStatus: CloseoutItemStatus) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.map((item) => {
              if (item.id === itemId) {
                return {
                  ...item,
                  status: newStatus,
                  completedDate: newStatus === "Conforming" ? new Date() : undefined,
                }
              }
              return item
            }),
          }
        }
        return section
      })
    )

    onStatusChange?.(itemId, newStatus)
  }

  // Handle assignment change
  const handleAssignmentChange = (sectionId: string, itemId: string, userId: string) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.map((item) => {
              if (item.id === itemId) {
                return {
                  ...item,
                  assignedTo: userId,
                }
              }
              return item
            }),
          }
        }
        return section
      })
    )
  }

  // Handle comment add
  const handleCommentAdd = (sectionId: string, itemId: string, comment: string) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.map((item) => {
              if (item.id === itemId) {
                return {
                  ...item,
                  comments: comment,
                }
              }
              return item
            }),
          }
        }
        return section
      })
    )

    onCommentAdd?.(itemId, comment)
  }

  // Handle task generation
  const handleTaskGenerate = (item: CloseoutItem) => {
    const taskData = {
      title: `Closeout: ${item.title}`,
      description: `Complete closeout item: ${item.title}`,
      status: "todo" as const,
      priority: item.isRequired ? ("high" as const) : ("medium" as const),
      createdBy: "current-user",
      assignedTo: item.assignedTo || "current-user",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      linkedTo: {
        type: "closeout-checklist" as const,
        id: item.id,
        label: item.title,
        url: `/project/${projectId}?tab=closeout#${item.id}`,
      },
      comments: [],
    }

    addTask(taskData)
    onTaskGenerate?.(item.id)
  }

  // Mock integrations
  const handleConstraintCreate = (item: CloseoutItem) => {
    // Mock constraint creation
    console.log("Creating constraint for:", item.title)
    onConstraintCreate?.(item.id)
  }

  const handleNotificationSend = (item: CloseoutItem, type: "email" | "teams") => {
    // Mock Microsoft Graph notification
    console.log(`Sending ${type} notification for:`, item.title)
    onNotificationSend?.(item.id, type)
  }

  // Export functions
  const handleExportPDF = () => {
    console.log("Exporting Closeout Checklist to PDF")
    // Mock PDF export
  }

  const handleExportExcel = () => {
    console.log("Exporting Closeout Checklist to Excel")
    // Mock Excel export
  }

  // Edit item title
  const updateItemTitle = (sectionId: string, itemId: string, newTitle: string) => {
    if (!newTitle.trim()) return

    setSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.map((item) => {
              if (item.id === itemId) {
                return {
                  ...item,
                  title: newTitle.trim(),
                }
              }
              return item
            }),
          }
        }
        return section
      })
    )

    setEditingItem(null)
  }

  // Add new item
  const addNewItem = (sectionId: string, title: string) => {
    if (!title.trim()) return

    const newItem: CloseoutItem = {
      id: `${sectionId}-${Date.now()}`,
      title: title.trim(),
      status: "Neutral",
      isRequired: false,
      category: "Custom",
    }

    setSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: [...section.items, newItem],
          }
        }
        return section
      })
    )

    setShowAddItem(null)
  }

  // Remove item
  const removeItem = (sectionId: string, itemId: string) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.filter((item) => item.id !== itemId),
          }
        }
        return section
      })
    )
  }

  // Add attachment
  const addAttachment = (sectionId: string, itemId: string, fileName: string) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.map((item) => {
              if (item.id === itemId) {
                return {
                  ...item,
                  attachments: [...(item.attachments || []), fileName],
                }
              }
              return item
            }),
          }
        }
        return section
      })
    )
  }

  // Remove attachment
  const removeAttachment = (sectionId: string, itemId: string, fileName: string) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.map((item) => {
              if (item.id === itemId) {
                return {
                  ...item,
                  attachments: (item.attachments || []).filter((att) => att !== fileName),
                }
              }
              return item
            }),
          }
        }
        return section
      })
    )
  }

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

  const toggleItem = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  const toggleMode = () => {
    const newMode = currentMode === "editable" ? "review" : "editable"
    setCurrentMode(newMode)
    toast({
      title: `Switched to ${newMode} mode`,
      description: `You are now in ${newMode} mode`,
    })
  }

  const isReadOnly = currentMode === "review"

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Archive className="h-5 w-5 text-blue-600" />
                Closeout & Pre-CO Checklist
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Track and manage all closeout requirements and deliverables
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                {Math.round(calculateProgress())}% Complete
              </Badge>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={currentMode === "review" ? "bg-orange-100 text-orange-800" : "bg-green-100 text-green-800"}
                >
                  {currentMode === "review" ? "Review Mode" : "Edit Mode"}
                </Badge>
                <Button variant="outline" size="sm" onClick={toggleMode}>
                  {currentMode === "review" ? "Switch to Edit" : "Switch to Review"}
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Mode description */}
      <div className="text-sm text-muted-foreground">
        {currentMode === "review"
          ? "Viewing items in read-only mode. Switch to Edit Mode to make changes."
          : "Edit mode active. Click items to expand and modify details."}
      </div>

      {/* Export buttons */}
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={handleExportPDF}>
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
        <Button variant="outline" onClick={handleExportExcel}>
          <Download className="h-4 w-4 mr-2" />
          Export Excel
        </Button>
        <Button variant="outline" onClick={() => setShowCompactView(!showCompactView)}>
          {showCompactView ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
          {showCompactView ? "Full View" : "Compact"}
        </Button>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">{Math.round(calculateProgress())}% Complete</span>
            </div>
            <Progress value={calculateProgress()} className="h-2" />

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {sections.map((section) => (
                <div key={section.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    {section.icon}
                    <span className="text-sm font-medium">{section.title}</span>
                  </div>
                  <Progress value={getProgressBySection(section)} className="h-1" />
                  <span className="text-xs text-muted-foreground">
                    {Math.round(getProgressBySection(section))}% Complete
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={filterStatus}
                onValueChange={(value) => setFilterStatus(value as CloseoutItemStatus | "all")}
              >
                <SelectTrigger>
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
            <div className="space-y-2">
              <Label>Assignee</Label>
              <Select value={filterAssignee} onValueChange={setFilterAssignee}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assignees</SelectItem>
                  {mockUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Completion</Label>
              <Select
                value={filterCompleted}
                onValueChange={(value) => setFilterCompleted(value as "all" | "completed" | "pending")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checklist Sections */}
      <div className="space-y-4">
        {sections.map((section) => {
          const filteredItems = getFilteredItems(section.items)
          if (filteredItems.length === 0) return null

          return (
            <Card key={section.id}>
              <Collapsible open={expandedSections.has(section.id)} onOpenChange={() => toggleSection(section.id)}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="hover:bg-muted/50 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {section.icon}
                        <div>
                          <CardTitle className="text-lg">{section.title}</CardTitle>
                          <CardDescription>{section.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">
                          {filteredItems.filter((item) => item.status === "Conforming").length}/{filteredItems.length}{" "}
                          Complete
                        </Badge>
                        <Progress value={getProgressBySection(section)} className="w-24 h-2" />
                        {expandedSections.has(section.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <div className="space-y-3">
                      {filteredItems.map((item) => {
                        const isExpanded = expandedItems.has(item.id)
                        const isEditing = editingItem === item.id

                        return (
                          <div key={item.id} className="border rounded-lg">
                            {/* Collapsed view - clickable item header */}
                            <div
                              className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50"
                              onClick={() => toggleItem(item.id)}
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{item.title}</span>
                                    {item.isRequired && (
                                      <Badge variant="destructive" className="text-xs">
                                        Required
                                      </Badge>
                                    )}
                                    {item.category && (
                                      <Badge variant="outline" className="text-xs">
                                        {item.category}
                                      </Badge>
                                    )}
                                  </div>
                                  {!isExpanded && (
                                    <>
                                      {item.description && (
                                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                                      )}
                                      {item.comments && (
                                        <p className="text-sm text-blue-600 mt-1">💬 {item.comments}</p>
                                      )}
                                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                        {item.assignedTo && (
                                          <span className="flex items-center gap-1">
                                            <User className="h-3 w-3" />
                                            {mockUsers.find((u) => u.id === item.assignedTo)?.name}
                                          </span>
                                        )}
                                        {item.completedDate && (
                                          <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {format(item.completedDate, "MMM dd, yyyy")}
                                          </span>
                                        )}
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <StatusBadge status={item.status} />
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </div>
                            </div>

                            {/* Expanded view - interactive form */}
                            {isExpanded && (
                              <div className="border-t p-4 space-y-4 bg-muted/30">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium">Item Details</h4>
                                  <div className="flex items-center gap-2">
                                    {!isReadOnly && (
                                      <>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            setEditingItem(isEditing ? null : item.id)
                                          }}
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            const section = sections.find((s) => s.items.some((i) => i.id === item.id))
                                            if (section) {
                                              removeItem(section.id, item.id)
                                            }
                                          }}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </div>

                                {/* Item title editing */}
                                {isEditing ? (
                                  <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input
                                      value={item.title}
                                      onChange={(e) => {
                                        const section = sections.find((s) => s.items.some((i) => i.id === item.id))
                                        if (section) {
                                          updateItemTitle(section.id, item.id, e.target.value)
                                        }
                                      }}
                                      onBlur={() => setEditingItem(null)}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          setEditingItem(null)
                                        }
                                      }}
                                      autoFocus
                                    />
                                  </div>
                                ) : (
                                  <div>
                                    <h4 className="font-medium">{item.title}</h4>
                                    {item.description && (
                                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                                    )}
                                  </div>
                                )}

                                {/* Status and Assignment */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select
                                      value={item.status}
                                      onValueChange={(value) => {
                                        const section = sections.find((s) => s.items.some((i) => i.id === item.id))
                                        if (section) {
                                          handleStatusChange(section.id, item.id, value as CloseoutItemStatus)
                                        }
                                      }}
                                      disabled={isReadOnly}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Conforming">Conforming</SelectItem>
                                        <SelectItem value="Deficient">Deficient</SelectItem>
                                        <SelectItem value="Neutral">Neutral</SelectItem>
                                        <SelectItem value="N/A">N/A</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="space-y-2">
                                    <Label>Assign To</Label>
                                    <Select
                                      value={item.assignedTo || ""}
                                      onValueChange={(value) => {
                                        const section = sections.find((s) => s.items.some((i) => i.id === item.id))
                                        if (section) {
                                          handleAssignmentChange(section.id, item.id, value)
                                        }
                                      }}
                                      disabled={isReadOnly}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select assignee" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {mockUsers.map((user) => (
                                          <SelectItem key={user.id} value={user.id}>
                                            {user.name} ({user.role})
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>

                                {/* Comments */}
                                <div className="space-y-2">
                                  <Label>Comments</Label>
                                  <Textarea
                                    value={item.comments || ""}
                                    onChange={(e) => {
                                      const section = sections.find((s) => s.items.some((i) => i.id === item.id))
                                      if (section) {
                                        handleCommentAdd(section.id, item.id, e.target.value)
                                      }
                                    }}
                                    placeholder="Add comments or notes..."
                                    disabled={isReadOnly}
                                  />
                                </div>

                                {/* Attachments */}
                                <div className="space-y-2">
                                  <Label>Attachments</Label>
                                  <div className="flex flex-wrap gap-2">
                                    {item.attachments?.map((fileName) => (
                                      <div
                                        key={fileName}
                                        className="flex items-center gap-2 bg-muted/50 px-2 py-1 rounded"
                                      >
                                        <Paperclip className="h-3 w-3" />
                                        <span className="text-sm">{fileName}</span>
                                        {!isReadOnly && (
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              const section = sections.find((s) =>
                                                s.items.some((i) => i.id === item.id)
                                              )
                                              if (section) {
                                                removeAttachment(section.id, item.id, fileName)
                                              }
                                            }}
                                          >
                                            <X className="h-3 w-3" />
                                          </Button>
                                        )}
                                      </div>
                                    ))}
                                    {!isReadOnly && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          const fileName = prompt("Enter attachment name:")
                                          if (fileName) {
                                            const section = sections.find((s) => s.items.some((i) => i.id === item.id))
                                            if (section) {
                                              addAttachment(section.id, item.id, fileName)
                                            }
                                          }
                                        }}
                                      >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Attachment
                                      </Button>
                                    )}
                                  </div>
                                </div>

                                {/* Action buttons */}
                                {!isReadOnly && (
                                  <div className="flex flex-wrap gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleTaskGenerate(item)
                                      }}
                                    >
                                      <FileText className="h-4 w-4 mr-2" />
                                      Generate Task
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleConstraintCreate(item)
                                      }}
                                    >
                                      <AlertTriangle className="h-4 w-4 mr-2" />
                                      Create Constraint
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleNotificationSend(item, "email")
                                      }}
                                    >
                                      <Bell className="h-4 w-4 mr-2" />
                                      Send Email
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleNotificationSend(item, "teams")
                                      }}
                                    >
                                      <MessageSquare className="h-4 w-4 mr-2" />
                                      Teams Message
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}

                      {/* Add new item */}
                      {!isReadOnly && showAddItem === section.id && (
                        <div className="border rounded-lg p-4">
                          <div className="space-y-2">
                            <Label>New Item Title</Label>
                            <Input
                              placeholder="Enter item title..."
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  const title = e.currentTarget.value.trim()
                                  if (title) {
                                    addNewItem(section.id, title)
                                    e.currentTarget.value = ""
                                    setShowAddItem(null)
                                  }
                                } else if (e.key === "Escape") {
                                  setShowAddItem(null)
                                }
                              }}
                              autoFocus
                            />
                          </div>
                        </div>
                      )}

                      {!isReadOnly && showAddItem !== section.id && (
                        <Button variant="outline" onClick={() => setShowAddItem(section.id)} className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Add New Item
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
