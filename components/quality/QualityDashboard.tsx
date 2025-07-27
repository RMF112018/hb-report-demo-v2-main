/**
 * @fileoverview Quality Dashboard Component
 * @module QualityDashboard
 * @version 1.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Main quality control dashboard with section cards for:
 * - Quality Metrics
 * - Warranty Log
 * - Programs & Procedures
 * - Notices & Updates
 * - Lessons Learned
 */

"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import {
  Shield,
  FileText,
  BookOpen,
  Bell,
  AlertTriangle,
  Users,
  Calendar,
  Download,
  Upload,
  Eye,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Settings,
  ChevronRight,
  Award,
  AlertCircle,
  MapPin,
  Phone,
  Building,
  Clock,
  CheckCircle,
  XCircle,
  Maximize2,
  Minimize2,
  BarChart3,
  TrendingUp,
  Wrench,
  ClipboardCheck,
  Star,
  Target,
  Lightbulb,
  Brain,
  Bot,
} from "lucide-react"

// Import quality components
import { QualityMetricsPanel } from "./QualityMetricsPanel"
import { WarrantyLog } from "./WarrantyLog"
import { QualityProgramsLibrary } from "./QualityProgramsLibrary"
import { QualityAnnouncements } from "./QualityAnnouncements"
import { LessonsLearnedNotices } from "./LessonsLearnedNotices"
import { QCProgramGenerator } from "./QCProgramGenerator"

interface QualityDashboardProps {
  user: any
  projectId?: string
  projectData?: any
  userRole?: string
}

interface QualityMetrics {
  totalInspections: number
  passedInspections: number
  failedInspections: number
  pendingInspections: number
  qualityScore: number
  defectRate: number
  reworkRate: number
  customerSatisfaction: number
  warrantyItems: number
  activePrograms: number
  lastAuditDate: string
  nextAuditDate: string
  complianceRate: number
}

