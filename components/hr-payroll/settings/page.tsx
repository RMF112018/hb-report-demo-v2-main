"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Settings,
  Building2,
  MapPin,
  Users,
  Heart,
  Calendar,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Globe,
  Shield,
  CreditCard,
  Clock,
  FileText,
  Database,
  Zap,
  Upload,
  Download,
  Brain,
  Target,
  UserCheck,
  FileSpreadsheet,
  FileJson,
  CheckSquare,
  Square,
} from "lucide-react"
import AskHBIChat from "../AskHBIChat"

// Interfaces for assessment and target profile settings
interface AssessmentUpload {
  id: string
  fileName: string
  fileType: "csv" | "json" | "pdf"
  uploadDate: string
  status: "pending" | "processing" | "completed" | "error"
  employeeCount: number
  processedCount: number
  errorCount: number
  assignedTo: string[]
}

interface TargetProfile {
  id: string
  role: string
  department: string
  discProfile: {
    primaryType: string
    secondaryType: string
    preferredTraits: string[]
    avoidTraits: string[]
  }
  integrusProfile: {
    leadershipType: string
    preferredStrengths: string[]
    developmentAreas: string[]
  }
  culturalRules: {
    teamwork: number
    communication: number
    innovation: number
    stability: number
    adaptability: number
  }
  priority: "high" | "medium" | "low"
  active: boolean
}

