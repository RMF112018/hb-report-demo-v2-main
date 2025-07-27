/**
 * @prompt
 * Refactor this component to replicate the layout and grouping behavior of the Cost Summary Excel worksheet.
 *
 * Key goals:
 * 1. Restructure the grid to support **grouped cost categories by CSI division** (e.g., "03 - Concrete", "04 - Masonry").
 * 2. Insert **pseudo subtotal rows** before each CSI group using a new `rowType: "subtotal"` flag.
 * 3. In the grid column definitions:
 *    - Add custom `cellRenderer` logic to visually style subtotal rows (bold text, muted background, no edit icons).
 *    - Hide `Actions` column for subtotal rows.
 *    - Use `cellClassRules` to apply custom styling.
 * 4. In the grid config:
 *    - Prevent editing for subtotal rows via `isCellEditable`.
 *    - Optionally gray out rows or apply icons for locked categories.
 * 5. Use `useMemo` to generate the full grouped dataset with injected subtotal rows.
 *    - Aggregate values like `Original Bid`, `Selected Bid`, `Buyout Savings`, `Final Amount` in each subtotal row.
 *    - Group by the first two digits of `CSI Code` to determine the division.
 * 6. Ensure that export (PDF/CSV) and save logic ignores subtotal rows unless explicitly needed.
 * 7. Retain all existing `ProtectedGrid` configurations and hooks, but wrap new logic in helper functions if necessary.
 *
 * Summary:
 * This module should mimic the visual groupings and subtotal formatting of the Excel worksheet,
 * while retaining interactivity and protection rules defined in protected-grid.tsx.
 */

"use client"

import React, { useState, useCallback, useEffect, useMemo, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
  DollarSign,
  Calculator,
  TrendingUp,
  TrendingDown,
  Save,
  Download,
  FileText,
  CheckCircle,
  AlertTriangle,
  Edit3,
  Plus,
  Trash2,
  Eye,
  Send,
  Target,
  BarChart3,
  Building2,
  Users,
  Clock,
  Award,
  RefreshCw,
  Zap,
  Shield,
  TestTube,
} from "lucide-react"
import {
  ProtectedGrid,
  ProtectedColDef,
  GridRow,
  GridConfig,
  GridEvents,
  createProtectedColumn,
  createReadOnlyColumn,
  createLockedColumn,
  createGridWithTotalsAndSticky,
  defaultTotalsCalculator,
} from "@/components/ui/protected-grid"
import {
  gcFieldLaborConstruction,
  gcFieldLaborCloseOut,
  gcFieldOfficeContractor,
  gcTemporaryUtilities,
  type GeneralConditionsRow,
} from "./general-conditions-data"
import {
  grTemporaryUtilities,
  grCleaning,
  grServices,
  grDrawings,
  grTesting,
  grPermits,
  grTravel,
  grOther,
} from "./general-requirements-data"

// Types for Cost Summary
export interface CostCategory {
  id: string
  category: string
  description: string
  csiCode?: string
  csiDivision?: string // Add CSI division (e.g., "03 - Concrete")
  rowType?: "category" | "subtotal" | "total" // New field for row type
  selectedBidAmount: number
  originalBidAmount: number
  buyoutSavings: number
  adjustments: number
  finalAmount: number
  numberOfBids?: number // Number of bids received for this CSI code
  adjustment?: "None" | "$" | "%" // Adjustment type for the row
  adjValue?: number // Adjustment value (dollar amount or percentage)
  status: "pending" | "selected" | "committed" | "approved"
  bidder?: string
  notes?: string
  lastModified: string
}

// New interfaces for GC&GR Worksheet structure
export interface GCLineItem {
  id: string
  description: string
  quantity: number | string
  unit: string
  unitCost: number | null
  constCost: number | null
  generalReq: number | null
  total: number | null
  percentTime: number | null
  remarks: string
  customizedLaborRates: number | null
  laborFY2025: number | null
  rowType?: "section" | "item" | "subtotal"
}

export interface GRLineItem {
  id: string
  description: string
  quantity: number | string
  unit: string
  unitCost: number | null
  constCond: number | null
  unitValue: number | null
  generalReq: number | null
  total: number | null
  percentTime: number | null
  remarks: string
  rowType?: "section" | "item" | "subtotal"
}

export interface GeneralConditions {
  supervision: number
  temporaryFacilities: number
  equipment: number
  utilities: number
  permits: number
  insurance: number
  bonds: number
  other: number
}

export interface GeneralRequirements {
  projectManagement: number
  qualityControl: number
  safety: number
  testing: number
  cleanup: number
  mobilization: number
  demobilization: number
  other: number
}

export interface ApprovalStep {
  id: string
  title: string
  description: string
  status: "pending" | "complete" | "skipped"
  approver: string
  completedBy?: string
  completedAt?: Date
  required: boolean
}

export interface CostSummaryData {
  projectId: string
  projectName: string
  costCategories: CostCategory[]
  generalConditions: GeneralConditions
  generalRequirements: GeneralRequirements
  approvalSteps: ApprovalStep[]
  subtotal: number
  overhead: number
  profit: number
  contingency: number
  total: number
  approvalStatus: "draft" | "pending" | "approved" | "submitted"
  approvalProgress: number
  lastModified: string
}

interface CostSummaryModuleProps {
  projectId: string
  projectName: string
  onSave?: (data: CostSummaryData) => void
  onExport?: (format: "pdf" | "csv") => void
  onSubmit?: (data: CostSummaryData) => void
}

// CSI Division mapping for grouping
const CSI_DIVISION_MAP: Record<string, string> = {
  "01": "01 - General Requirements",
  "02": "02 - Existing Conditions",
  "03": "03 - Concrete",
  "04": "04 - Masonry",
  "05": "05 - Metals",
  "06": "06 - Wood, Plastics, and Composites",
  "07": "07 - Thermal and Moisture Protection",
  "08": "08 - Openings",
  "09": "09 - Finishes",
  "10": "10 - Specialties",
  "11": "11 - Equipment",
  "12": "12 - Furnishings",
  "13": "13 - Special Construction",
  "14": "14 - Conveying Equipment",
  "21": "21 - Fire Suppression",
  "22": "22 - Plumbing",
  "23": "23 - HVAC",
  "25": "25 - Integrated Automation",
  "26": "26 - Electrical",
  "27": "27 - Communications",
  "28": "28 - Electronic Safety and Security",
  "31": "31 - Earthwork",
  "32": "32 - Exterior Improvements",
  "33": "33 - Utilities",
  "34": "34 - Transportation",
  "35": "35 - Waterway and Marine Construction",
}

// 1. Create proper cell editors that extend ag-Grid's ICellEditorComp interface
const AdjustmentSelectEditor = (props: any) => {
  const [value, setValue] = useState(props.value || "None")

  const getValue = () => value

  const isPopup = () => true

  const onValueChange = (newValue: string) => {
    setValue(newValue)
    // Don't stop editing immediately - let ag-Grid handle it
  }

  // Handle Enter key to stop editing
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      props.api.stopEditing()
    }
    if (e.key === "Escape") {
      props.api.stopEditing()
    }
  }

  return (
    <div onKeyDown={handleKeyDown}>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="None">None</SelectItem>
          <SelectItem value="$">$</SelectItem>
          <SelectItem value="%">%</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

const AdjValueEditor = (props: any) => {
  const [value, setValue] = useState(props.value || 0)
  const adjustmentType = props.data?.adjustment || "None"

  const getValue = () => value

  const isPopup = () => true

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      props.api.stopEditing()
    }
    if (e.key === "Escape") {
      props.api.stopEditing()
    }
  }

  if (adjustmentType === "None") {
    return <div className="text-muted-foreground italic p-2">No adjustment</div>
  }

  return (
    <div className="flex items-center gap-1 p-1" onKeyDown={handleKeyDown}>
      <Input
        type="number"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-20 h-6 text-xs"
        autoFocus
      />
      <span className="text-xs">{adjustmentType === "$" ? "$" : "%"}</span>
    </div>
  )
}

// Column definitions for Field Labor - Construction
const fieldLaborConstructionColumns: ProtectedColDef[] = [
  createProtectedColumn("description", "Description", { level: "none" }, { width: 200, pinned: "left" }),
  createProtectedColumn(
    "quantity",
    "Qty.",
    { level: "none" },
    { width: 80, editable: (params) => params.data.rowType === "item" }
  ),
  createProtectedColumn("unit", "Unit", { level: "none" }, { width: 60 }),
  createProtectedColumn(
    "unitCost",
    "Unit Cost",
    { level: "none" },
    { width: 120, editable: (params) => params.data.rowType === "item" }
  ),
  createLockedColumn("constCost", "Const. Cost", { width: 130 }),
  createLockedColumn("total", "Total", { width: 130 }),
  createProtectedColumn(
    "percentTime",
    "% Time",
    { level: "none" },
    { width: 80, editable: (params) => params.data.rowType === "item" }
  ),
  createProtectedColumn(
    "remarks",
    "Remarks",
    { level: "none" },
    { width: 200, editable: (params) => params.data.rowType === "item" }
  ),
  createLockedColumn("customizedLaborRates", "CUSTOMIZED LABOR RATES", { width: 180 }),
  createLockedColumn("laborFY2025", "LABOR FY 2025", { width: 220 }),
]

// Column definitions for Field Labor - Close Out
const fieldLaborCloseOutColumns: ProtectedColDef[] = [
  createProtectedColumn("description", "Description", { level: "none" }, { width: 200, pinned: "left" }),
  createProtectedColumn(
    "quantity",
    "Qty.",
    { level: "none" },
    { width: 80, editable: (params) => params.data.rowType === "item" }
  ),
  createProtectedColumn("unit", "Unit", { level: "none" }, { width: 60 }),
  createProtectedColumn(
    "unitCost",
    "Unit Cost",
    { level: "none" },
    { width: 120, editable: (params) => params.data.rowType === "item" }
  ),
  createLockedColumn("constCost", "Const. Cost", { width: 130 }),
  createLockedColumn("total", "Total", { width: 130 }),
  createProtectedColumn(
    "percentTime",
    "% Time",
    { level: "none" },
    { width: 80, editable: (params) => params.data.rowType === "item" }
  ),
  createProtectedColumn(
    "remarks",
    "Remarks",
    { level: "none" },
    { width: 200, editable: (params) => params.data.rowType === "item" }
  ),
  createLockedColumn("customizedLaborRates", "CUSTOMIZED LABOR RATES", { width: 180 }),
  createLockedColumn("laborFY2025", "LABOR FY 2025", { width: 220 }),
]

// Column definitions for Field Office - Contractor
const fieldOfficeContractorColumns: ProtectedColDef[] = [
  createProtectedColumn("description", "Description", { level: "none" }, { width: 200, pinned: "left" }),
  createProtectedColumn(
    "quantity",
    "Qty.",
    { level: "none" },
    { width: 80, editable: (params) => params.data.rowType === "item" }
  ),
  createProtectedColumn("unit", "Unit", { level: "none" }, { width: 60 }),
  createProtectedColumn(
    "unitCost",
    "Unit Cost",
    { level: "none" },
    { width: 120, editable: (params) => params.data.rowType === "item" }
  ),
  createLockedColumn("constCost", "Const. Cost", { width: 130 }),
  createLockedColumn("total", "Total", { width: 130 }),
  createProtectedColumn(
    "percentTime",
    "% Time",
    { level: "none" },
    { width: 80, editable: (params) => params.data.rowType === "item" }
  ),
  createProtectedColumn(
    "remarks",
    "Remarks",
    { level: "none" },
    { width: 200, editable: (params) => params.data.rowType === "item" }
  ),
]

// Column definitions for Temporary Utilities
const temporaryUtilitiesColumns: ProtectedColDef[] = [
  createProtectedColumn("description", "Description", { level: "none" }, { width: 200, pinned: "left" }),
  createProtectedColumn(
    "quantity",
    "Qty.",
    { level: "none" },
    { width: 80, editable: (params) => params.data.rowType === "item" }
  ),
  createProtectedColumn("unit", "Unit", { level: "none" }, { width: 60 }),
  createProtectedColumn(
    "unitCost",
    "Unit Cost",
    { level: "none" },
    { width: 120, editable: (params) => params.data.rowType === "item" }
  ),
  createLockedColumn("constCost", "Const. Cost", { width: 130 }),
  createLockedColumn("total", "Total", { width: 130 }),
  createProtectedColumn(
    "percentTime",
    "% Time",
    { level: "none" },
    { width: 80, editable: (params) => params.data.rowType === "item" }
  ),
  createProtectedColumn(
    "remarks",
    "Remarks",
    { level: "none" },
    { width: 200, editable: (params) => params.data.rowType === "item" }
  ),
]

