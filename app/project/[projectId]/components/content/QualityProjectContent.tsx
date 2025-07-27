/**
 * @fileoverview Quality Project Content Component - QC Checklists per Project
 * @module QualityProjectContent
 * @version 1.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Project-specific Quality Control management with AI-powered checklist generation
 * Features: QC checklist builder, submittal register integration, trade-specific guidance
 */

"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ClipboardCheck,
  FileText,
  MapPin,
  Building2,
  Thermometer,
  Wrench,
  CheckCircle,
  AlertTriangle,
  Plus,
  Edit,
  Download,
  Eye,
  Search,
  Filter,
  RefreshCw,
  Bot,
  Users,
  Calendar,
  Target,
  Zap,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Star,
  Shield,
  Maximize2,
  Minimize2,
  BarChart3,
  TrendingUp,
  FileCheck,
  Lightbulb,
  Settings,
  Save,
  X,
  Paperclip,
} from "lucide-react"

// Types
interface QualityChecklistItem {
  id: string
  description: string
  category: string
  isRequired: boolean
  isCompleted: boolean
  notes?: string
  photos?: string[]
  inspector?: string
  inspectionDate?: string
  priority: "low" | "medium" | "high" | "critical"
  tradeSpecific?: string
  preInspectionRequirements?: string[]
  validationPoints?: string[]
  aiGenerated?: boolean
}

interface QualityChecklist {
  id: string
  name: string
  projectId: string
  projectName: string
  location: string
  zone: string
  phase: string
  trade: string
  submittalReferences: string[]
  specSections: string[]
  environmentalConditions: EnvironmentalCondition[]
  items: QualityChecklistItem[]
  status: "draft" | "active" | "completed" | "archived"
  createdBy: string
  createdDate: string
  lastUpdated: string
  approvedBy?: string
  approvedDate?: string
  totalItems: number
  completedItems: number
  aiSuggestions: AISuggestion[]
}

interface EnvironmentalCondition {
  type: "temperature" | "humidity" | "weather" | "soil" | "seismic" | "wind" | "other"
  value: string
  unit: string
  impact: string
  requirements?: string[]
}

interface AISuggestion {
  id: string
  type: "validation_point" | "pre_inspection" | "trade_guidance" | "environmental_requirement"
  description: string
  priority: "low" | "medium" | "high"
  source: string
  confidence: number
  implemented: boolean
}

interface SubmittalItem {
  id: string
  title: string
  trade: string
  status: "required" | "submitted" | "approved" | "rejected"
  specSection: string
  description: string
}

interface SpecSection {
  id: string
  number: string
  title: string
  description: string
  trade: string
  qualityRequirements: string[]
  testingRequirements: string[]
}

interface QualityProjectContentProps {
  projectId: string
  projectData: any
  userRole: string
  user: any
  activeTab?: string
  onTabChange?: (tabId: string) => void
}