// Mock data for settings
const mockSettings = {
  departments: [
    {
      id: "dept-001",
      name: "Construction",
      code: "CON",
      manager: "Sarah Johnson",
      location: "Main Office",
      active: true,
    },
    {
      id: "dept-002",
      name: "Engineering",
      code: "ENG",
      manager: "Michael Chen",
      location: "Main Office",
      active: true,
    },
    { id: "dept-003", name: "Safety", code: "SAF", manager: "Lisa Rodriguez", location: "Field Office", active: true },
    {
      id: "dept-004",
      name: "Operations",
      code: "OPS",
      manager: "David Thompson",
      location: "Main Office",
      active: true,
    },
    {
      id: "dept-005",
      name: "Administration",
      code: "ADM",
      manager: "Jennifer Lee",
      location: "Main Office",
      active: true,
    },
  ],
  locations: [
    {
      id: "loc-001",
      name: "Main Office",
      address: "123 Construction Blvd, City, State",
      type: "Headquarters",
      active: true,
    },
    {
      id: "loc-002",
      name: "Field Office",
      address: "456 Project Way, City, State",
      type: "Field Office",
      active: true,
    },
    {
      id: "loc-003",
      name: "Regional Office",
      address: "789 Regional Ave, City, State",
      type: "Regional",
      active: false,
    },
  ],
  recruitingPartners: [
    {
      id: "partner-001",
      name: "Construction Recruiters Inc",
      type: "Agency",
      contact: "John Smith",
      email: "john@constructionrecruiters.com",
      active: true,
    },
    {
      id: "partner-002",
      name: "LinkedIn",
      type: "Platform",
      contact: "LinkedIn Sales",
      email: "sales@linkedin.com",
      active: true,
    },
    {
      id: "partner-003",
      name: "Indeed",
      type: "Platform",
      contact: "Indeed Support",
      email: "support@indeed.com",
      active: true,
    },
    {
      id: "partner-004",
      name: "Local Trade Schools",
      type: "Educational",
      contact: "Various",
      email: "partnerships@company.com",
      active: true,
    },
  ],
  benefitsEligibility: {
    healthInsurance: { minHours: 30, waitingPeriod: 30, coverage: "80/20" },
    retirement: { minHours: 20, waitingPeriod: 90, matchPercentage: 3 },
    paidTimeOff: { minHours: 30, accrualRate: 0.0385, maxAccrual: 240 },
    overtime: { threshold: 40, rate: 1.5, holidayRate: 2.0 },
  },
  payrollCycles: {
    frequency: "bi-weekly",
    payDay: "Friday",
    cutoffDay: "Tuesday",
    processingDay: "Wednesday",
    directDepositDay: "Thursday",
  },
  approvalRules: {
    timeApproval: { autoApproval: false, maxHours: 12, requireNotes: true, managerApproval: true },
    expenseApproval: { autoApproval: false, maxAmount: 500, requireReceipt: true, managerApproval: true },
    overtimeApproval: { requireApproval: true, maxOvertime: 20, advanceNotice: 24 },
    expenseCategories: {
      requireApproval: ["Travel", "Equipment", "Training"],
      autoApprove: ["Meals", "Transportation"],
    },
  },
  systemSettings: {
    useMockData: true,
    dataRetention: 7,
    backupFrequency: "daily",
    auditLogging: true,
    notifications: true,
  },
  assessmentUploads: [
    {
      id: "upload-001",
      fileName: "Q4_2024_DiSC_Results.csv",
      fileType: "csv",
      uploadDate: "2024-12-15",
      status: "completed",
      employeeCount: 45,
      processedCount: 43,
      errorCount: 2,
      assignedTo: ["Sarah Johnson", "Michael Chen", "Emily Davis"],
    },
    {
      id: "upload-002",
      fileName: "Integrus_360_Leadership_Assessment.json",
      fileType: "json",
      uploadDate: "2024-12-10",
      status: "completed",
      employeeCount: 28,
      processedCount: 28,
      errorCount: 0,
      assignedTo: ["Alex Singh", "Jennifer Lee", "David Wilson"],
    },
    {
      id: "upload-003",
      fileName: "Behavioral_Assessment_Reports.pdf",
      fileType: "pdf",
      uploadDate: "2024-12-08",
      status: "processing",
      employeeCount: 15,
      processedCount: 8,
      errorCount: 0,
      assignedTo: ["Lisa Rodriguez", "Robin Brown"],
    },
  ],
  targetProfiles: [
    {
      id: "profile-001",
      role: "Senior Project Manager",
      department: "Construction",
      discProfile: {
        primaryType: "D",
        secondaryType: "C",
        preferredTraits: ["Goal-oriented", "Analytical", "Direct communication"],
        avoidTraits: ["Indecisive", "Overly emotional", "Disorganized"],
      },
      integrusProfile: {
        leadershipType: "Driver",
        preferredStrengths: ["Results focus", "Decision making", "High energy"],
        developmentAreas: ["Relationship building", "Strategic thinking"],
      },
      culturalRules: {
        teamwork: 7,
        communication: 8,
        innovation: 6,
        stability: 8,
        adaptability: 7,
      },
      priority: "high",
      active: true,
    },
    {
      id: "profile-002",
      role: "Senior Estimator",
      department: "Estimating",
      discProfile: {
        primaryType: "C",
        secondaryType: "S",
        preferredTraits: ["Attention to detail", "Reliability", "Analytical thinking"],
        avoidTraits: ["Impulsive", "Disorganized", "Poor communication"],
      },
      integrusProfile: {
        leadershipType: "Refiner",
        preferredStrengths: ["Quality focus", "Process improvement", "Attention to detail"],
        developmentAreas: ["Strategic thinking", "Initiative taking"],
      },
      culturalRules: {
        teamwork: 6,
        communication: 7,
        innovation: 5,
        stability: 9,
        adaptability: 6,
      },
      priority: "medium",
      active: true,
    },
    {
      id: "profile-003",
      role: "HR Specialist",
      department: "Human Resources",
      discProfile: {
        primaryType: "S",
        secondaryType: "I",
        preferredTraits: ["Relationship building", "Supportive", "Good communication"],
        avoidTraits: ["Aggressive", "Impersonal", "Poor listening"],
      },
      integrusProfile: {
        leadershipType: "Supporter",
        preferredStrengths: ["Team building", "Relationship management", "Conflict resolution"],
        developmentAreas: ["Strategic decision making", "Direct communication"],
      },
      culturalRules: {
        teamwork: 9,
        communication: 8,
        innovation: 6,
        stability: 7,
        adaptability: 7,
      },
      priority: "medium",
      active: true,
    },
  ],
}