export function CostSummaryModule({ projectId, projectName, onSave, onExport, onSubmit }: CostSummaryModuleProps) {
  const { toast } = useToast()

  // State management
  const [activeTab, setActiveTab] = useState("categories")
  const [costCategories, setCostCategories] = useState<CostCategory[]>([])
  const [generalConditions, setGeneralConditions] = useState<GeneralConditions>({
    supervision: 0,
    temporaryFacilities: 0,
    equipment: 0,
    utilities: 0,
    permits: 0,
    insurance: 0,
    bonds: 0,
    other: 0,
  })
  const [generalRequirements, setGeneralRequirements] = useState<GeneralRequirements>({
    projectManagement: 0,
    qualityControl: 0,
    safety: 0,
    testing: 0,
    cleanup: 0,
    mobilization: 0,
    demobilization: 0,
    other: 0,
  })
  const [approvalSteps, setApprovalSteps] = useState<ApprovalStep[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const [pageHeaderHeight, setPageHeaderHeight] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Initialize data
  useEffect(() => {
    // Mock initial data - in production this would come from API
    const mockCostCategories: CostCategory[] = [
      {
        id: "1",
        category: "Site Work",
        description: "Earthwork, utilities, paving",
        csiCode: "02000",
        selectedBidAmount: 850000,
        originalBidAmount: 900000,
        buyoutSavings: 50000,
        adjustments: 0,
        finalAmount: 850000,
        status: "selected",
        bidder: "ABC Excavation",
        notes: "Includes 15% rock allowance",
        lastModified: new Date().toISOString(),
      },
      {
        id: "2",
        category: "Concrete",
        description: "Structural concrete, foundations",
        csiCode: "03000",
        selectedBidAmount: 2100000,
        originalBidAmount: 2200000,
        buyoutSavings: 100000,
        adjustments: 0,
        finalAmount: 2100000,
        status: "committed",
        bidder: "Solid Concrete Co",
        notes: "Best value with strong references",
        lastModified: new Date().toISOString(),
      },
      {
        id: "3",
        category: "Steel",
        description: "Structural steel, misc metals",
        csiCode: "05000",
        selectedBidAmount: 3200000,
        originalBidAmount: 3400000,
        buyoutSavings: 200000,
        adjustments: 0,
        finalAmount: 3200000,
        status: "approved",
        bidder: "Premier Steel",
        notes: "Market pricing locked through Q2",
        lastModified: new Date().toISOString(),
      },
      {
        id: "4",
        category: "MEP",
        description: "Mechanical, electrical, plumbing",
        csiCode: "15000-16000",
        selectedBidAmount: 4800000,
        originalBidAmount: 5000000,
        buyoutSavings: 200000,
        adjustments: 0,
        finalAmount: 4800000,
        status: "pending",
        bidder: "Total MEP Solutions",
        notes: "Contingent on final drawings",
        lastModified: new Date().toISOString(),
      },
      {
        id: "5",
        category: "Finishes",
        description: "Flooring, painting, ceilings",
        csiCode: "09000",
        selectedBidAmount: 1800000,
        originalBidAmount: 1850000,
        buyoutSavings: 50000,
        adjustments: 0,
        finalAmount: 1800000,
        status: "selected",
        bidder: "Elite Finishes",
        notes: "Upgraded tile selection",
        lastModified: new Date().toISOString(),
      },
      {
        id: "6",
        category: "Masonry",
        description: "Brick, block, stone work",
        csiCode: "04000",
        selectedBidAmount: 950000,
        originalBidAmount: 1000000,
        buyoutSavings: 50000,
        adjustments: 0,
        finalAmount: 950000,
        status: "committed",
        bidder: "Masonry Masters",
        notes: "Premium brick selection",
        lastModified: new Date().toISOString(),
      },
      {
        id: "7",
        category: "Electrical",
        description: "Power, lighting, systems",
        csiCode: "26000",
        selectedBidAmount: 2200000,
        originalBidAmount: 2300000,
        buyoutSavings: 100000,
        adjustments: 0,
        finalAmount: 2200000,
        status: "selected",
        bidder: "Power Systems Inc",
        notes: "LED lighting upgrade",
        lastModified: new Date().toISOString(),
      },
      {
        id: "8",
        category: "Plumbing",
        description: "Water, waste, gas systems",
        csiCode: "22000",
        selectedBidAmount: 1600000,
        originalBidAmount: 1650000,
        buyoutSavings: 50000,
        adjustments: 0,
        finalAmount: 1600000,
        status: "approved",
        bidder: "Plumbing Pros",
        notes: "High-efficiency fixtures",
        lastModified: new Date().toISOString(),
      },
      // Category 2 - Contingency rows
      {
        id: "9",
        category: "GC Contingency",
        description: "GC Contingency",
        csiCode: " ", // Blank CSI code
        selectedBidAmount: 0,
        originalBidAmount: 0,
        buyoutSavings: 0,
        adjustments: 0,
        finalAmount: 0,
        status: "pending",
        bidder: "",
        notes: "",
        lastModified: new Date().toISOString(),
      },
      {
        id: "10",
        category: "Owner Contingency",
        description: "Owner Contingency",
        csiCode: " ", // Blank CSI code
        selectedBidAmount: 0,
        originalBidAmount: 0,
        buyoutSavings: 0,
        adjustments: 0,
        finalAmount: 0,
        status: "pending",
        bidder: "",
        notes: "",
        lastModified: new Date().toISOString(),
      },
      {
        id: "11",
        category: "Escalation Contingency",
        description: "Escalation Contingency",
        csiCode: " ", // Blank CSI code
        selectedBidAmount: 0,
        originalBidAmount: 0,
        buyoutSavings: 0,
        adjustments: 0,
        finalAmount: 0,
        status: "pending",
        bidder: "",
        notes: "",
        lastModified: new Date().toISOString(),
      },
    ]

    const mockApprovalSteps: ApprovalStep[] = [
      {
        id: "1",
        title: "Cost Review",
        description: "Senior estimator review of all cost categories",
        status: "complete",
        approver: "Senior Estimator",
        completedBy: "John Smith",
        completedAt: new Date(),
        required: true,
      },
      {
        id: "2",
        title: "Project Manager Approval",
        description: "PM approval of final cost summary",
        status: "pending",
        approver: "Project Manager",
        required: true,
      },
      {
        id: "3",
        title: "Executive Review",
        description: "Executive approval for submission",
        status: "pending",
        approver: "Project Executive",
        required: true,
      },
    ]

    setCostCategories(mockCostCategories)
    setApprovalSteps(mockApprovalSteps)

    // Mock general conditions and requirements
    setGeneralConditions({
      supervision: 450000,
      temporaryFacilities: 320000,
      equipment: 180000,
      utilities: 75000,
      permits: 45000,
      insurance: 85000,
      bonds: 55000,
      other: 40000,
    })

    setGeneralRequirements({
      projectManagement: 280000,
      qualityControl: 120000,
      safety: 95000,
      testing: 65000,
      cleanup: 85000,
      mobilization: 110000,
      demobilization: 90000,
      other: 35000,
    })
  }, [])

  // Sticky scroll handling
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return

      // Find the PageHeader element
      const pageHeader =
        document.querySelector("[data-radix-popper-content-wrapper]") ||
        document.querySelector('[role="banner"]') ||
        document.querySelector("header")

      if (!pageHeader) return

      const pageHeaderRect = pageHeader.getBoundingClientRect()
      const containerRect = containerRef.current.getBoundingClientRect()

      // Check if the container top has reached the bottom of the page header
      const shouldBeSticky = containerRect.top <= pageHeaderRect.bottom

      setIsSticky(shouldBeSticky)
      setPageHeaderHeight(pageHeaderRect.height)
    }

    // Initial measurement
    handleScroll()

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [])

  // Calculate totals
  const calculations = useMemo(() => {
    const subtotal = costCategories.reduce((sum, category) => sum + category.finalAmount, 0)
    const gcTotal = Object.values(generalConditions).reduce((sum, value) => sum + value, 0)
    const grTotal = Object.values(generalRequirements).reduce((sum, value) => sum + value, 0)

    const baseTotal = subtotal + gcTotal + grTotal
    const overhead = baseTotal * 0.08 // 8% overhead
    const profit = baseTotal * 0.1 // 10% profit
    const contingency = baseTotal * 0.05 // 5% contingency
    const total = baseTotal + overhead + profit + contingency

    const totalBuyoutSavings = costCategories.reduce((sum, category) => sum + category.buyoutSavings, 0)
    const completedSteps = approvalSteps.filter((step) => step.status === "complete").length
    const approvalProgress = (completedSteps / approvalSteps.length) * 100

    return {
      subtotal,
      gcTotal,
      grTotal,
      baseTotal,
      overhead,
      profit,
      contingency,
      total,
      totalBuyoutSavings,
      approvalProgress,
      markupPercentage: ((overhead + profit + contingency) / baseTotal) * 100,
    }
  }, [costCategories, generalConditions, generalRequirements, approvalSteps])

  // Generate grouped cost data with subtotal rows (remove the Total row)
  const generateGroupedCostData = useMemo(() => {
    // Filter categories that have CSI codes (not null/blank/empty) - Category 1
    const categoriesWithCSI = costCategories.filter((category) => category.csiCode && category.csiCode.trim() !== "")

    // Filter categories with blank CSI codes - Category 2 (contingency items)
    const categoriesWithoutCSI = costCategories.filter(
      (category) => !category.csiCode || category.csiCode.trim() === ""
    )

    // Generate rows with three subtotals plus Category 4 (no Total row)
    const rows: GridRow[] = []

    // Add Category 1 rows first
    categoriesWithCSI.forEach((category) => {
      rows.push({
        ...category,
        rowType: "category",
        numberOfBids: Math.floor(Math.random() * 5) + 1, // Mock data for number of bids
        // Ensure adjustment and adjValue are preserved
        adjustment: category.adjustment || "None",
        adjValue: category.adjValue || 0,
      })
    })

    // Add Category 1 subtotal row
    if (categoriesWithCSI.length > 0) {
      const category1Subtotal = categoriesWithCSI.reduce((sum, c) => sum + c.selectedBidAmount, 0)
      const subtotalRow1: GridRow = {
        id: "subtotal-category1",
        csiCode: "Subtotal",
        description: "Category 1 - Cost of Work",
        selectedBidAmount: category1Subtotal,
        originalBidAmount: categoriesWithCSI.reduce((sum, c) => sum + c.originalBidAmount, 0),
        buyoutSavings: categoriesWithCSI.reduce((sum, c) => sum + c.buyoutSavings, 0),
        adjustments: categoriesWithCSI.reduce((sum, c) => sum + c.adjustments, 0),
        finalAmount: categoriesWithCSI.reduce((sum, c) => sum + c.finalAmount, 0),
        numberOfBids: categoriesWithCSI.reduce((sum, c) => sum + (c.numberOfBids || 0), 0),
        status: " ",
        bidder: " ",
        rowType: "subtotal",
        adjustment: "None",
        adjValue: 0,
      }
      rows.push(subtotalRow1)
    }

    // Add Category 2 rows
    categoriesWithoutCSI.forEach((category) => {
      rows.push({
        ...category,
        rowType: "category",
        numberOfBids: 0, // No bids for contingency items
        // Ensure adjustment and adjValue are preserved
        adjustment: category.adjustment || "None",
        adjValue: category.adjValue || 0,
      })
    })

    // Add Category 2 subtotal row with conditional calculation
    if (categoriesWithoutCSI.length > 0) {
      // Find the adjustment settings for Category 2
      // Use the first Category 2 row that has adjustment settings, or default to first row
      const category2Row =
        categoriesWithoutCSI.find((c) => c.adjustment && c.adjustment !== "None") || categoriesWithoutCSI[0]
      const category2Adjustment = category2Row?.adjustment || "None"
      const category2AdjValue = category2Row?.adjValue || 0

      // Calculate Category 2 subtotal based on adjustment type
      let category2Subtotal = 0
      if (category2Adjustment === "%") {
        // Calculate from Category 1 subtotal
        const category1Subtotal = categoriesWithCSI.reduce((sum, c) => sum + c.selectedBidAmount, 0)
        category2Subtotal = category1Subtotal * (category2AdjValue / 100)
      } else if (category2Adjustment === "$") {
        category2Subtotal = category2AdjValue
      }
      // Default is $0.00 if adjustment is "None"

      const subtotalRow2: GridRow = {
        id: "subtotal-category2",
        csiCode: "Subtotal",
        description: "Category 2 - Contingency",
        selectedBidAmount: category2Subtotal,
        originalBidAmount: 0,
        buyoutSavings: 0,
        adjustments: 0,
        finalAmount: category2Subtotal,
        numberOfBids: 0,
        status: " ",
        bidder: " ",
        rowType: "subtotal",
        adjustment: "None",
        adjValue: 0,
      }
      rows.push(subtotalRow2)
    }

    // Add Category 3 rows (Bonds, Insurance, & GCs)
    const category3Rows: GridRow[] = [
      {
        id: "gc-general-conditions",
        csiCode: " ",
        description: "General Conditions",
        selectedBidAmount: 0,
        originalBidAmount: 0,
        buyoutSavings: 0,
        adjustments: 0,
        finalAmount: 0,
        numberOfBids: 0,
        status: "pending",
        bidder: " ",
        rowType: "category",
        adjustment: "None",
        adjValue: 0,
      },
      {
        id: "gc-general-requirements",
        csiCode: " ",
        description: "General Requirements",
        selectedBidAmount: 0,
        originalBidAmount: 0,
        buyoutSavings: 0,
        adjustments: 0,
        finalAmount: 0,
        numberOfBids: 0,
        status: "pending",
        bidder: " ",
        rowType: "category",
        adjustment: "None",
        adjValue: 0,
      },
      {
        id: "gc-impact-concurrency",
        csiCode: " ",
        description: "Impact & Concurrency Fee Allowance",
        selectedBidAmount: 0,
        originalBidAmount: 0,
        buyoutSavings: 0,
        adjustments: 0,
        finalAmount: 0,
        numberOfBids: 0,
        status: "pending",
        bidder: " ",
        rowType: "category",
        adjustment: "None",
        adjValue: 0,
      },
      {
        id: "gc-permits-co",
        csiCode: " ",
        description: "Permits & C/O Fee Allowance",
        selectedBidAmount: 0,
        originalBidAmount: 0,
        buyoutSavings: 0,
        adjustments: 0,
        finalAmount: 0,
        numberOfBids: 0,
        status: "pending",
        bidder: " ",
        rowType: "category",
        adjustment: "None",
        adjValue: 0,
      },
      {
        id: "gc-builder-risk",
        csiCode: " ",
        description: "Builder Risk Insurance & Deductibles",
        selectedBidAmount: 0,
        originalBidAmount: 0,
        buyoutSavings: 0,
        adjustments: 0,
        finalAmount: 0,
        numberOfBids: 0,
        status: "pending",
        bidder: " ",
        rowType: "category",
        adjustment: "None",
        adjValue: 0,
      },
      {
        id: "gc-ccip-insurance",
        csiCode: " ",
        description: "CCIP Insurance Program",
        selectedBidAmount: 0,
        originalBidAmount: 0,
        buyoutSavings: 0,
        adjustments: 0,
        finalAmount: 0,
        numberOfBids: 0,
        status: "pending",
        bidder: " ",
        rowType: "category",
        adjustment: "None",
        adjValue: 0,
      },
      {
        id: "gc-subcontractor-default",
        csiCode: " ",
        description: "Subcontractor Default Insurance",
        selectedBidAmount: 0, // Will be calculated below
        originalBidAmount: 0,
        buyoutSavings: 0,
        adjustments: 0,
        finalAmount: 0, // Will be calculated below
        numberOfBids: 0,
        status: "pending",
        bidder: " ",
        rowType: "category",
        adjustment: "None",
        adjValue: 0,
      },
      {
        id: "gc-warranty",
        csiCode: " ",
        description: "Warranty",
        selectedBidAmount: 0, // Will be calculated below
        originalBidAmount: 0,
        buyoutSavings: 0,
        adjustments: 0,
        finalAmount: 0, // Will be calculated below
        numberOfBids: 0,
        status: "pending",
        bidder: " ",
        rowType: "category",
        adjustment: "None",
        adjValue: 0,
      },
      {
        id: "gc-procore",
        csiCode: " ",
        description: "Procore",
        selectedBidAmount: 0, // Will be calculated below
        originalBidAmount: 0,
        buyoutSavings: 0,
        adjustments: 0,
        finalAmount: 0, // Will be calculated below
        numberOfBids: 0,
        status: "pending",
        bidder: " ",
        rowType: "category",
        adjustment: "None",
        adjValue: 0,
      },
      {
        id: "gc-general-liability",
        csiCode: " ",
        description: "General Liability Insurance",
        selectedBidAmount: 0, // Will be calculated below
        originalBidAmount: 0,
        buyoutSavings: 0,
        adjustments: 0,
        finalAmount: 0, // Will be calculated below
        numberOfBids: 0,
        status: "pending",
        bidder: " ",
        rowType: "category",
        adjustment: "None",
        adjValue: 0,
      },
    ]

    // Calculate Category 1 and Category 2 subtotals for Category 3 calculations
    const category1Subtotal = categoriesWithCSI.reduce((sum, c) => sum + c.selectedBidAmount, 0)
    const category2Subtotal =
      categoriesWithoutCSI.length > 0
        ? (() => {
            const category2Row =
              categoriesWithoutCSI.find((c) => c.adjustment && c.adjustment !== "None") || categoriesWithoutCSI[0]
            const category2Adjustment = category2Row?.adjustment || "None"
            const category2AdjValue = category2Row?.adjValue || 0

            if (category2Adjustment === "%") {
              return category1Subtotal * (category2AdjValue / 100)
            } else if (category2Adjustment === "$") {
              return category2AdjValue
            }
            return 0
          })()
        : 0

    const combinedSubtotal = category1Subtotal + category2Subtotal

    // Update Category 3 rows with calculated values
    category3Rows[6].selectedBidAmount = combinedSubtotal * 0.018 // Subcontractor Default Insurance
    category3Rows[6].finalAmount = combinedSubtotal * 0.018
    category3Rows[7].selectedBidAmount = combinedSubtotal * 0.0065 // Warranty
    category3Rows[7].finalAmount = combinedSubtotal * 0.0065
    category3Rows[8].selectedBidAmount = combinedSubtotal * 0.0025 // Procore
    category3Rows[8].finalAmount = combinedSubtotal * 0.0025
    category3Rows[9].selectedBidAmount = combinedSubtotal * 0.015 // General Liability Insurance
    category3Rows[9].finalAmount = combinedSubtotal * 0.015

    // Add Category 3 rows to the main rows array
    rows.push(...category3Rows)

    // Add Category 3 subtotal row
    const category3Subtotal = category3Rows.reduce((sum, row) => sum + row.selectedBidAmount, 0)
    const subtotalRow3: GridRow = {
      id: "subtotal-category3",
      csiCode: "Subtotal",
      description: "Category 3 - Bonds, Ins., & GCs",
      selectedBidAmount: category3Subtotal,
      originalBidAmount: 0,
      buyoutSavings: 0,
      adjustments: 0,
      finalAmount: category3Subtotal,
      numberOfBids: 0,
      status: " ",
      bidder: " ",
      rowType: "subtotal",
      adjustment: "None",
      adjValue: 0,
    }
    rows.push(subtotalRow3)

    // Add Category 4 row (Contracting Fee - OH & P)
    const category4Amount = (category1Subtotal + category2Subtotal + category3Subtotal) * 0.1
    const category4Row: GridRow = {
      id: "category4-contracting-fee",
      csiCode: " ",
      description: "Contracting Fee (OH & P)",
      selectedBidAmount: category4Amount,
      originalBidAmount: 0,
      buyoutSavings: 0,
      adjustments: 0,
      finalAmount: category4Amount,
      numberOfBids: 0,
      status: "pending",
      bidder: " ",
      rowType: "category",
      adjustment: "None",
      adjValue: 0,
    }
    rows.push(category4Row)

    // Remove the Total row - it will be handled by the built-in totals row
    return rows
  }, [costCategories])

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  // Fix the getStatusColor function to return Badge variant types
  const getStatusColor = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "pending":
        return "secondary"
      case "selected":
        return "default"
      case "committed":
        return "outline"
      case "approved":
        return "default"
      default:
        return "secondary"
    }
  }

  // Inline edit component
  const InlineEdit = ({
    value,
    onSave,
    type = "number",
    className = "",
    prefix = "$",
  }: {
    value: number
    onSave: (value: number) => void
    type?: "number"
    className?: string
    prefix?: string
  }) => {
    const fieldKey = `${type}-${value}-${Date.now()}`
    const isEditing = editingField === fieldKey
    const [editValue, setEditValue] = useState(value)

    const handleSave = () => {
      onSave(editValue)
      setEditingField(null)
      setHasUnsavedChanges(true)
    }

    const handleCancel = () => {
      setEditValue(value)
      setEditingField(null)
    }

    if (isEditing) {
      return (
        <div className="flex items-center gap-1">
          <Input
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(Number(e.target.value))}
            className="w-28 h-8 text-xs"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave()
              if (e.key === "Escape") handleCancel()
            }}
            autoFocus
          />
          <Button size="sm" onClick={handleSave} className="h-6 w-6 p-0">
            <CheckCircle className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel} className="h-6 w-6 p-0">
            ✕
          </Button>
        </div>
      )
    }

    return (
      <div
        className={`flex items-center gap-1 cursor-pointer hover:bg-muted/50 rounded px-2 py-1 group ${className}`}
        onClick={() => setEditingField(fieldKey)}
      >
        <span className={`text-sm font-medium ${className}`}>{formatCurrency(value)}</span>
        <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
      </div>
    )
  }

  // Update cost category
  const updateCostCategory = useCallback((categoryId: string, field: keyof CostCategory, value: any) => {
    setCostCategories((prev) =>
      prev.map((category) => {
        if (category.id === categoryId) {
          const updated = { ...category, [field]: value, lastModified: new Date().toISOString() }

          // Recalculate final amount when relevant fields change
          if (field === "selectedBidAmount" || field === "adjustments") {
            updated.finalAmount = updated.selectedBidAmount + (updated.adjustments || 0)
          }

          // If this is a Category 2 row (blank CSI code) and adjValue or adjustment changed,
          // we need to trigger a recalculation of Category 2 subtotal
          if ((field === "adjValue" || field === "adjustment") && (!updated.csiCode || updated.csiCode.trim() === "")) {
            // The generateGroupedCostData will automatically recalculate due to dependency on costCategories
            setHasUnsavedChanges(true)
          }

          return updated
        }
        return category
      })
    )
    setHasUnsavedChanges(true)
  }, [])

  // Add new cost category
  const addCostCategory = useCallback(() => {
    const newCategory: CostCategory = {
      id: Date.now().toString(),
      category: "New Category",
      description: "",
      selectedBidAmount: 0,
      originalBidAmount: 0,
      buyoutSavings: 0,
      adjustments: 0,
      finalAmount: 0,
      numberOfBids: 0,
      adjustment: "None",
      adjValue: 0,
      status: "pending",
      lastModified: new Date().toISOString(),
    }
    setCostCategories((prev) => [...prev, newCategory])
    setHasUnsavedChanges(true)
  }, [])

  // Remove cost category
  const removeCostCategory = useCallback((categoryId: string) => {
    setCostCategories((prev) => prev.filter((category) => category.id !== categoryId))
    setHasUnsavedChanges(true)
  }, [])

  // Handle approval step
  const handleApprovalStep = useCallback(
    (stepId: string, action: "approve" | "reject") => {
      setApprovalSteps((prev) =>
        prev.map((step) => {
          if (step.id === stepId) {
            return {
              ...step,
              status: action === "approve" ? "complete" : "skipped",
              completedBy: action === "approve" ? "Current User" : undefined,
              completedAt: action === "approve" ? new Date() : undefined,
            }
          }
          return step
        })
      )

      toast({
        title: "Approval Status Updated",
        description: `Step marked as ${action === "approve" ? "approved" : "rejected"}.`,
      })
    },
    [toast]
  )

  // Save data
  const handleSave = useCallback(async () => {
    const costSummaryData: CostSummaryData = {
      projectId,
      projectName,
      costCategories,
      generalConditions,
      generalRequirements,
      approvalSteps,
      subtotal: calculations.subtotal,
      overhead: calculations.overhead,
      profit: calculations.profit,
      contingency: calculations.contingency,
      total: calculations.total,
      approvalStatus: "pending",
      approvalProgress: calculations.approvalProgress,
      lastModified: new Date().toISOString(),
    }

    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (onSave) {
      onSave(costSummaryData)
    }

    setHasUnsavedChanges(false)
    toast({
      title: "Cost Summary Saved",
      description: "All changes have been saved successfully.",
    })
  }, [
    projectId,
    projectName,
    costCategories,
    generalConditions,
    generalRequirements,
    approvalSteps,
    calculations,
    onSave,
    toast,
  ])

  // Export data
  const handleExport = useCallback(
    async (format: "pdf" | "csv") => {
      setIsExporting(true)
      try {
        // Filter out subtotal rows for export unless explicitly requested
        const exportData = costCategories.filter((category) => category.rowType !== "subtotal")

        await new Promise((resolve) => setTimeout(resolve, 2000))
        if (onExport) {
          onExport(format)
        }
        toast({
          title: "Export Successful",
          description: `Cost summary exported as ${format.toUpperCase()}.`,
        })
      } catch (error) {
        toast({
          title: "Export Failed",
          description: "There was an error exporting the data.",
          variant: "destructive",
        })
      } finally {
        setIsExporting(false)
      }
    },
    [onExport, toast, costCategories]
  )

  // Create column definitions for the ProtectedGrid
  const costCategoryColumns: ProtectedColDef[] = useMemo(
    () => [
      createProtectedColumn(
        "csiCode",
        "CSI",
        { level: "none" },
        {
          width: 80,
          minWidth: 80,
          headerClass: "text-xs font-semibold",
          cellRenderer: (params: any) => {
            const isSubtotal = params.data.rowType === "subtotal"
            const isTotal = params.data.rowType === "total" || params.data.csiCode === "Total"
            return (
              <div
                className={`text-xs ${
                  isSubtotal || isTotal
                    ? "text-muted-foreground"
                    : "cursor-pointer hover:bg-muted/50 rounded px-2 py-1 group"
                }`}
              >
                {isSubtotal ? "Subtotal" : isTotal ? "Total" : params.value || "N/A"}
                {!isSubtotal && !isTotal && (
                  <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity inline ml-1" />
                )}
              </div>
            )
          },
          cellClassRules: {
            "subtotal-row": (params: any) => params.data.rowType === "subtotal",
            "total-row": (params: any) => params.data.rowType === "total" || params.data.csiCode === "Total",
          },
        }
      ),
      createProtectedColumn(
        "description",
        "CSI DESCRIPTION",
        { level: "none" },
        {
          width: 150,
          minWidth: 120,
          headerClass: "text-xs font-semibold",
          cellRenderer: (params: any) => {
            const isSubtotal = params.data.rowType === "subtotal"
            const isTotal = params.data.rowType === "total" || params.data.csiCode === "Total"
            return (
              <div
                className={`text-xs ${
                  isSubtotal || isTotal
                    ? "text-muted-foreground italic"
                    : "cursor-pointer hover:bg-muted/50 rounded px-2 py-1 group"
                }`}
              >
                {isTotal ? "" : params.value || "Click to add description"}
                {!isSubtotal && !isTotal && (
                  <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity inline ml-1" />
                )}
              </div>
            )
          },
          cellClassRules: {
            "subtotal-row": (params: any) => params.data.rowType === "subtotal",
            "total-row": (params: any) => params.data.rowType === "total" || params.data.csiCode === "Total",
          },
        }
      ),
      createProtectedColumn(
        "selectedBidAmount",
        "TOTAL PROJECT",
        { level: "read-only" },
        {
          width: 100,
          minWidth: 90,
          headerClass: "text-xs font-semibold",
          type: "numericColumn",
          valueFormatter: (params: any) => formatCurrency(params.value),
          cellRenderer: (params: any) => {
            const isSubtotal = params.data.rowType === "subtotal"
            const isTotal = params.data.rowType === "total" || params.data.csiCode === "Total"
            if (isSubtotal || isTotal) {
              return (
                <div className="text-xs font-bold text-blue-900 dark:text-blue-100 text-right">
                  {formatCurrency(params.value)}
                </div>
              )
            }
            return <div className="text-xs text-right">{formatCurrency(params.value)}</div>
          },
          cellStyle: { textAlign: "right" },
          cellClassRules: {
            "subtotal-row": (params: any) => params.data.rowType === "subtotal",
            "total-row": (params: any) => params.data.rowType === "total" || params.data.csiCode === "Total",
          },
        }
      ),
      createProtectedColumn(
        "dollarPerGSF",
        "$ /GSF",
        { level: "none" },
        {
          width: 80,
          minWidth: 70,
          headerClass: "text-xs font-semibold",
          type: "numericColumn",
          valueFormatter: (params: any) => {
            const totalProject = params.data.selectedBidAmount || 0
            const gsf = 6794 // Mock data as specified
            const dollarPerGSF = totalProject / gsf
            return formatCurrency(dollarPerGSF)
          },
          cellRenderer: (params: any) => {
            const isSubtotal = params.data.rowType === "subtotal"
            const isTotal = params.data.rowType === "total" || params.data.csiCode === "Total"
            const totalProject = params.data.selectedBidAmount || 0
            const gsf = 6794 // Mock data as specified
            const dollarPerGSF = totalProject / gsf

            if (isSubtotal || isTotal) {
              return (
                <div className="text-xs font-bold text-blue-900 dark:text-blue-100 text-right">
                  {formatCurrency(dollarPerGSF)}
                </div>
              )
            }
            return <div className="text-xs text-right">{formatCurrency(dollarPerGSF)}</div>
          },
          cellStyle: { textAlign: "right" },
          cellClassRules: {
            "subtotal-row": (params: any) => params.data.rowType === "subtotal",
            "total-row": (params: any) => params.data.rowType === "total" || params.data.csiCode === "Total",
          },
        }
      ),
      createProtectedColumn(
        "dollarPerLSF",
        "$ /LSF",
        { level: "none" },
        {
          width: 80,
          minWidth: 70,
          headerClass: "text-xs font-semibold",
          type: "numericColumn",
          valueFormatter: (params: any) => {
            const totalProject = params.data.selectedBidAmount || 0
            const lsf = 5827 // Mock data as specified
            const dollarPerLSF = totalProject / lsf
            return formatCurrency(dollarPerLSF)
          },
          cellRenderer: (params: any) => {
            const isSubtotal = params.data.rowType === "subtotal"
            const isTotal = params.data.rowType === "total" || params.data.csiCode === "Total"
            const totalProject = params.data.selectedBidAmount || 0
            const lsf = 5827 // Mock data as specified
            const dollarPerLSF = totalProject / lsf

            if (isSubtotal || isTotal) {
              return (
                <div className="text-xs font-bold text-blue-900 dark:text-blue-100 text-right">
                  {formatCurrency(dollarPerLSF)}
                </div>
              )
            }
            return <div className="text-xs text-right">{formatCurrency(dollarPerLSF)}</div>
          },
          cellStyle: { textAlign: "right" },
          cellClassRules: {
            "subtotal-row": (params: any) => params.data.rowType === "subtotal",
            "total-row": (params: any) => params.data.rowType === "total" || params.data.csiCode === "Total",
          },
        }
      ),
      createProtectedColumn(
        "numberOfBids",
        "# OF BIDS",
        { level: "none" },
        {
          width: 80,
          minWidth: 70,
          headerClass: "text-xs font-semibold",
          type: "numericColumn",
          valueFormatter: (params: any) => params.value || 0,
          cellRenderer: (params: any) => {
            const isSubtotal = params.data.rowType === "subtotal"
            const isTotal = params.data.rowType === "total" || params.data.csiCode === "Total"
            return (
              <div className={`text-xs ${isSubtotal || isTotal ? "font-bold" : ""}`}>
                {isSubtotal ? "—" : isTotal ? "" : params.value || 0}
              </div>
            )
          },
          cellClassRules: {
            "subtotal-row": (params: any) => params.data.rowType === "subtotal",
            "total-row": (params: any) => params.data.rowType === "total" || params.data.csiCode === "Total",
          },
        }
      ),
      createProtectedColumn(
        "percentage",
        "%",
        { level: "none" },
        {
          width: 60,
          minWidth: 50,
          headerClass: "text-xs font-semibold",
          type: "numericColumn",
          valueFormatter: (params: any) => {
            const totalProject = params.data.selectedBidAmount || 0
            // Calculate grand total from all category rows (excluding subtotals and totals)
            const grandTotal = generateGroupedCostData
              .filter((row: any) => row.rowType !== "subtotal" && row.rowType !== "total")
              .reduce((sum: number, row: any) => sum + (row.selectedBidAmount || 0), 0)
            const percentage = grandTotal > 0 ? (totalProject / grandTotal) * 100 : 0
            return `${percentage.toFixed(1)}%`
          },
          cellRenderer: (params: any) => {
            const isSubtotal = params.data.rowType === "subtotal"
            const isTotal = params.data.rowType === "total" || params.data.csiCode === "Total"
            const totalProject = params.data.selectedBidAmount || 0
            const grandTotal = generateGroupedCostData
              .filter((row: any) => row.rowType !== "subtotal" && row.rowType !== "total")
              .reduce((sum: number, row: any) => sum + (row.selectedBidAmount || 0), 0)
            const percentage = grandTotal > 0 ? (totalProject / grandTotal) * 100 : 0

            if (isSubtotal || isTotal) {
              return (
                <div className="text-xs font-bold text-blue-900 dark:text-blue-100 text-right">
                  {percentage.toFixed(1)}%
                </div>
              )
            }
            return <div className="text-xs text-right">{percentage.toFixed(1)}%</div>
          },
          cellStyle: { textAlign: "right" },
          cellClassRules: {
            "subtotal-row": (params: any) => params.data.rowType === "subtotal",
            "total-row": (params: any) => params.data.rowType === "total" || params.data.csiCode === "Total",
          },
        }
      ),
      createProtectedColumn(
        "adjustment",
        "Adjustment",
        { level: "none" },
        {
          width: 90,
          minWidth: 80,
          headerClass: "text-xs font-semibold",
          editable: (params) => {
            const isSubtotal = params.data.rowType === "subtotal"
            const isTotal = params.data.rowType === "total" || params.data.csiCode === "Total"
            return !isSubtotal && !isTotal
          },
          cellEditor: AdjustmentSelectEditor,
          cellRenderer: (params: any) => {
            const isSubtotal = params.data.rowType === "subtotal"
            const isTotal = params.data.rowType === "total" || params.data.csiCode === "Total"
            if (isSubtotal || isTotal) {
              return <div className="text-muted-foreground italic"></div>
            }
            return <div className="text-xs">{params.value || "None"}</div>
          },
          cellClassRules: {
            "subtotal-row": (params: any) => params.data.rowType === "subtotal",
            "total-row": (params: any) => params.data.rowType === "total" || params.data.csiCode === "Total",
          },
        }
      ),
      createProtectedColumn(
        "adjValue",
        "Adj. Value",
        { level: "none" },
        {
          width: 90,
          minWidth: 80,
          headerClass: "text-xs font-semibold",
          editable: (params) => {
            const isSubtotal = params.data.rowType === "subtotal"
            const isTotal = params.data.rowType === "total" || params.data.csiCode === "Total"
            const adjustmentType = params.data.adjustment || "None"
            return !isSubtotal && !isTotal && adjustmentType !== "None"
          },
          cellEditor: AdjValueEditor,
          cellRenderer: (params: any) => {
            const isSubtotal = params.data.rowType === "subtotal"
            const isTotal = params.data.rowType === "total" || params.data.csiCode === "Total"
            if (isSubtotal || isTotal) {
              return <div className="text-muted-foreground italic"></div>
            }

            const adjustmentType = params.data.adjustment || "None"
            if (adjustmentType === "None") {
              return <div className="text-muted-foreground italic">TBD</div>
            }

            const value = Number(params.data.adjValue) || 0
            const formattedValue = adjustmentType === "$" ? formatCurrency(value) : `${value.toFixed(2)}%`

            return <div className="text-xs text-right">{formattedValue}</div>
          },
          valueFormatter: (params: any) => {
            const adjustmentType = params.data.adjustment || "None"
            if (adjustmentType === "None") return "TBD"

            const value = Number(params.data.adjValue) || 0
            return adjustmentType === "$" ? formatCurrency(value) : `${value.toFixed(2)}%`
          },
          cellClassRules: {
            "subtotal-row": (params: any) => params.data.rowType === "subtotal",
            "total-row": (params: any) => params.data.rowType === "total" || params.data.csiCode === "Total",
          },
        }
      ),
      createProtectedColumn(
        "status",
        "Status",
        { level: "none" },
        {
          width: 90,
          minWidth: 80,
          headerClass: "text-xs font-semibold",
          editable: (params) => {
            const isSubtotal = params.data.rowType === "subtotal"
            const isTotal = params.data.rowType === "total" || params.data.csiCode === "Total"
            return !isSubtotal && !isTotal
          },
          cellEditor: "agSelectCellEditor",
          cellEditorParams: {
            values: ["pending", "selected", "committed", "approved"],
          },
          cellRenderer: (params: any) => {
            const isSubtotal = params.data.rowType === "subtotal"
            const isTotal = params.data.rowType === "total" || params.data.csiCode === "Total"
            if (isSubtotal || isTotal) {
              return <div className="text-muted-foreground italic"></div>
            }
            return <div className="text-xs">{params.value}</div>
          },
          cellClassRules: {
            "subtotal-row": (params: any) => params.data.rowType === "subtotal",
            "total-row": (params: any) => params.data.rowType === "total" || params.data.csiCode === "Total",
          },
        }
      ),
      createProtectedColumn(
        "bidder",
        "Bidder",
        { level: "read-only" },
        {
          width: 100,
          minWidth: 80,
          headerClass: "text-xs font-semibold",
          cellRenderer: (params: any) => {
            const isSubtotal = params.data.rowType === "subtotal"
            const isTotal = params.data.rowType === "total" || params.data.csiCode === "Total"
            if (isSubtotal || isTotal) {
              return <div className="text-muted-foreground italic"></div>
            }
            return (
              <div className="flex items-center h-full text-xs">
                <span>{params.value || "TBD"}</span>
              </div>
            )
          },
          cellClassRules: {
            "subtotal-row": (params: any) => params.data.rowType === "subtotal",
            "total-row": (params: any) => params.data.rowType === "total" || params.data.csiCode === "Total",
          },
        }
      ),
    ],
    [updateCostCategory, removeCostCategory, generateGroupedCostData]
  )

  // Custom totals calculator that only sums category rows (not subtotals)
  const customTotalsCalculator = useCallback((data: GridRow[], columnField: string): number | string => {
    // Only sum rows that are not subtotals
    const categoryRows = data.filter((row) => row.rowType !== "subtotal")

    if (columnField === "csiCode") {
      return "Total"
    }

    if (columnField === "description") {
      return ""
    }

    if (columnField === "numberOfBids") {
      return ""
    }

    if (columnField === "adjustment") {
      return ""
    }

    if (columnField === "adjValue") {
      return ""
    }

    if (columnField === "status") {
      return ""
    }

    if (columnField === "bidder") {
      return ""
    }

    // For numeric columns, sum the values
    const values = categoryRows
      .map((row) => {
        const value = row[columnField]
        return typeof value === "number" ? value : parseFloat(value)
      })
      .filter((val) => !isNaN(val))

    if (values.length === 0) return ""
    return values.reduce((sum, val) => sum + val, 0)
  }, [])

  // Update the grid configuration to enable totals row with auto-sizing and reduced row height
  const gridConfig: GridConfig = useMemo(
    () =>
      createGridWithTotalsAndSticky(3, true, {
        allowExport: true,
        allowRowSelection: true,
        allowColumnResizing: true,
        allowSorting: true,
        allowFiltering: true,
        allowCellEditing: true,
        showToolbar: true,
        showStatusBar: true,
        protectionEnabled: true,
        theme: "quartz",
        enableTotalsRow: true, // Enable the built-in totals row
        rowHeight: 32, // Reduced row height for more compact display
      }),
    []
  )

  // Fix the grid events with proper typing
  const gridEvents: GridEvents = useMemo(
    () => ({
      onCellValueChanged: (event: any) => {
        const { data, column, newValue, oldValue } = event

        console.log("Cell value changed:", {
          column: column.getColId(),
          oldValue,
          newValue,
          dataId: data.id,
        })

        // Update the data through the proper callback
        if (data.id) {
          updateCostCategory(data.id, column.getColId() as keyof CostCategory, newValue)
        }
      },
      onCellEditingStarted: (event: any) => {
        console.log("Cell editing started:", event.column.getColId())
      },
      onCellEditingStopped: (event: any) => {
        console.log("Cell editing stopped:", event.column.getColId())
      },
      onGridReady: (event: any) => {
        console.log("Grid ready")
      },
    }),
    [updateCostCategory]
  )

  // Convert cost categories to grid rows with grouped data
  const gridRowData: GridRow[] = useMemo(() => {
    return generateGroupedCostData
  }, [generateGroupedCostData])

  // Create column definitions for the General Conditions ProtectedGrid
  const generalConditionsColumns: ProtectedColDef[] = useMemo(
    () => [
      createProtectedColumn(
        "description",
        "Description",
        { level: "none" },
        {
          width: 200,
          pinned: "left",
          cellClassRules: {
            "section-header": (params) => params.data.rowType === "section",
            "subtotal-row": (params) => params.data.rowType === "subtotal",
          },
        }
      ),
      createProtectedColumn(
        "quantity",
        "Qty.",
        { level: "none" },
        {
          width: 60,
          cellClassRules: {
            "section-header": (params) => params.data.rowType === "section",
            "subtotal-row": (params) => params.data.rowType === "subtotal",
          },
        }
      ),
      createProtectedColumn(
        "unit",
        "U",
        { level: "none" },
        {
          width: 50,
          cellClassRules: {
            "section-header": (params) => params.data.rowType === "section",
            "subtotal-row": (params) => params.data.rowType === "subtotal",
          },
        }
      ),
      createProtectedColumn(
        "unitCost",
        "Unit Cost",
        { level: "none" },
        {
          width: 100,
          valueFormatter: (params) => formatCurrency(params.value),
          cellClassRules: {
            "section-header": (params) => params.data.rowType === "section",
            "subtotal-row": (params) => params.data.rowType === "subtotal",
          },
        }
      ),
      createProtectedColumn(
        "constCost",
        "Const. Cost",
        { level: "locked" },
        {
          width: 100,
          valueGetter: (params) => params.data.quantity * params.data.unitCost,
          valueFormatter: (params) => formatCurrency(params.value),
          cellClassRules: {
            "section-header": (params) => params.data.rowType === "section",
            "subtotal-row": (params) => params.data.rowType === "subtotal",
          },
        }
      ),
      createProtectedColumn(
        "percentTime",
        "% Time",
        { level: "none" },
        {
          width: 80,
          cellClassRules: {
            "section-header": (params) => params.data.rowType === "section",
            "subtotal-row": (params) => params.data.rowType === "subtotal",
          },
        }
      ),
      createProtectedColumn(
        "remarks",
        "Remarks",
        { level: "none" },
        {
          width: 150,
          cellClassRules: {
            "section-header": (params) => params.data.rowType === "section",
            "subtotal-row": (params) => params.data.rowType === "subtotal",
          },
        }
      ),
      createProtectedColumn(
        "customizedRate",
        "CUSTOMIZED LABOR RATES",
        { level: "read-only" },
        {
          width: 140,
          valueFormatter: (params) => formatCurrency(params.value),
          cellClassRules: {
            "section-header": (params) => params.data.rowType === "section",
            "subtotal-row": (params) => params.data.rowType === "subtotal",
          },
        }
      ),
      createProtectedColumn(
        "laborRateFY2025",
        "LABOR FY 2025",
        { level: "read-only" },
        {
          width: 140,
          valueFormatter: (params) => formatCurrency(params.value),
          cellClassRules: {
            "section-header": (params) => params.data.rowType === "section",
            "subtotal-row": (params) => params.data.rowType === "subtotal",
          },
        }
      ),
      createProtectedColumn(
        "total",
        "Total",
        { level: "locked" },
        {
          width: 100,
          valueGetter: (params) => params.data.constCost,
          valueFormatter: (params) => formatCurrency(params.value),
          cellClassRules: {
            "section-header": (params) => params.data.rowType === "section",
            "subtotal-row": (params) => params.data.rowType === "subtotal",
          },
        }
      ),
    ],
    []
  )

  // Grid configuration for General Conditions
  const generalConditionsGridConfig: GridConfig = useMemo(
    () =>
      createGridWithTotalsAndSticky(1, true, {
        allowExport: true,
        allowRowSelection: true,
        allowColumnResizing: true,
        allowSorting: true,
        allowFiltering: true,
        allowCellEditing: true,
        showToolbar: true,
        showStatusBar: true,
        protectionEnabled: true,
        theme: "quartz",
        rowHeight: 32,
      }),
    []
  )

  // Fix the general conditions grid events
  const generalConditionsGridEvents: GridEvents = useMemo(
    () => ({
      onCellValueChanged: (event: any) => {
        // Handle cell value changes if needed
        setHasUnsavedChanges(true)
      },
      onGridReady: (event: any) => {
        // Grid is ready
      },
    }),
    []
  )

  // Convert general conditions to grid rows based on the image data
  const generalConditionsData: GridRow[] = useMemo(() => {
    return [
      // Field Labor - Construction Section
      {
        id: "section1",
        description: "Field Labor - Construction",
        quantity: "",
        unit: "",
        unitCost: "",
        constCost: "",
        generalReq: "",
        total: "",
        percentTime: "",
        remarks: "",
        customizedLaborRates: "",
        laborFY2025: "",
      },
      {
        id: "pe1",
        description: "Project Executive",
        quantity: 39,
        unit: "wks",
        unitCost: 2554,
        constCost: 99979,
        generalReq: "",
        total: 99979,
        percentTime: 30,
        remarks: "",
        customizedLaborRates: 212.85,
        laborFY2025: 212.85,
      },
      {
        id: "spm1",
        description: "Senior Project Manager",
        quantity: 39,
        unit: "wks",
        unitCost: 0,
        constCost: 0,
        generalReq: "",
        total: 0,
        percentTime: 0,
        remarks: "",
        customizedLaborRates: 176.41,
        laborFY2025: 176.41,
      },
      {
        id: "pm3_1",
        description: "Project Manager - Level 3",
        quantity: 39,
        unit: "wks",
        unitCost: 0,
        constCost: 0,
        generalReq: "",
        total: 0,
        percentTime: 0,
        remarks: "",
        customizedLaborRates: 162.46,
        laborFY2025: 162.46,
      },
      {
        id: "pm2_1",
        description: "Project Manager - Level 2",
        quantity: 39,
        unit: "wks",
        unitCost: 5948,
        constCost: 232822,
        generalReq: "",
        total: 232822,
        percentTime: 100,
        remarks: "",
        customizedLaborRates: 148.7,
        laborFY2025: 148.7,
      },
      {
        id: "pm1_1",
        description: "Project Manager - Level 1",
        quantity: 39,
        unit: "wks",
        unitCost: 0,
        constCost: 0,
        generalReq: "",
        total: 0,
        percentTime: 0,
        remarks: "",
        customizedLaborRates: 127.26,
        laborFY2025: 127.26,
      },
      {
        id: "pa1",
        description: "Project Administrator",
        quantity: 39,
        unit: "wks",
        unitCost: 3591,
        constCost: 140570,
        generalReq: "",
        total: 140570,
        percentTime: 100,
        remarks: "",
        customizedLaborRates: 89.78,
        laborFY2025: 89.78,
      },
      {
        id: "pac1",
        description: "Project Accountant",
        quantity: 39,
        unit: "wks",
        unitCost: 2317,
        constCost: 90686,
        generalReq: "",
        total: 90686,
        percentTime: 50,
        remarks: "",
        customizedLaborRates: 115.84,
        laborFY2025: 115.84,
      },
      {
        id: "apm1",
        description: "Assistant Project Manager",
        quantity: 39,
        unit: "wks",
        unitCost: 4468,
        constCost: 174875,
        generalReq: "",
        total: 174875,
        percentTime: 100,
        remarks: "",
        customizedLaborRates: 111.69,
        laborFY2025: 111.69,
      },
      {
        id: "sup3_1",
        description: "Superintendent - Level 3",
        quantity: 39,
        unit: "wks",
        unitCost: 0,
        constCost: 0,
        generalReq: "",
        total: 0,
        percentTime: 0,
        remarks: "",
        customizedLaborRates: 177.87,
        laborFY2025: 177.87,
      },
      {
        id: "sup2_1",
        description: "Superintendent - Level 2",
        quantity: 39,
        unit: "wks",
        unitCost: 0,
        constCost: 0,
        generalReq: "",
        total: 0,
        percentTime: 0,
        remarks: "",
        customizedLaborRates: 149.3,
        laborFY2025: 149.3,
      },
      {
        id: "sup1_1",
        description: "Superintendent - Level 1",
        quantity: 39,
        unit: "wks",
        unitCost: 4888,
        constCost: 191315,
        generalReq: "",
        total: 191315,
        percentTime: 100,
        remarks: "",
        customizedLaborRates: 122.19,
        laborFY2025: 122.19,
      },
      {
        id: "asup1",
        description: "Assistant Superintendent",
        quantity: 39,
        unit: "wks",
        unitCost: 3236,
        constCost: 126651,
        generalReq: "",
        total: 126651,
        percentTime: 100,
        remarks: "",
        customizedLaborRates: 80.89,
        laborFY2025: 80.89,
      },
      {
        id: "asup2",
        description: "Assistant Superintendent",
        quantity: 39,
        unit: "wks",
        unitCost: 0,
        constCost: 0,
        generalReq: "",
        total: 0,
        percentTime: 0,
        remarks: "",
        customizedLaborRates: 80.89,
        laborFY2025: 80.89,
      },
      {
        id: "qcm1",
        description: "Quality Control Manager",
        quantity: 39,
        unit: "wks",
        unitCost: 0,
        constCost: 0,
        generalReq: "",
        total: 0,
        percentTime: 0,
        remarks: "",
        customizedLaborRates: 138.96,
        laborFY2025: 138.96,
      },
      {
        id: "foreman1",
        description: "Foreman",
        quantity: 39,
        unit: "wks",
        unitCost: 0,
        constCost: 0,
        generalReq: "",
        total: 0,
        percentTime: 0,
        remarks: "",
        customizedLaborRates: 56.06,
        laborFY2025: 56.06,
      },
      {
        id: "accounting1",
        description: "Accounting",
        quantity: 39,
        unit: "wks",
        unitCost: 927,
        constCost: 36274,
        generalReq: "",
        total: 36274,
        percentTime: 20,
        remarks: "",
        customizedLaborRates: 115.84,
        laborFY2025: 115.84,
      },
      {
        id: "vdc1",
        description: "VDC Manager",
        quantity: 39,
        unit: "wks",
        unitCost: 0,
        constCost: 0,
        generalReq: "",
        total: 0,
        percentTime: 0,
        remarks: "",
        customizedLaborRates: 138.96,
        laborFY2025: 138.96,
      },
      {
        id: "safety1",
        description: "Safety Supervisor/Inspector",
        quantity: 39,
        unit: "wks",
        unitCost: 2153,
        constCost: 84267,
        generalReq: "",
        total: 84267,
        percentTime: 50,
        remarks: "",
        customizedLaborRates: 107.64,
        laborFY2025: 107.64,
      },
      {
        id: "subtotal1",
        description: "Subtotal for Field Labor - Construction",
        quantity: "",
        unit: "",
        unitCost: "",
        constCost: "",
        generalReq: "",
        total: 1177437,
        percentTime: "",
        remarks: "",
        customizedLaborRates: "",
        laborFY2025: "",
      },

      // Field Labor - Close Out Section
      {
        id: "section2",
        description: "Field Labor - Close Out",
        quantity: "",
        unit: "",
        unitCost: "",
        constCost: "",
        generalReq: "",
        total: "",
        percentTime: "",
        remarks: "",
        customizedLaborRates: "",
        laborFY2025: "",
      },
      {
        id: "pe2",
        description: "Project Executive",
        quantity: 4,
        unit: "wks",
        unitCost: 2810,
        constCost: 12041,
        generalReq: "",
        total: 12041,
        percentTime: 33,
        remarks: "",
        customizedLaborRates: 212.85,
        laborFY2025: 212.85,
      },
      {
        id: "spm2",
        description: "Senior Project Manager",
        quantity: 4,
        unit: "wks",
        unitCost: 0,
        constCost: 0,
        generalReq: "",
        total: 0,
        percentTime: 0,
        remarks: "",
        customizedLaborRates: 176.41,
        laborFY2025: 176.41,
      },
      {
        id: "pm3_2",
        description: "Project Manager - Level 3",
        quantity: 4,
        unit: "wks",
        unitCost: 0,
        constCost: 0,
        generalReq: "",
        total: 0,
        percentTime: 0,
        remarks: "",
        customizedLaborRates: 162.46,
        laborFY2025: 162.46,
      },
      {
        id: "pm2_2",
        description: "Project Manager - Level 2",
        quantity: 4,
        unit: "wks",
        unitCost: 5948,
        constCost: 25491,
        generalReq: "",
        total: 25491,
        percentTime: 100,
        remarks: "",
        customizedLaborRates: 148.7,
        laborFY2025: 148.7,
      },
      {
        id: "pm1_2",
        description: "Project Manager - Level 1",
        quantity: 4,
        unit: "wks",
        unitCost: 0,
        constCost: 0,
        generalReq: "",
        total: 0,
        percentTime: 0,
        remarks: "",
        customizedLaborRates: 127.26,
        laborFY2025: 127.26,
      },
      {
        id: "pa2",
        description: "Project Administrator",
        quantity: 4,
        unit: "wks",
        unitCost: 3591,
        constCost: 15391,
        generalReq: "",
        total: 15391,
        percentTime: 100,
        remarks: "",
        customizedLaborRates: 89.78,
        laborFY2025: 89.78,
      },
      {
        id: "pc2",
        description: "Project Coordinator",
        quantity: 4,
        unit: "wks",
        unitCost: 2317,
        constCost: 9929,
        generalReq: "",
        total: 9929,
        percentTime: 100,
        remarks: "",
        customizedLaborRates: 115.84,
        laborFY2025: 115.84,
      },
      {
        id: "apm2",
        description: "Assistant Project Manager",
        quantity: 4,
        unit: "wks",
        unitCost: 4468,
        constCost: 19147,
        generalReq: "",
        total: 19147,
        percentTime: 100,
        remarks: "",
        customizedLaborRates: 111.69,
        laborFY2025: 111.69,
      },
      {
        id: "sup3_2",
        description: "Superintendent - Level 3",
        quantity: 4,
        unit: "wks",
        unitCost: 7115,
        constCost: 30492,
        generalReq: "",
        total: 30492,
        percentTime: 100,
        remarks: "",
        customizedLaborRates: 177.87,
        laborFY2025: 177.87,
      },
      {
        id: "sup2_2",
        description: "Superintendent - Level 2",
        quantity: 4,
        unit: "wks",
        unitCost: 0,
        constCost: 0,
        generalReq: "",
        total: 0,
        percentTime: 0,
        remarks: "",
        customizedLaborRates: 149.3,
        laborFY2025: 149.3,
      },
      {
        id: "sup1_2",
        description: "Superintendent - Level 1",
        quantity: 4,
        unit: "wks",
        unitCost: 0,
        constCost: 0,
        generalReq: "",
        total: 0,
        percentTime: 0,
        remarks: "",
        customizedLaborRates: 122.19,
        laborFY2025: 122.19,
      },
      {
        id: "asup3",
        description: "Assistant Superintendent",
        quantity: 4,
        unit: "wks",
        unitCost: 3236,
        constCost: 13867,
        generalReq: "",
        total: 13867,
        percentTime: 100,
        remarks: "",
        customizedLaborRates: 80.89,
        laborFY2025: 80.89,
      },
      {
        id: "foreman2",
        description: "Foreman",
        quantity: 4,
        unit: "wks",
        unitCost: 0,
        constCost: 0,
        generalReq: "",
        total: 0,
        percentTime: 0,
        remarks: "",
        customizedLaborRates: 56.06,
        laborFY2025: 56.06,
      },
      {
        id: "accounting2",
        description: "Accounting",
        quantity: 4,
        unit: "wks",
        unitCost: 927,
        constCost: 3972,
        generalReq: "",
        total: 3972,
        percentTime: 20,
        remarks: "",
        customizedLaborRates: 115.84,
        laborFY2025: 115.84,
      },
      {
        id: "vdc2",
        description: "VDC Manager",
        quantity: 4,
        unit: "wks",
        unitCost: 0,
        constCost: 0,
        generalReq: "",
        total: 0,
        percentTime: 0,
        remarks: "",
        customizedLaborRates: 138.96,
        laborFY2025: 138.96,
      },
      {
        id: "safety2",
        description: "Safety Supervisor/Inspector",
        quantity: 4,
        unit: "wks",
        unitCost: 2153,
        constCost: 9226,
        generalReq: "",
        total: 9226,
        percentTime: 50,
        remarks: "",
        customizedLaborRates: 107.64,
        laborFY2025: 107.64,
      },
      {
        id: "subtotal2",
        description: "Subtotal for Field Labor - Close Out",
        quantity: "",
        unit: "",
        unitCost: "",
        constCost: "",
        generalReq: "",
        total: 139556,
        percentTime: "",
        remarks: "",
        customizedLaborRates: "",
        laborFY2025: "",
      },

      // Field Office - Contractor Section
      {
        id: "section3",
        description: "Field Office - Contractor",
        quantity: "",
        unit: "",
        unitCost: "",
        constCost: "",
        generalReq: "",
        total: "",
        percentTime: "",
        remarks: "",
        customizedLaborRates: "",
        laborFY2025: "",
      },
      {
        id: "fosr_dw",
        description: "Field Office Set Up / Removal - Double W",
        quantity: 1,
        unit: "ea",
        unitCost: 16000,
        constCost: 16000,
        generalReq: "",
        total: 16000,
        percentTime: "",
        remarks: "WILLSCOT 4/16/2024 (36x10 mobile office)",
        customizedLaborRates: "",
        laborFY2025: "",
      },
      {
        id: "fo_dw",
        description: "Field Office - Double Wide",
        quantity: 5,
        unit: "mos",
        unitCost: 3500,
        constCost: 17500,
        generalReq: "",
        total: 17500,
        percentTime: "",
        remarks: "WILLSCOT 4/16/2024 (36x10 mobile office)",
        customizedLaborRates: "",
        laborFY2025: "",
      },
      {
        id: "fosr_sw",
        description: "Field Office Set Up / Removal - Single W",
        quantity: 0,
        unit: "ea",
        unitCost: 15958,
        constCost: 0,
        generalReq: "",
        total: 0,
        percentTime: "",
        remarks: "",
        customizedLaborRates: "",
        laborFY2025: "",
      },
      {
        id: "fo_sw",
        description: "Field Office - Single Wide",
        quantity: 5,
        unit: "mos",
        unitCost: 1732,
        constCost: 8660,
        generalReq: "",
        total: 8660,
        percentTime: "",
        remarks: "WILLSCOT 4/16/2024 (36x10 mobile office)",
        customizedLaborRates: "",
        laborFY2025: "",
      },
      {
        id: "fosr_connex",
        description: "Field Office Set Up / Removal - Connex",
        quantity: 0,
        unit: "ea",
        unitCost: 1371,
        constCost: 0,
        generalReq: "",
        total: 0,
        percentTime: "",
        remarks: "",
        customizedLaborRates: "",
        laborFY2025: "",
      },
      {
        id: "fo_connex",
        description: "Field Office - Connex",
        quantity: 5,
        unit: "mos",
        unitCost: 6855,
        constCost: 34275,
        generalReq: "",
        total: 34275,
        percentTime: "",
        remarks: "WILLSCOT 20' COMBO W/10' OFFICE",
        customizedLaborRates: "",
        laborFY2025: "",
      },
      {
        id: "phone_lines",
        description: "Connect Telephone Lines",
        quantity: 1,
        unit: "ea",
        unitCost: 2000,
        constCost: 2000,
        generalReq: "",
        total: 2000,
        percentTime: "",
        remarks: "WILLSCOT 20' COMBO W/10' OFFICE",
        customizedLaborRates: "",
        laborFY2025: "",
      },
      {
        id: "phone_internet",
        description: "Telephone/Internet",
        quantity: 5,
        unit: "mos",
        unitCost: 250,
        constCost: 1250,
        generalReq: "",
        total: 1250,
        percentTime: "",
        remarks: "",
        customizedLaborRates: "",
        laborFY2025: "",
      },
      {
        id: "cellular",
        description: "Cellular Telephones",
        quantity: 0,
        unit: "mos",
        unitCost: 0,
        constCost: 0,
        generalReq: "",
        total: 0,
        percentTime: "",
        remarks: "",
        customizedLaborRates: "",
        laborFY2025: "",
      },
      {
        id: "job_trailer",
        description: "Job Trailer",
        quantity: 1,
        unit: "ls",
        unitCost: 2500,
        constCost: 2500,
        generalReq: "",
        total: 2500,
        percentTime: "",
        remarks: "",
        customizedLaborRates: "",
        laborFY2025: "",
      },
      {
        id: "office_supplies",
        description: "Office Supplies",
        quantity: 5,
        unit: "mos",
        unitCost: 500,
        constCost: 2500,
        generalReq: "",
        total: 2500,
        percentTime: "",
        remarks: "",
        customizedLaborRates: "",
        laborFY2025: "",
      },
      {
        id: "drinking_water",
        description: "Drinking Water",
        quantity: 5,
        unit: "mos",
        unitCost: 200,
        constCost: 1000,
        generalReq: "",
        total: 1000,
        percentTime: "",
        remarks: "",
        customizedLaborRates: "",
        laborFY2025: "",
      },
      {
        id: "janitor_supplies",
        description: "Janitor Supplies/Cleaning",
        quantity: 5,
        unit: "mos",
        unitCost: 50,
        constCost: 250,
        generalReq: "",
        total: 250,
        percentTime: "",
        remarks: "",
        customizedLaborRates: "",
        laborFY2025: "",
      },
      {
        id: "labor_charge",
        description: "Labor in Charge",
        quantity: 0.0,
        unit: "%",
        unitCost: "",
        constCost: 64806874,
        generalReq: "",
        total: 64806874,
        percentTime: "",
        remarks: "in labor rates",
        customizedLaborRates: "",
        laborFY2025: "",
      },
      {
        id: "software_charge",
        description: "Software Charge",
        quantity: 0.0,
        unit: "%",
        unitCost: "",
        constCost: 64806874,
        generalReq: "",
        total: 64806874,
        percentTime: "",
        remarks: "25% of GMP Total",
        customizedLaborRates: "",
        laborFY2025: "",
      },
      {
        id: "computers",
        description: "Computers",
        quantity: 1,
        unit: "ls",
        unitCost: 25000,
        constCost: 25000,
        generalReq: "",
        total: 25000,
        percentTime: "",
        remarks: "",
        customizedLaborRates: "",
        laborFY2025: "",
      },
      {
        id: "printers",
        description: "Printers",
        quantity: 1,
        unit: "ls",
        unitCost: 500,
        constCost: 500,
        generalReq: "",
        total: 500,
        percentTime: "",
        remarks: "",
        customizedLaborRates: "",
        laborFY2025: "",
      },
      {
        id: "copy_machine",
        description: "Copy Machine",
        quantity: 1,
        unit: "ls",
        unitCost: 1500,
        constCost: 1500,
        generalReq: "",
        total: 1500,
        percentTime: "",
        remarks: "",
        customizedLaborRates: "",
        laborFY2025: "",
      },
      {
        id: "alarm_system",
        description: "Alarm System",
        quantity: 0,
        unit: "mos",
        unitCost: 0,
        constCost: 0,
        generalReq: "",
        total: 0,
        percentTime: "",
        remarks: "",
        customizedLaborRates: "",
        laborFY2025: "",
      },
      {
        id: "install_office_equip",
        description: "Installation Office Equip.",
        quantity: 0,
        unit: "ls",
        unitCost: 250,
        constCost: 0,
        generalReq: "",
        total: 0,
        percentTime: "",
        remarks: "",
        customizedLaborRates: "",
        laborFY2025: "",
      },
      {
        id: "storage_trailers_sr",
        description: "Storage Trailers Set Up / Removal",
        quantity: 2,
        unit: "ea",
        unitCost: 1000,
        constCost: 2000,
        generalReq: "",
        total: 2000,
        percentTime: "",
        remarks: "willscot 40' trailer",
        customizedLaborRates: "",
        laborFY2025: "",
      },
      {
        id: "storage_trailers",
        description: "Storage Trailers",
        quantity: 5,
        unit: "mos",
        unitCost: 500,
        constCost: 2500,
        generalReq: "",
        total: 2500,
        percentTime: "",
        remarks: "Rate - $1200 ea. per month",
        customizedLaborRates: "",
        laborFY2025: "",
      },
      {
        id: "subtotal3",
        description: "Subtotal for Field Office - Contractor",
        quantity: "",
        unit: "",
        unitCost: "",
        constCost: "",
        generalReq: "",
        total: 82720,
        percentTime: "",
        remarks: "",
        customizedLaborRates: "",
        laborFY2025: "",
      },

      // Temporary Utilities Section
      {
        id: "section4",
        description: "Temporary Utilities",
        quantity: "",
        unit: "",
        unitCost: "",
        constCost: "",
        generalReq: "",
        total: "",
        percentTime: "",
        remarks: "",
        customizedLaborRates: "",
        laborFY2025: "",
      },
      {
        id: "subtotal4",
        description: "Subtotal for Temporary Utilities",
        quantity: "",
        unit: "",
        unitCost: "",
        constCost: "",
        generalReq: "",
        total: 76351,
        percentTime: "",
        remarks: "",
        customizedLaborRates: "",
        laborFY2025: "",
      },
    ]
  }, [])

  function GridSection({
    title,
    data,
    type = "requirements",
  }: {
    title: string
    data: any[]
    type?: "conditions" | "requirements"
  }) {
    // Calculate dynamic height based on number of data rows
    // Each row is approximately 32px, plus header (60px) and padding (40px)
    const rowHeight = 32
    const headerHeight = 60
    const padding = 40
    const dynamicHeight = Math.max(200, data.length * rowHeight + headerHeight + padding)

    // Use appropriate column definitions and config based on type
    const columnDefs = type === "conditions" ? generalConditionsColumns : generalRequirementsColumns
    const gridConfig = type === "conditions" ? generalConditionsGridConfig : generalRequirementsGridConfig
    const gridEvents = type === "conditions" ? generalConditionsGridEvents : generalRequirementsGridEvents

    return (
      <Card>
        <CardContent>
          <ProtectedGrid
            columnDefs={columnDefs}
            rowData={data}
            config={gridConfig}
            events={gridEvents}
            totalsCalculator={defaultTotalsCalculator}
            height={`${dynamicHeight}px`}
            enableSearch
            title={title}
          />
        </CardContent>
      </Card>
    )
  }

  // Create column definitions for the General Requirements ProtectedGrid
  const generalRequirementsColumns: ProtectedColDef[] = useMemo(
    () => [
      createProtectedColumn(
        "description",
        "Description",
        { level: "none" },
        {
          width: 200,
          pinned: "left",
          cellRenderer: (params: any) => <div className="font-medium">{params.value}</div>,
        }
      ),
      createProtectedColumn(
        "quantity",
        "Qty.",
        { level: "none" },
        {
          width: 60,
          type: "numericColumn",
          valueFormatter: (params: any) => params.value || "",
        }
      ),
      createProtectedColumn(
        "unit",
        "U",
        { level: "none" },
        {
          width: 50,
          cellRenderer: (params: any) => <div className="text-center">{params.value || ""}</div>,
        }
      ),
      createProtectedColumn(
        "unitCost",
        "Unit Cost",
        { level: "none" },
        {
          width: 100,
          type: "numericColumn",
          valueFormatter: (params: any) => (params.value ? formatCurrency(params.value) : "-"),
        }
      ),
      createProtectedColumn(
        "constCond",
        "Const. Cond.",
        { level: "none" },
        {
          width: 100,
          type: "numericColumn",
          valueFormatter: (params: any) => (params.value ? formatCurrency(params.value) : "-"),
        }
      ),
      createProtectedColumn(
        "unitValue",
        "Unit",
        { level: "none" },
        {
          width: 100,
          type: "numericColumn",
          valueFormatter: (params: any) => (params.value ? formatCurrency(params.value) : "-"),
        }
      ),
      createProtectedColumn(
        "generalReq",
        "General Req",
        { level: "none" },
        {
          width: 100,
          type: "numericColumn",
          valueFormatter: (params: any) => (params.value ? formatCurrency(params.value) : "-"),
        }
      ),
      createProtectedColumn(
        "total",
        "Total",
        { level: "none" },
        {
          width: 100,
          type: "numericColumn",
          valueFormatter: (params: any) => (params.value ? formatCurrency(params.value) : "-"),
          cellStyle: { fontWeight: "bold" },
        }
      ),
      createProtectedColumn(
        "percentTime",
        "% Time",
        { level: "none" },
        {
          width: 70,
          type: "numericColumn",
          valueFormatter: (params: any) => (params.value ? `${params.value}%` : "-"),
        }
      ),
      createProtectedColumn(
        "remarks",
        "Remarks",
        { level: "none" },
        {
          width: 150,
          cellRenderer: (params: any) => <div className="text-sm text-muted-foreground">{params.value || ""}</div>,
        }
      ),
    ],
    []
  )

  // Grid configuration for General Requirements
  const generalRequirementsGridConfig: GridConfig = useMemo(
    () =>
      createGridWithTotalsAndSticky(1, true, {
        allowExport: true,
        allowRowSelection: true,
        allowColumnResizing: true,
        allowSorting: true,
        allowFiltering: true,
        allowCellEditing: true,
        showToolbar: true,
        showStatusBar: true,
        protectionEnabled: true,
        theme: "quartz",
        rowHeight: 32,
      }),
    []
  )

  // Grid events for General Requirements
  const generalRequirementsGridEvents: GridEvents = useMemo(
    () => ({
      onCellValueChanged: (event) => {
        // Handle cell value changes if needed
        setHasUnsavedChanges(true)
      },
      onGridReady: (event) => {
        // Grid is ready
      },
    }),
    []
  )

  // Convert general requirements to grid rows based on the image data
  const generalRequirementsData: GridRow[] = useMemo(() => {
    return [
      // Temporary Utilities Section
      {
        id: "section1",
        description: "Temporary Utilities",
        quantity: "",
        unit: "",
        unitCost: "",
        constCond: "",
        unitValue: "",
        generalReq: "",
        total: "",
        percentTime: "",
        remarks: "",
      },
      {
        id: "temp_electrical_service",
        description: "Temp. Electrical Service",
        quantity: 0,
        unit: "h",
        unitCost: null,
        constCond: null,
        unitValue: null,
        generalReq: null,
        total: null,
        percentTime: null,
        remarks: "by elect sub",
      },
      {
        id: "temp_electrical_const",
        description: "Temp. Electrical - Const. Phase",
        quantity: 0,
        unit: "mos",
        unitCost: null,
        constCond: null,
        unitValue: 8000,
        generalReq: null,
        total: null,
        percentTime: null,
        remarks: "In Hardcosts",
      },
      {
        id: "temp_electrical_operate",
        description: "Temp. Electrical - Operate Phase",
        quantity: 0,
        unit: "mos",
        unitCost: null,
        constCond: null,
        unitValue: 8000,
        generalReq: null,
        total: null,
        percentTime: null,
        remarks: "In Hardcosts",
      },
      {
        id: "temp_wiring_lighting",
        description: "Temp. Wiring & Lighting",
        quantity: 0,
        unit: "h",
        unitCost: null,
        constCond: null,
        unitValue: null,
        generalReq: null,
        total: null,
        percentTime: null,
        remarks: "by elect sub",
      },
      {
        id: "temp_water_service",
        description: "Temporary Water - Service",
        quantity: 0,
        unit: "h",
        unitCost: null,
        constCond: null,
        unitValue: null,
        generalReq: null,
        total: null,
        percentTime: null,
        remarks: "by plumb sub",
      },
      {
        id: "temp_water",
        description: "Temporary Water",
        quantity: 0,
        unit: "mos",
        unitCost: 1000,
        constCond: null,
        unitValue: null,
        generalReq: null,
        total: null,
        percentTime: null,
        remarks: "",
      },
      {
        id: "temp_toilets",
        description: "Temporary Toilets",
        quantity: 5,
        unit: "mos",
        unitCost: 1750,
        constCond: null,
        unitValue: null,
        generalReq: 8750,
        total: 8750,
        percentTime: null,
        remarks: "",
      },
      {
        id: "temp_toilets_setup",
        description: "Temporary Toilet Set Up / Removal",
        quantity: 7,
        unit: "ea",
        unitCost: 93,
        constCond: null,
        unitValue: null,
        generalReq: 651,
        total: 651,
        percentTime: null,
        remarks: "",
      },
      {
        id: "temp_washing_station",
        description: "Temporary Washing Station",
        quantity: 0,
        unit: "mos",
        unitCost: 407,
        constCond: null,
        unitValue: null,
        generalReq: null,
        total: null,
        percentTime: null,
        remarks: "",
      },
      {
        id: "temp_washing_setup",
        description: "Temporary Washing Station Set Up / Re",
        quantity: 0,
        unit: "ea",
        unitCost: 93,
        constCond: null,
        unitValue: null,
        generalReq: null,
        total: null,
        percentTime: null,
        remarks: "",
      },
      {
        id: "temp_holding_tanks",
        description: "Temporary Holding Tanks",
        quantity: 5,
        unit: "mos",
        unitCost: 750,
        constCond: null,
        unitValue: null,
        generalReq: 3750,
        total: 3750,
        percentTime: null,
        remarks: "",
      },
      {
        id: "temp_ventilation",
        description: "Temporary Ventilation",
        quantity: 0,
        unit: "h",
        unitCost: null,
        constCond: null,
        unitValue: null,
        generalReq: null,
        total: null,
        percentTime: null,
        remarks: "",
      },
      {
        id: "temp_cooling",
        description: "Temporary Cooling",
        quantity: 0,
        unit: "h",
        unitCost: null,
        constCond: null,
        unitValue: null,
        generalReq: null,
        total: null,
        percentTime: null,
        remarks: "",
      },
      {
        id: "temp_enclosures",
        description: "15000 Temporary Enclosures",
        quantity: 0,
        unit: "h",
        unitCost: null,
        constCond: null,
        unitValue: 5000,
        generalReq: null,
        total: null,
        percentTime: null,
        remarks: "",
      },
      {
        id: "temp_ladders",
        description: "Temporary Ladders",
        quantity: 0,
        unit: "h",
        unitCost: null,
        constCond: null,
        unitValue: null,
        generalReq: null,
        total: null,
        percentTime: null,
        remarks: "",
      },
      {
        id: "building_barricades",
        description: "15000 Building Barricades",
        quantity: 0,
        unit: "h",
        unitCost: null,
        constCond: null,
        unitValue: 5000,
        generalReq: null,
        total: null,
        percentTime: null,
        remarks: "",
      },
      {
        id: "site_barricades",
        description: "15000 Site Barricades",
        quantity: 0,
        unit: "h",
        unitCost: null,
        constCond: null,
        unitValue: 5000,
        generalReq: null,
        total: null,
        percentTime: null,
        remarks: "",
      },
      {
        id: "fire_protection",
        description: "Fire Protection",
        quantity: 5,
        unit: "mos",
        unitCost: 500,
        constCond: null,
        unitValue: null,
        generalReq: 2500,
        total: 2500,
        percentTime: null,
        remarks: "",
      },
      {
        id: "first_aid",
        description: "First Aid",
        quantity: 5,
        unit: "mos",
        unitCost: 50,
        constCond: null,
        unitValue: null,
        generalReq: 250,
        total: 250,
        percentTime: null,
        remarks: "",
      },
      {
        id: "drug_testing",
        description: "Drug Testing",
        quantity: 0,
        unit: "ea",
        unitCost: null,
        constCond: null,
        unitValue: null,
        generalReq: null,
        total: null,
        percentTime: null,
        remarks: "",
      },
      {
        id: "subtotal1",
        description: "Total",
        quantity: "",
        unit: "",
        unitCost: "",
        constCond: "",
        unitValue: "",
        generalReq: "",
        total: 76351,
        percentTime: "",
        remarks: "",
      },

      // Cleaning Section
      {
        id: "section2",
        description: "Cleaning",
        quantity: "",
        unit: "",
        unitCost: "",
        constCond: "",
        unitValue: "",
        generalReq: "",
        total: "",
        percentTime: "",
        remarks: "",
      },
      {
        id: "trash_removal_10yd",
        description: "Trash Removal - 10yd dumpsters",
        quantity: 0,
        unit: "wks",
        unitCost: 350,
        constCond: null,
        unitValue: null,
        generalReq: null,
        total: null,
        percentTime: null,
        remarks: "",
      },
      {
        id: "trash_removal_20yd",
        description: "Trash Removal - 20yd dumpsters",
        quantity: 0,
        unit: "wks",
        unitCost: 400,
        constCond: null,
        unitValue: null,
        generalReq: null,
        total: null,
        percentTime: null,
        remarks: "",
      },
      {
        id: "trash_removal_30yd",
        description: "Trash Removal - 30yd dumpsters",
        quantity: 0,
        unit: "wks",
        unitCost: 2500,
        constCond: null,
        unitValue: null,
        generalReq: null,
        total: null,
        percentTime: null,
        remarks: "",
      },
      {
        id: "trash_removal_offices",
        description: "Trash Removal - Field Offices",
        quantity: 0,
        unit: "wks",
        unitCost: null,
        constCond: null,
        unitValue: null,
        generalReq: null,
        total: null,
        percentTime: null,
        remarks: "",
      },
      {
        id: "general_building_cleaning",
        description: "17500 General Building Cleaning",
        quantity: 39,
        unit: "wks",
        unitCost: 520,
        constCond: null,
        unitValue: null,
        generalReq: 20354,
        total: 20354,
        percentTime: null,
        remarks: "In Hardcosts",
      },
      {
        id: "final_building_clean",
        description: "Final Building Clean",
        quantity: 0,
        unit: "#",
        unitCost: null,
        constCond: null,
        unitValue: null,
        generalReq: null,
        total: null,
        percentTime: null,
        remarks: "In Hardcosts",
      },
      {
        id: "subtotal2",
        description: "Total",
        quantity: "",
        unit: "",
        unitCost: "",
        constCond: "",
        unitValue: "",
        generalReq: "",
        total: 20354,
        percentTime: "",
        remarks: "",
      },

      // Services Section
      {
        id: "section3",
        description: "Services",
        quantity: "",
        unit: "",
        unitCost: "",
        constCond: "",
        unitValue: "",
        generalReq: "",
        total: "",
        percentTime: "",
        remarks: "",
      },
      {
        id: "cvp_schedule_setup",
        description: "13200 CVP Schedule - Set Up",
        quantity: 0,
        unit: "h",
        unitCost: null,
        constCond: null,
        unitValue: 10000,
        generalReq: null,
        total: null,
        percentTime: null,
        remarks: "Call Assaf Newmark (Spectrum Consulting) to confirm 404-819-4663",
      },
      {
        id: "cpm_schedule_updates_standard",
        description: "13200 CPM Schedule - Updates (Standard Rep)",
        quantity: 0,
        unit: "mos",
        unitCost: 1650,
        constCond: null,
        unitValue: null,
        generalReq: null,
        total: null,
        percentTime: null,
        remarks: "Call Assaf Newmark (Spectrum Consulting) to confirm 404-819-4664",
      },
      {
        id: "cpm_schedule_updates_bifurcated",
        description: "13200 CPM Schedule - Updates (Bifurcated Re)",
        quantity: 0,
        unit: "mos",
        unitCost: 300,
        constCond: null,
        unitValue: null,
        generalReq: null,
        total: null,
        percentTime: null,
        remarks: "Call Assaf Newmark (Spectrum Consulting) to confirm 404-819-4665",
      },
      {
        id: "progress_photos_ground",
        description: "13233 Progress Photos Bldg - Ground",
        quantity: 5,
        unit: "mos",
        unitCost: 50,
        constCond: null,
        unitValue: null,
        generalReq: 250,
        total: 250,
        percentTime: null,
        remarks: "",
      },
      {
        id: "progress_photos_aerial",
        description: "13233 Progress Photos Bldg - Aerial",
        quantity: 5,
        unit: "mos",
        unitCost: 100,
        constCond: null,
        unitValue: null,
        generalReq: 500,
        total: 500,
        percentTime: null,
        remarks: "",
      },
      {
        id: "video_existing_conditions",
        description: "13233 Video - Existing Conditions",
        quantity: 0,
        unit: "h",
        unitCost: 2500,
        constCond: null,
        unitValue: null,
        generalReq: null,
        total: null,
        percentTime: null,
        remarks: "",
      },
      {
        id: "video_owner_demo",
        description: "13233 Video - Owner O&M Demo",
        quantity: 0,
        unit: "h",
        unitCost: 500,
        constCond: null,
        unitValue: null,
        generalReq: null,
        total: null,
        percentTime: null,
        remarks: "",
      },
      {
        id: "legal",
        description: "Legal",
        quantity: 0,
        unit: "h",
        unitCost: null,
        constCond: null,
        unitValue: null,
        generalReq: null,
        total: null,
        percentTime: null,
        remarks: "",
      },
      {
        id: "subtotal3",
        description: "Total",
        quantity: "",
        unit: "",
        unitCost: "",
        constCond: "",
        unitValue: "",
        generalReq: "",
        total: 10750,
        percentTime: "",
        remarks: "",
      },

      // Drawings Section
      {
        id: "section4",
        description: "Drawings",
        quantity: "",
        unit: "",
        unitCost: "",
        constCond: "",
        unitValue: "",
        generalReq: "",
        total: "",
        percentTime: "",
        remarks: "",
      },
      {
        id: "as_built_survey",
        description: "As Built Survey",
        quantity: 0,
        unit: "h",
        unitCost: 1000,
        constCond: null,
        unitValue: null,
        generalReq: null,
        total: null,
        percentTime: null,
        remarks: "",
      },
      {
        id: "as_built_drawings",
        description: "10550 As Built Drawings",
        quantity: 0,
        unit: "h",
        unitCost: 500,
        constCond: null,
        unitValue: null,
        generalReq: null,
        total: null,
        percentTime: null,
        remarks: "",
      },
      {
        id: "plan_copy_expense",
        description: "Plan/Copy Expense",
        quantity: 1,
        unit: "h",
        unitCost: null,
        constCond: null,
        unitValue: null,
        generalReq: null,
        total: 10000,
        percentTime: null,
        remarks: "",
      },
      {
        id: "postage_usps",
        description: "Postage - USPS",
        quantity: 5,
        unit: "mos",
        unitCost: null,
        constCond: null,
        unitValue: null,
        generalReq: null,
        total: 375,
        percentTime: null,
        remarks: "",
      },
      {
        id: "postage_fedex",
        description: "Postage - Fed-X",
        quantity: 5,
        unit: "mos",
        unitCost: null,
        constCond: null,
        unitValue: null,
        generalReq: null,
        total: 375,
        percentTime: null,
        remarks: "",
      },
      {
        id: "subtotal4",
        description: "Total",
        quantity: "",
        unit: "",
        unitCost: "",
        constCond: "",
        unitValue: "",
        generalReq: "",
        total: 10000,
        percentTime: "",
        remarks: "",
      },

      // Testing Section
      {
        id: "section5",
        description: "Testing",
        quantity: "",
        unit: "",
        unitCost: "",
        constCond: "",
        unitValue: "",
        generalReq: "",
        total: "",
        percentTime: "",
        remarks: "",
      },
      {
        id: "concrete_testing",
        description: "Concrete Testing",
        quantity: 0,
        unit: "h",
        unitCost: null,
        constCond: null,
        unitValue: null,
        generalReq: null,
        total: null,
        percentTime: null,
        remarks: "by owner",
      },
      {
        id: "steel_testing",
        description: "Steel Testing",
        quantity: 0,
        unit: "ea",
        unitCost: null,
        constCond: null,
        unitValue: null,
        generalReq: null,
        total: null,
        percentTime: null,
        remarks: "by owner",
      },
      {
        id: "special_inspectors",
        description: "Special Inspectors",
        quantity: 0,
        unit: "h",
        unitCost: null,
        constCond: null,
        unitValue: null,
        generalReq: null,
        total: null,
        percentTime: null,
        remarks: "by owner",
      },
      {
        id: "subtotal5",
        description: "Total",
        quantity: "",
        unit: "",
        unitCost: "",
        constCond: "",
        unitValue: "",
        generalReq: "",
        total: 5500,
        percentTime: "",
        remarks: "",
      },

      // Permits Section
      {
        id: "section6",
        description: "Permits",
        quantity: "",
        unit: "",
        unitCost: "",
        constCond: "",
        unitValue: "",
        generalReq: "",
        total: "",
        percentTime: "",
        remarks: "",
      },
      {
        id: "building_permits",
        description: "Building Permits",
        quantity: 5,
        unit: "h",
        unitCost: 1000.0,
        constCond: null,
        unitValue: null,
        generalReq: 5000,
        total: 5000,
        percentTime: null,
        remarks: "Sub Trades Only",
      },
      {
        id: "impact_fees",
        description: "Impact Fees",
        quantity: 0,
        unit: "h",
        unitCost: null,
        constCond: null,
        unitValue: null,
        generalReq: null,
        total: null,
        percentTime: null,
        remarks: "by owner",
      },
      {
        id: "trailer_permits",
        description: "Trailer Permits",
        quantity: 1,
        unit: "ea",
        unitCost: 500.0,
        constCond: null,
        unitValue: null,
        generalReq: 500,
        total: 500,
        percentTime: null,
        remarks: "",
      },
      {
        id: "off_site_permits",
        description: "Off Site Permits",
        quantity: 0,
        unit: "h",
        unitCost: null,
        constCond: null,
        unitValue: null,
        generalReq: null,
        total: null,
        percentTime: null,
        remarks: "by owner",
      },
      {
        id: "subtotal6",
        description: "Total",
        quantity: "",
        unit: "",
        unitCost: "",
        constCond: "",
        unitValue: "",
        generalReq: "",
        total: 19250,
        percentTime: "",
        remarks: "",
      },

      // Travel Section
      {
        id: "section7",
        description: "Travel",
        quantity: "",
        unit: "",
        unitCost: "",
        constCond: "",
        unitValue: "",
        generalReq: "",
        total: "",
        percentTime: "",
        remarks: "",
      },
      {
        id: "airfare",
        description: "Airfare",
        quantity: 5,
        unit: "mos",
        unitCost: 2000,
        constCond: null,
        unitValue: null,
        generalReq: 10000,
        total: 10000,
        percentTime: null,
        remarks: "",
      },
      {
        id: "hotel",
        description: "Hotel",
        quantity: 5,
        unit: "mos",
        unitCost: 1000,
        constCond: null,
        unitValue: null,
        generalReq: 5000,
        total: 5000,
        percentTime: null,
        remarks: "",
      },
      {
        id: "per_diem",
        description: "Per Diem",
        quantity: 5,
        unit: "mos",
        unitCost: 850,
        constCond: null,
        unitValue: null,
        generalReq: 4250,
        total: 4250,
        percentTime: null,
        remarks: "",
      },
      {
        id: "cars",
        description: "Cars",
        quantity: 0,
        unit: "mos",
        unitCost: null,
        constCond: null,
        unitValue: null,
        generalReq: null,
        total: null,
        percentTime: null,
        remarks: "",
      },
      {
        id: "subtotal7",
        description: "Total",
        quantity: "",
        unit: "",
        unitCost: "",
        constCond: "",
        unitValue: "",
        generalReq: "",
        total: 19250,
        percentTime: "",
        remarks: "",
      },

      // Other Section
      {
        id: "section8",
        description: "Other",
        quantity: "",
        unit: "",
        unitCost: "",
        constCond: "",
        unitValue: "",
        generalReq: "",
        total: "",
        percentTime: "",
        remarks: "",
      },
      {
        id: "project_sign",
        description: "Project Sign",
        quantity: 5,
        unit: "ea",
        unitCost: 1500,
        constCond: null,
        unitValue: null,
        generalReq: 7500,
        total: 7500,
        percentTime: null,
        remarks: "",
      },
      {
        id: "temporary_parking",
        description: "Temporary Parking",
        quantity: 0,
        unit: "h",
        unitCost: null,
        constCond: null,
        unitValue: null,
        generalReq: null,
        total: null,
        percentTime: null,
        remarks: "",
      },
      {
        id: "legal_notices",
        description: "Legal Notices",
        quantity: 0,
        unit: "ea",
        unitCost: null,
        constCond: null,
        unitValue: null,
        generalReq: null,
        total: null,
        percentTime: null,
        remarks: "",
      },
      {
        id: "subtotal8",
        description: "Total",
        quantity: "",
        unit: "",
        unitCost: "",
        constCond: "",
        unitValue: "",
        generalReq: "",
        total: 7500,
        percentTime: "",
        remarks: "",
      },

      // Overall Total
      {
        id: "grand_total",
        description: "Total",
        quantity: "361,970",
        unit: "#",
        unitCost: 1316994,
        constCond: "",
        unitValue: 129705,
        generalReq: 951450,
        total: "",
        percentTime: "",
        remarks: "",
      },
    ]
  }, [])

  // Conditional KPI cards based on active tab
  const renderKPICards = () => {
    const projectMonths = 9.75 // Demo project duration in months

    switch (activeTab) {
      case "categories":
        return (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-blue-700 dark:text-blue-300">Total Estimate</CardTitle>
                <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {formatCurrency(calculations.total)}
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  {formatCurrency(calculations.total / projectMonths)} per month
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  {calculations.markupPercentage.toFixed(1)}% markup
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-green-700 dark:text-green-300">Buyout Savings</CardTitle>
                <TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {formatCurrency(calculations.totalBuyoutSavings)}
                </div>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {formatCurrency(calculations.totalBuyoutSavings / projectMonths)} per month
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">Negotiated savings</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-orange-700 dark:text-orange-300">Categories</CardTitle>
                <Building2 className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{costCategories.length}</div>
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  {(costCategories.length / projectMonths).toFixed(1)} per month
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400">Cost categories</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-purple-700 dark:text-purple-300">Approval</CardTitle>
                <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {calculations.approvalProgress.toFixed(0)}%
                </div>
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  {(calculations.approvalProgress / projectMonths).toFixed(1)}% per month
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400">Complete</p>
              </CardContent>
            </Card>
          </div>
        )

      case "conditions":
        return (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-blue-700 dark:text-blue-300">GC Total</CardTitle>
                <Calculator className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {formatCurrency(calculations.gcTotal)}
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  {formatCurrency(calculations.gcTotal / projectMonths)} per month
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">General Conditions</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-green-700 dark:text-green-300">Field Labor</CardTitle>
                <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {formatCurrency(calculations.gcTotal * 0.6)}
                </div>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {formatCurrency((calculations.gcTotal * 0.6) / projectMonths)} per month
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">Construction & Close Out</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-orange-700 dark:text-orange-300">Field Office</CardTitle>
                <Building2 className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {formatCurrency(calculations.gcTotal * 0.25)}
                </div>
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  {formatCurrency((calculations.gcTotal * 0.25) / projectMonths)} per month
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400">Setup & Equipment</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-purple-700 dark:text-purple-300">Utilities</CardTitle>
                <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {formatCurrency(calculations.gcTotal * 0.15)}
                </div>
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  {formatCurrency((calculations.gcTotal * 0.15) / projectMonths)} per month
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400">Temporary Services</p>
              </CardContent>
            </Card>
          </div>
        )

      case "requirements":
        return (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-blue-700 dark:text-blue-300">GR Total</CardTitle>
                <Calculator className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {formatCurrency(calculations.grTotal)}
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  {formatCurrency(calculations.grTotal / projectMonths)} per month
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">General Requirements</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-green-700 dark:text-green-300">Project Mgmt</CardTitle>
                <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {formatCurrency(calculations.grTotal * 0.4)}
                </div>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {formatCurrency((calculations.grTotal * 0.4) / projectMonths)} per month
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">Management & Admin</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-orange-700 dark:text-orange-300">
                  Quality & Safety
                </CardTitle>
                <Shield className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {formatCurrency(calculations.grTotal * 0.3)}
                </div>
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  {formatCurrency((calculations.grTotal * 0.3) / projectMonths)} per month
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400">QC & Safety Programs</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-purple-700 dark:text-purple-300">
                  Testing & Cleanup
                </CardTitle>
                <TestTube className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {formatCurrency(calculations.grTotal * 0.3)}
                </div>
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  {formatCurrency((calculations.grTotal * 0.3) / projectMonths)} per month
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400">Testing & Demobilization</p>
              </CardContent>
            </Card>
          </div>
        )

      case "summary":
        return (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-blue-700 dark:text-blue-300">Total Bid</CardTitle>
                <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {formatCurrency(calculations.total)}
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  {formatCurrency(calculations.total / projectMonths)} per month
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">Final estimate</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-green-700 dark:text-green-300">Base Cost</CardTitle>
                <Calculator className="h-4 w-4 text-green-600 dark:text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {formatCurrency(calculations.baseTotal)}
                </div>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {formatCurrency(calculations.baseTotal / projectMonths)} per month
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">Before markup</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-orange-700 dark:text-orange-300">Markup</CardTitle>
                <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {formatCurrency(calculations.overhead + calculations.profit + calculations.contingency)}
                </div>
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  {formatCurrency(
                    (calculations.overhead + calculations.profit + calculations.contingency) / projectMonths
                  )}{" "}
                  per month
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400">OH + Profit + Contingency</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-purple-700 dark:text-purple-300">Approval</CardTitle>
                <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {calculations.approvalProgress.toFixed(0)}%
                </div>
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  {(calculations.approvalProgress / projectMonths).toFixed(1)}% per month
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400">Complete</p>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div
      ref={containerRef}
      className={`space-y-6 transition-all duration-200 ${
        isSticky
          ? `sticky top-0 z-20 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-lg`
          : ""
      }`}
      style={{
        top: isSticky ? `${pageHeaderHeight}px` : "auto",
      }}
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Calculator className="h-6 w-6 text-blue-600" />
            Cost Summary - {projectName}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Selected bid costs and project estimate compilation</p>
        </div>

        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <Alert className="w-auto py-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">Unsaved changes</AlertDescription>
            </Alert>
          )}

          <Button onClick={handleSave} disabled={!hasUnsavedChanges} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>

          <Button
            variant="outline"
            onClick={() => handleExport("pdf")}
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            {isExporting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Export PDF
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="py-4 -mx-6 px-6">{renderKPICards()}</div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categories">Cost Summary Detail</TabsTrigger>
          <TabsTrigger value="conditions">General Conditions</TabsTrigger>
          <TabsTrigger value="requirements">General Requirements</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Selected Bid Costs
                  </CardTitle>
                  <CardDescription>Editable cost categories with buyout savings and adjustments</CardDescription>
                </div>
                <Button
                  onClick={addCostCategory}
                  className="flex items-center gap-2"
                  style={{ backgroundColor: "rgb(250, 70, 22)", color: "#fff" }}
                >
                  <Plus className="h-4 w-4" />
                  Add Category
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ProtectedGrid
                columnDefs={costCategoryColumns}
                rowData={gridRowData}
                config={gridConfig}
                events={gridEvents}
                title="Cost Categories"
                height="600px"
                enableSearch={true}
                totalsCalculator={customTotalsCalculator} // Use the custom totals calculator
                className="w-full"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conditions" className="space-y-6">
          <GridSection title="Field Labor – Construction" data={gcFieldLaborConstruction} type="conditions" />
          <GridSection title="Field Labor – Close Out" data={gcFieldLaborCloseOut} type="conditions" />
          <GridSection title="Field Office – Contractor" data={gcFieldOfficeContractor} type="conditions" />
          <GridSection title="Temporary Utilities" data={gcTemporaryUtilities} type="conditions" />
        </TabsContent>

        <TabsContent value="requirements" className="space-y-6">
          <GridSection title="Temporary Utilities" data={grTemporaryUtilities} type="requirements" />
          <GridSection title="Cleaning" data={grCleaning} type="requirements" />
          <GridSection title="Services" data={grServices} type="requirements" />
          <GridSection title="Drawings" data={grDrawings} type="requirements" />
          <GridSection title="Testing" data={grTesting} type="requirements" />
          <GridSection title="Permits" data={grPermits} type="requirements" />
          <GridSection title="Travel" data={grTravel} type="requirements" />
          <GridSection title="Other" data={grOther} type="requirements" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
