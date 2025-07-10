"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import {
  Plus,
  Edit,
  Copy,
  Trash2,
  Eye,
  Save,
  Search,
  Filter,
  Settings,
  FileText,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Type,
  Hash,
  DollarSign,
  Percent,
  Calendar,
  Clock,
  CheckSquare,
  ToggleLeft,
  List,
  Upload,
  Download,
  RefreshCw,
  Play,
  Pause,
  AlertTriangle,
  Info,
  Check,
  X,
  MoreHorizontal,
  Layers,
  Target,
  Zap,
  Star,
  Building2,
  Users,
  Mail,
  Phone,
  Globe,
  MapPin,
  Briefcase,
} from "lucide-react"

interface BidFormTemplate {
  id: string
  name: string
  description: string
  category: string
  fields: BidFormField[]
  sections: BidFormSection[]
  settings: BidFormSettings
  usageCount: number
  lastModified: string
  createdAt: string
  updatedAt: string
  isPublic: boolean
  createdBy: string
  tags: string[]
}

interface BidFormField {
  id: string
  name: string
  type: "text" | "number" | "currency" | "percentage" | "date" | "time" | "checkbox" | "select" | "textarea" | "file"
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
  defaultValue?: string
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
  helpText?: string
  section?: string
  order: number
  conditional?: {
    dependsOn: string
    value: string
    operator: "equals" | "not_equals" | "greater_than" | "less_than"
  }
}

interface BidFormSection {
  id: string
  name: string
  description?: string
  order: number
  collapsible: boolean
  defaultExpanded: boolean
  fields: string[]
}

interface BidFormSettings {
  allowAttachments: boolean
  maxAttachmentSize: number
  allowDraftSaves: boolean
  requireDigitalSignature: boolean
  enableAutoSave: boolean
  customStyling: boolean
  responseDeadline?: string
  emailNotifications: boolean
  responseValidation: boolean
  allowPartialSubmissions: boolean
}

interface BidFormBuilderProps {
  templates: BidFormTemplate[]
  onTemplateCreate?: (template: Omit<BidFormTemplate, "id" | "createdAt" | "updatedAt">) => void
  onTemplateUpdate?: (id: string, template: Partial<BidFormTemplate>) => void
  onTemplateDelete?: (id: string) => void
  onTemplateDuplicate?: (id: string) => void
  onTemplatePreview?: (template: BidFormTemplate) => void
  className?: string
}

const FIELD_TYPES = [
  { value: "text", label: "Text Input", icon: Type },
  { value: "number", label: "Number", icon: Hash },
  { value: "currency", label: "Currency", icon: DollarSign },
  { value: "percentage", label: "Percentage", icon: Percent },
  { value: "date", label: "Date", icon: Calendar },
  { value: "time", label: "Time", icon: Clock },
  { value: "checkbox", label: "Checkbox", icon: CheckSquare },
  { value: "select", label: "Select Dropdown", icon: List },
  { value: "textarea", label: "Multi-line Text", icon: FileText },
  { value: "file", label: "File Upload", icon: Upload },
]

const FORM_CATEGORIES = [
  "General Contractor",
  "Electrical",
  "Plumbing",
  "HVAC",
  "Concrete",
  "Masonry",
  "Roofing",
  "Flooring",
  "Insulation",
  "Drywall",
  "Painting",
  "Landscaping",
  "Custom",
]

