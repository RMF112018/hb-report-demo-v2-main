"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  Layers,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Copy,
  Download,
  Upload,
  Building2,
  Calculator,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react"

interface AssemblyComponent {
  id: string
  description: string
  csiCode: string
  unit: string
  quantity: number
  unitCost: number
  totalCost: number
  laborHours: number
  materialCost: number
  equipmentCost: number
  subcontractorCost: number
  markup: number
}

interface Assembly {
  id: string
  name: string
  description: string
  csiCode: string
  components: AssemblyComponent[]
  totalCost: number
  totalLaborHours: number
  category: string
  region: string
  lastUpdated: string
  createdBy: string
}

interface AssemblyLibraryProps {
  onAssemblySelect?: (assembly: Assembly) => void
}

export default function AssemblyLibrary({ onAssemblySelect }: AssemblyLibraryProps) {
  const { toast } = useToast()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [assemblies, setAssemblies] = useState<Assembly[]>([
    {
      id: "1",
      name: "Exterior Wall Assembly",
      description: "8-inch CMU wall with insulation and finish",
      csiCode: "04 20 00",
      components: [
        {
          id: "1-1",
          description: "8-inch CMU Block",
          csiCode: "04 22 00",
          unit: "SF",
          quantity: 1,
          unitCost: 8.5,
          totalCost: 8.5,
          laborHours: 0.15,
          materialCost: 6.0,
          equipmentCost: 1.0,
          subcontractorCost: 0,
          markup: 15,
        },
        {
          id: "1-2",
          description: "Rigid Insulation",
          csiCode: "07 21 00",
          unit: "SF",
          quantity: 1,
          unitCost: 2.25,
          totalCost: 2.25,
          laborHours: 0.05,
          materialCost: 1.75,
          equipmentCost: 0.25,
          subcontractorCost: 0,
          markup: 12,
        },
        {
          id: "1-3",
          description: "Stucco Finish",
          csiCode: "09 24 00",
          unit: "SF",
          quantity: 1,
          unitCost: 3.75,
          totalCost: 3.75,
          laborHours: 0.1,
          materialCost: 2.5,
          equipmentCost: 0.5,
          subcontractorCost: 0,
          markup: 18,
        },
      ],
      totalCost: 14.5,
      totalLaborHours: 0.3,
      category: "Walls",
      region: "Southeast",
      lastUpdated: "2024-01-15",
      createdBy: "John Smith",
    },
    {
      id: "2",
      name: "Interior Partition Assembly",
      description: "Metal stud partition with drywall",
      csiCode: "09 21 00",
      components: [
        {
          id: "2-1",
          description: "Metal Studs",
          csiCode: "05 40 00",
          unit: "SF",
          quantity: 1,
          unitCost: 3.25,
          totalCost: 3.25,
          laborHours: 0.08,
          materialCost: 2.5,
          equipmentCost: 0.25,
          subcontractorCost: 0,
          markup: 12,
        },
        {
          id: "2-2",
          description: "Drywall 1/2-inch",
          csiCode: "09 21 00",
          unit: "SF",
          quantity: 2,
          unitCost: 0.85,
          totalCost: 1.7,
          laborHours: 0.12,
          materialCost: 0.45,
          equipmentCost: 0.15,
          subcontractorCost: 0,
          markup: 15,
        },
      ],
      totalCost: 4.95,
      totalLaborHours: 0.2,
      category: "Partitions",
      region: "Southeast",
      lastUpdated: "2024-01-12",
      createdBy: "Sarah Johnson",
    },
    {
      id: "3",
      name: "Roof Assembly",
      description: "Built-up roofing with insulation",
      csiCode: "07 22 00",
      components: [
        {
          id: "3-1",
          description: "Roof Insulation",
          csiCode: "07 21 00",
          unit: "SF",
          quantity: 1,
          unitCost: 4.5,
          totalCost: 4.5,
          laborHours: 0.06,
          materialCost: 3.5,
          equipmentCost: 0.5,
          subcontractorCost: 0,
          markup: 12,
        },
        {
          id: "3-2",
          description: "Built-up Roofing",
          csiCode: "07 22 00",
          unit: "SF",
          quantity: 1,
          unitCost: 6.25,
          totalCost: 6.25,
          laborHours: 0.1,
          materialCost: 4.75,
          equipmentCost: 0.75,
          subcontractorCost: 0,
          markup: 15,
        },
      ],
      totalCost: 10.75,
      totalLaborHours: 0.16,
      category: "Roofing",
      region: "Southeast",
      lastUpdated: "2024-01-10",
      createdBy: "Mike Wilson",
    },
  ])

  const categories = [
    "all",
    "Walls",
    "Partitions",
    "Roofing",
    "Floors",
    "Ceilings",
    "Doors",
    "Windows",
    "Electrical",
    "Plumbing",
    "HVAC",
  ]

  const filteredAssemblies = assemblies.filter((assembly) => {
    const matchesSearch =
      assembly.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assembly.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assembly.csiCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || assembly.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAssemblySelect = (assembly: Assembly) => {
    if (onAssemblySelect) {
      onAssemblySelect(assembly)
    }
    toast({
      title: "Assembly Selected",
      description: `${assembly.name} has been added to your takeoff.`,
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Assembly Library
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Pre-built construction assemblies with detailed cost breakdowns
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <Upload className="h-4 w-4 mr-1" />
                Import
              </Button>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search assemblies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Assemblies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssemblies.map((assembly) => (
          <Card key={assembly.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{assembly.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{assembly.description}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleAssemblySelect(assembly)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline">{assembly.category}</Badge>
                <span className="text-sm text-muted-foreground">{assembly.csiCode}</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Cost:</span>
                  <span className="font-medium">{formatCurrency(assembly.totalCost)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Labor Hours:</span>
                  <span className="font-medium">{assembly.totalLaborHours.toFixed(2)} hrs</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Components:</span>
                  <span className="font-medium">{assembly.components.length}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Created by:</span>
                  <span>{assembly.createdBy}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Updated:</span>
                  <span>{assembly.lastUpdated}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Region:</span>
                  <span>{assembly.region}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAssemblies.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Layers className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No assemblies found</h3>
            <p className="text-sm text-muted-foreground text-center">
              Try adjusting your search terms or category filter to find the assemblies you need.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
