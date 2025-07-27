"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  DollarSign,
  Calculator,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  Download,
  Upload,
  TrendingUp,
  Building2,
  Users,
  Settings,
  Copy,
} from "lucide-react"

interface CostItem {
  id: string
  description: string
  csiCode: string
  unit: string
  materialCost: number
  laborCost: number
  equipmentCost: number
  totalCost: number
  region: string
  lastUpdated: string
  source: string
}

interface CostDatabaseProps {
  onCostSelect?: (cost: CostItem) => void
}

export default function CostDatabase({ onCostSelect }: CostDatabaseProps) {
  const { toast } = useToast()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [costItems, setCostItems] = useState<CostItem[]>([
    {
      id: "1",
      description: "Concrete 3000 PSI",
      csiCode: "03 30 00",
      unit: "CY",
      materialCost: 85.0,
      laborCost: 25.0,
      equipmentCost: 15.0,
      totalCost: 125.0,
      region: "Southeast",
      lastUpdated: "2024-01-15",
      source: "RSMeans",
    },
    {
      id: "2",
      description: "2x4 Studs",
      csiCode: "06 10 00",
      unit: "LF",
      materialCost: 1.75,
      laborCost: 0.5,
      equipmentCost: 0.25,
      totalCost: 2.5,
      region: "Southeast",
      lastUpdated: "2024-01-10",
      source: "RSMeans",
    },
    {
      id: "3",
      description: 'Drywall 1/2"',
      csiCode: "09 21 00",
      unit: "SF",
      materialCost: 0.45,
      laborCost: 0.25,
      equipmentCost: 0.15,
      totalCost: 0.85,
      region: "Southeast",
      lastUpdated: "2024-01-12",
      source: "RSMeans",
    },
    {
      id: "4",
      description: "Electrical Outlet",
      csiCode: "26 20 00",
      unit: "EA",
      materialCost: 12.5,
      laborCost: 35.0,
      equipmentCost: 5.0,
      totalCost: 52.5,
      region: "Southeast",
      lastUpdated: "2024-01-08",
      source: "RSMeans",
    },
  ])

  const categories = [
    "all",
    "Concrete",
    "Masonry",
    "Metals",
    "Wood",
    "Thermal",
    "Doors",
    "Finishes",
    "Electrical",
    "Plumbing",
    "HVAC",
  ]

  const filteredCosts = costItems.filter((item) => {
    const matchesSearch =
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.csiCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.csiCode.startsWith(selectedCategory)
    return matchesSearch && matchesCategory
  })

  const handleCostSelect = (cost: CostItem) => {
    if (onCostSelect) {
      onCostSelect(cost)
    }
    toast({
      title: "Cost Selected",
      description: `${cost.description} has been added to your takeoff.`,
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
                <DollarSign className="h-5 w-5" />
                Cost Database
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Unit costs, labor rates, and material pricing database
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
                  placeholder="Search costs..."
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

      {/* Cost Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCosts.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{item.description}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {item.csiCode}
                    </Badge>
                    <span className="text-xs text-muted-foreground">per {item.unit}</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleCostSelect(item)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Material:</span>
                  <span className="font-medium">{formatCurrency(item.materialCost)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Labor:</span>
                  <span className="font-medium">{formatCurrency(item.laborCost)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Equipment:</span>
                  <span className="font-medium">{formatCurrency(item.equipmentCost)}</span>
                </div>
                <div className="flex items-center justify-between text-sm font-medium border-t pt-2">
                  <span>Total:</span>
                  <span className="text-green-600">{formatCurrency(item.totalCost)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{item.region}</span>
                <span>{item.lastUpdated}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCosts.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No costs found</h3>
            <p className="text-sm text-muted-foreground text-center">
              Try adjusting your search terms or category filter to find the costs you need.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
