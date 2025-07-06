"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useProductivityStore } from "@/app/tools/productivity/store/useProductivityStore"
import type { LinkedEntity } from "@/types/productivity"
import {
  ChevronRight,
  ChevronDown,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  User,
  Calendar,
  MessageSquare,
  CheckSquare,
  AlertCircle,
  Link,
  Mail,
  Send,
  Download,
  Upload,
  Plus,
  Settings,
  Eye,
  EyeOff,
  History,
  Filter,
  RefreshCw,
  ExternalLink,
  Building,
  Paperclip,
  X,
  DollarSign,
  Percent,
  FileIcon,
  LinkIcon,
} from "lucide-react"
import { format } from "date-fns"

// Types
interface ChecklistItem {
  id: string
  title: string
  description?: string
  status: "Conforming" | "Deficient" | "Neutral" | "N/A"
  comments: string
  attachments: string[]
  completionDate?: Date
  assignedTo?: string
  dueDate?: Date
  lastModified: Date
  modifiedBy: string
  priority: "Low" | "Medium" | "High"
  tags: string[]
  isContractItem?: boolean
  contractData?: ContractItemData
}

interface ContractItemData {
  fields: ContractField[]
  contractLinks: ContractLink[]
  isComplete: boolean
}

interface ContractField {
  id: string
  label: string
  type: "currency" | "percentage" | "text" | "number" | "date" | "boolean"
  value: string | number | boolean
  required: boolean
  placeholder?: string
}

interface ContractLink {
  id: string
  articleNumber: string
  articleTitle: string
  pageNumber: number
  highlightedText: string
  url: string
}

interface ChecklistSection {
  id: string
  title: string
  description: string
  items: ChecklistItem[]
  isExpanded: boolean
  completionRate: number
}

interface StartUpChecklistProps {
  projectId: string
  projectName: string
  mode?: "editable" | "review"
  onStatusChange?: (sectionId: string, itemId: string, status: ChecklistItem["status"]) => void
  className?: string
}

// Mock users for assignment
const mockUsers = [
  { id: "u1", name: "John Smith", email: "john@company.com", role: "Project Manager" },
  { id: "u2", name: "Sarah Johnson", email: "sarah@company.com", role: "Superintendent" },
  { id: "u3", name: "Mike Davis", email: "mike@company.com", role: "Field Engineer" },
  { id: "u4", name: "Lisa Chen", email: "lisa@company.com", role: "Safety Manager" },
  { id: "u5", name: "Robert Wilson", email: "robert@company.com", role: "Quality Manager" },
]

