"use client"

import React, { useState, useMemo } from "react"
import { DashboardGrid } from "@/components/dashboard/DashboardGrid"
import { DashboardCard } from "@/types/dashboard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Settings,
  RefreshCw,
  Download,
  Plus,
  BarChart3,
  Users,
  DollarSign,
  FileText,
  Award,
  AlertTriangle,
  Building2,
  Eye,
} from "lucide-react"
import {
  TeamUtilizationCard,
  LaborCostAnalysisCard,
  SPCRActivityCard,
  TeamExperienceCard,
  ProjectStaffingOverviewCard,
  StaffingAlertsCard,
} from "../cards/staffing/StaffingAnalyticsCards"

interface StaffingDashboardProps {
  projectId?: string
  projectData?: any
  userRole?: string
  className?: string
  isCompact?: boolean
  isFullScreen?: boolean
}

// Define the dashboard cards configuration
const createStaffingDashboardCards = (projectId?: string): DashboardCard[] => [
  {
    id: "team-utilization",
    title: "Team Utilization",
    type: "team-utilization",
    visible: true,
    position: { x: 0, y: 0 },
    span: { cols: 4, rows: 4 },
    config: { projectId },
  },
  {
    id: "labor-cost-analysis",
    title: "Labor Cost Analysis",
    type: "labor-cost-analysis",
    visible: true,
    position: { x: 4, y: 0 },
    span: { cols: 4, rows: 4 },
    config: { projectId },
  },
  {
    id: "spcr-activity",
    title: "SPCR Activity",
    type: "spcr-activity",
    visible: true,
    position: { x: 8, y: 0 },
    span: { cols: 4, rows: 4 },
    config: { projectId },
  },
  {
    id: "team-experience",
    title: "Team Experience",
    type: "team-experience",
    visible: true,
    position: { x: 12, y: 0 },
    span: { cols: 4, rows: 4 },
    config: { projectId },
  },
  {
    id: "project-staffing-overview",
    title: "Project Staffing Overview",
    type: "project-staffing-overview",
    visible: true,
    position: { x: 0, y: 4 },
    span: { cols: 8, rows: 5 },
    config: { projectId },
  },
  {
    id: "staffing-alerts",
    title: "Staffing Alerts",
    type: "staffing-alerts",
    visible: true,
    position: { x: 8, y: 4 },
    span: { cols: 8, rows: 5 },
    config: { projectId },
  },
]

// Card content renderer for staffing cards
const StaffingCardContent = ({
  card,
  isCompact,
  projectId,
}: {
  card: DashboardCard
  isCompact: boolean
  projectId?: string
}) => {
  const commonProps = {
    className: "h-full w-full",
    isCompact,
    projectId,
  }

  switch (card.type) {
    case "team-utilization":
      return <TeamUtilizationCard {...commonProps} />
    case "labor-cost-analysis":
      return <LaborCostAnalysisCard {...commonProps} />
    case "spcr-activity":
      return <SPCRActivityCard {...commonProps} />
    case "team-experience":
      return <TeamExperienceCard {...commonProps} />
    case "project-staffing-overview":
      return <ProjectStaffingOverviewCard {...commonProps} />
    case "staffing-alerts":
      return <StaffingAlertsCard {...commonProps} />
    default:
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Unknown card type: {card.type}</p>
          </div>
        </div>
      )
  }
}

