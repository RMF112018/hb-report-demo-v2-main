"use client"

import React, { useState, useCallback, useEffect, useMemo } from "react"
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

// Types for Cost Summary
export interface CostCategory {
  id: string
  category: string
  description: string
  csiCode?: string
  selectedBidAmount: number
  originalBidAmount: number
  buyoutSavings: number
  adjustments: number
  finalAmount: number
  status: "pending" | "selected" | "committed" | "approved"
  bidder?: string
  notes?: string
  lastModified: string
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

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "selected":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "committed":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800"
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
        <span className="text-sm font-medium">{formatCurrency(value)}</span>
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
    [onExport, toast]
  )

  // Create column definitions for the ProtectedGrid
  const costCategoryColumns: ProtectedColDef[] = useMemo(
    () => [
      createProtectedColumn(
        "category",
        "Category",
        { level: "none" },
        {
          width: 150,
          cellRenderer: (params: any) => {
            return (
              <div
                className="font-medium cursor-pointer hover:bg-muted/50 rounded px-2 py-1 group"
                onClick={() => {
                  const newValue = prompt("Enter category name:", params.value)
                  if (newValue) updateCostCategory(params.data.id, "category", newValue)
                }}
              >
                {params.value}
                <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity inline ml-1" />
              </div>
            )
          },
        }
      ),
      createProtectedColumn(
        "description",
        "Description",
        { level: "none" },
        {
          width: 200,
          cellRenderer: (params: any) => {
            return (
              <div
                className="cursor-pointer hover:bg-muted/50 rounded px-2 py-1 group"
                onClick={() => {
                  const newValue = prompt("Enter description:", params.value || "")
                  if (newValue !== null) updateCostCategory(params.data.id, "description", newValue)
                }}
              >
                {params.value || "Click to add description"}
                <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity inline ml-1" />
              </div>
            )
          },
        }
      ),
      createProtectedColumn(
        "csiCode",
        "CSI Code",
        { level: "none" },
        {
          width: 100,
          cellRenderer: (params: any) => {
            return (
              <div
                className="cursor-pointer hover:bg-muted/50 rounded px-2 py-1 group"
                onClick={() => {
                  const newValue = prompt("Enter CSI code:", params.value || "")
                  if (newValue !== null) updateCostCategory(params.data.id, "csiCode", newValue)
                }}
              >
                {params.value || "N/A"}
                <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity inline ml-1" />
              </div>
            )
          },
        }
      ),
      createProtectedColumn(
        "originalBidAmount",
        "Original Bid",
        { level: "none" },
        {
          width: 130,
          type: "numericColumn",
          valueFormatter: (params: any) => formatCurrency(params.value),
          cellRenderer: (params: any) => (
            <InlineEdit
              value={params.value}
              onSave={(value) => updateCostCategory(params.data.id, "originalBidAmount", value)}
            />
          ),
        }
      ),
      createProtectedColumn(
        "selectedBidAmount",
        "Selected Bid",
        { level: "none" },
        {
          width: 130,
          type: "numericColumn",
          valueFormatter: (params: any) => formatCurrency(params.value),
          cellRenderer: (params: any) => (
            <InlineEdit
              value={params.value}
              onSave={(value) => updateCostCategory(params.data.id, "selectedBidAmount", value)}
            />
          ),
        }
      ),
      createProtectedColumn(
        "buyoutSavings",
        "Buyout Savings",
        { level: "none" },
        {
          width: 130,
          type: "numericColumn",
          valueFormatter: (params: any) => formatCurrency(params.value),
          cellRenderer: (params: any) => (
            <InlineEdit
              value={params.value}
              onSave={(value) => updateCostCategory(params.data.id, "buyoutSavings", value)}
              className="text-green-600"
            />
          ),
        }
      ),
      createProtectedColumn(
        "adjustments",
        "Adjustments",
        { level: "none" },
        {
          width: 130,
          type: "numericColumn",
          valueFormatter: (params: any) => formatCurrency(params.value),
          cellRenderer: (params: any) => (
            <InlineEdit
              value={params.value}
              onSave={(value) => updateCostCategory(params.data.id, "adjustments", value)}
            />
          ),
        }
      ),
      createReadOnlyColumn("finalAmount", "Final Amount", {
        width: 130,
        type: "numericColumn",
        valueFormatter: (params: any) => formatCurrency(params.value),
        cellStyle: { fontWeight: "bold", color: "var(--blue-900)" },
      }),
      createProtectedColumn(
        "status",
        "Status",
        { level: "none" },
        {
          width: 120,
          cellRenderer: (params: any) => (
            <Select value={params.value} onValueChange={(value) => updateCostCategory(params.data.id, "status", value)}>
              <SelectTrigger className="w-full h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="selected">Selected</SelectItem>
                <SelectItem value="committed">Committed</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
              </SelectContent>
            </Select>
          ),
        }
      ),
      createProtectedColumn(
        "bidder",
        "Bidder",
        { level: "none" },
        {
          width: 150,
          cellRenderer: (params: any) => (
            <div
              className="cursor-pointer hover:bg-muted/50 rounded px-2 py-1 group text-xs"
              onClick={() => {
                const newValue = prompt("Enter bidder name:", params.value || "")
                if (newValue !== null) updateCostCategory(params.data.id, "bidder", newValue)
              }}
            >
              {params.value || "TBD"}
              <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity inline ml-1" />
            </div>
          ),
        }
      ),
      createProtectedColumn(
        "actions",
        "Actions",
        { level: "none" },
        {
          width: 80,
          cellRenderer: (params: any) => (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeCostCategory(params.data.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          ),
        }
      ),
    ],
    [updateCostCategory, removeCostCategory]
  )

  // Grid configuration
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
      }),
    []
  )

  // Grid events
  const gridEvents: GridEvents = useMemo(
    () => ({
      onCellValueChanged: (event) => {
        // Handle cell value changes if needed
      },
      onGridReady: (event) => {
        // Grid is ready
      },
    }),
    []
  )

  // Convert cost categories to grid rows
  const gridRowData: GridRow[] = useMemo(() => {
    return costCategories.map((category) => ({
      id: category.id,
      category: category.category,
      description: category.description,
      csiCode: category.csiCode || "",
      originalBidAmount: category.originalBidAmount,
      selectedBidAmount: category.selectedBidAmount,
      buyoutSavings: category.buyoutSavings,
      adjustments: category.adjustments,
      finalAmount: category.finalAmount,
      status: category.status,
      bidder: category.bidder || "",
      actions: "",
    }))
  }, [costCategories])

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
          cellRenderer: (params: any) => <div className="font-medium">{params.value}</div>,
        }
      ),
      createProtectedColumn(
        "quantity",
        "Qty.",
        { level: "none" },
        {
          width: 80,
          type: "numericColumn",
          valueFormatter: (params: any) => params.value,
        }
      ),
      createProtectedColumn(
        "unit",
        "U",
        { level: "none" },
        {
          width: 60,
          cellRenderer: (params: any) => <div className="text-center">{params.value}</div>,
        }
      ),
      createProtectedColumn(
        "unitCost",
        "Unit Cost",
        { level: "none" },
        {
          width: 120,
          type: "numericColumn",
          valueFormatter: (params: any) => formatCurrency(params.value),
        }
      ),
      createProtectedColumn(
        "constCost",
        "Const. Cost",
        { level: "none" },
        {
          width: 130,
          type: "numericColumn",
          valueFormatter: (params: any) => formatCurrency(params.value),
        }
      ),
      createProtectedColumn(
        "generalReq",
        "General Req.",
        { level: "none" },
        {
          width: 120,
          type: "numericColumn",
          valueFormatter: (params: any) => (params.value ? formatCurrency(params.value) : ""),
        }
      ),
      createProtectedColumn(
        "total",
        "Total",
        { level: "none" },
        {
          width: 130,
          type: "numericColumn",
          valueFormatter: (params: any) => formatCurrency(params.value),
          cellStyle: { fontWeight: "bold" },
        }
      ),
      createProtectedColumn(
        "percentTime",
        "% Time",
        { level: "none" },
        {
          width: 80,
          type: "numericColumn",
          valueFormatter: (params: any) => (params.value ? `${params.value}%` : ""),
        }
      ),
      createProtectedColumn(
        "remarks",
        "Remarks",
        { level: "none" },
        {
          width: 200,
          cellRenderer: (params: any) => <div className="text-sm text-muted-foreground">{params.value}</div>,
        }
      ),
      createProtectedColumn(
        "customizedLaborRates",
        "CUSTOMIZED LABOR RATES",
        { level: "none" },
        {
          width: 180,
          type: "numericColumn",
          valueFormatter: (params: any) => formatCurrency(params.value),
          cellStyle: { backgroundColor: "var(--blue-50)", fontWeight: "bold" },
        }
      ),
      createProtectedColumn(
        "laborFY2025",
        "LABOR FY 2025 *Updated 09.26.24",
        { level: "none" },
        {
          width: 220,
          type: "numericColumn",
          valueFormatter: (params: any) => formatCurrency(params.value),
          cellStyle: { backgroundColor: "var(--blue-50)", fontWeight: "bold" },
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
      }),
    []
  )

  // Grid events for General Conditions
  const generalConditionsGridEvents: GridEvents = useMemo(
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

  // Create column definitions for the General Requirements ProtectedGrid
  const generalRequirementsColumns: ProtectedColDef[] = useMemo(
    () => [
      createProtectedColumn(
        "description",
        "Description",
        { level: "none" },
        {
          width: 250,
          pinned: "left",
          cellRenderer: (params: any) => <div className="font-medium">{params.value}</div>,
        }
      ),
      createProtectedColumn(
        "quantity",
        "Qty.",
        { level: "none" },
        {
          width: 80,
          type: "numericColumn",
          valueFormatter: (params: any) => params.value || "",
        }
      ),
      createProtectedColumn(
        "unit",
        "U",
        { level: "none" },
        {
          width: 60,
          cellRenderer: (params: any) => <div className="text-center">{params.value || ""}</div>,
        }
      ),
      createProtectedColumn(
        "unitCost",
        "Unit Cost",
        { level: "none" },
        {
          width: 120,
          type: "numericColumn",
          valueFormatter: (params: any) => (params.value ? formatCurrency(params.value) : "-"),
        }
      ),
      createProtectedColumn(
        "constCond",
        "Const. Cond.",
        { level: "none" },
        {
          width: 120,
          type: "numericColumn",
          valueFormatter: (params: any) => (params.value ? formatCurrency(params.value) : "-"),
        }
      ),
      createProtectedColumn(
        "unitValue",
        "Unit",
        { level: "none" },
        {
          width: 120,
          type: "numericColumn",
          valueFormatter: (params: any) => (params.value ? formatCurrency(params.value) : "-"),
        }
      ),
      createProtectedColumn(
        "generalReq",
        "General Req",
        { level: "none" },
        {
          width: 130,
          type: "numericColumn",
          valueFormatter: (params: any) => (params.value ? formatCurrency(params.value) : "-"),
        }
      ),
      createProtectedColumn(
        "total",
        "Total",
        { level: "none" },
        {
          width: 130,
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
          width: 80,
          type: "numericColumn",
          valueFormatter: (params: any) => (params.value ? `${params.value}%` : "-"),
        }
      ),
      createProtectedColumn(
        "remarks",
        "Remarks",
        { level: "none" },
        {
          width: 300,
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

  return (
    <div className="space-y-6">
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

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Estimate</CardTitle>
            <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {formatCurrency(calculations.total)}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              {calculations.markupPercentage.toFixed(1)}% markup
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Buyout Savings</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {formatCurrency(calculations.totalBuyoutSavings)}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">Negotiated savings</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Categories</CardTitle>
            <Building2 className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{costCategories.length}</div>
            <p className="text-xs text-orange-600 dark:text-orange-400">Cost categories</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Approval</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {calculations.approvalProgress.toFixed(0)}%
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">Complete</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="categories">Cost Categories</TabsTrigger>
          <TabsTrigger value="conditions">General Conditions</TabsTrigger>
          <TabsTrigger value="requirements">General Requirements</TabsTrigger>
          <TabsTrigger value="summary">Final Summary</TabsTrigger>
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
                <Button onClick={addCostCategory} className="flex items-center gap-2">
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
                totalsCalculator={defaultTotalsCalculator}
                className="w-full"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conditions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-green-600" />
                General Conditions
              </CardTitle>
              <CardDescription>Project management and site-related costs</CardDescription>
            </CardHeader>
            <CardContent>
              <ProtectedGrid
                columnDefs={generalConditionsColumns}
                rowData={generalConditionsData}
                config={generalConditionsGridConfig}
                events={generalConditionsGridEvents}
                title="General Conditions Cost Breakdown"
                height="600px"
                enableSearch={true}
                totalsCalculator={defaultTotalsCalculator}
                className="w-full"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-600" />
                General Requirements
              </CardTitle>
              <CardDescription>Administrative and operational requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <ProtectedGrid
                columnDefs={generalRequirementsColumns}
                rowData={generalRequirementsData}
                config={generalRequirementsGridConfig}
                events={generalRequirementsGridEvents}
                title="General Requirements Cost Breakdown"
                height="600px"
                enableSearch={true}
                totalsCalculator={defaultTotalsCalculator}
                className="w-full"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Final Cost Summary */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                  <Calculator className="h-5 w-5" />
                  Final Cost Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Direct Costs:</span>
                    <span className="font-semibold">{formatCurrency(calculations.subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>General Conditions:</span>
                    <span className="font-semibold">{formatCurrency(calculations.gcTotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>General Requirements:</span>
                    <span className="font-semibold">{formatCurrency(calculations.grTotal)}</span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-2">
                    <span className="font-medium">Subtotal:</span>
                    <span className="font-semibold">{formatCurrency(calculations.baseTotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Overhead (8%):</span>
                    <span className="font-semibold">{formatCurrency(calculations.overhead)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Profit (10%):</span>
                    <span className="font-semibold">{formatCurrency(calculations.profit)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Contingency (5%):</span>
                    <span className="font-semibold">{formatCurrency(calculations.contingency)}</span>
                  </div>
                  <div className="flex items-center justify-between border-t-2 pt-3 text-lg">
                    <span className="font-bold text-blue-800 dark:text-blue-200">Total Bid:</span>
                    <span className="font-bold text-2xl text-blue-900 dark:text-blue-100">
                      {formatCurrency(calculations.total)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Approval Workflow */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Approval Workflow
                </CardTitle>
                <CardDescription>Review and approval status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {approvalSteps.map((step) => (
                    <div key={step.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{step.title}</div>
                        <div className="text-sm text-muted-foreground">{step.description}</div>
                        <div className="text-xs text-muted-foreground mt-1">Approver: {step.approver}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            step.status === "complete"
                              ? "bg-green-100 text-green-800"
                              : step.status === "skipped"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {step.status === "complete" ? "Approved" : step.status === "skipped" ? "Rejected" : "Pending"}
                        </Badge>
                        {step.status === "pending" && (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              onClick={() => handleApprovalStep(step.id, "approve")}
                              className="h-7 w-7 p-0 bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleApprovalStep(step.id, "reject")}
                              className="h-7 w-7 p-0"
                            >
                              ✕
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Approval Progress:</span>
                    <span className="font-medium">{calculations.approvalProgress.toFixed(0)}%</span>
                  </div>
                  <Progress value={calculations.approvalProgress} className="h-2" />
                </div>

                {calculations.approvalProgress === 100 && (
                  <Button
                    className="w-full mt-4"
                    onClick={() => {
                      if (onSubmit) {
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
                          approvalStatus: "approved",
                          approvalProgress: calculations.approvalProgress,
                          lastModified: new Date().toISOString(),
                        }
                        onSubmit(costSummaryData)
                      }
                    }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Submit for Client Review
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
