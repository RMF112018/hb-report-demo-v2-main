"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Plus,
  Eye,
  BarChart3,
  RefreshCw,
  CheckSquare,
  CheckCircle,
  Download,
  MessageSquare,
  Users,
  Calendar,
  FileText,
  Shield,
  DollarSign,
  CreditCard,
  TrendingUp,
  PiggyBank,
  Receipt,
  Calculator,
  Building2,
  ClipboardCheck,
  AlertTriangle,
  Hammer,
  FileX,
  Clock,
  Wrench,
  Settings,
  BookOpen,
  Target,
  UserCheck,
  Archive,
} from "lucide-react"

interface QuickActionsPanelProps {
  projectId: string
  projectData: any
  user: any
  userRole: string
  navigation: any
  activeTab?: string
}

export default function QuickActionsPanel({
  projectId,
  projectData,
  user,
  userRole,
  navigation,
  activeTab,
}: QuickActionsPanelProps) {
  // Get quick actions based on current tab context
  const getQuickActions = () => {
    // Financial Management tabs
    if (activeTab === "financial-management" || activeTab === "financial-hub") {
      const currentFinancialTab = navigation.tool === "financial-management" ? navigation.subTool : "overview"

      switch (currentFinancialTab) {
        case "budget-analysis":
          return [
            { label: "Generate Report", icon: BarChart3, onClick: () => {} },
            { label: "Export Analysis", icon: Download, onClick: () => {} },
            { label: "Update Budget", icon: Calculator, onClick: () => {} },
            { label: "Review Variance", icon: Eye, onClick: () => {} },
          ]

        case "jchr":
          return [
            { label: "Export JCHR", icon: Download, onClick: () => {} },
            { label: "Update Costs", icon: DollarSign, onClick: () => {} },
            { label: "Division Analysis", icon: BarChart3, onClick: () => {} },
            { label: "Refresh Data", icon: RefreshCw, onClick: () => {} },
          ]

        case "ar-aging":
          return [
            { label: "Collection Report", icon: Receipt, onClick: () => {} },
            { label: "Contact Client", icon: MessageSquare, onClick: () => {} },
            { label: "Export Aging", icon: Download, onClick: () => {} },
            { label: "Update Status", icon: RefreshCw, onClick: () => {} },
          ]

        case "cash-flow":
          return [
            { label: "Cash Forecast", icon: TrendingUp, onClick: () => {} },
            { label: "Payment Schedule", icon: Calendar, onClick: () => {} },
            { label: "Export Analysis", icon: Download, onClick: () => {} },
            { label: "Update Projections", icon: Calculator, onClick: () => {} },
          ]

        case "forecasting":
          return [
            { label: "Run Forecast", icon: TrendingUp, onClick: () => {} },
            { label: "Update Models", icon: Calculator, onClick: () => {} },
            { label: "Export Forecast", icon: Download, onClick: () => {} },
            { label: "View Scenarios", icon: Eye, onClick: () => {} },
          ]

        case "change-management":
          return [
            { label: "New Change Order", icon: Plus, onClick: () => {} },
            { label: "Approve Pending", icon: CheckCircle, onClick: () => {} },
            { label: "Export CO Log", icon: Download, onClick: () => {} },
            { label: "Cost Impact", icon: Calculator, onClick: () => {} },
          ]

        case "pay-authorization":
          return [
            { label: "Authorize Payment", icon: CheckCircle, onClick: () => {} },
            { label: "Review Queue", icon: Eye, onClick: () => {} },
            { label: "Export Report", icon: Download, onClick: () => {} },
            { label: "Process Batch", icon: Receipt, onClick: () => {} },
          ]

        case "pay-application":
          return [
            { label: "Create G702/G703", icon: Plus, onClick: () => {} },
            { label: "Submit Application", icon: CheckCircle, onClick: () => {} },
            { label: "Export AIA Forms", icon: Download, onClick: () => {} },
            { label: "Review Status", icon: Eye, onClick: () => {} },
          ]

        case "retention":
          return [
            { label: "Release Retention", icon: PiggyBank, onClick: () => {} },
            { label: "Update Status", icon: RefreshCw, onClick: () => {} },
            { label: "Export Report", icon: Download, onClick: () => {} },
            { label: "Review Schedule", icon: Calendar, onClick: () => {} },
          ]

        default:
          return [
            { label: "Financial Report", icon: BarChart3, onClick: () => {} },
            { label: "Budget Review", icon: Calculator, onClick: () => {} },
            { label: "Cash Flow", icon: TrendingUp, onClick: () => {} },
            { label: "Export Data", icon: Download, onClick: () => {} },
          ]
      }
    }

    // Field Management tabs
    if (activeTab === "field-management") {
      const fieldSubTool = navigation.subTool || "scheduler"

      switch (fieldSubTool) {
        case "scheduler":
          return [
            { label: "Update Schedule", icon: Calendar, onClick: () => {} },
            { label: "Resource Planning", icon: Users, onClick: () => {} },
            { label: "Export Schedule", icon: Download, onClick: () => {} },
            { label: "Critical Path", icon: AlertTriangle, onClick: () => {} },
          ]

        case "field-reports":
          return [
            { label: "Daily Report", icon: Plus, onClick: () => {} },
            { label: "Photo Upload", icon: Eye, onClick: () => {} },
            { label: "Export Reports", icon: Download, onClick: () => {} },
            { label: "Weather Log", icon: Clock, onClick: () => {} },
          ]

        case "constraints":
          return [
            { label: "Add Constraint", icon: Plus, onClick: () => {} },
            { label: "Resolve Issues", icon: Wrench, onClick: () => {} },
            { label: "Export Log", icon: Download, onClick: () => {} },
            { label: "Escalate Critical", icon: AlertTriangle, onClick: () => {} },
          ]

        case "permit-log":
          return [
            { label: "New Application", icon: Plus, onClick: () => {} },
            { label: "Schedule Inspection", icon: Calendar, onClick: () => {} },
            { label: "Export Log", icon: Download, onClick: () => {} },
            { label: "Renewal Alert", icon: Clock, onClick: () => {} },
          ]

        default:
          return [
            { label: "Field Update", icon: Hammer, onClick: () => {} },
            { label: "Schedule Review", icon: Calendar, onClick: () => {} },
            { label: "Team Coordination", icon: Users, onClick: () => {} },
            { label: "Export Data", icon: Download, onClick: () => {} },
          ]
      }
    }

    // Pre-Construction tab
    if (activeTab === "pre-construction") {
      return [
        { label: "Create Estimate", icon: Calculator, onClick: () => {} },
        { label: "BIM Coordination", icon: Building2, onClick: () => {} },
        { label: "Schedule Planning", icon: Calendar, onClick: () => {} },
        { label: "Team Setup", icon: Users, onClick: () => {} },
      ]
    }

    // Warranty Management tab
    if (activeTab === "warranty") {
      return [
        { label: "New Warranty Claim", icon: Plus, onClick: () => {} },
        { label: "Upload Documents", icon: FileX, onClick: () => {} },
        { label: "Contact Vendor", icon: MessageSquare, onClick: () => {} },
        { label: "Export Report", icon: Download, onClick: () => {} },
      ]
    }

    // Compliance tab
    if (activeTab === "compliance") {
      return [
        { label: "Contract Review", icon: FileText, onClick: () => {} },
        { label: "Document Upload", icon: Plus, onClick: () => {} },
        { label: "Compliance Check", icon: ClipboardCheck, onClick: () => {} },
        { label: "Export Report", icon: Download, onClick: () => {} },
      ]
    }

    // Core Project Tools tabs
    if (activeTab === "core" || !activeTab) {
      // Dashboard tab (default)
      if (!navigation.coreTab || navigation.coreTab === "dashboard") {
        return [
          { label: "Project Report", icon: BarChart3, onClick: () => {} },
          { label: "Team Update", icon: Users, onClick: () => {} },
          { label: "Schedule Review", icon: Calendar, onClick: () => {} },
          { label: "Refresh Data", icon: RefreshCw, onClick: () => {} },
        ]
      }

      switch (navigation.coreTab) {
        case "checklists":
          return [
            { label: "StartUp Checklist", icon: CheckSquare, onClick: () => {} },
            { label: "Closeout Checklist", icon: CheckCircle, onClick: () => {} },
            { label: "Export Checklist", icon: Download, onClick: () => {} },
            { label: "Update Progress", icon: RefreshCw, onClick: () => {} },
          ]

        case "productivity":
          return [
            { label: "New Message", icon: MessageSquare, onClick: () => {} },
            { label: "Create Task", icon: Plus, onClick: () => {} },
            { label: "View Tasks", icon: CheckSquare, onClick: () => {} },
            { label: "Team Updates", icon: Users, onClick: () => {} },
          ]

        case "staffing":
          return [
            { label: "View Timeline", icon: Calendar, onClick: () => {} },
            { label: "Create SPCR", icon: FileText, onClick: () => {} },
            { label: "Assign Staff", icon: Users, onClick: () => {} },
            { label: "Export Schedule", icon: Download, onClick: () => {} },
          ]

        case "responsibility-matrix":
          return [
            { label: "Update Matrix", icon: Users, onClick: () => {} },
            { label: "Assign Roles", icon: Shield, onClick: () => {} },
            { label: "Export Matrix", icon: Download, onClick: () => {} },
            { label: "View Coverage", icon: Eye, onClick: () => {} },
          ]

        case "reports":
          return [
            { label: "Create Report", icon: Plus, onClick: () => {} },
            { label: "View Reports", icon: Eye, onClick: () => {} },
            { label: "Report Analytics", icon: BarChart3, onClick: () => {} },
            { label: "Refresh Data", icon: RefreshCw, onClick: () => {} },
          ]

        default:
          return [
            { label: "Project Report", icon: BarChart3, onClick: () => {} },
            { label: "Team Update", icon: Users, onClick: () => {} },
            { label: "Schedule Review", icon: Calendar, onClick: () => {} },
            { label: "Refresh Data", icon: RefreshCw, onClick: () => {} },
          ]
      }
    }

    // Default fallback actions
    return [
      { label: "Quick Report", icon: FileText, onClick: () => {} },
      { label: "View Tasks", icon: CheckSquare, onClick: () => {} },
      { label: "Team Chat", icon: MessageSquare, onClick: () => {} },
      { label: "Refresh Data", icon: RefreshCw, onClick: () => {} },
    ]
  }

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        {getQuickActions().map((action, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            className="w-full justify-start text-sm h-8"
            onClick={action.onClick}
          >
            <action.icon className="h-4 w-4 mr-2" />
            {action.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
