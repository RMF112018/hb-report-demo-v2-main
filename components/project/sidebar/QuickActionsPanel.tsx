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
} from "lucide-react"

interface QuickActionsPanelProps {
  projectId: string
  projectData: any
  user: any
  userRole: string
  navigation: any
}

export default function QuickActionsPanel({
  projectId,
  projectData,
  user,
  userRole,
  navigation,
}: QuickActionsPanelProps) {
  // Get quick actions based on current core tab
  const getQuickActions = () => {
    if (navigation.coreTab === "reports") {
      return [
        { label: "Create Report", icon: Plus, onClick: () => {} },
        { label: "View Reports", icon: Eye, onClick: () => {} },
        { label: "Report Analytics", icon: BarChart3, onClick: () => {} },
        { label: "Refresh Data", icon: RefreshCw, onClick: () => {} },
      ]
    } else if (navigation.coreTab === "checklists") {
      return [
        { label: "StartUp Checklist", icon: CheckSquare, onClick: () => {} },
        { label: "Closeout Checklist", icon: CheckCircle, onClick: () => {} },
        { label: "Export Checklist", icon: Download, onClick: () => {} },
        { label: "Update Progress", icon: RefreshCw, onClick: () => {} },
      ]
    } else if (navigation.coreTab === "productivity") {
      return [
        { label: "New Message", icon: MessageSquare, onClick: () => {} },
        { label: "Create Task", icon: Plus, onClick: () => {} },
        { label: "View Tasks", icon: CheckSquare, onClick: () => {} },
        { label: "Team Updates", icon: Users, onClick: () => {} },
      ]
    } else if (navigation.coreTab === "staffing") {
      return [
        { label: "View Timeline", icon: Calendar, onClick: () => {} },
        { label: "Create SPCR", icon: FileText, onClick: () => {} },
        { label: "Assign Staff", icon: Users, onClick: () => {} },
        { label: "Export Schedule", icon: Download, onClick: () => {} },
      ]
    } else if (navigation.coreTab === "responsibility-matrix") {
      return [
        { label: "Update Matrix", icon: Users, onClick: () => {} },
        { label: "Assign Roles", icon: Shield, onClick: () => {} },
        { label: "Export Matrix", icon: Download, onClick: () => {} },
        { label: "Team Overview", icon: Eye, onClick: () => {} },
      ]
    }

    // Default dashboard actions
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
