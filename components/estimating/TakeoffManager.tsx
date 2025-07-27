"use client"

import React, { useState, useCallback, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import {
  Ruler,
  Calculator,
  Building2,
  Layers,
  Save,
  Download,
  Plus,
  Trash2,
  Edit3,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Target,
  BarChart3,
  PieChart,
  Home,
  MapPin,
  FileText,
  Eye,
  Settings,
  DollarSign,
} from "lucide-react"
import type { TakeoffItem, TakeoffType } from "@/types/estimating"
import DrawingViewer from "@/components/estimating/DrawingViewer"
import AssemblyLibrary from "@/components/estimating/AssemblyLibrary"
import CostDatabase from "@/components/estimating/CostDatabase"

const TABS = [
  { key: "drawings", label: "Drawing Viewer" },
  { key: "takeoff", label: "Takeoff Tools" },
  { key: "assemblies", label: "Assemblies" },
  { key: "pricing", label: "Cost Database" },
  { key: "summary", label: "Summary" },
]

interface TakeoffManagerProps {
  projectId: string
  projectName: string
  onSave?: (data: any) => void
  onExport?: (format: "pdf" | "csv") => void
}

export default function TakeoffManager({ projectId, projectName, onSave, onExport }: TakeoffManagerProps) {
  const { toast } = useToast()

  // State management
  const [activeTab, setActiveTab] = useState("takeoff")
  const [takeoffItems, setTakeoffItems] = useState<TakeoffItem[]>([])
  const [adding, setAdding] = useState(false)
  const [newItem, setNewItem] = useState<Partial<TakeoffItem>>({
    takeoffType: "area",
    measurements: {},
    unitCost: 0,
    totalCost: 0,
    laborHours: 0,
    laborRate: 0,
    materialCost: 0,
    equipmentCost: 0,
    subcontractorCost: 0,
    markup: 0,
    status: "draft",
  })
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // Add state for measurements from drawing viewer
  const [drawingMeasurements, setDrawingMeasurements] = useState<any[]>([])

  // Initialize with sample data
  useEffect(() => {
    const sampleItems: TakeoffItem[] = [
      {
        id: "1",
        csiCode: "03 20 00",
        csiDivision: "03 - Concrete",
        description: "Concrete Foundation",
        takeoffType: "volume",
        measurements: { volume: 150, length: 50, width: 30, height: 0.1 },
        unitOfMeasure: "CY",
        unitCost: 125,
        totalCost: 18750,
        laborHours: 80,
        laborRate: 45,
        materialCost: 15000,
        equipmentCost: 2500,
        subcontractorCost: 0,
        markup: 15,
        location: "Foundation",
        floor: "Basement",
        phase: "Foundation",
        status: "draft",
        lastModified: new Date().toISOString(),
      },
      {
        id: "2",
        csiCode: "04 20 00",
        csiDivision: "04 - Masonry",
        description: "CMU Walls",
        takeoffType: "area",
        measurements: { area: 2500, length: 100, height: 25 },
        unitOfMeasure: "SF",
        unitCost: 8.5,
        totalCost: 21250,
        laborHours: 120,
        laborRate: 42,
        materialCost: 18000,
        equipmentCost: 2000,
        subcontractorCost: 0,
        markup: 12,
        location: "Exterior Walls",
        floor: "Level 1",
        phase: "Shell",
        status: "reviewed",
        lastModified: new Date().toISOString(),
      },
      {
        id: "3",
        csiCode: "06 10 00",
        csiDivision: "06 - Wood and Plastics",
        description: "Wood Framing",
        takeoffType: "area",
        measurements: { area: 3200, length: 80, width: 40 },
        unitOfMeasure: "SF",
        unitCost: 12.75,
        totalCost: 40800,
        laborHours: 200,
        laborRate: 38,
        materialCost: 32000,
        equipmentCost: 3000,
        subcontractorCost: 0,
        markup: 18,
        location: "Interior Structure",
        floor: "Level 2",
        phase: "Interior",
        status: "approved",
        lastModified: new Date().toISOString(),
      },
    ]
    setTakeoffItems(sampleItems)
  }, [])

  // Calculate totals
  const calculations = useMemo(() => {
    const totalCost = takeoffItems.reduce((sum, item) => sum + item.totalCost, 0)
    const totalLaborHours = takeoffItems.reduce((sum, item) => sum + item.laborHours, 0)
    const totalMaterialCost = takeoffItems.reduce((sum, item) => sum + item.materialCost, 0)
    const totalEquipmentCost = takeoffItems.reduce((sum, item) => sum + item.equipmentCost, 0)

    // Group by CSI division
    const divisionBreakdown = takeoffItems.reduce((acc, item) => {
      if (!acc[item.csiDivision]) {
        acc[item.csiDivision] = { cost: 0, count: 0, items: [] }
      }
      acc[item.csiDivision].cost += item.totalCost
      acc[item.csiDivision].count += 1
      acc[item.csiDivision].items.push(item)
      return acc
    }, {} as Record<string, { cost: number; count: number; items: TakeoffItem[] }>)

    // Group by takeoff type
    const typeBreakdown = takeoffItems.reduce((acc, item) => {
      if (!acc[item.takeoffType]) {
        acc[item.takeoffType] = { cost: 0, count: 0 }
      }
      acc[item.takeoffType].cost += item.totalCost
      acc[item.takeoffType].count += 1
      return acc
    }, {} as Record<string, { cost: number; count: number }>)

    return {
      totalCost,
      totalLaborHours,
      totalMaterialCost,
      totalEquipmentCost,
      divisionBreakdown,
      typeBreakdown,
      totalItems: takeoffItems.length,
    }
  }, [takeoffItems])

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Format number with commas
  const formatNumber = (value: number) => {
    return value.toLocaleString()
  }

  // Get CSI division color
  const getCSIDivisionColor = (division: string) => {
    const colors = {
      "03 - Concrete": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      "04 - Masonry": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      "06 - Wood and Plastics": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      "07 - Thermal and Moisture Protection": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      "08 - Doors and Windows": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      "09 - Finishes": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      "11 - Equipment": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
      "21 - Fire Suppression": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      "22 - Plumbing": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
      "23 - HVAC": "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
      "26 - Electrical": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    }
    return colors[division as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  // Handlers
  const handleAdd = () => {
    setAdding(true)
    setNewItem({
      takeoffType: "area",
      measurements: {},
      unitCost: 0,
      totalCost: 0,
      laborHours: 0,
      laborRate: 0,
      materialCost: 0,
      equipmentCost: 0,
      subcontractorCost: 0,
      markup: 0,
      status: "draft",
    })
  }

  const handleSaveNew = () => {
    if (!newItem.description || !newItem.unitOfMeasure) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in description and unit of measure.",
        variant: "destructive",
      })
      return
    }

    const totalCost = (newItem.measurements?.area || 0) * (newItem.unitCost || 0)

    const newTakeoffItem: TakeoffItem = {
      id: Date.now().toString(),
      csiCode: newItem.csiCode || "",
      csiDivision: newItem.csiDivision || "",
      description: newItem.description || "",
      takeoffType: newItem.takeoffType || "area",
      measurements: newItem.measurements || {},
      unitOfMeasure: newItem.unitOfMeasure || "",
      unitCost: newItem.unitCost || 0,
      totalCost: totalCost,
      laborHours: newItem.laborHours || 0,
      laborRate: newItem.laborRate || 0,
      materialCost: newItem.materialCost || 0,
      equipmentCost: newItem.equipmentCost || 0,
      subcontractorCost: newItem.subcontractorCost || 0,
      markup: newItem.markup || 0,
      location: newItem.location || "",
      floor: newItem.floor || "",
      phase: newItem.phase || "",
      status: "draft",
      lastModified: new Date().toISOString(),
    }

    setTakeoffItems((prev) => [...prev, newTakeoffItem])
    setAdding(false)
    setNewItem({
      takeoffType: "area",
      measurements: {},
      unitCost: 0,
      totalCost: 0,
      laborHours: 0,
      laborRate: 0,
      materialCost: 0,
      equipmentCost: 0,
      subcontractorCost: 0,
      markup: 0,
      status: "draft",
    })
    setHasUnsavedChanges(true)

    toast({
      title: "Takeoff Item Added",
      description: "New takeoff item has been added successfully.",
    })
  }

  const handleDelete = (id: string) => {
    setTakeoffItems((prev) => prev.filter((item) => item.id !== id))
    setHasUnsavedChanges(true)

    toast({
      title: "Takeoff Item Deleted",
      description: "Takeoff item has been removed.",
    })
  }

  // Inline edit for takeoff items
  const handleEdit = (id: string, field: keyof TakeoffItem, value: any) => {
    setTakeoffItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value, lastModified: new Date().toISOString() }

          // Recalculate total cost if measurements or unit cost changed
          if (field === "measurements" || field === "unitCost") {
            const measurements = field === "measurements" ? value : item.measurements
            const unitCost = field === "unitCost" ? value : item.unitCost
            updatedItem.totalCost = (measurements.area || 0) * (unitCost || 0)
          }

          return updatedItem
        }
        return item
      })
    )
    setHasUnsavedChanges(true)
  }

  // Add handler for measurements from drawing viewer
  const handleDrawingMeasurement = (measurement: any) => {
    setDrawingMeasurements((prev) => [...prev, measurement])

    // Auto-create takeoff item from measurement
    const newTakeoffItem: TakeoffItem = {
      id: Date.now().toString(),
      csiCode: "",
      csiDivision: "",
      description: measurement.measurements?.notes || "Drawing Measurement",
      takeoffType: measurement.type === "measurement" ? "linear" : "area",
      measurements: {
        length: measurement.measurements?.length || 0,
        area: measurement.measurements?.area || 0,
      },
      unitOfMeasure: "FT",
      unitCost: 0,
      totalCost: 0,
      laborHours: 0,
      laborRate: 0,
      materialCost: 0,
      equipmentCost: 0,
      subcontractorCost: 0,
      markup: 0,
      location: "",
      floor: "",
      phase: "",
      status: "draft",
      lastModified: new Date().toISOString(),
    }

    setTakeoffItems((prev) => [...prev, newTakeoffItem])
    setHasUnsavedChanges(true)

    toast({
      title: "Measurement Added",
      description: "Measurement from drawing has been added to takeoff items.",
    })
  }

  // Add handler for cost selection
  const handleCostSelect = (cost: any) => {
    const newTakeoffItem: TakeoffItem = {
      id: Date.now().toString() + Math.random(),
      csiCode: cost.csiCode,
      csiDivision: cost.csiCode.split(" ")[0] + " - " + cost.csiCode.split(" ")[1],
      description: cost.description,
      takeoffType: "area",
      measurements: { area: 1 }, // Default to 1 unit
      unitOfMeasure: cost.unit,
      unitCost: cost.totalCost,
      totalCost: cost.totalCost,
      laborHours: 0, // No direct labor hours from cost item
      laborRate: 0,
      materialCost: cost.materialCost,
      equipmentCost: cost.equipmentCost,
      subcontractorCost: cost.totalCost * 0.1, // Default 10% subcontractor
      markup: 15,
      location: "",
      floor: "",
      phase: "",
      status: "draft",
      lastModified: new Date().toISOString(),
    }

    setTakeoffItems((prev) => [...prev, newTakeoffItem])
    setHasUnsavedChanges(true)

    toast({
      title: "Cost Added",
      description: `${cost.description} has been added to your takeoff.`,
    })
  }

  // Add handler for assembly selection
  const handleAssemblySelect = (assembly: any) => {
    // Create takeoff items from assembly components
    assembly.components.forEach((component: any) => {
      const newTakeoffItem: TakeoffItem = {
        id: Date.now().toString() + Math.random(),
        csiCode: assembly.csiCode,
        csiDivision: assembly.category,
        description: `${assembly.name} - ${component.item}`,
        takeoffType: "assembly",
        measurements: {
          count: component.quantity,
        },
        unitOfMeasure: component.unit,
        unitCost: component.unitCost,
        totalCost: component.totalCost,
        laborHours: assembly.laborHours / assembly.components.length,
        laborRate: 45, // Default labor rate
        materialCost: component.totalCost * 0.8,
        equipmentCost: component.totalCost * 0.1,
        subcontractorCost: component.totalCost * 0.1,
        markup: 15,
        location: "",
        floor: "",
        phase: "",
        status: "draft",
        lastModified: new Date().toISOString(),
      }

      setTakeoffItems((prev) => [...prev, newTakeoffItem])
    })

    setHasUnsavedChanges(true)

    toast({
      title: "Assembly Added",
      description: `${assembly.name} has been added to your takeoff with ${assembly.components.length} components.`,
    })
  }

  // Save data
  const handleSave = useCallback(async () => {
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (onSave) {
      onSave({ takeoffItems, calculations })
    }

    setHasUnsavedChanges(false)
    toast({
      title: "Takeoff Data Saved",
      description: "All changes have been saved successfully.",
    })
  }, [takeoffItems, calculations, onSave, toast])

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
          description: `Takeoff data exported as ${format.toUpperCase()}.`,
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Ruler className="h-6 w-6 text-blue-600" />
            Takeoff Manager - {projectName}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive estimating takeoff and measurement tools
          </p>
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
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {formatCurrency(calculations.totalCost)}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">Project total</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Labor Hours</CardTitle>
            <Calculator className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {formatNumber(calculations.totalLaborHours)}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">Total hours</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Material Cost</CardTitle>
            <Building2 className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {formatCurrency(calculations.totalMaterialCost)}
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400">Materials only</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Takeoff Items</CardTitle>
            <Layers className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{calculations.totalItems}</div>
            <p className="text-xs text-purple-600 dark:text-purple-400">Total items</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.key} value={tab.key} className="text-xs px-2 py-1">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="drawings">
          <DrawingViewer projectId={projectId} onTakeoffAdd={handleDrawingMeasurement} />
        </TabsContent>

        <TabsContent value="takeoff" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-blue-600" />
                    Takeoff Tools
                  </CardTitle>
                  <CardDescription>Enter and manage takeoff items with measurements and costs</CardDescription>
                </div>
                <Button onClick={handleAdd} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Takeoff
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 bg-muted/50">
                      <th className="text-left p-3 w-24">CSI Code</th>
                      <th className="text-left p-3 w-32">Division</th>
                      <th className="text-left p-3 w-48">Description</th>
                      <th className="text-left p-3 w-20">Type</th>
                      <th className="text-left p-3 w-24">Measurement</th>
                      <th className="text-left p-3 w-20">Unit</th>
                      <th className="text-left p-3 w-24">Unit Cost</th>
                      <th className="text-left p-3 w-24">Total Cost</th>
                      <th className="text-left p-3 w-20">Status</th>
                      <th className="text-left p-3 w-16">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adding && (
                      <tr className="bg-blue-50 dark:bg-blue-950">
                        <td className="p-3">
                          <Input
                            value={newItem.csiCode || ""}
                            onChange={(e) => setNewItem({ ...newItem, csiCode: e.target.value })}
                            placeholder="CSI"
                            className="h-8 text-xs"
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            value={newItem.csiDivision || ""}
                            onChange={(e) => setNewItem({ ...newItem, csiDivision: e.target.value })}
                            placeholder="Division"
                            className="h-8 text-xs"
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            value={newItem.description || ""}
                            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                            placeholder="Description"
                            className="h-8 text-xs"
                          />
                        </td>
                        <td className="p-3">
                          <Select
                            value={newItem.takeoffType || "area"}
                            onValueChange={(val) => setNewItem({ ...newItem, takeoffType: val as TakeoffType })}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="area">Area</SelectItem>
                              <SelectItem value="linear">Linear</SelectItem>
                              <SelectItem value="count">Count</SelectItem>
                              <SelectItem value="volume">Volume</SelectItem>
                              <SelectItem value="assembly">Assembly</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-3">
                          <Input
                            value={newItem.measurements?.area || ""}
                            onChange={(e) =>
                              setNewItem({
                                ...newItem,
                                measurements: { ...newItem.measurements, area: Number(e.target.value) },
                              })
                            }
                            placeholder="Area/Length/Count"
                            type="number"
                            className="h-8 text-xs"
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            value={newItem.unitOfMeasure || ""}
                            onChange={(e) => setNewItem({ ...newItem, unitOfMeasure: e.target.value })}
                            placeholder="Unit"
                            className="h-8 text-xs"
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            value={newItem.unitCost || ""}
                            onChange={(e) => setNewItem({ ...newItem, unitCost: Number(e.target.value) })}
                            placeholder="Unit Cost"
                            type="number"
                            className="h-8 text-xs"
                          />
                        </td>
                        <td className="p-3">
                          {newItem.measurements?.area && newItem.unitCost
                            ? formatCurrency(Number(newItem.measurements.area) * Number(newItem.unitCost))
                            : ""}
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className="text-xs">
                            Draft
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Button size="sm" onClick={handleSaveNew} className="h-6 w-6 p-0">
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                        </td>
                      </tr>
                    )}
                    {takeoffItems.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-muted/50">
                        <td className="p-3">
                          <Input
                            value={item.csiCode}
                            onChange={(e) => handleEdit(item.id, "csiCode", e.target.value)}
                            className="bg-transparent h-8 text-xs"
                          />
                        </td>
                        <td className="p-3">
                          <Badge className={`text-xs ${getCSIDivisionColor(item.csiDivision)}`}>
                            {item.csiDivision}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Input
                            value={item.description}
                            onChange={(e) => handleEdit(item.id, "description", e.target.value)}
                            className="bg-transparent h-8 text-xs"
                          />
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className="text-xs capitalize">
                            {item.takeoffType}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Input
                            value={item.measurements.area || ""}
                            onChange={(e) =>
                              handleEdit(item.id, "measurements", {
                                ...item.measurements,
                                area: Number(e.target.value),
                              })
                            }
                            className="bg-transparent h-8 text-xs"
                            type="number"
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            value={item.unitOfMeasure}
                            onChange={(e) => handleEdit(item.id, "unitOfMeasure", e.target.value)}
                            className="bg-transparent h-8 text-xs"
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            value={item.unitCost}
                            onChange={(e) => handleEdit(item.id, "unitCost", Number(e.target.value))}
                            className="bg-transparent h-8 text-xs"
                            type="number"
                          />
                        </td>
                        <td className="p-3 font-medium">{formatCurrency(item.totalCost)}</td>
                        <td className="p-3">
                          <Badge variant={item.status === "approved" ? "default" : "outline"} className="text-xs">
                            {item.status}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </td>
                      </tr>
                    ))}

                    {/* Total Row */}
                    <tr className="border-t-2 bg-blue-50 dark:bg-blue-950 font-semibold">
                      <td colSpan={7} className="p-3 text-right">
                        TOTAL:
                      </td>
                      <td className="p-3 text-lg font-bold text-blue-900 dark:text-blue-100">
                        {formatCurrency(calculations.totalCost)}
                      </td>
                      <td colSpan={2}></td>
                    </tr>

                    {takeoffItems.length === 0 && !adding && (
                      <tr>
                        <td colSpan={10} className="text-center text-muted-foreground py-8">
                          No takeoff items yet. Click "Add Takeoff" to get started.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assemblies">
          <AssemblyLibrary onAssemblySelect={handleAssemblySelect} />
        </TabsContent>

        <TabsContent value="pricing">
          <CostDatabase onCostSelect={handleCostSelect} />
        </TabsContent>

        <TabsContent value="summary" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Division Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Division Breakdown
                </CardTitle>
                <CardDescription>Cost summary by CSI division</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(calculations.divisionBreakdown).map(([division, data]) => (
                    <div key={division} className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{division}</h4>
                        <Badge className={getCSIDivisionColor(division)}>{data.count} items</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Total Cost:</span>
                          <div className="font-medium">{formatCurrency(data.cost)}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Items:</span>
                          <div className="font-medium">{data.count}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Type Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-purple-600" />
                  Takeoff Type Breakdown
                </CardTitle>
                <CardDescription>Cost summary by takeoff type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(calculations.typeBreakdown).map(([type, data]) => (
                    <div key={type} className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold capitalize">{type}</h4>
                        <Badge variant="outline">{data.count} items</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Total Cost:</span>
                          <div className="font-medium">{formatCurrency(data.cost)}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Items:</span>
                          <div className="font-medium">{data.count}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
