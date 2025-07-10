/**
 * @fileoverview Bid Project List Component
 * @version 3.0.0
 * @description Displays and manages a list of bid projects with filtering and actions
 */

"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card"
import { Badge } from "../../../ui/badge"
import { Button } from "../../../ui/button"
import { Plus, Calendar, DollarSign, User, MapPin } from "lucide-react"
import { BidProject } from "../types/bid-management"

interface BidProjectListProps {
  projects: BidProject[]
  selectedProject?: BidProject | null
  onProjectSelect: (project: BidProject) => void
  onCreateProject: () => void
  userRole: string
}

const BidProjectList: React.FC<BidProjectListProps> = ({
  projects,
  selectedProject,
  onProjectSelect,
  onCreateProject,
  userRole,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "awarded":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      case "lost":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      case "withdrawn":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Bid Projects</h2>
        <Button onClick={onCreateProject} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="space-y-3">
        {projects.map((project) => (
          <Card
            key={project.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedProject?.id === project.id
                ? "ring-2 ring-blue-500 border-blue-500"
                : "border-gray-200 dark:border-gray-700"
            }`}
            onClick={() => onProjectSelect(project)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base font-medium">{project.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {project.project_number} • {project.client}
                  </p>
                </div>
                <Badge variant="secondary" className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  {project.location}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <DollarSign className="h-4 w-4 mr-2" />
                  {formatCurrency(project.estimated_value)}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <User className="h-4 w-4 mr-2" />
                  {project.team_lead}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Due: {formatDate(project.key_dates.bid_due)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No bid projects found</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default BidProjectList