export function BidFormBuilder({
  templates,
  onTemplateCreate,
  onTemplateUpdate,
  onTemplateDelete,
  onTemplateDuplicate,
  onTemplatePreview,
  className = "",
}: BidFormBuilderProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedTemplate, setSelectedTemplate] = useState<BidFormTemplate | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [newTemplate, setNewTemplate] = useState<Partial<BidFormTemplate>>({
    name: "",
    description: "",
    category: "",
    fields: [],
    sections: [
      {
        id: "section-1",
        name: "General Information",
        description: "Basic project information",
        order: 0,
        collapsible: false,
        defaultExpanded: true,
        fields: [],
      },
    ],
    settings: {
      allowAttachments: true,
      maxAttachmentSize: 10,
      allowDraftSaves: true,
      requireDigitalSignature: false,
      enableAutoSave: true,
      customStyling: false,
      emailNotifications: true,
      responseValidation: true,
      allowPartialSubmissions: false,
    },
    isPublic: false,
    tags: [],
  })

  const [newField, setNewField] = useState<Partial<BidFormField>>({
    name: "",
    type: "text",
    label: "",
    placeholder: "",
    required: false,
    options: [],
    section: "section-1",
    order: 0,
  })

  const [showFieldDialog, setShowFieldDialog] = useState(false)
  const [editingField, setEditingField] = useState<string | null>(null)

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
        lastModified: new Date().toISOString(),
        createdBy: "Current User",
        tags: newTemplate.tags || [],
      } as Omit<BidFormTemplate, "id" | "createdAt" | "updatedAt">)

      resetForm()
      setShowCreateDialog(false)
    }
  }

  const handleUpdateTemplate = () => {
    if (onTemplateUpdate && selectedTemplate && newTemplate.name && newTemplate.category) {
      onTemplateUpdate(selectedTemplate.id, {
        ...newTemplate,
        lastModified: new Date().toISOString(),
      })
      setIsEditing(false)
      resetForm()
      setShowCreateDialog(false)
    }
  }

  const resetForm = () => {
    setNewTemplate({
      name: "",
      description: "",
      category: "",
      fields: [],
      sections: [
        {
          id: "section-1",
          name: "General Information",
          description: "Basic project information",
          order: 0,
          collapsible: false,
          defaultExpanded: true,
          fields: [],
        },
      ],
      settings: {
        allowAttachments: true,
        maxAttachmentSize: 10,
        allowDraftSaves: true,
        requireDigitalSignature: false,
        enableAutoSave: true,
        customStyling: false,
        emailNotifications: true,
        responseValidation: true,
        allowPartialSubmissions: false,
      },
      isPublic: false,
      tags: [],
    })
    setSelectedTemplate(null)
    setNewField({
      name: "",
      type: "text",
      label: "",
      placeholder: "",
      required: false,
      options: [],
      section: "section-1",
      order: 0,
    })
  }

  const handleEditTemplate = (template: BidFormTemplate) => {
    setSelectedTemplate(template)
    setNewTemplate(template)
    setIsEditing(true)
    setShowCreateDialog(true)
  }

  const handleAddField = () => {
    if (newField.name && newField.label) {
      const field: BidFormField = {
        id: `field-${Date.now()}`,
        name: newField.name,
        type: newField.type || "text",
        label: newField.label,
        placeholder: newField.placeholder,
        required: newField.required || false,
        options: newField.options || [],
        section: newField.section || "section-1",
        order: newTemplate.fields?.length || 0,
        helpText: newField.helpText,
        validation: newField.validation,
        conditional: newField.conditional,
      }

      setNewTemplate((prev) => ({
        ...prev,
        fields: [...(prev.fields || []), field],
      }))

      setNewField({
        name: "",
        type: "text",
        label: "",
        placeholder: "",
        required: false,
        options: [],
        section: "section-1",
        order: 0,
      })
      setShowFieldDialog(false)
    }
  }

  const handleEditField = (fieldId: string) => {
    const field = newTemplate.fields?.find((f) => f.id === fieldId)
    if (field) {
      setNewField(field)
      setEditingField(fieldId)
      setShowFieldDialog(true)
    }
  }

  const handleUpdateField = () => {
    if (editingField && newField.name && newField.label) {
      setNewTemplate((prev) => ({
        ...prev,
        fields: prev.fields?.map((f) => (f.id === editingField ? { ...f, ...newField, id: editingField } : f)),
      }))
      setNewField({
        name: "",
        type: "text",
        label: "",
        placeholder: "",
        required: false,
        options: [],
        section: "section-1",
        order: 0,
      })
      setEditingField(null)
      setShowFieldDialog(false)
    }
  }

  const handleDeleteField = (fieldId: string) => {
    setNewTemplate((prev) => ({
      ...prev,
      fields: prev.fields?.filter((f) => f.id !== fieldId),
    }))
  }

  const handleAddSection = () => {
    const newSection: BidFormSection = {
      id: `section-${Date.now()}`,
      name: `Section ${(newTemplate.sections?.length || 0) + 1}`,
      description: "",
      order: newTemplate.sections?.length || 0,
      collapsible: true,
      defaultExpanded: true,
      fields: [],
    }

    setNewTemplate((prev) => ({
      ...prev,
      sections: [...(prev.sections || []), newSection],
    }))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getFieldIcon = (type: string) => {
    const fieldType = FIELD_TYPES.find((ft) => ft.value === type)
    return fieldType ? fieldType.icon : Type
  }

  const TemplateCard = ({ template }: { template: BidFormTemplate }) => (
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
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-600 dark:text-gray-400">Fields</p>
            <p className="text-lg font-semibold">{template.fields?.length || 0}</p>
          </div>
          <div>
            <p className="font-medium text-gray-600 dark:text-gray-400">Sections</p>
            <p className="text-lg font-semibold">{template.sections?.length || 0}</p>
          </div>
          <div>
            <p className="font-medium text-gray-600 dark:text-gray-400">Usage</p>
            <p className="text-lg font-semibold">{template.usageCount}</p>
          </div>
        </div>

        <div className="text-sm text-gray-500">Last modified: {formatDate(template.lastModified)}</div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => {
              setSelectedTemplate(template)
              setShowPreviewDialog(true)
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
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

  const FieldPreview = ({ field }: { field: BidFormField }) => {
    const Icon = getFieldIcon(field.type)

    return (
      <div className="border rounded-lg p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-gray-500" />
            <Label className="font-medium">{field.label}</Label>
            {field.required && (
              <Badge variant="destructive" className="text-xs">
                Required
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => handleEditField(field.id)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleDeleteField(field.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {field.helpText && <p className="text-sm text-gray-500">{field.helpText}</p>}

        <div className="text-xs text-gray-400">
          Type: {field.type} | Section: {field.section}
        </div>
      </div>
    )
  }

  return (
    <div className={`bid-form-builder ${className}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Bid Form Builder</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Create and manage bid forms with custom line items and response formats
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Form
          </Button>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search forms..."
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
                {FORM_CATEGORIES.map((category) => (
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
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Form Template" : "Create Bid Form Template"}</DialogTitle>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="sections">Sections</TabsTrigger>
                <TabsTrigger value="fields">Fields</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Form Name</Label>
                    <Input
                      id="name"
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter form name"
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
                        {FORM_CATEGORIES.map((category) => (
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
                    placeholder="Enter form description"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPublic"
                    checked={newTemplate.isPublic}
                    onCheckedChange={(checked) => setNewTemplate((prev) => ({ ...prev, isPublic: checked as boolean }))}
                  />
                  <Label htmlFor="isPublic">Make this form public (available to all users)</Label>
                </div>
              </TabsContent>

              <TabsContent value="sections" className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Form Sections</Label>
                  <Button size="sm" onClick={handleAddSection}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Section
                  </Button>
                </div>

                <div className="space-y-2">
                  {newTemplate.sections?.map((section, index) => (
                    <Card key={section.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h4 className="font-medium">{section.name}</h4>
                          {section.description && <p className="text-sm text-gray-600">{section.description}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{section.fields?.length || 0} fields</Badge>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="fields" className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Form Fields</Label>
                  <Button size="sm" onClick={() => setShowFieldDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Field
                  </Button>
                </div>

                <div className="space-y-2">
                  {newTemplate.fields?.map((field) => (
                    <FieldPreview key={field.id} field={field} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="allowAttachments">Allow Attachments</Label>
                      <p className="text-sm text-gray-600">Allow bidders to upload files</p>
                    </div>
                    <Switch
                      id="allowAttachments"
                      checked={newTemplate.settings?.allowAttachments}
                      onCheckedChange={(checked) =>
                        setNewTemplate((prev) => ({
                          ...prev,
                          settings: { ...prev.settings!, allowAttachments: checked },
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="allowDraftSaves">Allow Draft Saves</Label>
                      <p className="text-sm text-gray-600">Allow bidders to save drafts</p>
                    </div>
                    <Switch
                      id="allowDraftSaves"
                      checked={newTemplate.settings?.allowDraftSaves}
                      onCheckedChange={(checked) =>
                        setNewTemplate((prev) => ({
                          ...prev,
                          settings: { ...prev.settings!, allowDraftSaves: checked },
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="requireDigitalSignature">Require Digital Signature</Label>
                      <p className="text-sm text-gray-600">Require e-signature for submission</p>
                    </div>
                    <Switch
                      id="requireDigitalSignature"
                      checked={newTemplate.settings?.requireDigitalSignature}
                      onCheckedChange={(checked) =>
                        setNewTemplate((prev) => ({
                          ...prev,
                          settings: { ...prev.settings!, requireDigitalSignature: checked },
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <p className="text-sm text-gray-600">Send email notifications for responses</p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={newTemplate.settings?.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNewTemplate((prev) => ({
                          ...prev,
                          settings: { ...prev.settings!, emailNotifications: checked },
                        }))
                      }
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateDialog(false)
                  setIsEditing(false)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={isEditing ? handleUpdateTemplate : handleCreateTemplate}
                disabled={!newTemplate.name || !newTemplate.category}
              >
                <Save className="h-4 w-4 mr-2" />
                {isEditing ? "Update Form" : "Create Form"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Field Dialog */}
        <Dialog open={showFieldDialog} onOpenChange={setShowFieldDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingField ? "Edit Field" : "Add Field"}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fieldName">Field Name</Label>
                  <Input
                    id="fieldName"
                    value={newField.name}
                    onChange={(e) => setNewField((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter field name"
                  />
                </div>
                <div>
                  <Label htmlFor="fieldLabel">Field Label</Label>
                  <Input
                    id="fieldLabel"
                    value={newField.label}
                    onChange={(e) => setNewField((prev) => ({ ...prev, label: e.target.value }))}
                    placeholder="Enter field label"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fieldType">Field Type</Label>
                  <Select
                    value={newField.type}
                    onValueChange={(value) => setNewField((prev) => ({ ...prev, type: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select field type" />
                    </SelectTrigger>
                    <SelectContent>
                      {FIELD_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="h-4 w-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="fieldSection">Section</Label>
                  <Select
                    value={newField.section}
                    onValueChange={(value) => setNewField((prev) => ({ ...prev, section: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      {newTemplate.sections?.map((section) => (
                        <SelectItem key={section.id} value={section.id}>
                          {section.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="fieldPlaceholder">Placeholder</Label>
                <Input
                  id="fieldPlaceholder"
                  value={newField.placeholder}
                  onChange={(e) => setNewField((prev) => ({ ...prev, placeholder: e.target.value }))}
                  placeholder="Enter placeholder text"
                />
              </div>

              <div>
                <Label htmlFor="fieldHelp">Help Text</Label>
                <Textarea
                  id="fieldHelp"
                  value={newField.helpText}
                  onChange={(e) => setNewField((prev) => ({ ...prev, helpText: e.target.value }))}
                  placeholder="Enter help text"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fieldRequired"
                  checked={newField.required}
                  onCheckedChange={(checked) => setNewField((prev) => ({ ...prev, required: checked as boolean }))}
                />
                <Label htmlFor="fieldRequired">This field is required</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowFieldDialog(false)
                  setEditingField(null)
                  setNewField({
                    name: "",
                    type: "text",
                    label: "",
                    placeholder: "",
                    required: false,
                    options: [],
                    section: "section-1",
                    order: 0,
                  })
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={editingField ? handleUpdateField : handleAddField}
                disabled={!newField.name || !newField.label}
              >
                <Save className="h-4 w-4 mr-2" />
                {editingField ? "Update Field" : "Add Field"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default BidFormBuilder