const QualityProjectContent: React.FC<QualityProjectContentProps> = ({
  projectId,
  projectData,
  userRole,
  user,
  activeTab,
  onTabChange,
}) => {
  const [mounted, setMounted] = useState(false)
  const [currentTab, setCurrentTab] = useState("overview")
  const [selectedChecklist, setSelectedChecklist] = useState<QualityChecklist | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isBuilderOpen, setIsBuilderOpen] = useState(false)
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showAIBuilder, setShowAIBuilder] = useState(false)
  const [generateLoading, setGenerateLoading] = useState(false)

  // Create checklist form state
  const [checklistForm, setChecklistForm] = useState({
    name: "",
    location: "",
    zone: "",
    phase: "",
    trade: "",
    submittalReferences: [] as string[],
    specSections: [] as string[],
    environmentalConditions: [] as EnvironmentalCondition[],
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  // Mock data for submittals
  const mockSubmittals: SubmittalItem[] = [
    {
      id: "SUB-001",
      title: "Structural Steel Shop Drawings",
      trade: "Structural",
      status: "approved",
      specSection: "05120",
      description: "Structural steel fabrication drawings for main building frame",
    },
    {
      id: "SUB-002",
      title: "Concrete Mix Design",
      trade: "Concrete",
      status: "submitted",
      specSection: "03300",
      description: "Concrete mix design for foundation and slab work",
    },
    {
      id: "SUB-003",
      title: "HVAC Equipment Schedule",
      trade: "HVAC",
      status: "required",
      specSection: "23000",
      description: "HVAC equipment specifications and installation requirements",
    },
    {
      id: "SUB-004",
      title: "Electrical Panel Schedule",
      trade: "Electrical",
      status: "approved",
      specSection: "26000",
      description: "Electrical panel layout and circuit distribution",
    },
    {
      id: "SUB-005",
      title: "Plumbing Fixture Schedule",
      trade: "Plumbing",
      status: "submitted",
      specSection: "22000",
      description: "Plumbing fixture specifications and rough-in requirements",
    },
  ]

  // Mock data for spec sections
  const mockSpecSections: SpecSection[] = [
    {
      id: "SPEC-001",
      number: "03300",
      title: "Cast-in-Place Concrete",
      description: "Concrete placement, finishing, and curing requirements",
      trade: "Concrete",
      qualityRequirements: [
        "Minimum 28-day compressive strength of 4000 psi",
        "Slump test requirements per ACI 301",
        "Air content testing for freeze-thaw protection",
        "Temperature monitoring during placement",
      ],
      testingRequirements: [
        "Concrete cylinder testing every 100 cubic yards",
        "Slump testing every truck load",
        "Air content testing per ACI 318",
        "Temperature monitoring continuous",
      ],
    },
    {
      id: "SPEC-002",
      number: "05120",
      title: "Structural Steel",
      description: "Structural steel fabrication and erection requirements",
      trade: "Structural",
      qualityRequirements: [
        "Welding certification per AWS D1.1",
        "Material certifications required",
        "Dimensional tolerance per AISC 303",
        "Surface preparation per SSPC standards",
      ],
      testingRequirements: [
        "Weld testing per AWS requirements",
        "Material testing certificates",
        "Dimensional inspection reports",
        "Surface preparation verification",
      ],
    },
    {
      id: "SPEC-003",
      number: "26000",
      title: "Electrical Systems",
      description: "Electrical installation and testing requirements",
      trade: "Electrical",
      qualityRequirements: [
        "NECA installation standards compliance",
        "Conductor sizing per NEC requirements",
        "Ground fault protection verification",
        "Insulation resistance testing",
      ],
      testingRequirements: [
        "Megger testing all circuits",
        "Ground fault testing",
        "Load testing electrical panels",
        "Torque testing connections",
      ],
    },
  ]

  // Mock data for existing checklists
  const mockChecklists: QualityChecklist[] = [
    {
      id: "QC-001",
      name: "Foundation Concrete Pour - Zone A",
      projectId: projectId,
      projectName: projectData?.name || "Project",
      location: "Building A",
      zone: "Zone A - Foundation",
      phase: "Structural",
      trade: "Concrete",
      submittalReferences: ["SUB-002"],
      specSections: ["03300"],
      environmentalConditions: [
        {
          type: "temperature",
          value: "45",
          unit: "°F",
          impact: "Cold weather concrete requirements",
          requirements: ["Heated enclosure required", "Extended curing time needed"],
        },
        {
          type: "humidity",
          value: "65",
          unit: "%",
          impact: "Normal curing conditions",
          requirements: ["Standard curing procedures"],
        },
      ],
      items: [
        {
          id: "ITEM-001",
          description: "Verify concrete temperature at delivery",
          category: "Temperature Control",
          isRequired: true,
          isCompleted: true,
          notes: "Temperature verified at 65°F, within acceptable range",
          inspector: "John Smith",
          inspectionDate: "2025-01-14",
          priority: "high",
          tradeSpecific: "Concrete",
          preInspectionRequirements: ["Calibrate thermometer", "Check weather conditions"],
          validationPoints: ["Temperature between 50-90°F", "Consistent throughout load"],
          aiGenerated: true,
        },
        {
          id: "ITEM-002",
          description: "Perform slump test per ACI 301",
          category: "Quality Testing",
          isRequired: true,
          isCompleted: false,
          priority: "critical",
          tradeSpecific: "Concrete",
          preInspectionRequirements: ["Slump cone available", "Tamping rod ready"],
          validationPoints: ["Slump between 3-6 inches", "Consistent mix appearance"],
          aiGenerated: true,
        },
      ],
      status: "active",
      createdBy: "Quality Manager",
      createdDate: "2025-01-13",
      lastUpdated: "2025-01-14",
      totalItems: 2,
      completedItems: 1,
      aiSuggestions: [
        {
          id: "AI-001",
          type: "validation_point",
          description: "Add air content testing for freeze-thaw protection",
          priority: "high",
          source: "ACI 318 Standard",
          confidence: 95,
          implemented: false,
        },
        {
          id: "AI-002",
          type: "environmental_requirement",
          description: "Cold weather protection protocols needed",
          priority: "medium",
          source: "Weather Analysis",
          confidence: 88,
          implemented: true,
        },
      ],
    },
    {
      id: "QC-002",
      name: "Electrical Panel Installation - Main Building",
      projectId: projectId,
      projectName: projectData?.name || "Project",
      location: "Building A",
      zone: "Zone B - Electrical Room",
      phase: "MEP",
      trade: "Electrical",
      submittalReferences: ["SUB-004"],
      specSections: ["26000"],
      environmentalConditions: [
        {
          type: "temperature",
          value: "72",
          unit: "°F",
          impact: "Normal installation conditions",
          requirements: ["Standard installation procedures"],
        },
      ],
      items: [
        {
          id: "ITEM-003",
          description: "Verify panel clearance requirements",
          category: "Code Compliance",
          isRequired: true,
          isCompleted: true,
          notes: "36-inch clearance verified per NEC 110.26",
          inspector: "Sarah Johnson",
          inspectionDate: "2025-01-12",
          priority: "critical",
          tradeSpecific: "Electrical",
          preInspectionRequirements: ["Measuring tape", "NEC code book"],
          validationPoints: ["36-inch minimum clearance", "Proper working space"],
          aiGenerated: false,
        },
      ],
      status: "active",
      createdBy: "Electrical Foreman",
      createdDate: "2025-01-10",
      lastUpdated: "2025-01-12",
      totalItems: 1,
      completedItems: 1,
      aiSuggestions: [],
    },
  ]

  // Available options for form fields
  const projectPhases = ["Pre-Construction", "Structural", "MEP", "Finishes", "Closeout"]
  const projectTrades = ["Concrete", "Structural", "Electrical", "Plumbing", "HVAC", "Finishes", "General"]
  const projectLocations = ["Building A", "Building B", "Site Work", "Parking Structure"]
  const projectZones = [
    "Zone A - Foundation",
    "Zone B - Electrical Room",
    "Zone C - Mechanical Room",
    "Zone D - Main Floor",
    "Zone E - Upper Floors",
  ]

  // Generate AI-powered checklist
  const generateAIChecklist = async () => {
    setGenerateLoading(true)

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Generate checklist items based on selected criteria
    const baseItems: QualityChecklistItem[] = []

    // Add items based on selected submittals
    checklistForm.submittalReferences.forEach((submittalId) => {
      const submittal = mockSubmittals.find((s) => s.id === submittalId)
      if (submittal) {
        baseItems.push({
          id: `AI-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          description: `Verify ${submittal.title} compliance`,
          category: "Submittal Verification",
          isRequired: true,
          isCompleted: false,
          priority: "high",
          tradeSpecific: submittal.trade,
          preInspectionRequirements: [
            "Review approved submittal drawings",
            "Check material certifications",
            "Verify installation sequence",
          ],
          validationPoints: [
            "Materials match approved submittals",
            "Installation per specifications",
            "Quality standards met",
          ],
          aiGenerated: true,
        })
      }
    })

    // Add items based on spec sections
    checklistForm.specSections.forEach((specId) => {
      const spec = mockSpecSections.find((s) => s.id === specId)
      if (spec) {
        spec.qualityRequirements.forEach((req, index) => {
          baseItems.push({
            id: `AI-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            description: req,
            category: "Quality Requirement",
            isRequired: true,
            isCompleted: false,
            priority: index === 0 ? "critical" : "high",
            tradeSpecific: spec.trade,
            preInspectionRequirements: [
              "Review specification requirements",
              "Prepare testing equipment",
              "Coordinate with trade contractor",
            ],
            validationPoints: [
              "Requirement fully met",
              "Proper documentation provided",
              "Testing results within limits",
            ],
            aiGenerated: true,
          })
        })
      }
    })

    // Add environmental considerations
    checklistForm.environmentalConditions.forEach((condition) => {
      if (condition.requirements) {
        condition.requirements.forEach((req) => {
          baseItems.push({
            id: `AI-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            description: req,
            category: "Environmental Requirements",
            isRequired: true,
            isCompleted: false,
            priority: "medium",
            tradeSpecific: checklistForm.trade,
            preInspectionRequirements: [
              "Monitor environmental conditions",
              "Verify protection measures",
              "Document conditions",
            ],
            validationPoints: [
              "Environmental protection adequate",
              "Conditions within acceptable range",
              "Continuous monitoring in place",
            ],
            aiGenerated: true,
          })
        })
      }
    })

    // Add trade-specific items
    if (checklistForm.trade) {
      const tradeItems = generateTradeSpecificItems(checklistForm.trade)
      baseItems.push(...tradeItems)
    }

    // Create the new checklist
    const newChecklist: QualityChecklist = {
      id: `QC-${Date.now()}`,
      name: checklistForm.name,
      projectId: projectId,
      projectName: projectData?.name || "Project",
      location: checklistForm.location,
      zone: checklistForm.zone,
      phase: checklistForm.phase,
      trade: checklistForm.trade,
      submittalReferences: checklistForm.submittalReferences,
      specSections: checklistForm.specSections,
      environmentalConditions: checklistForm.environmentalConditions,
      items: baseItems,
      status: "draft",
      createdBy: user?.firstName + " " + user?.lastName || "Current User",
      createdDate: new Date().toISOString().split("T")[0],
      lastUpdated: new Date().toISOString().split("T")[0],
      totalItems: baseItems.length,
      completedItems: 0,
      aiSuggestions: [
        {
          id: `AI-SUGG-${Date.now()}`,
          type: "trade_guidance",
          description: `Consider additional ${checklistForm.trade} specific requirements`,
          priority: "medium",
          source: "Trade Best Practices",
          confidence: 82,
          implemented: false,
        },
      ],
    }

    setSelectedChecklist(newChecklist)
    setIsBuilderOpen(true)
    setShowAIBuilder(false)
    setGenerateLoading(false)
  }

  // Generate trade-specific items
  const generateTradeSpecificItems = (trade: string): QualityChecklistItem[] => {
    const tradeItems: Record<string, QualityChecklistItem[]> = {
      Concrete: [
        {
          id: `TRADE-${Date.now()}-1`,
          description: "Verify concrete mix design approval",
          category: "Material Verification",
          isRequired: true,
          isCompleted: false,
          priority: "critical",
          tradeSpecific: "Concrete",
          preInspectionRequirements: [
            "Review approved mix design",
            "Verify batch plant certification",
            "Check delivery tickets",
          ],
          validationPoints: [
            "Mix design matches approved submittal",
            "Batch plant certified",
            "Delivery documentation complete",
          ],
          aiGenerated: true,
        },
        {
          id: `TRADE-${Date.now()}-2`,
          description: "Perform concrete cylinder testing",
          category: "Quality Testing",
          isRequired: true,
          isCompleted: false,
          priority: "high",
          tradeSpecific: "Concrete",
          preInspectionRequirements: [
            "Cylinder molds available",
            "Testing equipment calibrated",
            "Sampling procedure reviewed",
          ],
          validationPoints: [
            "Cylinders properly filled",
            "Correct curing procedures",
            "Testing scheduled appropriately",
          ],
          aiGenerated: true,
        },
      ],
      Structural: [
        {
          id: `TRADE-${Date.now()}-3`,
          description: "Verify welding certification",
          category: "Certification",
          isRequired: true,
          isCompleted: false,
          priority: "critical",
          tradeSpecific: "Structural",
          preInspectionRequirements: [
            "Check welder certifications",
            "Verify welding procedure specifications",
            "Review AWS D1.1 requirements",
          ],
          validationPoints: ["Welders properly certified", "Procedures approved", "Documentation current"],
          aiGenerated: true,
        },
      ],
      Electrical: [
        {
          id: `TRADE-${Date.now()}-4`,
          description: "Perform insulation resistance testing",
          category: "Electrical Testing",
          isRequired: true,
          isCompleted: false,
          priority: "high",
          tradeSpecific: "Electrical",
          preInspectionRequirements: [
            "Megger testing equipment",
            "Circuit isolation verification",
            "Safety procedures reviewed",
          ],
          validationPoints: ["Insulation resistance > 1 MΩ", "All circuits tested", "Results documented"],
          aiGenerated: true,
        },
      ],
    }

    return tradeItems[trade] || []
  }

  // Filter checklists based on search
  const filteredChecklists = useMemo(() => {
    return mockChecklists.filter(
      (checklist) =>
        checklist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        checklist.trade.toLowerCase().includes(searchQuery.toLowerCase()) ||
        checklist.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        checklist.zone.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  // Calculate completion percentage
  const getCompletionPercentage = (checklist: QualityChecklist) => {
    return checklist.totalItems > 0 ? Math.round((checklist.completedItems / checklist.totalItems) * 100) : 0
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "active":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "archived":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "text-blue-600"
      case "medium":
        return "text-yellow-600"
      case "high":
        return "text-orange-600"
      case "critical":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  // Handle focus mode toggle
  const handleFocusToggle = () => {
    setIsFocusMode(!isFocusMode)
  }

  // Reset form
  const resetForm = () => {
    setChecklistForm({
      name: "",
      location: "",
      zone: "",
      phase: "",
      trade: "",
      submittalReferences: [],
      specSections: [],
      environmentalConditions: [],
    })
  }

  // Export checklist
  const exportChecklist = (checklist: QualityChecklist, format: "pdf" | "form") => {
    // Implementation for export functionality
    console.log(`Exporting checklist ${checklist.id} as ${format}`)
    // In a real implementation, this would generate and download the file
    alert(`Checklist exported as ${format.toUpperCase()}`)
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Main content
  const mainContent = (
    <div className="flex flex-col h-full w-full min-w-0 max-w-full overflow-hidden">
      {/* Module Title with Focus Button */}
      <div className="pb-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-foreground">Quality Control Center</h2>
            <p className="text-sm text-muted-foreground">
              AI-powered QC checklist generation with project-specific requirements
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={showAIBuilder} onOpenChange={setShowAIBuilder}>
              <DialogTrigger asChild>
                <Button>
                  <Bot className="h-4 w-4 mr-2" />
                  AI Checklist Builder
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>AI-Powered QC Checklist Builder</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="checklist-name">Checklist Name</Label>
                      <Input
                        id="checklist-name"
                        value={checklistForm.name}
                        onChange={(e) => setChecklistForm({ ...checklistForm, name: e.target.value })}
                        placeholder="Enter checklist name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Select
                        value={checklistForm.location}
                        onValueChange={(value) => setChecklistForm({ ...checklistForm, location: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          {projectLocations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="zone">Zone</Label>
                      <Select
                        value={checklistForm.zone}
                        onValueChange={(value) => setChecklistForm({ ...checklistForm, zone: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select zone" />
                        </SelectTrigger>
                        <SelectContent>
                          {projectZones.map((zone) => (
                            <SelectItem key={zone} value={zone}>
                              {zone}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="phase">Phase</Label>
                      <Select
                        value={checklistForm.phase}
                        onValueChange={(value) => setChecklistForm({ ...checklistForm, phase: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select phase" />
                        </SelectTrigger>
                        <SelectContent>
                          {projectPhases.map((phase) => (
                            <SelectItem key={phase} value={phase}>
                              {phase}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="trade">Trade</Label>
                      <Select
                        value={checklistForm.trade}
                        onValueChange={(value) => setChecklistForm({ ...checklistForm, trade: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select trade" />
                        </SelectTrigger>
                        <SelectContent>
                          {projectTrades.map((trade) => (
                            <SelectItem key={trade} value={trade}>
                              {trade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Submittal Register */}
                  <div>
                    <Label>Submittal Register</Label>
                    <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
                      {mockSubmittals.map((submittal) => (
                        <div key={submittal.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`submittal-${submittal.id}`}
                            checked={checklistForm.submittalReferences.includes(submittal.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setChecklistForm({
                                  ...checklistForm,
                                  submittalReferences: [...checklistForm.submittalReferences, submittal.id],
                                })
                              } else {
                                setChecklistForm({
                                  ...checklistForm,
                                  submittalReferences: checklistForm.submittalReferences.filter(
                                    (id) => id !== submittal.id
                                  ),
                                })
                              }
                            }}
                          />
                          <Label htmlFor={`submittal-${submittal.id}`} className="text-sm">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{submittal.title}</span>
                              <Badge variant="outline" className="text-xs">
                                {submittal.trade}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  submittal.status === "approved"
                                    ? "bg-green-100 text-green-800"
                                    : submittal.status === "submitted"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {submittal.status}
                              </Badge>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Project Spec Sections */}
                  <div>
                    <Label>Project Spec Sections</Label>
                    <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
                      {mockSpecSections.map((spec) => (
                        <div key={spec.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`spec-${spec.id}`}
                            checked={checklistForm.specSections.includes(spec.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setChecklistForm({
                                  ...checklistForm,
                                  specSections: [...checklistForm.specSections, spec.id],
                                })
                              } else {
                                setChecklistForm({
                                  ...checklistForm,
                                  specSections: checklistForm.specSections.filter((id) => id !== spec.id),
                                })
                              }
                            }}
                          />
                          <Label htmlFor={`spec-${spec.id}`} className="text-sm">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {spec.number} - {spec.title}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {spec.trade}
                              </Badge>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Environmental Conditions */}
                  <div>
                    <Label>Environmental & Soil Conditions</Label>
                    <div className="mt-2 space-y-3 border rounded-md p-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm">Temperature</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              placeholder="Temperature"
                              className="flex-1"
                              onChange={(e) => {
                                const tempCondition: EnvironmentalCondition = {
                                  type: "temperature",
                                  value: e.target.value,
                                  unit: "°F",
                                  impact:
                                    e.target.value && parseInt(e.target.value) < 50
                                      ? "Cold weather concrete requirements"
                                      : "Normal conditions",
                                  requirements:
                                    e.target.value && parseInt(e.target.value) < 50
                                      ? ["Heated enclosure required", "Extended curing time"]
                                      : [],
                                }
                                setChecklistForm({
                                  ...checklistForm,
                                  environmentalConditions: [
                                    ...checklistForm.environmentalConditions.filter((c) => c.type !== "temperature"),
                                    tempCondition,
                                  ],
                                })
                              }}
                            />
                            <span className="text-sm text-muted-foreground">°F</span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm">Humidity</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              placeholder="Humidity"
                              className="flex-1"
                              onChange={(e) => {
                                const humidityCondition: EnvironmentalCondition = {
                                  type: "humidity",
                                  value: e.target.value,
                                  unit: "%",
                                  impact: "Normal curing conditions",
                                  requirements: ["Standard curing procedures"],
                                }
                                setChecklistForm({
                                  ...checklistForm,
                                  environmentalConditions: [
                                    ...checklistForm.environmentalConditions.filter((c) => c.type !== "humidity"),
                                    humidityCondition,
                                  ],
                                })
                              }}
                            />
                            <span className="text-sm text-muted-foreground">%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Generate Button */}
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowAIBuilder(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={generateAIChecklist}
                      disabled={generateLoading || !checklistForm.name || !checklistForm.trade}
                    >
                      {generateLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Generate AI Checklist
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm" onClick={handleFocusToggle} className="h-8 px-3 text-xs">
              {isFocusMode ? (
                <>
                  <Minimize2 className="h-3 w-3 mr-1" />
                  Exit Focus
                </>
              ) : (
                <>
                  <Maximize2 className="h-3 w-3 mr-1" />
                  Focus
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-1 w-full min-w-0 max-w-full min-h-0">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="checklists">Checklists</TabsTrigger>
            <TabsTrigger value="builder">Checklist Builder</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="flex-1 overflow-y-auto">
            <div className="space-y-6">
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Checklists</p>
                        <p className="text-2xl font-bold text-blue-600">{mockChecklists.length}</p>
                      </div>
                      <ClipboardCheck className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Active</p>
                        <p className="text-2xl font-bold text-green-600">
                          {mockChecklists.filter((c) => c.status === "active").length}
                        </p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Completed</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {mockChecklists.filter((c) => c.status === "completed").length}
                        </p>
                      </div>
                      <Star className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">AI Generated</p>
                        <p className="text-2xl font-bold text-orange-600">
                          {mockChecklists.filter((c) => c.items.some((i) => i.aiGenerated)).length}
                        </p>
                      </div>
                      <Bot className="h-8 w-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Checklists */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Quality Checklists</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockChecklists.slice(0, 3).map((checklist) => (
                      <div key={checklist.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <ClipboardCheck className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{checklist.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {checklist.trade} • {checklist.location}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(checklist.status)}>{checklist.status}</Badge>
                          <span className="text-sm font-medium">{getCompletionPercentage(checklist)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="checklists" className="flex-1 overflow-y-auto">
            <div className="space-y-4">
              {/* Search and Filter */}
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search checklists..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>

              {/* Checklists Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredChecklists.map((checklist) => (
                  <Card key={checklist.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{checklist.name}</CardTitle>
                        <Badge className={getStatusColor(checklist.status)}>{checklist.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Trade:</span>
                            <p className="font-medium">{checklist.trade}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Location:</span>
                            <p className="font-medium">{checklist.location}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Zone:</span>
                            <p className="font-medium">{checklist.zone}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Phase:</span>
                            <p className="font-medium">{checklist.phase}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">Progress:</span>
                            <div className="w-24 h-2 bg-gray-200 rounded-full">
                              <div
                                className="h-2 bg-blue-600 rounded-full"
                                style={{ width: `${getCompletionPercentage(checklist)}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{getCompletionPercentage(checklist)}%</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedChecklist(checklist)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => exportChecklist(checklist, "pdf")}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Created: {checklist.createdDate}</span>
                          <span>Items: {checklist.totalItems}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="builder" className="flex-1 overflow-y-auto">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Checklist Builder</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Bot className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">AI-Powered Checklist Generation</h3>
                    <p className="text-muted-foreground mb-4">
                      Create comprehensive quality checklists using AI that pulls from your project's submittal
                      register, spec sections, location data, and environmental conditions.
                    </p>
                    <Button onClick={() => setShowAIBuilder(true)}>
                      <Zap className="h-4 w-4 mr-2" />
                      Start Building
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="font-medium">Submittal Integration</p>
                        <p className="text-sm text-muted-foreground">
                          Automatically pull requirements from approved submittals
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="h-8 w-8 text-green-500" />
                      <div>
                        <p className="font-medium">Spec Sections</p>
                        <p className="text-sm text-muted-foreground">Generate items based on project specifications</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Thermometer className="h-8 w-8 text-orange-500" />
                      <div>
                        <p className="font-medium">Environmental Conditions</p>
                        <p className="text-sm text-muted-foreground">Account for weather, soil, and site conditions</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )

  // Show selected checklist details
  if (selectedChecklist) {
    return (
      <div className="flex flex-col h-full w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-xl font-semibold">{selectedChecklist.name}</h2>
            <p className="text-sm text-muted-foreground">
              {selectedChecklist.trade} • {selectedChecklist.location} • {selectedChecklist.zone}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => exportChecklist(selectedChecklist, "pdf")}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportChecklist(selectedChecklist, "form")}>
              <FileCheck className="h-4 w-4 mr-2" />
              Export Form
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelectedChecklist(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            {/* Checklist Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Items</p>
                      <p className="text-2xl font-bold text-blue-600">{selectedChecklist.totalItems}</p>
                    </div>
                    <ClipboardCheck className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Completed</p>
                      <p className="text-2xl font-bold text-green-600">{selectedChecklist.completedItems}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Progress</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {getCompletionPercentage(selectedChecklist)}%
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Checklist Items */}
            <Card>
              <CardHeader>
                <CardTitle>Checklist Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedChecklist.items.map((item, index) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Checkbox
                              checked={item.isCompleted}
                              onCheckedChange={() => {
                                // Update completion status
                                const updatedItems = selectedChecklist.items.map((i) =>
                                  i.id === item.id ? { ...i, isCompleted: !i.isCompleted } : i
                                )
                                setSelectedChecklist({
                                  ...selectedChecklist,
                                  items: updatedItems,
                                  completedItems: updatedItems.filter((i) => i.isCompleted).length,
                                })
                              }}
                            />
                            <p
                              className={`font-medium ${item.isCompleted ? "line-through text-muted-foreground" : ""}`}
                            >
                              {item.description}
                            </p>
                            {item.aiGenerated && (
                              <Badge variant="secondary" className="text-xs">
                                <Bot className="h-3 w-3 mr-1" />
                                AI
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                            <span>Category: {item.category}</span>
                            <span className={getPriorityColor(item.priority)}>Priority: {item.priority}</span>
                            <span>Trade: {item.tradeSpecific}</span>
                          </div>

                          {item.preInspectionRequirements && (
                            <div className="mb-2">
                              <p className="text-sm font-medium mb-1">Pre-Inspection Requirements:</p>
                              <ul className="text-sm text-muted-foreground list-disc list-inside">
                                {item.preInspectionRequirements.map((req, i) => (
                                  <li key={i}>{req}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {item.validationPoints && (
                            <div className="mb-2">
                              <p className="text-sm font-medium mb-1">Validation Points:</p>
                              <ul className="text-sm text-muted-foreground list-disc list-inside">
                                {item.validationPoints.map((point, i) => (
                                  <li key={i}>{point}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {item.notes && (
                            <div className="bg-gray-50 p-3 rounded-md">
                              <p className="text-sm">
                                <strong>Notes:</strong> {item.notes}
                              </p>
                              {item.inspector && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Inspected by: {item.inspector} on {item.inspectionDate}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Paperclip className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Return focus mode if active
  if (isFocusMode) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-950 flex flex-col z-50">
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
          <div className="p-6 min-h-full w-full max-w-full">{mainContent}</div>
        </div>
      </div>
    )
  }

  // Return the main content
  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="w-full max-w-full">{mainContent}</div>
    </div>
  )
}

export default QualityProjectContent