export default function SettingsPage() {
  const [settings, setSettings] = useState(mockSettings)
  const [activeTab, setActiveTab] = useState("departments")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showTargetProfileDialog, setShowTargetProfileDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [dialogType, setDialogType] = useState<"department" | "location" | "partner">("department")

  const handleAddItem = (type: "department" | "location" | "partner") => {
    setDialogType(type)
    setEditingItem(null)
    setShowAddDialog(true)
  }

  const handleEditItem = (item: any, type: "department" | "location" | "partner") => {
    setDialogType(type)
    setEditingItem(item)
    setShowAddDialog(true)
  }

  const handleDeleteItem = (id: string, type: "department" | "location" | "partner") => {
    // Mock delete functionality
    console.log(`Deleting ${type} with id: ${id}`)
  }

  const handleSaveSettings = () => {
    // Mock save functionality
    console.log("Saving settings:", settings)
  }

  const handleToggleMockData = () => {
    setSettings((prev) => ({
      ...prev,
      systemSettings: {
        ...prev.systemSettings,
        useMockData: !prev.systemSettings.useMockData,
      },
    }))
  }

  const handleUploadFiles = () => {
    setShowUploadDialog(true)
  }

  const handleAddTargetProfile = () => {
    setShowTargetProfileDialog(true)
  }

  const handleDownloadTemplate = () => {
    // Mock download functionality
    console.log("Downloading assessment template...")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">HR & Payroll Settings</h1>
          <p className="text-muted-foreground">Manage departments, locations, benefits, and system configurations</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleSaveSettings}>
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="recruiting">Recruiting</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="targets">Target Profiles</TabsTrigger>
        </TabsList>

        {/* Departments Tab */}
        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Building2 className="mr-2 h-5 w-5" />
                    Department Management
                  </CardTitle>
                  <CardDescription>Manage company departments and organizational structure</CardDescription>
                </div>
                <Button onClick={() => handleAddItem("department")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Department
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {settings.departments.map((dept) => (
                  <div key={dept.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{dept.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Code: {dept.code} • Manager: {dept.manager} • Location: {dept.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={dept.active ? "default" : "secondary"}>
                        {dept.active ? "Active" : "Inactive"}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => handleEditItem(dept, "department")}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteItem(dept.id, "department")}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    Office Locations
                  </CardTitle>
                  <CardDescription>Manage company office locations and addresses</CardDescription>
                </div>
                <Button onClick={() => handleAddItem("location")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Location
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {settings.locations.map((location) => (
                  <div key={location.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{location.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {location.address} • Type: {location.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={location.active ? "default" : "secondary"}>
                        {location.active ? "Active" : "Inactive"}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => handleEditItem(location, "location")}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteItem(location.id, "location")}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recruiting Partners Tab */}
        <TabsContent value="recruiting" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Recruiting Partners
                  </CardTitle>
                  <CardDescription>Manage external recruiting partners and platforms</CardDescription>
                </div>
                <Button onClick={() => handleAddItem("partner")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Partner
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {settings.recruitingPartners.map((partner) => (
                  <div key={partner.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Globe className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{partner.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Type: {partner.type} • Contact: {partner.contact} • {partner.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={partner.active ? "default" : "secondary"}>
                        {partner.active ? "Active" : "Inactive"}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => handleEditItem(partner, "partner")}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteItem(partner.id, "partner")}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Benefits Tab */}
        <TabsContent value="benefits" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="mr-2 h-5 w-5" />
                  Health Insurance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Minimum Hours Required</Label>
                  <Input
                    value={settings.benefitsEligibility.healthInsurance.minHours}
                    type="number"
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        benefitsEligibility: {
                          ...prev.benefitsEligibility,
                          healthInsurance: {
                            ...prev.benefitsEligibility.healthInsurance,
                            minHours: parseInt(e.target.value),
                          },
                        },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Waiting Period (Days)</Label>
                  <Input
                    value={settings.benefitsEligibility.healthInsurance.waitingPeriod}
                    type="number"
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        benefitsEligibility: {
                          ...prev.benefitsEligibility,
                          healthInsurance: {
                            ...prev.benefitsEligibility.healthInsurance,
                            waitingPeriod: parseInt(e.target.value),
                          },
                        },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Coverage Level</Label>
                  <Select value={settings.benefitsEligibility.healthInsurance.coverage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="80/20">80/20</SelectItem>
                      <SelectItem value="90/10">90/10</SelectItem>
                      <SelectItem value="100/0">100/0</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Retirement Benefits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Minimum Hours Required</Label>
                  <Input
                    value={settings.benefitsEligibility.retirement.minHours}
                    type="number"
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        benefitsEligibility: {
                          ...prev.benefitsEligibility,
                          retirement: {
                            ...prev.benefitsEligibility.retirement,
                            minHours: parseInt(e.target.value),
                          },
                        },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Waiting Period (Days)</Label>
                  <Input
                    value={settings.benefitsEligibility.retirement.waitingPeriod}
                    type="number"
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        benefitsEligibility: {
                          ...prev.benefitsEligibility,
                          retirement: {
                            ...prev.benefitsEligibility.retirement,
                            waitingPeriod: parseInt(e.target.value),
                          },
                        },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company Match (%)</Label>
                  <Input
                    value={settings.benefitsEligibility.retirement.matchPercentage}
                    type="number"
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        benefitsEligibility: {
                          ...prev.benefitsEligibility,
                          retirement: {
                            ...prev.benefitsEligibility.retirement,
                            matchPercentage: parseInt(e.target.value),
                          },
                        },
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Paid Time Off
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Minimum Hours Required</Label>
                  <Input
                    value={settings.benefitsEligibility.paidTimeOff.minHours}
                    type="number"
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        benefitsEligibility: {
                          ...prev.benefitsEligibility,
                          paidTimeOff: {
                            ...prev.benefitsEligibility.paidTimeOff,
                            minHours: parseInt(e.target.value),
                          },
                        },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Accrual Rate (hours/week)</Label>
                  <Input
                    value={settings.benefitsEligibility.paidTimeOff.accrualRate}
                    type="number"
                    step="0.0001"
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        benefitsEligibility: {
                          ...prev.benefitsEligibility,
                          paidTimeOff: {
                            ...prev.benefitsEligibility.paidTimeOff,
                            accrualRate: parseFloat(e.target.value),
                          },
                        },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Maximum Accrual (hours)</Label>
                  <Input
                    value={settings.benefitsEligibility.paidTimeOff.maxAccrual}
                    type="number"
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        benefitsEligibility: {
                          ...prev.benefitsEligibility,
                          paidTimeOff: {
                            ...prev.benefitsEligibility.paidTimeOff,
                            maxAccrual: parseInt(e.target.value),
                          },
                        },
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Overtime Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Overtime Threshold (hours/week)</Label>
                  <Input
                    value={settings.benefitsEligibility.overtime.threshold}
                    type="number"
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        benefitsEligibility: {
                          ...prev.benefitsEligibility,
                          overtime: {
                            ...prev.benefitsEligibility.overtime,
                            threshold: parseInt(e.target.value),
                          },
                        },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Overtime Rate Multiplier</Label>
                  <Input
                    value={settings.benefitsEligibility.overtime.rate}
                    type="number"
                    step="0.1"
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        benefitsEligibility: {
                          ...prev.benefitsEligibility,
                          overtime: {
                            ...prev.benefitsEligibility.overtime,
                            rate: parseFloat(e.target.value),
                          },
                        },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Holiday Rate Multiplier</Label>
                  <Input
                    value={settings.benefitsEligibility.overtime.holidayRate}
                    type="number"
                    step="0.1"
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        benefitsEligibility: {
                          ...prev.benefitsEligibility,
                          overtime: {
                            ...prev.benefitsEligibility.overtime,
                            holidayRate: parseFloat(e.target.value),
                          },
                        },
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Payroll Tab */}
        <TabsContent value="payroll" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Payroll Cycle Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Payroll Frequency</Label>
                    <Select value={settings.payrollCycles.frequency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                        <SelectItem value="semi-monthly">Semi-Monthly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Pay Day</Label>
                    <Select value={settings.payrollCycles.payDay}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Monday">Monday</SelectItem>
                        <SelectItem value="Tuesday">Tuesday</SelectItem>
                        <SelectItem value="Wednesday">Wednesday</SelectItem>
                        <SelectItem value="Thursday">Thursday</SelectItem>
                        <SelectItem value="Friday">Friday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Cutoff Day</Label>
                    <Select value={settings.payrollCycles.cutoffDay}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Monday">Monday</SelectItem>
                        <SelectItem value="Tuesday">Tuesday</SelectItem>
                        <SelectItem value="Wednesday">Wednesday</SelectItem>
                        <SelectItem value="Thursday">Thursday</SelectItem>
                        <SelectItem value="Friday">Friday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Processing Day</Label>
                    <Select value={settings.payrollCycles.processingDay}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Monday">Monday</SelectItem>
                        <SelectItem value="Tuesday">Tuesday</SelectItem>
                        <SelectItem value="Wednesday">Wednesday</SelectItem>
                        <SelectItem value="Thursday">Thursday</SelectItem>
                        <SelectItem value="Friday">Friday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Direct Deposit Day</Label>
                    <Select value={settings.payrollCycles.directDepositDay}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Monday">Monday</SelectItem>
                        <SelectItem value="Tuesday">Tuesday</SelectItem>
                        <SelectItem value="Wednesday">Wednesday</SelectItem>
                        <SelectItem value="Thursday">Thursday</SelectItem>
                        <SelectItem value="Friday">Friday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Approvals Tab */}
        <TabsContent value="approvals" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Time Approval Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Auto-approval for regular hours</Label>
                  <Switch
                    checked={settings.approvalRules.timeApproval.autoApproval}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        approvalRules: {
                          ...prev.approvalRules,
                          timeApproval: {
                            ...prev.approvalRules.timeApproval,
                            autoApproval: checked,
                          },
                        },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Maximum hours per day (auto-approval)</Label>
                  <Input
                    value={settings.approvalRules.timeApproval.maxHours}
                    type="number"
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        approvalRules: {
                          ...prev.approvalRules,
                          timeApproval: {
                            ...prev.approvalRules.timeApproval,
                            maxHours: parseInt(e.target.value),
                          },
                        },
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Require notes for overtime</Label>
                  <Switch
                    checked={settings.approvalRules.timeApproval.requireNotes}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        approvalRules: {
                          ...prev.approvalRules,
                          timeApproval: {
                            ...prev.approvalRules.timeApproval,
                            requireNotes: checked,
                          },
                        },
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Manager approval required</Label>
                  <Switch
                    checked={settings.approvalRules.timeApproval.managerApproval}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        approvalRules: {
                          ...prev.approvalRules,
                          timeApproval: {
                            ...prev.approvalRules.timeApproval,
                            managerApproval: checked,
                          },
                        },
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Expense Approval Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Auto-approval for small amounts</Label>
                  <Switch
                    checked={settings.approvalRules.expenseApproval.autoApproval}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        approvalRules: {
                          ...prev.approvalRules,
                          expenseApproval: {
                            ...prev.approvalRules.expenseApproval,
                            autoApproval: checked,
                          },
                        },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Maximum amount for auto-approval</Label>
                  <Input
                    value={settings.approvalRules.expenseApproval.maxAmount}
                    type="number"
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        approvalRules: {
                          ...prev.approvalRules,
                          expenseApproval: {
                            ...prev.approvalRules.expenseApproval,
                            maxAmount: parseInt(e.target.value),
                          },
                        },
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Require receipt for all expenses</Label>
                  <Switch
                    checked={settings.approvalRules.expenseApproval.requireReceipt}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        approvalRules: {
                          ...prev.approvalRules,
                          expenseApproval: {
                            ...prev.approvalRules.expenseApproval,
                            requireReceipt: checked,
                          },
                        },
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Manager approval required</Label>
                  <Switch
                    checked={settings.approvalRules.expenseApproval.managerApproval}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        approvalRules: {
                          ...prev.approvalRules,
                          expenseApproval: {
                            ...prev.approvalRules.expenseApproval,
                            managerApproval: checked,
                          },
                        },
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Use Mock Data</Label>
                    <p className="text-sm text-muted-foreground">
                      Toggle between mock and real data for development/testing
                    </p>
                  </div>
                  <Switch checked={settings.systemSettings.useMockData} onCheckedChange={handleToggleMockData} />
                </div>
                <Separator />
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Data Retention (days)</Label>
                    <Input
                      value={settings.systemSettings.dataRetention}
                      type="number"
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          systemSettings: {
                            ...prev.systemSettings,
                            dataRetention: parseInt(e.target.value),
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Backup Frequency</Label>
                    <Select value={settings.systemSettings.backupFrequency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Audit Logging</Label>
                    <Switch
                      checked={settings.systemSettings.auditLogging}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({
                          ...prev,
                          systemSettings: {
                            ...prev.systemSettings,
                            auditLogging: checked,
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assessment Uploads Tab */}
        <TabsContent value="assessments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Upload className="mr-2 h-5 w-5" />
                    Assessment Uploads & Tracking
                  </CardTitle>
                  <CardDescription>Upload and manage behavioral assessment results in bulk</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" onClick={handleDownloadTemplate}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Template
                  </Button>
                  <Button onClick={handleUploadFiles}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Files
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* File Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="flex flex-col items-center space-y-2">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Upload Assessment Files</p>
                      <p className="text-xs text-muted-foreground">
                        Supports CSV, JSON, and PDF formats. Drag and drop or click to browse.
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 mt-4">
                      <div className="flex items-center space-x-2">
                        <FileSpreadsheet className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="text-xs">CSV</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileJson className="h-4 w-4 text-blue-600" />
                        <span className="text-xs">JSON</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-red-600" />
                        <span className="text-xs">PDF</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upload History */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Upload History</h3>
                  <div className="space-y-3">
                    {settings.assessmentUploads.map((upload) => (
                      <div key={upload.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            {upload.fileType === "csv" && <FileSpreadsheet className="h-5 w-5 text-blue-600" />}
                            {upload.fileType === "json" && <FileJson className="h-5 w-5 text-blue-600" />}
                            {upload.fileType === "pdf" && <FileText className="h-5 w-5 text-red-600" />}
                          </div>
                          <div>
                            <h4 className="font-medium">{upload.fileName}</h4>
                            <p className="text-sm text-muted-foreground">
                              Uploaded: {new Date(upload.uploadDate).toLocaleDateString()} •{upload.employeeCount}{" "}
                              employees •{upload.processedCount} processed •{upload.errorCount} errors
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              upload.status === "completed"
                                ? "default"
                                : upload.status === "processing"
                                ? "secondary"
                                : upload.status === "error"
                                ? "destructive"
                                : "outline"
                            }
                          >
                            {upload.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <UserCheck className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assignment Rules */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Assignment Rules</CardTitle>
                    <CardDescription>
                      Configure how assessment results are automatically assigned to employees
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Auto-assign by Department</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="space-y-2">
                        <Label>Auto-assign by Role</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="space-y-2">
                        <Label>Require Manager Review</Label>
                        <Switch />
                      </div>
                      <div className="space-y-2">
                        <Label>Send Notifications</Label>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Target Profiles Tab */}
        <TabsContent value="targets" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-5 w-5" />
                    Target Profile Settings
                  </CardTitle>
                  <CardDescription>
                    Define desired DiSC/Integrus traits per role and customize cultural compatibility rules
                  </CardDescription>
                </div>
                <Button onClick={handleAddTargetProfile}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Target Profile
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {settings.targetProfiles.map((profile) => (
                  <div key={profile.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium">{profile.role}</h3>
                        <p className="text-sm text-muted-foreground">{profile.department}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={profile.priority === "high" ? "default" : "secondary"}>
                          {profile.priority} priority
                        </Badge>
                        <Badge variant={profile.active ? "default" : "secondary"}>
                          {profile.active ? "Active" : "Inactive"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* DiSC Profile */}
                      <div>
                        <h4 className="font-medium mb-2 flex items-center">
                          <Brain className="h-4 w-4 mr-1" />
                          DiSC Profile
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Primary Type:</span>
                            <Badge variant="outline">{profile.discProfile.primaryType}</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Secondary Type:</span>
                            <Badge variant="outline">{profile.discProfile.secondaryType}</Badge>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Preferred Traits:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {profile.discProfile.preferredTraits.map((trait, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {trait}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Avoid Traits:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {profile.discProfile.avoidTraits.map((trait, index) => (
                                <Badge key={index} variant="destructive" className="text-xs">
                                  {trait}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Integrus Profile */}
                      <div>
                        <h4 className="font-medium mb-2 flex items-center">
                          <Target className="h-4 w-4 mr-1" />
                          Integrus 360 Profile
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Leadership Type:</span>
                            <Badge variant="outline">{profile.integrusProfile.leadershipType}</Badge>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Preferred Strengths:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {profile.integrusProfile.preferredStrengths.map((strength, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {strength}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Development Areas:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {profile.integrusProfile.developmentAreas.map((area, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {area}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cultural Rules */}
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Cultural Compatibility Rules</h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{profile.culturalRules.teamwork}/10</div>
                          <div className="text-xs text-muted-foreground">Teamwork</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {profile.culturalRules.communication}/10
                          </div>
                          <div className="text-xs text-muted-foreground">Communication</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {profile.culturalRules.innovation}/10
                          </div>
                          <div className="text-xs text-muted-foreground">Innovation</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">{profile.culturalRules.stability}/10</div>
                          <div className="text-xs text-muted-foreground">Stability</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">{profile.culturalRules.adaptability}/10</div>
                          <div className="text-xs text-muted-foreground">Adaptability</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? `Edit ${dialogType}` : `Add ${dialogType}`}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input placeholder={`Enter ${dialogType} name`} />
            </div>
            {dialogType === "department" && (
              <>
                <div className="space-y-2">
                  <Label>Code</Label>
                  <Input placeholder="Enter department code" />
                </div>
                <div className="space-y-2">
                  <Label>Manager</Label>
                  <Input placeholder="Enter manager name" />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {settings.locations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            {dialogType === "location" && (
              <>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Textarea placeholder="Enter full address" />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="headquarters">Headquarters</SelectItem>
                      <SelectItem value="regional">Regional Office</SelectItem>
                      <SelectItem value="field">Field Office</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            {dialogType === "partner" && (
              <>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select partner type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agency">Recruiting Agency</SelectItem>
                      <SelectItem value="platform">Job Platform</SelectItem>
                      <SelectItem value="educational">Educational Institution</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Contact Person</Label>
                  <Input placeholder="Enter contact person name" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="Enter contact email" />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowAddDialog(false)}>{editingItem ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assessment Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Assessment Files</DialogTitle>
            <CardDescription>Upload behavioral assessment results in bulk format</CardDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium">Drop files here or click to browse</p>
              <p className="text-xs text-muted-foreground mt-1">Supports CSV, JSON, and PDF formats up to 10MB each</p>
            </div>

            <div className="space-y-2">
              <Label>File Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select file type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV - Comma Separated Values</SelectItem>
                  <SelectItem value="json">JSON - JavaScript Object Notation</SelectItem>
                  <SelectItem value="pdf">PDF - Portable Document Format</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Assessment Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select assessment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disc">DiSC Assessment</SelectItem>
                  <SelectItem value="integrus">Integrus 360 Leadership</SelectItem>
                  <SelectItem value="cultural">Cultural Fit Assessment</SelectItem>
                  <SelectItem value="personality">Personality Assessment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Auto-assign to Employees</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckSquare className="h-4 w-4" />
                  <span className="text-sm">Match by employee ID</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckSquare className="h-4 w-4" />
                  <span className="text-sm">Match by email address</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Square className="h-4 w-4" />
                  <span className="text-sm">Match by name (fuzzy)</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowUploadDialog(false)}>Upload Files</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Target Profile Dialog */}
      <Dialog open={showTargetProfileDialog} onOpenChange={setShowTargetProfileDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Target Profile</DialogTitle>
            <CardDescription>Define desired behavioral traits for a specific role</CardDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Role Title</Label>
                <Input placeholder="e.g., Senior Project Manager" />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {settings.departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* DiSC Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Brain className="h-4 w-4 mr-2" />
                  DiSC Profile Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Primary Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select primary type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="D">D - Dominant</SelectItem>
                        <SelectItem value="I">I - Influential</SelectItem>
                        <SelectItem value="S">S - Steady</SelectItem>
                        <SelectItem value="C">C - Conscientious</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Secondary Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select secondary type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="D">D - Dominant</SelectItem>
                        <SelectItem value="I">I - Influential</SelectItem>
                        <SelectItem value="S">S - Steady</SelectItem>
                        <SelectItem value="C">C - Conscientious</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Preferred Traits</Label>
                  <Textarea placeholder="Enter preferred behavioral traits, one per line" />
                </div>
                <div className="space-y-2">
                  <Label>Avoid Traits</Label>
                  <Textarea placeholder="Enter traits to avoid, one per line" />
                </div>
              </CardContent>
            </Card>

            {/* Integrus Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  Integrus 360 Leadership Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Leadership Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select leadership type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Driver">Driver</SelectItem>
                      <SelectItem value="Creator">Creator</SelectItem>
                      <SelectItem value="Supporter">Supporter</SelectItem>
                      <SelectItem value="Refiner">Refiner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Preferred Strengths</Label>
                  <Textarea placeholder="Enter preferred leadership strengths, one per line" />
                </div>
                <div className="space-y-2">
                  <Label>Development Areas</Label>
                  <Textarea placeholder="Enter areas for development, one per line" />
                </div>
              </CardContent>
            </Card>

            {/* Cultural Rules */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Cultural Compatibility Rules</CardTitle>
                <CardDescription>Set importance levels for cultural factors (1-10 scale)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label>Teamwork</Label>
                    <Input type="number" min="1" max="10" defaultValue="7" />
                  </div>
                  <div className="space-y-2">
                    <Label>Communication</Label>
                    <Input type="number" min="1" max="10" defaultValue="8" />
                  </div>
                  <div className="space-y-2">
                    <Label>Innovation</Label>
                    <Input type="number" min="1" max="10" defaultValue="6" />
                  </div>
                  <div className="space-y-2">
                    <Label>Stability</Label>
                    <Input type="number" min="1" max="10" defaultValue="8" />
                  </div>
                  <div className="space-y-2">
                    <Label>Adaptability</Label>
                    <Input type="number" min="1" max="10" defaultValue="7" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Priority */}
            <div className="space-y-2">
              <Label>Priority Level</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTargetProfileDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowTargetProfileDialog(false)}>Create Profile</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ask HBI Chat */}
      <AskHBIChat />
    </div>
  )
}
