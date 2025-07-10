"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Plus,
  Edit,
  Copy,
  Trash2,
  Eye,
  Users,
  Building2,
  MapPin,
  Search,
  Filter,
  Settings,
  Mail,
  Phone,
  Globe,
  Star,
  TrendingUp,
  BarChart3,
  Calendar,
  Target,
  FileText,
  Check,
  X,
  AlertTriangle,
  Info,
  Upload,
  Download,
  RefreshCw,
  Save,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react"

interface BidderTemplate {
  id: string
  name: string
  description: string
  category: string
  scopes: string[]
  regions: string[]
  bidders: BidderInfo[]
  defaultMessage: string
  usageCount: number
  lastUsed: string
  createdAt: string
  updatedAt: string
  isPublic: boolean
  createdBy: string
  tags: string[]
}

interface BidderInfo {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  website?: string
  rating: number
  specialties: string[]
  regions: string[]
  bondCapacity?: number
  prequalified: boolean
  preferredVendor: boolean
  lastProjectDate?: string
  projectCount: number
  averageBidValue: number
  responseRate: number
  qualificationLevel: "A" | "B" | "C" | "D"
  notes?: string
}

interface BidderTemplateManagerProps {
  templates: BidderTemplate[]
  onTemplateCreate?: (template: Omit<BidderTemplate, "id" | "createdAt" | "updatedAt">) => void
  onTemplateUpdate?: (id: string, template: Partial<BidderTemplate>) => void
  onTemplateDelete?: (id: string) => void
  onTemplateDuplicate?: (id: string) => void
  className?: string
}

// Mock CSI divisions for scope selection
const CSI_DIVISIONS = [
  "01 - General Requirements",
  "02 - Existing Conditions",
  "03 - Concrete",
  "04 - Masonry",
  "05 - Metals",
  "06 - Wood, Plastics, and Composites",
  "07 - Thermal and Moisture Protection",
  "08 - Openings",
  "09 - Finishes",
  "10 - Specialties",
  "11 - Equipment",
  "12 - Furnishings",
  "13 - Special Construction",
  "14 - Conveying Equipment",
  "21 - Fire Suppression",
  "22 - Plumbing",
  "23 - HVAC",
  "25 - Integrated Automation",
  "26 - Electrical",
  "27 - Communications",
  "28 - Electronic Safety and Security",
  "31 - Earthwork",
  "32 - Exterior Improvements",
  "33 - Utilities",
  "34 - Transportation",
  "35 - Waterway and Marine Construction",
]

// Mock regions
const REGIONS = [
  "Southeast",
  "Mid-Atlantic",
  "Northeast",
  "Southwest",
  "Midwest",
  "West Coast",
  "Gulf Coast",
  "Rocky Mountain",
  "Pacific Northwest",
  "National",
]

// Mock categories
const TEMPLATE_CATEGORIES = [
  "Commercial Office",
  "Healthcare",
  "Education",
  "Hospitality",
  "Industrial",
  "Residential",
  "Infrastructure",
  "Government",
  "Retail",
  "Mixed-Use",
]