export const QualityDashboard: React.FC<QualityDashboardProps> = ({
  user,
  projectId,
  projectData,
  userRole = "user",
}) => {
  const [activeTab, setActiveTab] = useState("overview")
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Mock quality metrics data
  const qualityMetrics: QualityMetrics = {
    totalInspections: 342,
    passedInspections: 298,
    failedInspections: 32,
    pendingInspections: 12,
    qualityScore: 87,
    defectRate: 2.3,
    reworkRate: 4.1,
    customerSatisfaction: 94,
    warrantyItems: 18,
    activePrograms: 12,
    lastAuditDate: "2024-12-15",
    nextAuditDate: "2025-03-15",
    complianceRate: 96,
  }

  const handleFocusToggle = () => {
    setIsFocusMode(!isFocusMode)
  }

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
  }

  // Tab configuration
  const qualityTabs = [
    {
      id: "overview",
      label: "Overview",
      icon: BarChart3,
      description: "Quality dashboard overview and key metrics",
    },
    {
      id: "metrics",
      label: "Quality Metrics",
      icon: TrendingUp,
      description: "Quality metrics and performance tracking",
    },
    {
      id: "warranty",
      label: "Warranty Log",
      icon: Wrench,
      description: "Warranty tracking and management",
    },
    {
      id: "programs",
      label: "Programs & Procedures",
      icon: BookOpen,
      description: "Quality programs and procedures library",
    },
    {
      id: "qc-generator",
      label: "QC Program Generator",
      icon: Bot,
      description: "AI-powered QC program generation",
    },
    {
      id: "notices",
      label: "Notices & Updates",
      icon: Bell,
      description: "Quality announcements and updates",
    },
    {
      id: "lessons",
      label: "Lessons Learned",
      icon: Lightbulb,
      description: "Lessons learned and best practices",
    },
  ]

  const renderOverviewContent = () => (
    <div className="space-y-6">
      {/* Quality Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Quality Score</p>
                <p className="text-2xl font-bold text-green-600">{qualityMetrics.qualityScore}%</p>
              </div>
              <Star className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Above target threshold</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Compliance Rate</p>
                <p className="text-2xl font-bold text-blue-600">{qualityMetrics.complianceRate}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">All standards met</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Defect Rate</p>
                <p className="text-2xl font-bold text-orange-600">{qualityMetrics.defectRate}%</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Within acceptable range</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Customer Satisfaction</p>
                <p className="text-2xl font-bold text-purple-600">{qualityMetrics.customerSatisfaction}%</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Excellent rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Inspection Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            Inspection Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{qualityMetrics.totalInspections}</p>
              <p className="text-sm text-muted-foreground">Total Inspections</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{qualityMetrics.passedInspections}</p>
              <p className="text-sm text-muted-foreground">Passed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{qualityMetrics.failedInspections}</p>
              <p className="text-sm text-muted-foreground">Failed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{qualityMetrics.pendingInspections}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Inspection
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Report
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh Metrics
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Quality Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Quality inspection passed</p>
                  <p className="text-xs text-muted-foreground">Electrical systems - Building A, Floor 3</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">1 hour ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm font-medium">Defect identified</p>
                  <p className="text-xs text-muted-foreground">Concrete finish - Requires rework</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">3 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Wrench className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Warranty claim processed</p>
                  <p className="text-xs text-muted-foreground">HVAC unit replacement - Unit #AC-301</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">1 day ago</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Quality Audit Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Last Audit</p>
              <p className="text-lg font-semibold">{qualityMetrics.lastAuditDate}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Next Audit</p>
              <p className="text-lg font-semibold">{qualityMetrics.nextAuditDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lessons Learned Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            Recent Lessons Learned
          </CardTitle>
          <CardDescription>AI-generated insights from resolved quality issues and warranty claims</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Mock lessons learned summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Generated This Month</p>
                    <p className="text-2xl font-bold text-amber-600">8</p>
                  </div>
                  <Brain className="h-8 w-8 text-amber-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">AI-powered analysis</p>
              </div>

              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Implementation Rate</p>
                    <p className="text-2xl font-bold text-green-600">85%</p>
                  </div>
                  <Target className="h-8 w-8 text-green-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Actively implemented</p>
              </div>

              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Avg. Effectiveness</p>
                    <p className="text-2xl font-bold text-blue-600">92%</p>
                  </div>
                  <Star className="h-8 w-8 text-blue-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Success rate</p>
              </div>
            </div>

            {/* Recent lessons learned items */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Concrete Curing Issues in Winter</p>
                    <p className="text-xs text-muted-foreground">From QC Issue • AI Generated</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-purple-600">
                    <Brain className="h-3 w-3 mr-1" />
                    91% confidence
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Wrench className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">HVAC Refrigerant Leak Prevention</p>
                    <p className="text-xs text-muted-foreground">From Warranty Claim • AI Generated</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-purple-600">
                    <Brain className="h-3 w-3 mr-1" />
                    87% confidence
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t">
              <Button variant="outline" className="w-full" onClick={() => handleTabChange("lessons")}>
                View All Lessons Learned
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverviewContent()
      case "metrics":
        return <QualityMetricsPanel userRole={userRole} />
      case "warranty":
        return <WarrantyLog />
      case "programs":
        return <QualityProgramsLibrary />
      case "qc-generator":
        return <QCProgramGenerator />
      case "notices":
        return <QualityAnnouncements />
      case "lessons":
        return <LessonsLearnedNotices />
      default:
        return renderOverviewContent()
    }
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
            <p className="text-sm text-muted-foreground">Comprehensive quality management and compliance monitoring</p>
          </div>
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

      {/* Card-based Tab Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6 flex-shrink-0">
        {qualityTabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm ${
              activeTab === tab.id
                ? "border-[#FA4616] bg-[#FA4616]/10 text-[#FA4616]"
                : "border-border hover:border-[#FA4616]/30"
            }`}
          >
            <div className="flex flex-col items-center text-center space-y-2">
              <tab.icon className="h-6 w-6" />
              <span className="text-sm font-medium">{tab.label}</span>
              <span className="text-xs text-muted-foreground">{tab.description}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 w-full min-w-0 max-w-full min-h-0">
        <div className="w-full min-w-0 max-w-full h-full overflow-auto">{renderTabContent()}</div>
      </div>
    </div>
  )

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

  return (
    <div className="h-screen bg-white dark:bg-gray-950 flex flex-col">
      <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
        <div className="p-6 min-h-full w-full max-w-full">{mainContent}</div>
      </div>
    </div>
  )
}
