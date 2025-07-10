/**
 * @fileoverview Bid Project Details Component
 * @version 3.0.0
 * @description Displays detailed information about a selected bid project
 */

"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card"
import { Badge } from "../../../ui/badge"
import { Button } from "../../../ui/button"
import { Edit, Calendar, DollarSign, User, MapPin, Building } from "lucide-react"
import { BidProject } from "../types/bid-management"

interface BidProjectDetailsProps {
  project: BidProject
  onProjectUpdate: (updates: Partial<BidProject>) => void
  isEditable: boolean
  className?: string
}

const BidProjectDetails: React.FC<BidProjectDetailsProps> = ({
  project,
  onProjectUpdate,
  isEditable,
  className = "",
}) => {
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
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

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

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{project.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{project.project_number}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className={getStatusColor(project.status)}>
                {project.status}
              </Badge>
              {isEditable && (
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">Client:</span>
                <span className="ml-2">{project.client}</span>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">Location:</span>
                <span className="ml-2">{project.location}</span>
              </div>
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">Team Lead:</span>
                <span className="ml-2">{project.team_lead}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="font-medium">Delivery Method:</span>
                <span className="ml-2">{project.delivery_method}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">Estimated Value:</span>
                <span className="ml-2">{formatCurrency(project.estimated_value)}</span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">Bid Due:</span>
                <span className="ml-2">{formatDate(project.key_dates.bid_due)}</span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">Project Start:</span>
                <span className="ml-2">{formatDate(project.key_dates.project_start)}</span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">Project End:</span>
                <span className="ml-2">{formatDate(project.key_dates.project_end)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {project.team.map((member) => (
              <div key={member.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">{member.email}</p>
                  <p className="text-sm text-muted-foreground">{member.department}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BidProjectDetails