export function BidderTemplateManager({
  templates,
  onTemplateCreate,
  onTemplateUpdate,
  onTemplateDelete,
  onTemplateDuplicate,
  className = "",
}: BidderTemplateManagerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedTemplate, setSelectedTemplate] = useState<BidderTemplate | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [newTemplate, setNewTemplate] = useState<Partial<BidderTemplate>>({
    name: "",
    description: "",
    category: "",
    scopes: [],
    regions: [],
    bidders: [],
    defaultMessage: "",
    isPublic: false,
    tags: [],
  })

  // Filter templates based on search and category
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleCreateTemplate = () => {
    if (onTemplateCreate && newTemplate.name && newTemplate.category) {
      onTemplateCreate({
        ...newTemplate,
        usageCount: 0,
        lastUsed: new Date().toISOString(),
        createdBy: "Current User",
        tags: newTemplate.tags || [],
      } as Omit<BidderTemplate, "id" | "createdAt" | "updatedAt">)

      setNewTemplate({
        name: "",
        description: "",
        category: "",
        scopes: [],
        regions: [],
        bidders: [],
        defaultMessage: "",
        isPublic: false,
        tags: [],
      })
      setShowCreateDialog(false)
    }
  }

  const handleEditTemplate = (template: BidderTemplate) => {
    setSelectedTemplate(template)
    setNewTemplate(template)
    setIsEditing(true)
    setShowCreateDialog(true)
  }

  const handleUpdateTemplate = () => {
    if (onTemplateUpdate && selectedTemplate && newTemplate.name && newTemplate.category) {
      onTemplateUpdate(selectedTemplate.id, newTemplate)
      setIsEditing(false)
      setShowCreateDialog(false)
      setSelectedTemplate(null)
      setNewTemplate({
        name: "",
        description: "",
        category: "",
        scopes: [],
        regions: [],
        bidders: [],
        defaultMessage: "",
        isPublic: false,
        tags: [],
      })
    }
  }

  const handleScopeToggle = (scope: string) => {
    setNewTemplate((prev) => ({
      ...prev,
      scopes: prev.scopes?.includes(scope) ? prev.scopes.filter((s) => s !== scope) : [...(prev.scopes || []), scope],
    }))
  }

  const handleRegionToggle = (region: string) => {
    setNewTemplate((prev) => ({
      ...prev,
      regions: prev.regions?.includes(region)
        ? prev.regions.filter((r) => r !== region)
        : [...(prev.regions || []), region],
    }))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getBidderCount = (template: BidderTemplate) => {
    return template.bidders?.length || 0
  }

  const getQualificationBadge = (level: string) => {
    switch (level) {
      case "A":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "B":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "C":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "D":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const TemplateCard = ({ template }: { template: BidderTemplate }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{template.name}</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">{template.description}</p>
          </div>
          <Badge variant="secondary">{template.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-600 dark:text-gray-400">Bidders</p>
            <p className="text-lg font-semibold">{getBidderCount(template)}</p>
          </div>
          <div>
            <p className="font-medium text-gray-600 dark:text-gray-400">Usage</p>
            <p className="text-lg font-semibold">{template.usageCount}</p>
          </div>
        </div>

        <div>
          <p className="font-medium text-gray-600 dark:text-gray-400 mb-2">CSI Scopes</p>
          <div className="flex flex-wrap gap-1">
            {template.scopes.slice(0, 3).map((scope, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {scope}
              </Badge>
            ))}
            {template.scopes.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{template.scopes.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        <div>
          <p className="font-medium text-gray-600 dark:text-gray-400 mb-2">Regions</p>
          <div className="flex flex-wrap gap-1">
            {template.regions.map((region, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {region}
              </Badge>
            ))}
          </div>
        </div>

        <div className="text-sm text-gray-500">Last used: {formatDate(template.lastUsed)}</div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => {
              setSelectedTemplate(template)
              setShowViewDialog(true)
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditTemplate(template)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => onTemplateDuplicate?.(template.id)}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onTemplateDelete?.(template.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const BidderList = ({ bidders }: { bidders: BidderInfo[] }) => (
    <div className="space-y-3">
      {bidders.map((bidder) => (
        <Card key={bidder.id} className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{bidder.name}</h4>
                <Badge className={getQualificationBadge(bidder.qualificationLevel)}>
                  Grade {bidder.qualificationLevel}
                </Badge>
                {bidder.preferredVendor && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <Star className="h-3 w-3 mr-1" />
                    Preferred
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {bidder.email}
                </div>
                {bidder.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {bidder.phone}
                  </div>
                )}
                {bidder.website && (
                  <div className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    Website
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-1">
                {bidder.specialties.map((specialty, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${i < bidder.rating ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-500">{bidder.projectCount} projects</div>
              <div className="text-sm text-gray-500">{bidder.responseRate}% response rate</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )

  return (
    <div className={`bidder-template-manager ${className}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Bidder Templates</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage reusable bidder lists for different project types</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {TEMPLATE_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>

        {/* Create/Edit Template Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Template" : "Create Bidder Template"}</DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="scopes">Scopes & Regions</TabsTrigger>
                <TabsTrigger value="bidders">Bidders</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Template Name</Label>
                    <Input
                      id="name"
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter template name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newTemplate.category}
                      onValueChange={(value) => setNewTemplate((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {TEMPLATE_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter template description"
                  />
                </div>

                <div>
                  <Label htmlFor="defaultMessage">Default Invitation Message</Label>
                  <Textarea
                    id="defaultMessage"
                    value={newTemplate.defaultMessage}
                    onChange={(e) => setNewTemplate((prev) => ({ ...prev, defaultMessage: e.target.value }))}
                    placeholder="Enter default message to send to bidders"
                    rows={4}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPublic"
                    checked={newTemplate.isPublic}
                    onCheckedChange={(checked) => setNewTemplate((prev) => ({ ...prev, isPublic: checked as boolean }))}
                  />
                  <Label htmlFor="isPublic">Make this template public (available to all users)</Label>
                </div>
              </TabsContent>

              <TabsContent value="scopes" className="space-y-4">
                <div>
                  <Label className="text-base font-medium">CSI Scopes</Label>
                  <p className="text-sm text-gray-600 mb-4">Select the CSI divisions that apply to this template</p>
                  <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                    {CSI_DIVISIONS.map((scope) => (
                      <div key={scope} className="flex items-center space-x-2">
                        <Checkbox
                          id={scope}
                          checked={newTemplate.scopes?.includes(scope)}
                          onCheckedChange={() => handleScopeToggle(scope)}
                        />
                        <Label htmlFor={scope} className="text-sm">
                          {scope}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-base font-medium">Regions</Label>
                  <p className="text-sm text-gray-600 mb-4">Select the regions where this template applies</p>
                  <div className="grid grid-cols-3 gap-2">
                    {REGIONS.map((region) => (
                      <div key={region} className="flex items-center space-x-2">
                        <Checkbox
                          id={region}
                          checked={newTemplate.regions?.includes(region)}
                          onCheckedChange={() => handleRegionToggle(region)}
                        />
                        <Label htmlFor={region} className="text-sm">
                          {region}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="bidders" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Bidders</Label>
                    <p className="text-sm text-gray-600">Add bidders to this template</p>
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Bidder
                  </Button>
                </div>

                <div className="text-center py-8 text-gray-500">
                  <Users className="h-8 w-8 mx-auto mb-2" />
                  <p>No bidders added yet</p>
                  <p className="text-sm">Click "Add Bidder" to start building your bidder list</p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateDialog(false)
                  setIsEditing(false)
                  setSelectedTemplate(null)
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={isEditing ? handleUpdateTemplate : handleCreateTemplate}
                disabled={!newTemplate.name || !newTemplate.category}
              >
                <Save className="h-4 w-4 mr-2" />
                {isEditing ? "Update Template" : "Create Template"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Template Dialog */}
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedTemplate?.name}</span>
                <Badge variant="secondary">{selectedTemplate?.category}</Badge>
              </DialogTitle>
            </DialogHeader>

            {selectedTemplate && (
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="scopes">Scopes & Regions</TabsTrigger>
                  <TabsTrigger value="bidders">Bidders ({getBidderCount(selectedTemplate)})</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Total Bidders</p>
                            <p className="text-2xl font-bold">{getBidderCount(selectedTemplate)}</p>
                          </div>
                          <Users className="h-8 w-8 text-blue-600" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Times Used</p>
                            <p className="text-2xl font-bold">{selectedTemplate.usageCount}</p>
                          </div>
                          <BarChart3 className="h-8 w-8 text-green-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Description</Label>
                    <p className="text-sm text-gray-600 mt-1">{selectedTemplate.description}</p>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Default Message</Label>
                    <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                      <p className="text-sm">{selectedTemplate.defaultMessage}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="scopes" className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">CSI Scopes</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedTemplate.scopes.map((scope, index) => (
                        <Badge key={index} variant="outline">
                          {scope}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Regions</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedTemplate.regions.map((region, index) => (
                        <Badge key={index} variant="secondary">
                          {region}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="bidders" className="space-y-4">
                  {selectedTemplate.bidders && selectedTemplate.bidders.length > 0 ? (
                    <BidderList bidders={selectedTemplate.bidders} />
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-8 w-8 mx-auto mb-2" />
                      <p>No bidders in this template</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default BidderTemplateManager