export const StaffingDashboard: React.FC<StaffingDashboardProps> = ({
  projectId,
  projectData,
  userRole,
  className,
  isCompact = false,
  isFullScreen = false,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [cards, setCards] = useState<DashboardCard[]>(() => createStaffingDashboardCards(projectId))

  // Handle layout changes
  const handleLayoutChange = (updatedCards: DashboardCard[]) => {
    setCards(updatedCards)
  }

  // Handle card removal
  const handleCardRemove = (cardId: string) => {
    setCards(cards.filter((card) => card.id !== cardId))
  }

  // Handle card configuration
  const handleCardConfigure = (cardId: string, configUpdate?: Partial<DashboardCard>) => {
    setCards(cards.map((card) => (card.id === cardId ? { ...card, ...configUpdate } : card)))
  }

  // Handle card size changes
  const handleCardSizeChange = (cardId: string, size: string) => {
    // Parse size format like "custom-4x3"
    const sizeMatch = size.match(/custom-(\d+)x(\d+)/)
    if (sizeMatch) {
      const cols = parseInt(sizeMatch[1])
      const rows = parseInt(sizeMatch[2])

      setCards(cards.map((card) => (card.id === cardId ? { ...card, span: { cols, rows } } : card)))
    }
  }

  // Handle card addition
  const handleCardAdd = () => {
    // This could open a modal to add new cards
    console.log("Add card functionality would go here")
  }

  // Handle dashboard save
  const handleSave = () => {
    // Save dashboard configuration
    console.log("Save dashboard configuration", cards)
  }

  // Handle dashboard reset
  const handleReset = () => {
    setCards(createStaffingDashboardCards(projectId))
  }

  // Handle refresh
  const handleRefresh = () => {
    // Refresh data
    window.location.reload()
  }

  // Handle export
  const handleExport = () => {
    // Export dashboard data
    console.log("Export dashboard data")
  }

  // Get dashboard title based on context
  const getDashboardTitle = () => {
    if (projectId && projectData) {
      return `${projectData.name} - Staffing Dashboard`
    }
    return "Staffing Dashboard"
  }

  // Get dashboard description
  const getDashboardDescription = () => {
    if (projectId) {
      return "Project-specific staffing analytics and team management insights"
    }
    return "Comprehensive staffing analytics and team performance metrics"
  }

  // Dashboard header actions
  const headerActions = (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={handleRefresh} className="h-8 px-3 text-xs">
        <RefreshCw className="h-3 w-3 mr-1" />
        Refresh
      </Button>
      <Button variant="outline" size="sm" onClick={handleExport} className="h-8 px-3 text-xs">
        <Download className="h-3 w-3 mr-1" />
        Export
      </Button>
      <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)} className="h-8 px-3 text-xs">
        <Settings className="h-3 w-3 mr-1" />
        {isEditing ? "Done" : "Edit"}
      </Button>
    </div>
  )

  // Dashboard content
  return (
    <div className={cn("w-full", isFullScreen ? "h-full flex flex-col overflow-hidden" : "space-y-4", className)}>
      {/* Dashboard Header */}
      <div className={cn("flex items-center justify-between", isFullScreen ? "flex-shrink-0 pb-4" : "")}>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            {getDashboardTitle()}
          </h2>
          <p className="text-sm text-muted-foreground">{getDashboardDescription()}</p>
        </div>
        {headerActions}
      </div>

      {/* Dashboard Status */}
      <div className={cn("flex items-center gap-2", isFullScreen ? "flex-shrink-0 pb-4" : "")}>
        <Badge variant="secondary" className="text-xs">
          {cards.filter((c) => c.visible).length} Active Cards
        </Badge>
        {projectId && (
          <Badge variant="outline" className="text-xs">
            Project: {projectData?.project_number || projectId}
          </Badge>
        )}
        {isEditing && (
          <Badge variant="default" className="text-xs">
            Edit Mode
          </Badge>
        )}
      </div>

      {/* Dashboard Grid */}
      <div className={cn("w-full", isFullScreen ? "flex-1 overflow-y-auto overflow-x-hidden" : "")}>
        <DashboardGrid
          cards={cards}
          onLayoutChange={handleLayoutChange}
          onCardRemove={handleCardRemove}
          onCardConfigure={handleCardConfigure}
          onCardSizeChange={handleCardSizeChange}
          onCardAdd={handleCardAdd}
          onSave={handleSave}
          onReset={handleReset}
          isEditing={isEditing}
          isCompact={isCompact}
          userRole={userRole}
        />
      </div>
    </div>
  )
}

// Export the card content renderer for use in the main DashboardGrid
export const renderStaffingCardContent = (card: DashboardCard, isCompact: boolean, projectId?: string) => {
  return <StaffingCardContent card={card} isCompact={isCompact} projectId={projectId} />
}
