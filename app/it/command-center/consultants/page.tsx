"use client"

import React, { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { ITModuleNavigation } from "@/components/layout/ITModuleNavigation"
import { AppHeader } from "@/components/layout/app-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Shield,
  Users,
  Building,
  Calendar,
  Settings,
  RefreshCw,
  Filter,
  Download,
  Plus,
  Edit,
  Eye,
  Archive,
  MessageSquare,
  FileText,
  Home,
  Activity,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"

import commandCenterMock from "@/data/mock/it/commandCenterMock.json"
import ConsultantDashboardCard from "@/components/cards/it/ConsultantDashboardCard"
import { EnhancedHBIInsights } from "@/components/cards/EnhancedHBIInsights"

/**
 * Consultant Dashboard Module
 * --------------------------
 * External vendor and consultant management
 */

export default function ConsultantsPage() {
  const { user } = useAuth()
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("overview")

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400">You don't have permission to access the IT Command Center.</p>
        </div>
      </div>
    )
  }

  const consultantData = {
    totalConsultants: 12,
    activeConsultants: 9,
    expiringSoon: 2,
    monthlySpend: 127500,
    systemCoverage: 94.2,
    yearlySpend: 1530000,
    avgContractValue: 15300,
    performanceScore: 87.3,
    renewalRate: 78.5,
    responseTime: "4.2 hours",
    deliverableOnTime: 89.7,
    riskAssessment: "Medium",
    costSavings: 245000,
    complianceRate: 96.8,
    expertiseAreas: 8,
    geographicCoverage: 3,
    certificationLevel: 92.1,
    securityClearance: 67,
    escalationRate: 12.3,
    customerSatisfaction: 4.2,
    knowledgeTransfer: 85.4,
    contractRenewals: 7,
    newVendorOnboarding: 3,
    vendorRiskScore: 2.3,
    slaCompliance: 94.7,
    businessCriticalSupport: 15,
  }

  // Consultant-specific AI insights
  const consultantInsights = [
    {
      id: "consultant-1",
      type: "risk",
      severity: "high",
      title: "Vendor Dependency Risk",
      text: "CyberShield Solutions handles 35% of critical security operations. Single point of failure detected.",
      action: "Diversify security vendor portfolio and establish backup SOC capabilities.",
      confidence: 92,
      relatedMetrics: ["Vendor Dependency", "Security Coverage", "Risk Mitigation"],
    },
    {
      id: "consultant-2",
      type: "opportunity",
      severity: "medium",
      title: "Cost Optimization Potential",
      text: "HBI Analysis identifies 18% cost savings through contract consolidation and renegotiation.",
      action: "Consolidate overlapping services and renegotiate contracts expiring in Q1.",
      confidence: 85,
      relatedMetrics: ["Cost Optimization", "Contract Management", "Procurement"],
    },
    {
      id: "consultant-3",
      type: "alert",
      severity: "high",
      title: "Contract Renewal Deadline",
      text: "2 critical consultant contracts expire within 30 days without renewal discussions initiated.",
      action: "Initiate renewal negotiations with DataGuard Analytics and NetworkPro Services.",
      confidence: 100,
      relatedMetrics: ["Contract Lifecycle", "Renewal Management", "Service Continuity"],
    },
    {
      id: "consultant-4",
      type: "performance",
      severity: "medium",
      title: "Performance Degradation Alert",
      text: "ComplianceFirst LLC showing 23% decline in deliverable quality over last 6 months.",
      action: "Conduct performance review and implement improvement plan or vendor replacement.",
      confidence: 88,
      relatedMetrics: ["Performance Management", "Quality Assurance", "Vendor Assessment"],
    },
    {
      id: "consultant-5",
      type: "forecast",
      severity: "low",
      title: "Budget Variance Projection",
      text: "Current consultant spending trend suggests 12% over-budget by year-end.",
      action: "Implement budget controls and evaluate non-essential consultant services.",
      confidence: 79,
      relatedMetrics: ["Budget Management", "Cost Control", "Financial Planning"],
    },
    {
      id: "consultant-6",
      type: "opportunity",
      severity: "medium",
      title: "Knowledge Transfer Opportunity",
      text: "SecureIT Experts demonstrating exceptional cybersecurity practices worth internalizing.",
      action: "Negotiate knowledge transfer sessions and document best practices for internal team.",
      confidence: 90,
      relatedMetrics: ["Knowledge Transfer", "Capability Building", "Internal Development"],
    },
  ]

  const activeConsultants = [
    {
      id: "C-001",
      name: "CyberShield Solutions",
      contactPerson: "Sarah Mitchell",
      areaOfResponsibility: "SOC Compliance",
      contractStatus: "Active",
      contractValue: 15000,
      renewalDate: "2025-01-15",
      lastEngagement: "2024-12-20",
      lastDeliverable: "Q4 SOC 2 Audit Report",
      performance: "Excellent",
    },
    {
      id: "C-002",
      name: "SecureIT Experts",
      contactPerson: "Marcus Rodriguez",
      areaOfResponsibility: "Cybersecurity",
      contractStatus: "Active",
      contractValue: 22000,
      renewalDate: "2025-03-01",
      lastEngagement: "2024-12-18",
      lastDeliverable: "Penetration Testing Report",
      performance: "Good",
    },
    {
      id: "C-003",
      name: "CloudOps Partners",
      contactPerson: "Jennifer Chen",
      areaOfResponsibility: "Server Administration",
      contractStatus: "Active",
      contractValue: 18500,
      renewalDate: "2025-02-01",
      lastEngagement: "2024-12-22",
      lastDeliverable: "Monthly Infrastructure Report",
      performance: "Excellent",
    },
    {
      id: "C-004",
      name: "DataGuard Analytics",
      contactPerson: "Robert Kim",
      areaOfResponsibility: "Data Analytics",
      contractStatus: "Expiring Soon",
      contractValue: 12000,
      renewalDate: "2025-01-01",
      lastEngagement: "2024-12-15",
      lastDeliverable: "Business Intelligence Dashboard",
      performance: "Good",
    },
    {
      id: "C-005",
      name: "ComplianceFirst LLC",
      contactPerson: "David Wilson",
      areaOfResponsibility: "Regulatory Compliance",
      contractStatus: "Under Review",
      contractValue: 9500,
      renewalDate: "2025-06-01",
      lastEngagement: "2024-12-10",
      lastDeliverable: "GDPR Compliance Report",
      performance: "Fair",
    },
  ]

  const archivedConsultants = [
    {
      id: "C-006",
      name: "Legacy Systems Inc",
      contactPerson: "Michael Brown",
      areaOfResponsibility: "Legacy System Maintenance",
      contractStatus: "Expired",
      contractValue: 8500,
      lastEngagement: "2023-12-31",
      reason: "Contract not renewed - services no longer needed",
    },
    {
      id: "C-007",
      name: "QuickFix IT",
      contactPerson: "Amanda Davis",
      areaOfResponsibility: "Help Desk Support",
      contractStatus: "Terminated",
      contractValue: 5000,
      lastEngagement: "2023-11-15",
      reason: "Contract terminated - performance issues",
    },
  ]

  const auditTrail = [
    {
      id: "AT-001",
      consultant: "CyberShield Solutions",
      date: "2024-12-20",
      type: "Engagement",
      description: "SOC 2 audit completed successfully",
      status: "Completed",
    },
    {
      id: "AT-002",
      consultant: "SecureIT Experts",
      date: "2024-12-18",
      type: "Deliverable",
      description: "Penetration testing report delivered",
      status: "Reviewed",
    },
    {
      id: "AT-003",
      consultant: "ComplianceFirst LLC",
      date: "2024-12-15",
      type: "Issue",
      description: "Late delivery of GDPR compliance report",
      status: "Escalated",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "text-green-600 bg-green-100"
      case "expiring soon":
        return "text-orange-600 bg-orange-100"
      case "under review":
        return "text-blue-600 bg-blue-100"
      case "expired":
        return "text-gray-600 bg-gray-100"
      case "terminated":
        return "text-red-600 bg-red-100"
      case "completed":
        return "text-green-600 bg-green-100"
      case "reviewed":
        return "text-blue-600 bg-blue-100"
      case "escalated":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getPerformanceColor = (performance: string) => {
    switch (performance.toLowerCase()) {
      case "excellent":
        return "text-green-600 bg-green-100"
      case "good":
        return "text-blue-600 bg-blue-100"
      case "fair":
        return "text-orange-600 bg-orange-100"
      case "poor":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getStatusIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "engagement":
        return CheckCircle
      case "deliverable":
        return FileText
      case "issue":
        return AlertTriangle
      default:
        return Activity
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <div className="sticky top-16 z-40 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3">
          <div className="max-w-[1920px] mx-auto">
            <Breadcrumb className="mb-3">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="flex items-center gap-1">
                    <Home className="h-3 w-3" />
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/it-command-center" className="text-muted-foreground hover:text-foreground">
                    IT Command Center
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Consultants</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground">Consultants & Vendors</h1>
                <Badge variant="outline" className="text-xs whitespace-nowrap">
                  {consultantData.activeConsultants} Active
                </Badge>
              </div>

              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <Button variant="ghost" size="sm" className="text-sm">
                  <Plus className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Add Consultant</span>
                </Button>
                <Button variant="ghost" size="sm" className="text-sm">
                  <RefreshCw className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
                <Button variant="ghost" size="sm" className="text-sm">
                  <Download className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </div>
            </div>

            <div className="mt-3">
              <ITModuleNavigation />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
          {/* Left Sidebar - Quick Stats and Actions */}
          <div className="xl:col-span-4">
            <div className="space-y-4">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Consultant Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Active Consultants</span>
                      <span className="font-bold text-lg">{consultantData.activeConsultants}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Monthly Spend</span>
                      <span className="font-bold text-green-600">
                        ${(consultantData.monthlySpend / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Performance Score</span>
                      <span className="font-bold text-blue-600">{consultantData.performanceScore}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Expiring Soon</span>
                      <span className="font-bold text-orange-600">{consultantData.expiringSoon}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button className="w-full" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Consultant
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Review Contracts
                    </Button>
                    <Button className="w-full" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Communication
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Report
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{consultantData.performanceScore}%</div>
                      <p className="text-sm text-muted-foreground">Overall Performance</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>On-time Delivery</span>
                        <span className="font-medium">{consultantData.deliverableOnTime}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${consultantData.deliverableOnTime}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Response Time</span>
                        <span className="font-medium text-blue-600">{consultantData.responseTime}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contract Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contract Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Annual Spend</span>
                      <span className="font-bold text-lg">${(consultantData.yearlySpend / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Up for Renewal</span>
                      <span className="font-medium text-blue-600">{consultantData.contractRenewals}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">New Onboarding</span>
                      <span className="font-medium text-purple-600">{consultantData.newVendorOnboarding}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Risk Level</span>
                      <Badge className="bg-yellow-100 text-yellow-800">{consultantData.riskAssessment}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI Consultant Intelligence</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-80">
                    <EnhancedHBIInsights config={consultantInsights} cardId="consultant-ai-insights" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Main Content Area */}
          <div className="xl:col-span-8">
            <div className="bg-card border border-border rounded-lg">
              <CardHeader>
                <CardTitle className="text-xl">Consultant & Vendor Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="archived">Archived</TabsTrigger>
                    <TabsTrigger value="audit">Audit Trail</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <ConsultantDashboardCard />

                    {/* Enhanced Performance Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Cost Efficiency</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-blue-600">
                            ${(consultantData.costSavings / 1000).toFixed(0)}K
                          </div>
                          <p className="text-xs text-muted-foreground">Cost Savings YTD</p>
                          <div className="text-sm mt-1">
                            <span className="font-medium">${consultantData.avgContractValue}</span> avg contract
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-purple-600">
                            {consultantData.customerSatisfaction}/5
                          </div>
                          <p className="text-xs text-muted-foreground">Satisfaction Score</p>
                          <div className="text-sm mt-1">
                            <span className="font-medium">{consultantData.escalationRate}%</span> escalation rate
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-emerald-600">{consultantData.complianceRate}%</div>
                          <p className="text-xs text-muted-foreground">SLA Compliance</p>
                          <div className="text-sm mt-1">
                            <span className="font-medium">{consultantData.slaCompliance}%</span> overall SLA
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Vendor Risk & Performance Matrix */}
                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle className="text-lg">Vendor Risk & Performance Matrix</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Renewal Rate</span>
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-green-500 h-2 rounded-full"
                                    style={{ width: `${consultantData.renewalRate}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-bold">{consultantData.renewalRate}%</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Knowledge Transfer</span>
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-500 h-2 rounded-full"
                                    style={{ width: `${consultantData.knowledgeTransfer}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-bold">{consultantData.knowledgeTransfer}%</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Security Clearance</span>
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-yellow-500 h-2 rounded-full"
                                    style={{ width: `${consultantData.securityClearance}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-bold">{consultantData.securityClearance}%</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Certification Level</span>
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-purple-500 h-2 rounded-full"
                                    style={{ width: `${consultantData.certificationLevel}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-bold">{consultantData.certificationLevel}%</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-sm text-muted-foreground space-y-2">
                            <div className="flex justify-between">
                              <span>Expertise Areas:</span>
                              <span className="font-medium">{consultantData.expertiseAreas}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Geographic Coverage:</span>
                              <span className="font-medium">{consultantData.geographicCoverage} regions</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Vendor Risk Score:</span>
                              <span className="font-medium text-green-600">{consultantData.vendorRiskScore}/5</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Business Critical Support:</span>
                              <span className="font-medium">{consultantData.businessCriticalSupport}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Contract Lifecycle Management */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Risk Assessment</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Overall Risk Level</span>
                              <Badge className="bg-yellow-100 text-yellow-800">{consultantData.riskAssessment}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Vendor Dependencies</span>
                              <span className="font-medium text-red-600">High</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Performance Variations</span>
                              <span className="font-medium text-yellow-600">Medium</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Contract Compliance</span>
                              <span className="font-medium text-green-600">Low Risk</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Vendor Pipeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">New Vendor Onboarding</span>
                              <span className="font-medium">{consultantData.newVendorOnboarding}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Evaluation Phase</span>
                              <span className="font-medium text-blue-600">5</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">RFP In Progress</span>
                              <span className="font-medium text-purple-600">2</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Contract Negotiation</span>
                              <span className="font-medium text-orange-600">3</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="active" className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Filters:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="expiring">Expiring Soon</SelectItem>
                            <SelectItem value="review">Under Review</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Active Consultants & Vendors</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Company</TableHead>
                              <TableHead>Area of Responsibility</TableHead>
                              <TableHead>Contract Status</TableHead>
                              <TableHead>Renewal Date</TableHead>
                              <TableHead>Last Engagement</TableHead>
                              <TableHead>Performance</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {activeConsultants.map((consultant) => (
                              <TableRow key={consultant.id}>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Building className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                      <span className="font-medium">{consultant.name}</span>
                                      <p className="text-xs text-muted-foreground">{consultant.contactPerson}</p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-sm">{consultant.areaOfResponsibility}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={getStatusColor(consultant.contractStatus)}>
                                    {consultant.contractStatus}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-sm">{consultant.renewalDate}</TableCell>
                                <TableCell className="text-sm">
                                  {consultant.lastEngagement}
                                  <p className="text-xs text-muted-foreground">{consultant.lastDeliverable}</p>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={getPerformanceColor(consultant.performance)}>
                                    {consultant.performance}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-1">
                                    <Button variant="ghost" size="sm">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <MessageSquare className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="archived" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Archived Consultants</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Company</TableHead>
                              <TableHead>Area of Responsibility</TableHead>
                              <TableHead>Contract Status</TableHead>
                              <TableHead>Last Engagement</TableHead>
                              <TableHead>Reason</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {archivedConsultants.map((consultant) => (
                              <TableRow key={consultant.id}>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Archive className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                      <span className="font-medium">{consultant.name}</span>
                                      <p className="text-xs text-muted-foreground">{consultant.contactPerson}</p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-sm">{consultant.areaOfResponsibility}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={getStatusColor(consultant.contractStatus)}>
                                    {consultant.contractStatus}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-sm">{consultant.lastEngagement}</TableCell>
                                <TableCell className="text-sm max-w-48">
                                  <span className="text-muted-foreground">{consultant.reason}</span>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-1">
                                    <Button variant="ghost" size="sm">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <FileText className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="audit" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Internal Audit Trail</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {auditTrail.map((entry) => {
                            const StatusIcon = getStatusIcon(entry.type)
                            return (
                              <div key={entry.id} className="border rounded-lg p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                      <StatusIcon className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium">{entry.consultant}</span>
                                        <Badge variant="outline" className="text-xs">
                                          {entry.type}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-muted-foreground mb-2">{entry.description}</p>
                                      <p className="text-xs text-muted-foreground">{entry.date}</p>
                                    </div>
                                  </div>
                                  <Badge variant="outline" className={getStatusColor(entry.status)}>
                                    {entry.status}
                                  </Badge>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