// Initial checklist structure
const initialSections: ChecklistSection[] = [
  {
    id: "section-1",
    title: "Review Owner's Contract",
    description: "Review and understand key contract terms and requirements",
    isExpanded: true,
    completionRate: 0,
    items: [
      {
        id: "1.1",
        title: "Split savings clause & contingency usage parameters",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["contract", "financial"],
        isContractItem: true,
        contractData: {
          fields: [
            {
              id: "split-savings-percentage",
              label: "Split Savings Percentage",
              type: "percentage",
              value: "",
              required: true,
              placeholder: "e.g., 50",
            },
            {
              id: "contingency-amount",
              label: "Contingency Amount",
              type: "currency",
              value: "",
              required: true,
              placeholder: "e.g., $100,000",
            },
            {
              id: "contingency-percentage",
              label: "Contingency Percentage",
              type: "percentage",
              value: "",
              required: true,
              placeholder: "e.g., 5",
            },
            {
              id: "usage-trigger",
              label: "Usage Trigger Conditions",
              type: "text",
              value: "",
              required: true,
              placeholder: "Describe conditions for contingency usage",
            },
          ],
          contractLinks: [],
          isComplete: false,
        },
      },
      {
        id: "1.2",
        title: "Liquidated damages",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["contract", "legal"],
        isContractItem: true,
        contractData: {
          fields: [
            {
              id: "daily-amount",
              label: "Daily Liquidated Damages Amount",
              type: "currency",
              value: "",
              required: true,
              placeholder: "e.g., $1,000",
            },
            {
              id: "maximum-amount",
              label: "Maximum Total Amount",
              type: "currency",
              value: "",
              required: false,
              placeholder: "e.g., $50,000",
            },
            {
              id: "start-date",
              label: "Damages Start Date",
              type: "date",
              value: "",
              required: true,
              placeholder: "Contract completion date",
            },
            {
              id: "calculation-method",
              label: "Calculation Method",
              type: "text",
              value: "",
              required: true,
              placeholder: "Describe how damages are calculated",
            },
          ],
          contractLinks: [],
          isComplete: false,
        },
      },
      {
        id: "1.3",
        title: "Special contract terms",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "Medium",
        tags: ["contract", "legal"],
        isContractItem: true,
        contractData: {
          fields: [
            {
              id: "term-1-title",
              label: "Term 1 - Title",
              type: "text",
              value: "",
              required: false,
              placeholder: "e.g., Payment Terms",
            },
            {
              id: "term-1-description",
              label: "Term 1 - Description",
              type: "text",
              value: "",
              required: false,
              placeholder: "Describe the special term",
            },
            {
              id: "term-1-value",
              label: "Term 1 - Value/Amount",
              type: "text",
              value: "",
              required: false,
              placeholder: "Associated value if applicable",
            },
          ],
          contractLinks: [],
          isComplete: false,
        },
      },
      {
        id: "1.4",
        title: "Allowances to track / change events",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "Medium",
        tags: ["contract", "tracking"],
      },
    ],
  },
  {
    id: "section-2",
    title: "Job Start-Up",
    description: "Complete all essential startup tasks and documentation",
    isExpanded: true,
    completionRate: 0,
    items: [
      {
        id: "2.1",
        title: "Review Bonding / SDI requirements",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["bonding", "insurance"],
        isContractItem: true,
        contractData: {
          fields: [
            {
              id: "performance-bond-amount",
              label: "Performance Bond Amount",
              type: "currency",
              value: "",
              required: true,
              placeholder: "e.g., $1,000,000",
            },
            {
              id: "performance-bond-percentage",
              label: "Performance Bond Percentage",
              type: "percentage",
              value: "",
              required: true,
              placeholder: "e.g., 100",
            },
            {
              id: "payment-bond-amount",
              label: "Payment Bond Amount",
              type: "currency",
              value: "",
              required: true,
              placeholder: "e.g., $1,000,000",
            },
            {
              id: "maintenance-bond-required",
              label: "Maintenance Bond Required",
              type: "boolean",
              value: false,
              required: true,
              placeholder: "",
            },
            {
              id: "maintenance-bond-duration",
              label: "Maintenance Bond Duration (Years)",
              type: "number",
              value: "",
              required: false,
              placeholder: "e.g., 2",
            },
          ],
          contractLinks: [],
          isComplete: false,
        },
      },
      {
        id: "2.2",
        title: "Complete bond applications and submit to CFO",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["bonding", "finance"],
      },
      {
        id: "2.3",
        title: "Verify project setup in Accounting",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["accounting", "setup"],
      },
      {
        id: "2.4",
        title: "Verify project setup in Procore",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["procore", "setup"],
      },
      {
        id: "2.5",
        title: "Estimating turnover meeting",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["meeting", "estimating"],
      },
      {
        id: "2.6",
        title: "Budget rolled from Sage Estimating to Accounting",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["budget", "sage"],
      },
      {
        id: "2.7",
        title: "Budget rolled from Sage Accounting to Procore",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["budget", "procore"],
      },
      {
        id: "2.8",
        title: "Order project signage",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "Medium",
        tags: ["signage", "procurement"],
      },
      {
        id: "2.9",
        title: "Upload drawings/specs to Procore",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["drawings", "procore"],
      },
      {
        id: "2.10",
        title: "Owner contract w/ schedule of values / pay app",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["contract", "payment"],
      },
      {
        id: "2.11",
        title: "Subcontractor COIs collected pre-mobilization",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["insurance", "subcontractor"],
      },
      {
        id: "2.12",
        title: "Owner Certificate of Insurance",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["insurance", "owner"],
      },
      {
        id: "2.13",
        title: "Complete and record Notice of Commencement",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["legal", "notice"],
      },
      {
        id: "2.14",
        title: "Setup job files",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "Medium",
        tags: ["documentation", "setup"],
      },
      {
        id: "2.15",
        title: "Create Management & Logistics Plan",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["planning", "logistics"],
      },
      {
        id: "2.16",
        title: "Prepare full project schedule",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["schedule", "planning"],
      },
      {
        id: "2.17",
        title: "Submittal register completed",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["submittals", "register"],
      },
      {
        id: "2.18",
        title: "Populate job close-out tracker",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "Medium",
        tags: ["closeout", "tracking"],
      },
      {
        id: "2.19",
        title: "Preconstruction meeting with AHJ",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["meeting", "ahj"],
      },
      {
        id: "2.20",
        title: "Preconstruction meeting with Owner",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["meeting", "owner"],
      },
      {
        id: "2.21",
        title: "Threshold/testing companies under contract",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["testing", "contract"],
      },
      {
        id: "2.22",
        title: "Photo/video surveys for adjacent properties",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "Medium",
        tags: ["survey", "documentation"],
      },
      {
        id: "2.23",
        title: "Vibration monitoring needs",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "Medium",
        tags: ["monitoring", "vibration"],
      },
      {
        id: "2.24",
        title: "Subcontracts written & lead items awarded",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["subcontract", "procurement"],
      },
      {
        id: "2.25",
        title: "Scope/proposal/estimate reviews completed",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["review", "estimate"],
      },
      {
        id: "2.26",
        title: "Buyout log created",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["buyout", "tracking"],
      },
      {
        id: "2.27",
        title: "Public relations announcement prepared",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "Low",
        tags: ["pr", "announcement"],
      },
      {
        id: "2.28",
        title: "NTO created and calendar reminder set",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["nto", "calendar"],
      },
      {
        id: "2.29",
        title: "NTO mailed (certified)",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["nto", "mailing"],
      },
      {
        id: "2.30",
        title: "Verify Builder's Risk insurance",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["insurance", "risk"],
      },
      {
        id: "2.31",
        title: "Safety Plan and SDS provided to Superintendent",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["safety", "sds"],
      },
      {
        id: "2.32",
        title: "Notify local utilities",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["utilities", "notification"],
      },
      {
        id: "2.33",
        title: "Community awareness (if warranted)",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "Low",
        tags: ["community", "awareness"],
      },
    ],
  },
  {
    id: "section-3",
    title: "Order Services / Equipment",
    description: "Secure necessary services and equipment for project startup",
    isExpanded: true,
    completionRate: 0,
    items: [
      {
        id: "3.1",
        title: "Phone / internet (via IT)",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["it", "communication"],
      },
      {
        id: "3.2",
        title: "Sanitary services",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["sanitary", "services"],
      },
      {
        id: "3.3",
        title: "Field office trailer ordered",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["trailer", "office"],
      },
      {
        id: "3.4",
        title: "Job trailer (permits in place)",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["trailer", "permits"],
      },
      {
        id: "3.5",
        title: "First aid and fire extinguishers",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["safety", "equipment"],
      },
      {
        id: "3.6",
        title: "Other equipment/services (specify)",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "Medium",
        tags: ["equipment", "services"],
      },
    ],
  },
  {
    id: "section-4",
    title: "Permits",
    description: "Obtain all required permits and approvals",
    isExpanded: true,
    completionRate: 0,
    items: [
      {
        id: "4.1",
        title: "Master Permit",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["permit", "master"],
      },
      {
        id: "4.2",
        title: "Roofing Permit",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["permit", "roofing"],
      },
      {
        id: "4.3",
        title: "Plumbing Permit",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["permit", "plumbing"],
      },
      {
        id: "4.4",
        title: "HVAC Permit",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["permit", "hvac"],
      },
      {
        id: "4.5",
        title: "Electric Permit",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["permit", "electric"],
      },
      {
        id: "4.6",
        title: "Fire Alarm Permit",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["permit", "fire-alarm"],
      },
      {
        id: "4.7",
        title: "Fire Sprinkler Permit",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["permit", "sprinkler"],
      },
      {
        id: "4.8",
        title: "Elevator Permit",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "Medium",
        tags: ["permit", "elevator"],
      },
      {
        id: "4.9",
        title: "Irrigation Permit",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "Medium",
        tags: ["permit", "irrigation"],
      },
      {
        id: "4.10",
        title: "Low Voltage Permit",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "Medium",
        tags: ["permit", "low-voltage"],
      },
      {
        id: "4.11",
        title: "Site Utilities Permits (Water/Sewer/Drainage)",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["permit", "utilities"],
      },
      {
        id: "4.12",
        title: "ROW / MOT / FDOT Permits",
        status: "Neutral",
        comments: "",
        attachments: [],
        lastModified: new Date(),
        modifiedBy: "current-user",
        priority: "High",
        tags: ["permit", "row", "mot"],
      },
    ],
  },
]

