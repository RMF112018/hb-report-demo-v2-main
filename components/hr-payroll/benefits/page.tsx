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
  Heart,
  Eye,
  Stethoscope,
  CreditCard,
  Users,
  Settings,
  Download,
  Upload,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Calendar,
  MapPin,
  Building2,
  FileText,
  UserCheck,
  UserX,
  TrendingUp,
} from "lucide-react"
import AskHBIChat from "../AskHBIChat"

// Mock data for benefits management
const mockBenefitsData = {
  plans: {
    health: [
      {
        id: "health-001",
        name: "Premium Health Plan",
        type: "health",
        provider: "Blue Cross Blue Shield",
        coverage: "80/20",
        monthlyCost: 450,
        employerContribution: 360,
        employeeCost: 90,
        description: "Comprehensive health coverage with low deductibles",
        active: true,
      },
      {
        id: "health-002",
        name: "Standard Health Plan",
        type: "health",
        provider: "Aetna",
        coverage: "70/30",
        monthlyCost: 350,
        employerContribution: 280,
        employeeCost: 70,
        description: "Standard health coverage with moderate deductibles",
        active: true,
      },
    ],
    dental: [
      {
        id: "dental-001",
        name: "Comprehensive Dental",
        type: "dental",
        provider: "Delta Dental",
        coverage: "100/80/50",
        monthlyCost: 120,
        employerContribution: 96,
        employeeCost: 24,
        description: "Full dental coverage including orthodontics",
        active: true,
      },
    ],
    vision: [
      {
        id: "vision-001",
        name: "Vision Plus",
        type: "vision",
        provider: "VSP",
        coverage: "100/80",
        monthlyCost: 80,
        employerContribution: 64,
        employeeCost: 16,
        description: "Comprehensive vision coverage with frame allowance",
        active: true,
      },
    ],
    retirement: [
      {
        id: "retirement-001",
        name: "401(k) Plan",
        type: "retirement",
        provider: "Fidelity",
        coverage: "3% match",
        monthlyCost: 0,
        employerContribution: 0,
        employeeCost: 0,
        description: "Traditional 401(k) with 3% company match",
        active: true,
      },
    ],
  },
  eligibilityRules: [
    {
      id: "rule-001",
      planType: "health",
      title: "All Employees",
      location: "All Locations",
      tenure: "0 months",
      waitingPeriod: 30,
      active: true,
    },
    {
      id: "rule-002",
      planType: "dental",
      title: "All Employees",
      location: "All Locations",
      tenure: "0 months",
      waitingPeriod: 30,
      active: true,
    },
    {
      id: "rule-003",
      planType: "vision",
      title: "All Employees",
      location: "All Locations",
      tenure: "0 months",
      waitingPeriod: 30,
      active: true,
    },
    {
      id: "rule-004",
      planType: "retirement",
      title: "All Employees",
      location: "All Locations",
      tenure: "3 months",
      waitingPeriod: 90,
      active: true,
    },
  ],
  enrollments: [
    {
      employeeId: "EMP001",
      name: "Sarah Johnson",
      department: "Construction",
      title: "Project Manager",
      location: "Main Office",
      hireDate: "2023-01-15",
      healthPlan: "Premium Health Plan",
      dentalPlan: "Comprehensive Dental",
      visionPlan: "Vision Plus",
      retirementPlan: "401(k) Plan",
      status: "Enrolled",
      effectiveDate: "2023-02-15",
    },
    {
      employeeId: "EMP002",
      name: "Michael Chen",
      department: "Engineering",
      title: "Site Engineer",
      location: "Main Office",
      hireDate: "2023-03-20",
      healthPlan: "Standard Health Plan",
      dentalPlan: "Comprehensive Dental",
      visionPlan: "Vision Plus",
      retirementPlan: "401(k) Plan",
      status: "Enrolled",
      effectiveDate: "2023-04-20",
    },
    {
      employeeId: "EMP003",
      name: "Lisa Rodriguez",
      department: "Safety",
      title: "Safety Coordinator",
      location: "Field Office",
      hireDate: "2023-06-10",
      healthPlan: "Premium Health Plan",
      dentalPlan: "Comprehensive Dental",
      visionPlan: "Vision Plus",
      retirementPlan: "401(k) Plan",
      status: "Pending",
      effectiveDate: "2023-09-10",
    },
    {
      employeeId: "EMP004",
      name: "David Thompson",
      department: "Operations",
      title: "Superintendent",
      location: "Main Office",
      hireDate: "2022-11-05",
      healthPlan: "Premium Health Plan",
      dentalPlan: "Comprehensive Dental",
      visionPlan: "Vision Plus",
      retirementPlan: "401(k) Plan",
      status: "Enrolled",
      effectiveDate: "2023-02-05",
    },
    {
      employeeId: "EMP005",
      name: "Jennifer Lee",
      department: "Administration",
      title: "Office Manager",
      location: "Main Office",
      hireDate: "2023-08-15",
      healthPlan: "Standard Health Plan",
      dentalPlan: "Comprehensive Dental",
      visionPlan: "Vision Plus",
      retirementPlan: "401(k) Plan",
      status: "Enrolled",
      effectiveDate: "2023-11-15",
    },
  ],
}

