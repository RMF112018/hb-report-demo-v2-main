"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Building2, Clock, CheckCircle } from "lucide-react"
import { TabProps } from "./shared/types"
import { formatDate, getDaysUntilDue } from "./shared/utils"
import { EditableField, ProjectNameLink, ControlsRow } from "./shared/components"
import ProjectLinkButton from "../ProjectLinkButton"

interface DeliveryTrackingTabProps extends TabProps {}

const DeliveryTrackingTab: React.FC<DeliveryTrackingTabProps> = ({
  filteredProjects,
  dashboardMetrics,
  onProjectNavigation,
  isEditMode,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  isLoading,
  onSync,
}) => {
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "open", label: "Open" },
    { value: "awarded", label: "Awarded" },
    { value: "closed", label: "Closed" },
  ]

  return (
    <div className="space-y-6">
      {/* Dashboard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Projects</p>
                <p className="text-2xl font-bold">{dashboardMetrics.totalProjects}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Open Bids</p>
                <p className="text-2xl font-bold text-green-600">{dashboardMetrics.openProjects}</p>
              </div>
              <Clock className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Complete Deliverables</p>
                <p className="text-2xl font-bold text-blue-600">
                  {filteredProjects.filter((p) => p.bidBookLog === "COMPLETE").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {filteredProjects.filter((p) => p.review === "IN PROGRESS").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <ControlsRow
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
        isLoading={isLoading}
        onSync={onSync}
        statusOptions={statusOptions}
        additionalControls={
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        }
      />

      {/* Comprehensive Delivery Tracking Table */}
      <Card>
        <CardHeader>
          <CardTitle>Project Delivery Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Project Name</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Deliverable</TableHead>
                  <TableHead>Bid Book Log</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Programming</TableHead>
                  <TableHead>Pricing</TableHead>
                  <TableHead>Lean Estimating</TableHead>
                  <TableHead>Final Estimate</TableHead>
                  <TableHead>Contributors</TableHead>
                  <TableHead>Bid Bond</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">
                      <ProjectNameLink project={project} onProjectNavigation={onProjectNavigation} />
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          project.schedule === "On Track"
                            ? "default"
                            : project.schedule === "Delayed"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {project.schedule}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <EditableField
                        projectId={project.id}
                        field="deliverable"
                        value={project.deliverable}
                        isEditMode={isEditMode}
                        displayComponent={<Badge variant="outline">{project.deliverable}</Badge>}
                      />
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          project.bidBookLog === "COMPLETE"
                            ? "default"
                            : project.bidBookLog === "IN PROGRESS"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {project.bidBookLog}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          project.review === "COMPLETE"
                            ? "default"
                            : project.review === "IN PROGRESS"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {project.review}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          project.programming === "COMPLETE"
                            ? "default"
                            : project.programming === "IN PROGRESS"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {project.programming}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <EditableField
                        projectId={project.id}
                        field="pricing"
                        value={project.pricing}
                        type="number"
                        isEditMode={isEditMode}
                        displayComponent={
                          <div className="flex items-center gap-2">
                            <Progress value={project.pricing} className="w-16" />
                            <span className="text-xs">{project.pricing}%</span>
                          </div>
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          project.leanEstimating === "COMPLETE"
                            ? "default"
                            : project.leanEstimating === "IN PROGRESS"
                            ? "secondary"
                            : project.leanEstimating === "SCHEDULED"
                            ? "outline"
                            : "destructive"
                        }
                      >
                        {project.leanEstimating}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          project.finalEstimate === "SUBMITTED"
                            ? "default"
                            : project.finalEstimate === "IN PROGRESS"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {project.finalEstimate}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <EditableField
                        projectId={project.id}
                        field="contributors"
                        value={project.contributors}
                        isEditMode={isEditMode}
                        displayComponent={<Badge variant="secondary">{project.contributors}</Badge>}
                      />
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          project.bidBond === "REQUIRED"
                            ? "destructive"
                            : project.bidBond === "OBTAINED"
                            ? "default"
                            : "outline"
                        }
                      >
                        {project.bidBond}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <EditableField
                        projectId={project.id}
                        field="bidDueDate"
                        value={project.bidDueDate}
                        isEditMode={isEditMode}
                        displayComponent={
                          <div>
                            <div className="text-sm">{formatDate(project.bidDueDate)}</div>
                            <div className="text-xs text-gray-500">
                              {getDaysUntilDue(project.bidDueDate) > 0
                                ? `${getDaysUntilDue(project.bidDueDate)} days`
                                : "Overdue"}
                            </div>
                          </div>
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ProjectLinkButton
                          projectId={project.id}
                          onNavigate={onProjectNavigation}
                          tooltip={`Open ${project.name}`}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DeliveryTrackingTab