export const StartUpChecklist: React.FC<StartUpChecklistProps> = ({
  projectId,
  projectName,
  mode = "editable",
  onStatusChange,
  className = "",
}) => {
  const [sections, setSections] = useState<ChecklistSection[]>([])
  const [selectedItem, setSelectedItem] = useState<ChecklistItem | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterAssignee, setFilterAssignee] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"full" | "compact">("full")
  const [showCompleted, setShowCompleted] = useState(true)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [showAddItem, setShowAddItem] = useState<string | null>(null)
  const [currentMode, setCurrentMode] = useState<"editable" | "review">(mode)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const { toast } = useToast()
  const { addTask } = useProductivityStore()

  // Initialize from localStorage or use default data
  useEffect(() => {
    const storageKey = `startup-checklist-${projectId}`
    const savedData = localStorage.getItem(storageKey)

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setSections(
          parsed.map((section: any) => ({
            ...section,
            items: section.items.map((item: any) => ({
              ...item,
              lastModified: new Date(item.lastModified),
              completionDate: item.completionDate ? new Date(item.completionDate) : undefined,
              dueDate: item.dueDate ? new Date(item.dueDate) : undefined,
            })),
          }))
        )
      } catch (error) {
        console.error("Failed to parse saved checklist data:", error)
        setSections(initialSections)
      }
    } else {
      setSections(initialSections)
    }
  }, [projectId])

  // Save to localStorage whenever sections change
  useEffect(() => {
    if (sections.length > 0) {
      const storageKey = `startup-checklist-${projectId}`
      localStorage.setItem(storageKey, JSON.stringify(sections))
    }
  }, [sections, projectId])

  // Calculate overall completion statistics
  const overallStats = React.useMemo(() => {
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
      completionRate: Math.round((conformingItems / totalItems) * 100),
    }
  }, [sections])

  // Update section completion rates
  useEffect(() => {
    setSections((prev) =>
      prev.map((section) => ({
        ...section,
        completionRate: Math.round(
          (section.items.filter((item) => item.status === "Conforming").length / section.items.length) * 100
        ),
      }))
    )
  }, [])

  // Status color mapping
  const getStatusColor = (status: ChecklistItem["status"]) => {
    switch (status) {
      case "Conforming":
        return "bg-green-100 text-green-800 border-green-200"
      case "Deficient":
        return "bg-red-100 text-red-800 border-red-200"
      case "Neutral":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "N/A":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Priority color mapping
  const getPriorityColor = (priority: ChecklistItem["priority"]) => {
    switch (priority) {
      case "High":
        return "text-red-600"
      case "Medium":
        return "text-orange-600"
      case "Low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  // Handle status update
  const handleStatusUpdate = (sectionId: string, itemId: string, newStatus: ChecklistItem["status"]) => {
    if (currentMode === "review") return

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
                      completionDate: newStatus === "Conforming" ? new Date() : undefined,
                      lastModified: new Date(),
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

  // Handle comment update
  const handleCommentUpdate = (sectionId: string, itemId: string, comments: string) => {
    if (currentMode === "review") return

    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map((item) =>
                item.id === itemId
                  ? {
                      ...item,
                      comments,
                      lastModified: new Date(),
                    }
                  : item
              ),
            }
          : section
      )
    )
  }

  // Handle assignment
  const handleAssignment = (sectionId: string, itemId: string, assignedTo: string) => {
    if (currentMode === "review") return

    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map((item) =>
                item.id === itemId
                  ? {
                      ...item,
                      assignedTo,
                      lastModified: new Date(),
                    }
                  : item
              ),
            }
          : section
      )
    )

    const assignedUser = mockUsers.find((u) => u.id === assignedTo)
    toast({
      title: "Assignment Updated",
      description: `Item assigned to ${assignedUser?.name || assignedTo}`,
    })
  }

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setSections((prev) =>
      prev.map((section) => (section.id === sectionId ? { ...section, isExpanded: !section.isExpanded } : section))
    )
  }

  // Toggle item expansion
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

  // Generate task from checklist item
  const generateTask = (sectionId: string, itemId: string) => {
    const section = sections.find((s) => s.id === sectionId)
    const item = section?.items.find((i) => i.id === itemId)

    if (!item) return

    const taskData = {
      title: item.title,
      description: `Start-up checklist item from ${section?.title}\n\n${item.description || ""}`,
      status: "todo" as const,
      priority: item.priority.toLowerCase() as "low" | "medium" | "high",
      createdBy: "current-user",
      assignedTo: item.assignedTo || "current-user",
      dueDate: item.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      linkedTo: {
        type: "startup-checklist" as const,
        id: `${projectId}-${sectionId}-${itemId}`,
        label: `${projectName} - ${item.title}`,
      },
      comments: [],
    }

    addTask(taskData)

    toast({
      title: "Task Created",
      description: `Task created: ${item.title}`,
    })
  }

  // Send notification (mock Microsoft Graph integration)
  const sendNotification = (sectionId: string, itemId: string, type: "email" | "teams") => {
    const section = sections.find((s) => s.id === sectionId)
    const item = section?.items.find((i) => i.id === itemId)

    if (!item) return

    // Mock Microsoft Graph API call
    console.log(`Sending ${type} notification for item: ${item.title}`)

    toast({
      title: "Notification Sent",
      description: `${type === "email" ? "Email" : "Teams message"} sent regarding: ${item.title}`,
    })
  }

  // Create constraint from checklist item
  const createConstraint = (sectionId: string, itemId: string) => {
    const section = sections.find((s) => s.id === sectionId)
    const item = section?.items.find((i) => i.id === itemId)

    if (!item) return

    // Mock constraint creation
    console.log(`Creating constraint for item: ${item.title}`)

    toast({
      title: "Constraint Created",
      description: `Constraint logged for: ${item.title}`,
    })
  }

  // Export checklist
  const exportChecklist = (format: "pdf" | "excel") => {
    // Mock export functionality
    console.log(`Exporting checklist as ${format}`)

    toast({
      title: "Export Started",
      description: `Checklist export to ${format.toUpperCase()} initiated`,
    })
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
                  lastModified: new Date(),
                  modifiedBy: "current-user",
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
    toast({
      title: "Item Updated",
      description: "Item title has been updated successfully",
    })
  }

  // Add new item
  const addNewItem = (sectionId: string, title: string) => {
    if (!title.trim()) return

    const newItem: ChecklistItem = {
      id: `${sectionId}-${Date.now()}`,
      title: title.trim(),
      status: "Neutral",
      comments: "",
      attachments: [],
      lastModified: new Date(),
      modifiedBy: "current-user",
      priority: "Medium",
      tags: [],
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
    toast({
      title: "Item Added",
      description: "New checklist item has been added successfully",
    })
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

    toast({
      title: "Item Removed",
      description: "Checklist item has been removed successfully",
    })
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
                  attachments: [...item.attachments, fileName],
                  lastModified: new Date(),
                  modifiedBy: "current-user",
                }
              }
              return item
            }),
          }
        }
        return section
      })
    )

    toast({
      title: "Attachment Added",
      description: `File "${fileName}" has been attached successfully`,
    })
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
                  attachments: item.attachments.filter((att) => att !== fileName),
                  lastModified: new Date(),
                  modifiedBy: "current-user",
                }
              }
              return item
            }),
          }
        }
        return section
      })
    )

    toast({
      title: "Attachment Removed",
      description: `File "${fileName}" has been removed successfully`,
    })
  }

  // Contract item functions
  const updateContractField = (
    sectionId: string,
    itemId: string,
    fieldId: string,
    value: string | number | boolean
  ) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.map((item) => {
              if (item.id === itemId && item.contractData) {
                const updatedFields = item.contractData.fields.map((field) =>
                  field.id === fieldId ? { ...field, value } : field
                )
                const isComplete = calculateContractItemCompletion(updatedFields)
                return {
                  ...item,
                  contractData: {
                    ...item.contractData,
                    fields: updatedFields,
                    isComplete,
                  },
                  status: isComplete ? "Conforming" : "Neutral",
                  lastModified: new Date(),
                  modifiedBy: "current-user",
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

  const addContractLink = (sectionId: string, itemId: string, link: Omit<ContractLink, "id">) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.map((item) => {
              if (item.id === itemId && item.contractData) {
                const newLink: ContractLink = {
                  ...link,
                  id: `link-${Date.now()}`,
                }
                return {
                  ...item,
                  contractData: {
                    ...item.contractData,
                    contractLinks: [...item.contractData.contractLinks, newLink],
                  },
                  lastModified: new Date(),
                  modifiedBy: "current-user",
                }
              }
              return item
            }),
          }
        }
        return section
      })
    )

    toast({
      title: "Contract Link Added",
      description: `Link to ${link.articleTitle} has been added`,
    })
  }

  const removeContractLink = (sectionId: string, itemId: string, linkId: string) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.map((item) => {
              if (item.id === itemId && item.contractData) {
                return {
                  ...item,
                  contractData: {
                    ...item.contractData,
                    contractLinks: item.contractData.contractLinks.filter((link) => link.id !== linkId),
                  },
                  lastModified: new Date(),
                  modifiedBy: "current-user",
                }
              }
              return item
            }),
          }
        }
        return section
      })
    )

    toast({
      title: "Contract Link Removed",
      description: "Contract link has been removed",
    })
  }

  const calculateContractItemCompletion = (fields: ContractField[]): boolean => {
    const requiredFields = fields.filter((field) => field.required)
    return requiredFields.every((field) => {
      if (field.type === "boolean") {
        return field.value !== undefined
      }
      return field.value !== "" && field.value !== undefined && field.value !== null
    })
  }

  const addFieldGroup = (sectionId: string, itemId: string, groupNumber: number) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.map((item) => {
              if (item.id === itemId && item.contractData) {
                const newFields: ContractField[] = [
                  {
                    id: `term-${groupNumber}-title`,
                    label: `Term ${groupNumber} - Title`,
                    type: "text",
                    value: "",
                    required: false,
                    placeholder: "e.g., Payment Terms",
                  },
                  {
                    id: `term-${groupNumber}-description`,
                    label: `Term ${groupNumber} - Description`,
                    type: "text",
                    value: "",
                    required: false,
                    placeholder: "Describe the special term",
                  },
                  {
                    id: `term-${groupNumber}-value`,
                    label: `Term ${groupNumber} - Value/Amount`,
                    type: "text",
                    value: "",
                    required: false,
                    placeholder: "Associated value if applicable",
                  },
                ]
                return {
                  ...item,
                  contractData: {
                    ...item.contractData,
                    fields: [...item.contractData.fields, ...newFields],
                  },
                  lastModified: new Date(),
                  modifiedBy: "current-user",
                }
              }
              return item
            }),
          }
        }
        return section
      })
    )

    toast({
      title: "Field Group Added",
      description: `Term ${groupNumber} fields have been added`,
    })
  }

  // Filter items based on current filters
  const getFilteredItems = (items: ChecklistItem[]) => {
    let filtered = items

    if (filterStatus !== "all") {
      filtered = filtered.filter((item) => item.status === filterStatus)
    }

    if (filterAssignee !== "all") {
      filtered = filtered.filter((item) => item.assignedTo === filterAssignee)
    }

    if (!showCompleted) {
      filtered = filtered.filter((item) => item.status !== "Conforming")
    }

    return filtered
  }

  // Contract field components
  const renderContractField = (field: ContractField, sectionId: string, itemId: string) => {
    const handleFieldChange = (value: string | number | boolean) => {
      updateContractField(sectionId, itemId, field.id, value)
    }

    switch (field.type) {
      case "currency":
        return (
          <div key={field.id} className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              type="text"
              value={field.value as string}
              onChange={(e) => {
                // Format as currency
                const value = e.target.value.replace(/[^0-9.,]/g, "")
                handleFieldChange(value)
              }}
              placeholder={field.placeholder}
              className="w-full"
              disabled={currentMode === "review"}
            />
          </div>
        )

      case "percentage":
        return (
          <div key={field.id} className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1">
              <Percent className="h-3 w-3" />
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              type="number"
              min="0"
              max="100"
              value={field.value as string}
              onChange={(e) => handleFieldChange(e.target.value)}
              placeholder={field.placeholder}
              className="w-full"
              disabled={currentMode === "review"}
            />
          </div>
        )

      case "boolean":
        return (
          <div key={field.id} className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Select
              value={field.value === true ? "true" : field.value === false ? "false" : ""}
              onValueChange={(value) => handleFieldChange(value === "true")}
              disabled={currentMode === "review"}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )

      case "date":
        return (
          <div key={field.id} className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              type="date"
              value={field.value as string}
              onChange={(e) => handleFieldChange(e.target.value)}
              className="w-full"
              disabled={currentMode === "review"}
            />
          </div>
        )

      case "number":
        return (
          <div key={field.id} className="space-y-2">
            <Label className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              type="number"
              value={field.value as string}
              onChange={(e) => handleFieldChange(e.target.value)}
              placeholder={field.placeholder}
              className="w-full"
              disabled={currentMode === "review"}
            />
          </div>
        )

      default: // text
        return (
          <div key={field.id} className="space-y-2">
            <Label className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              value={field.value as string}
              onChange={(e) => handleFieldChange(e.target.value)}
              placeholder={field.placeholder}
              className="min-h-[60px]"
              disabled={currentMode === "review"}
            />
          </div>
        )
    }
  }

  const renderContractLinks = (contractData: ContractItemData, sectionId: string, itemId: string) => {
    return (
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center gap-1">
          <LinkIcon className="h-3 w-3" />
          Contract Document Links
        </Label>
        <div className="space-y-2">
          {contractData.contractLinks.map((link) => (
            <div key={link.id} className="flex items-center justify-between p-2 bg-muted rounded">
              <div className="flex items-center gap-2">
                <FileIcon className="h-4 w-4" />
                <div>
                  <div className="text-sm font-medium">{link.articleTitle}</div>
                  <div className="text-xs text-muted-foreground">
                    Article {link.articleNumber} - Page {link.pageNumber}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => window.open(link.url, "_blank")}>
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View
                </Button>
                {currentMode === "editable" && (
                  <Button size="sm" variant="ghost" onClick={() => removeContractLink(sectionId, itemId, link.id)}>
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          {currentMode === "editable" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                // Mock contract document picker - in real implementation, this would open the Contract Documents tool
                const articleNumber = prompt("Enter article number:")
                const articleTitle = prompt("Enter article title:")
                if (articleNumber && articleTitle) {
                  addContractLink(sectionId, itemId, {
                    articleNumber,
                    articleTitle,
                    pageNumber: 1,
                    highlightedText: "Sample highlighted text",
                    url: `/contract-documents?article=${articleNumber}`,
                  })
                }
              }}
              className="w-full"
            >
              <Plus className="h-3 w-3 mr-2" />
              Link Contract Article
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card className="bg-slate-900/95 dark:bg-slate-900/95 light:bg-blue-50/80 border-slate-800/50 dark:border-slate-800/50 light:border-blue-200/30">
        <CardHeader className="bg-gradient-to-r from-slate-800/30 to-blue-900/20 dark:from-slate-800/30 dark:to-blue-900/20 light:from-blue-100/40 light:to-blue-200/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-blue-100 dark:text-blue-100 light:text-blue-900">
                <Building className="h-5 w-5 text-blue-400 dark:text-blue-400 light:text-blue-600" />
                Start-Up Checklist
                <Badge
                  variant="secondary"
                  className="bg-blue-800/50 text-blue-100 dark:bg-blue-800/50 dark:text-blue-100 light:bg-blue-200 light:text-blue-800"
                >
                  {projectName}
                </Badge>
              </CardTitle>
              <p className="text-sm text-slate-300 dark:text-slate-300 light:text-blue-700/80 mt-1">
                Digital project startup checklist for Construction stage
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-sm border-blue-400/50 text-blue-200 dark:border-blue-400/50 dark:text-blue-200 light:border-blue-600/50 light:text-blue-800"
              >
                {overallStats.completionRate}% Complete
              </Badge>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={
                    currentMode === "review"
                      ? "bg-orange-800/30 text-orange-200 border-orange-600/50 dark:bg-orange-800/30 dark:text-orange-200 dark:border-orange-600/50 light:bg-orange-100 light:text-orange-800 light:border-orange-400"
                      : "bg-green-800/30 text-green-200 border-green-600/50 dark:bg-green-800/30 dark:text-green-200 dark:border-green-600/50 light:bg-green-100 light:text-green-800 light:border-green-400"
                  }
                >
                  {currentMode === "review" ? "Review Mode" : "Edit Mode"}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-400/50 text-blue-200 hover:bg-blue-800/30 dark:border-blue-400/50 dark:text-blue-200 dark:hover:bg-blue-800/30 light:border-blue-600/50 light:text-blue-800 light:hover:bg-blue-200/30"
                  onClick={() => {
                    const newMode = currentMode === "editable" ? "review" : "editable"
                    setCurrentMode(newMode)
                    toast({
                      title: "Mode Changed",
                      description: `Switched to ${newMode === "editable" ? "Edit" : "Review"} Mode`,
                    })
                  }}
                >
                  {currentMode === "editable" ? "Switch to Review" : "Switch to Edit"}
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="bg-slate-850/50 dark:bg-slate-850/50 light:bg-blue-50/50">
          {/* Statistics Bar */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-100 dark:text-blue-100 light:text-blue-900">
                {overallStats.totalItems}
              </div>
              <div className="text-sm text-slate-400 dark:text-slate-400 light:text-blue-700/70">Total Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 dark:text-green-400 light:text-green-700">
                {overallStats.conformingItems}
              </div>
              <div className="text-sm text-slate-400 dark:text-slate-400 light:text-blue-700/70">Conforming</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400 dark:text-red-400 light:text-red-700">
                {overallStats.deficientItems}
              </div>
              <div className="text-sm text-slate-400 dark:text-slate-400 light:text-blue-700/70">Deficient</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-400 dark:text-slate-400 light:text-slate-600">
                {overallStats.neutralItems}
              </div>
              <div className="text-sm text-slate-400 dark:text-slate-400 light:text-blue-700/70">Neutral</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 dark:text-blue-400 light:text-blue-700">
                {overallStats.naItems}
              </div>
              <div className="text-sm text-slate-400 dark:text-slate-400 light:text-blue-700/70">N/A</div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Conforming">Conforming</SelectItem>
                  <SelectItem value="Deficient">Deficient</SelectItem>
                  <SelectItem value="Neutral">Neutral</SelectItem>
                  <SelectItem value="N/A">N/A</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterAssignee} onValueChange={setFilterAssignee}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter by Assignee" />
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

              <Button
                variant="outline"
                size="sm"
                className="border-blue-400/50 text-blue-200 hover:bg-blue-800/30 dark:border-blue-400/50 dark:text-blue-200 dark:hover:bg-blue-800/30 light:border-blue-600/50 light:text-blue-800 light:hover:bg-blue-200/30"
                onClick={() => setShowCompleted(!showCompleted)}
              >
                {showCompleted ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                {showCompleted ? "Hide" : "Show"} Completed
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-blue-400/50 text-blue-200 hover:bg-blue-800/30 dark:border-blue-400/50 dark:text-blue-200 dark:hover:bg-blue-800/30 light:border-blue-600/50 light:text-blue-800 light:hover:bg-blue-200/30"
                onClick={() => setViewMode(viewMode === "full" ? "compact" : "full")}
              >
                {viewMode === "full" ? "Compact" : "Full"} View
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-blue-400/50 text-blue-200 hover:bg-blue-800/30 dark:border-blue-400/50 dark:text-blue-200 dark:hover:bg-blue-800/30 light:border-blue-600/50 light:text-blue-800 light:hover:bg-blue-200/30"
                onClick={() => exportChecklist("pdf")}
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-blue-400/50 text-blue-200 hover:bg-blue-800/30 dark:border-blue-400/50 dark:text-blue-200 dark:hover:bg-blue-800/30 light:border-blue-600/50 light:text-blue-800 light:hover:bg-blue-200/30"
                onClick={() => exportChecklist("excel")}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checklist Sections */}
      <div className="space-y-4">
        {sections.map((section) => (
          <Card
            key={section.id}
            className="bg-slate-800/80 dark:bg-slate-800/80 light:bg-blue-100/60 border-slate-700/50 dark:border-slate-700/50 light:border-blue-300/40"
          >
            <Collapsible open={section.isExpanded} onOpenChange={() => toggleSection(section.id)}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-slate-700/30 dark:hover:bg-slate-700/30 light:hover:bg-blue-200/40 transition-colors bg-gradient-to-r from-slate-700/20 to-blue-800/15 dark:from-slate-700/20 dark:to-blue-800/15 light:from-blue-200/30 light:to-blue-300/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {section.isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-blue-300 dark:text-blue-300 light:text-blue-700" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-blue-300 dark:text-blue-300 light:text-blue-700" />
                      )}
                      <div>
                        <CardTitle className="text-lg text-blue-200 dark:text-blue-200 light:text-blue-900">
                          {section.title}
                        </CardTitle>
                        <p className="text-sm text-slate-400 dark:text-slate-400 light:text-blue-700/80">
                          {section.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="text-sm border-blue-300/50 text-blue-200 dark:border-blue-300/50 dark:text-blue-200 light:border-blue-600/60 light:text-blue-800"
                      >
                        {section.completionRate}% Complete
                      </Badge>
                      <div className="text-sm text-slate-400 dark:text-slate-400 light:text-blue-700/80">
                        {section.items.filter((item) => item.status === "Conforming").length} / {section.items.length}
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0 bg-slate-750/60 dark:bg-slate-750/60 light:bg-blue-150/40">
                  <div className="space-y-3">
                    {getFilteredItems(section.items).map((item) => (
                      <div
                        key={item.id}
                        className="border border-slate-600/40 dark:border-slate-600/40 light:border-blue-400/30 rounded-lg hover:bg-slate-700/30 dark:hover:bg-slate-700/30 light:hover:bg-blue-200/30 transition-colors bg-slate-700/20 dark:bg-slate-700/20 light:bg-blue-200/20"
                      >
                        {/* Collapsed Item Header - Always Visible */}
                        <div
                          className="flex items-center justify-between p-4 cursor-pointer"
                          onClick={() => toggleItem(item.id)}
                        >
                          <div className="flex items-center gap-3">
                            {expandedItems.has(item.id) ? (
                              <ChevronDown className="h-4 w-4 text-blue-400 dark:text-blue-400 light:text-blue-700 flex-shrink-0" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-blue-400 dark:text-blue-400 light:text-blue-700 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-blue-100 dark:text-blue-100 light:text-blue-900">
                                  {item.title}
                                </span>
                                <Badge variant="outline" className={getPriorityColor(item.priority)}>
                                  {item.priority}
                                </Badge>
                                {item.tags.slice(0, 2).map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="text-xs bg-blue-700/30 text-blue-200 dark:bg-blue-700/30 dark:text-blue-200 light:bg-blue-300/50 light:text-blue-800"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-400 light:text-blue-700/80">
                                {item.assignedTo && (
                                  <span className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {mockUsers.find((u) => u.id === item.assignedTo)?.name || item.assignedTo}
                                  </span>
                                )}
                                {item.completionDate && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {format(item.completionDate, "MMM d, yyyy")}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                          </div>
                        </div>

                        {/* Expanded Item Content */}
                        {expandedItems.has(item.id) && (
                          <div className="px-4 pb-4 space-y-3 bg-gradient-to-b from-slate-600/30 to-blue-900/20 dark:from-slate-600/30 dark:to-blue-900/20 light:from-blue-300/25 light:to-blue-400/15 border-t border-slate-600/40 dark:border-slate-600/40 light:border-blue-400/30">
                            {/* Title Editing */}
                            <div className="flex items-center gap-2">
                              {editingItem === item.id ? (
                                <div className="flex items-center gap-2 flex-1">
                                  <Input
                                    value={item.title}
                                    onChange={(e) => {
                                      // Update title in state temporarily
                                      setSections((prev) =>
                                        prev.map((s) =>
                                          s.id === section.id
                                            ? {
                                                ...s,
                                                items: s.items.map((i) =>
                                                  i.id === item.id ? { ...i, title: e.target.value } : i
                                                ),
                                              }
                                            : s
                                        )
                                      )
                                    }}
                                    className="flex-1"
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        updateItemTitle(section.id, item.id, item.title)
                                      } else if (e.key === "Escape") {
                                        setEditingItem(null)
                                      }
                                    }}
                                    autoFocus
                                  />
                                  <Button size="sm" onClick={() => updateItemTitle(section.id, item.id, item.title)}>
                                    Save
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => setEditingItem(null)}>
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                <>
                                  <Label className="text-sm font-medium text-blue-200 dark:text-blue-200 light:text-blue-900">
                                    Title:
                                  </Label>
                                  <span className="flex-1 text-blue-100 dark:text-blue-100 light:text-blue-800">
                                    {item.title}
                                  </span>
                                  {currentMode === "editable" && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => setEditingItem(item.id)}
                                      className="h-6 w-6 p-0 hover:bg-blue-800/30 dark:hover:bg-blue-800/30 light:hover:bg-blue-300/30"
                                    >
                                      <Settings className="h-3 w-3" />
                                    </Button>
                                  )}
                                </>
                              )}
                            </div>

                            {viewMode === "full" && (
                              <div className="space-y-3">
                                {/* Contract Item Fields or Status Selection */}
                                {item.isContractItem && item.contractData ? (
                                  <>
                                    {/* Contract Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-950/30 dark:bg-blue-950/30 light:bg-blue-400/15 rounded-lg border border-blue-800/30 dark:border-blue-800/30 light:border-blue-500/20">
                                      <div className="md:col-span-2">
                                        <h4 className="font-medium text-sm text-blue-200 dark:text-blue-200 light:text-blue-900 mb-3 flex items-center gap-2">
                                          <FileText className="h-4 w-4" />
                                          Contract Information
                                        </h4>
                                      </div>
                                      {item.contractData.fields.map((field) =>
                                        renderContractField(field, section.id, item.id)
                                      )}
                                      {/* Special handling for "Special contract terms" - add field group button */}
                                      {item.title === "Special contract terms" && currentMode === "editable" && (
                                        <div className="md:col-span-2">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                              const currentTerms =
                                                item.contractData!.fields.filter((f) => f.id.includes("term-")).length /
                                                3
                                              addFieldGroup(section.id, item.id, currentTerms + 1)
                                            }}
                                            className="w-full mt-2"
                                          >
                                            <Plus className="h-3 w-3 mr-2" />
                                            Add Another Term
                                          </Button>
                                        </div>
                                      )}
                                    </div>

                                    {/* Contract Links */}
                                    <div className="p-4 bg-blue-950/30 dark:bg-blue-950/30 light:bg-blue-400/15 rounded-lg border border-blue-800/30 dark:border-blue-800/30 light:border-blue-500/20">
                                      {renderContractLinks(item.contractData, section.id, item.id)}
                                    </div>
                                  </>
                                ) : (
                                  /* Regular Status Selection for non-contract items */
                                  <div className="flex items-center gap-2">
                                    <Label className="text-sm font-medium min-w-[60px] text-blue-200 dark:text-blue-200 light:text-blue-900">
                                      Status:
                                    </Label>
                                    <Select
                                      value={item.status}
                                      onValueChange={(value) =>
                                        handleStatusUpdate(section.id, item.id, value as ChecklistItem["status"])
                                      }
                                      disabled={currentMode === "review"}
                                    >
                                      <SelectTrigger className="w-[140px] border-blue-600/40 dark:border-blue-600/40 light:border-blue-500/50">
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
                                )}

                                {/* Assignment */}
                                <div className="flex items-center gap-2">
                                  <Label className="text-sm font-medium min-w-[60px] text-blue-200 dark:text-blue-200 light:text-blue-900">
                                    Assign:
                                  </Label>
                                  <Select
                                    value={item.assignedTo || ""}
                                    onValueChange={(value) => handleAssignment(section.id, item.id, value)}
                                    disabled={currentMode === "review"}
                                  >
                                    <SelectTrigger className="w-[180px] border-blue-600/40 dark:border-blue-600/40 light:border-blue-500/50">
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

                                {/* Comments */}
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-blue-200 dark:text-blue-200 light:text-blue-900">
                                    Comments:
                                  </Label>
                                  <Textarea
                                    placeholder="Add comments or notes..."
                                    value={item.comments}
                                    onChange={(e) => handleCommentUpdate(section.id, item.id, e.target.value)}
                                    className="min-h-[60px] border-blue-600/40 dark:border-blue-600/40 light:border-blue-500/50 bg-slate-600/20 dark:bg-slate-600/20 light:bg-blue-100/30 text-blue-100 dark:text-blue-100 light:text-blue-900"
                                    disabled={currentMode === "review"}
                                  />
                                </div>

                                {/* Attachments */}
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-blue-200 dark:text-blue-200 light:text-blue-900">
                                    Attachments:
                                  </Label>
                                  <div className="flex flex-wrap gap-2">
                                    {item.attachments.map((attachment, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center gap-1 bg-blue-900/30 dark:bg-blue-900/30 light:bg-blue-300/30 rounded px-2 py-1 text-sm text-blue-200 dark:text-blue-200 light:text-blue-800"
                                      >
                                        <Paperclip className="h-3 w-3" />
                                        <span>{attachment}</span>
                                        {currentMode === "editable" && (
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => removeAttachment(section.id, item.id, attachment)}
                                            className="h-4 w-4 p-0 ml-1 hover:bg-blue-800/30 dark:hover:bg-blue-800/30 light:hover:bg-blue-400/30"
                                          >
                                            <X className="h-3 w-3" />
                                          </Button>
                                        )}
                                      </div>
                                    ))}
                                    {currentMode === "editable" && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          const fileName = prompt("Enter file name:")
                                          if (fileName) {
                                            addAttachment(section.id, item.id, fileName)
                                          }
                                        }}
                                        className="h-8 border-blue-600/40 text-blue-200 hover:bg-blue-800/30 dark:border-blue-600/40 dark:text-blue-200 dark:hover:bg-blue-800/30 light:border-blue-500/50 light:text-blue-800 light:hover:bg-blue-300/30"
                                      >
                                        <Plus className="h-3 w-3 mr-1" />
                                        Add File
                                      </Button>
                                    )}
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                {currentMode === "editable" && (
                                  <div className="flex items-center gap-2 pt-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => generateTask(section.id, item.id)}
                                    >
                                      <CheckSquare className="h-4 w-4 mr-1" />
                                      Create Task
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => sendNotification(section.id, item.id, "email")}
                                    >
                                      <Mail className="h-4 w-4 mr-1" />
                                      Send Email
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => sendNotification(section.id, item.id, "teams")}
                                    >
                                      <MessageSquare className="h-4 w-4 mr-1" />
                                      Teams Message
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => createConstraint(section.id, item.id)}
                                    >
                                      <AlertCircle className="h-4 w-4 mr-1" />
                                      Add Constraint
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => removeItem(section.id, item.id)}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <X className="h-4 w-4 mr-1" />
                                      Remove Item
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Add New Item Interface */}
                    {currentMode === "editable" && (
                      <div className="mt-4 pt-4 border-t">
                        {showAddItem === section.id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              placeholder="Enter new item title..."
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  const input = e.target as HTMLInputElement
                                  if (input.value.trim()) {
                                    addNewItem(section.id, input.value.trim())
                                    input.value = ""
                                  }
                                } else if (e.key === "Escape") {
                                  setShowAddItem(null)
                                }
                              }}
                              className="flex-1"
                              autoFocus
                            />
                            <Button
                              size="sm"
                              onClick={(e) => {
                                const input = e.currentTarget.parentElement?.querySelector("input") as HTMLInputElement
                                if (input?.value.trim()) {
                                  addNewItem(section.id, input.value.trim())
                                  input.value = ""
                                }
                              }}
                            >
                              Add Item
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setShowAddItem(null)}>
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowAddItem(section.id)}
                            className="w-full"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Item
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>
    </div>
  )
}