export default function BenefitsPage() {
  const [benefitsData, setBenefitsData] = useState(mockBenefitsData)
  const [activeTab, setActiveTab] = useState("plans")
  const [showAddPlanDialog, setShowAddPlanDialog] = useState(false)
  const [showAddRuleDialog, setShowAddRuleDialog] = useState(false)
  const [showEnrollmentDialog, setShowEnrollmentDialog] = useState(false)
  const [editingPlan, setEditingPlan] = useState<any>(null)
  const [editingRule, setEditingRule] = useState<any>(null)
  const [selectedPlanType, setSelectedPlanType] = useState<"health" | "dental" | "vision" | "retirement">("health")

  const handleAddPlan = (type: "health" | "dental" | "vision" | "retirement") => {
    setSelectedPlanType(type)
    setEditingPlan(null)
    setShowAddPlanDialog(true)
  }

  const handleEditPlan = (plan: any) => {
    setEditingPlan(plan)
    setSelectedPlanType(plan.type)
    setShowAddPlanDialog(true)
  }

  const handleAddRule = () => {
    setEditingRule(null)
    setShowAddRuleDialog(true)
  }

  const handleEditRule = (rule: any) => {
    setEditingRule(rule)
    setShowAddRuleDialog(true)
  }

  const handleExportEnrollments = (format: string) => {
    // Mock export functionality
    console.log(`Exporting enrollments in ${format} format`)
  }

  const getPlanIcon = (type: string) => {
    switch (type) {
      case "health":
        return <Heart className="h-5 w-5 text-red-600" />
      case "dental":
        return <Stethoscope className="h-5 w-5 text-blue-600" />
      case "vision":
        return <Eye className="h-5 w-5 text-purple-600" />
      case "retirement":
        return <CreditCard className="h-5 w-5 text-green-600" />
      default:
        return <Heart className="h-5 w-5" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Enrolled":
        return <Badge variant="default">Enrolled</Badge>
      case "Pending":
        return <Badge variant="secondary">Pending</Badge>
      case "Not Enrolled":
        return <Badge variant="outline">Not Enrolled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Benefits Management</h1>
          <p className="text-muted-foreground">Manage health, dental, vision, and retirement benefits</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => handleExportEnrollments("excel")}>
            <Download className="mr-2 h-4 w-4" />
            Export Enrollments
          </Button>
        </div>
      </div>

      {/* Benefits Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="plans">Benefit Plans</TabsTrigger>
          <TabsTrigger value="eligibility">Eligibility Rules</TabsTrigger>
          <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
          <TabsTrigger value="self-service">Self Service</TabsTrigger>
        </TabsList>

        {/* Benefit Plans Tab */}
        <TabsContent value="plans" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Health Plans */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Heart className="mr-2 h-5 w-5 text-red-600" />
                      Health Plans
                    </CardTitle>
                    <CardDescription>Manage health insurance plans and coverage options</CardDescription>
                  </div>
                  <Button onClick={() => handleAddPlan("health")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Plan
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {benefitsData.plans.health.map((plan) => (
                    <div key={plan.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{plan.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {plan.provider} • {plan.coverage} coverage
                          </p>
                        </div>
                        <Badge variant={plan.active ? "default" : "secondary"}>
                          {plan.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Monthly Cost:</span>
                          <div className="font-medium">${plan.monthlyCost}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Employer Pays:</span>
                          <div className="font-medium">${plan.employerContribution}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Employee Pays:</span>
                          <div className="font-medium">${plan.employeeCost}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-3">
                        <Button variant="outline" size="sm" onClick={() => handleEditPlan(plan)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Dental Plans */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Stethoscope className="mr-2 h-5 w-5 text-blue-600" />
                      Dental Plans
                    </CardTitle>
                    <CardDescription>Manage dental insurance plans and coverage</CardDescription>
                  </div>
                  <Button onClick={() => handleAddPlan("dental")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Plan
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {benefitsData.plans.dental.map((plan) => (
                    <div key={plan.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{plan.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {plan.provider} • {plan.coverage} coverage
                          </p>
                        </div>
                        <Badge variant={plan.active ? "default" : "secondary"}>
                          {plan.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Monthly Cost:</span>
                          <div className="font-medium">${plan.monthlyCost}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Employer Pays:</span>
                          <div className="font-medium">${plan.employerContribution}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Employee Pays:</span>
                          <div className="font-medium">${plan.employeeCost}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-3">
                        <Button variant="outline" size="sm" onClick={() => handleEditPlan(plan)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Vision Plans */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Eye className="mr-2 h-5 w-5 text-purple-600" />
                      Vision Plans
                    </CardTitle>
                    <CardDescription>Manage vision insurance plans and coverage</CardDescription>
                  </div>
                  <Button onClick={() => handleAddPlan("vision")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Plan
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {benefitsData.plans.vision.map((plan) => (
                    <div key={plan.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{plan.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {plan.provider} • {plan.coverage} coverage
                          </p>
                        </div>
                        <Badge variant={plan.active ? "default" : "secondary"}>
                          {plan.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Monthly Cost:</span>
                          <div className="font-medium">${plan.monthlyCost}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Employer Pays:</span>
                          <div className="font-medium">${plan.employerContribution}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Employee Pays:</span>
                          <div className="font-medium">${plan.employeeCost}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-3">
                        <Button variant="outline" size="sm" onClick={() => handleEditPlan(plan)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Retirement Plans */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <CreditCard className="mr-2 h-5 w-5 text-green-600" />
                      Retirement Plans
                    </CardTitle>
                    <CardDescription>Manage retirement and 401(k) plans</CardDescription>
                  </div>
                  <Button onClick={() => handleAddPlan("retirement")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Plan
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {benefitsData.plans.retirement.map((plan) => (
                    <div key={plan.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{plan.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {plan.provider} • {plan.coverage}
                          </p>
                        </div>
                        <Badge variant={plan.active ? "default" : "secondary"}>
                          {plan.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Match Rate:</span>
                          <div className="font-medium">{plan.coverage}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Vesting:</span>
                          <div className="font-medium">3 years</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Max Match:</span>
                          <div className="font-medium">6%</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-3">
                        <Button variant="outline" size="sm" onClick={() => handleEditPlan(plan)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Eligibility Rules Tab */}
        <TabsContent value="eligibility" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Settings className="mr-2 h-5 w-5" />
                    Eligibility Rules
                  </CardTitle>
                  <CardDescription>Define who is eligible for each benefit plan</CardDescription>
                </div>
                <Button onClick={handleAddRule}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {benefitsData.eligibilityRules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        {getPlanIcon(rule.planType)}
                      </div>
                      <div>
                        <h3 className="font-semibold capitalize">{rule.planType} Plan</h3>
                        <p className="text-sm text-muted-foreground">
                          {rule.title} • {rule.location} • {rule.tenure} tenure
                        </p>
                        <p className="text-xs text-muted-foreground">Waiting period: {rule.waitingPeriod} days</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={rule.active ? "default" : "secondary"}>
                        {rule.active ? "Active" : "Inactive"}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => handleEditRule(rule)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enrollments Tab */}
        <TabsContent value="enrollments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Employee Enrollments
                  </CardTitle>
                  <CardDescription>View and manage employee benefit enrollments</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" onClick={() => handleExportEnrollments("excel")}>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                  <Button onClick={() => setShowEnrollmentDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Enrollment
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {benefitsData.enrollments.map((enrollment) => (
                  <div key={enrollment.employeeId} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{enrollment.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {enrollment.title} • {enrollment.department} • {enrollment.location}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Hired: {enrollment.hireDate} • Effective: {enrollment.effectiveDate}
                        </p>
                      </div>
                      {getStatusBadge(enrollment.status)}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Health:</span>
                        <div className="font-medium">{enrollment.healthPlan}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Dental:</span>
                        <div className="font-medium">{enrollment.dentalPlan}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Vision:</span>
                        <div className="font-medium">{enrollment.visionPlan}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Retirement:</span>
                        <div className="font-medium">{enrollment.retirementPlan}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Self Service Tab */}
        <TabsContent value="self-service" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCheck className="mr-2 h-5 w-5" />
                  Employee Self-Service
                </CardTitle>
                <CardDescription>Mock interface for employee benefit enrollment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Current Enrollments</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Health Insurance</span>
                        <Badge variant="default">Premium Health Plan</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Dental Insurance</span>
                        <Badge variant="default">Comprehensive Dental</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Vision Insurance</span>
                        <Badge variant="default">Vision Plus</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">401(k) Plan</span>
                        <Badge variant="default">Enrolled (3% match)</Badge>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full">
                    <Edit className="mr-2 h-4 w-4" />
                    Update Enrollments
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Enrollment Statistics
                </CardTitle>
                <CardDescription>Current enrollment rates and statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">85%</div>
                      <div className="text-sm text-muted-foreground">Health Enrollment</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">78%</div>
                      <div className="text-sm text-muted-foreground">Dental Enrollment</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">72%</div>
                      <div className="text-sm text-muted-foreground">Vision Enrollment</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">91%</div>
                      <div className="text-sm text-muted-foreground">401(k) Participation</div>
                    </div>
                  </div>
                  <Separator />
                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span>Total Employees:</span>
                      <span>47</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Eligible for Benefits:</span>
                      <span>45</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Open Enrollment Period:</span>
                      <span>Nov 1-15, 2024</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Plan Dialog */}
      <Dialog open={showAddPlanDialog} onOpenChange={setShowAddPlanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPlan ? `Edit ${selectedPlanType} Plan` : `Add ${selectedPlanType} Plan`}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Plan Name</Label>
              <Input placeholder="Enter plan name" />
            </div>
            <div className="space-y-2">
              <Label>Provider</Label>
              <Input placeholder="Enter provider name" />
            </div>
            <div className="space-y-2">
              <Label>Coverage Level</Label>
              <Input placeholder="e.g., 80/20, 100/80/50" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Monthly Cost</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Employer Pays</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Employee Pays</Label>
                <Input type="number" placeholder="0" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Enter plan description" />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="active" />
              <Label htmlFor="active">Active Plan</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddPlanDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowAddPlanDialog(false)}>{editingPlan ? "Update" : "Add"} Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Rule Dialog */}
      <Dialog open={showAddRuleDialog} onOpenChange={setShowAddRuleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRule ? "Edit Eligibility Rule" : "Add Eligibility Rule"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Plan Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select plan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="dental">Dental</SelectItem>
                  <SelectItem value="vision">Vision</SelectItem>
                  <SelectItem value="retirement">Retirement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Eligible Titles</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select titles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  <SelectItem value="managers">Managers Only</SelectItem>
                  <SelectItem value="full-time">Full-time Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Eligible Locations</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="main-office">Main Office Only</SelectItem>
                  <SelectItem value="field-offices">Field Offices Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Minimum Tenure (months)</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Waiting Period (days)</Label>
                <Input type="number" placeholder="30" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="rule-active" />
              <Label htmlFor="rule-active">Active Rule</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddRuleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowAddRuleDialog(false)}>{editingRule ? "Update" : "Add"} Rule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Enrollment Dialog */}
      <Dialog open={showEnrollmentDialog} onOpenChange={setShowEnrollmentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Employee Enrollment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Employee</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emp001">Sarah Johnson</SelectItem>
                  <SelectItem value="emp002">Michael Chen</SelectItem>
                  <SelectItem value="emp003">Lisa Rodriguez</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Health Plan</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select health plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="premium">Premium Health Plan</SelectItem>
                  <SelectItem value="standard">Standard Health Plan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Dental Plan</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select dental plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comprehensive">Comprehensive Dental</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Vision Plan</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select vision plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vision-plus">Vision Plus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Retirement Plan</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select retirement plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="401k">401(k) Plan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Effective Date</Label>
              <Input type="date" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEnrollmentDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowEnrollmentDialog(false)}>Add Enrollment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ask HBI Chat */}
      <AskHBIChat />
    </div>
  )
}
