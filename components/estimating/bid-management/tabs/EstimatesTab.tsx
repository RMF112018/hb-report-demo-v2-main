"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calculator, Target, FileText, BarChart3 } from "lucide-react"
import { TabProps } from "./shared/types"
import { formatDate } from "./shared/utils"
import { EditableField, ProjectNameLink, ControlsRow } from "./shared/components"
import ProjectLinkButton from "../ProjectLinkButton"

interface EstimatesTabProps extends TabProps {}

const EstimatesTab: React.FC<EstimatesTabProps> = ({
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
    { value: "all", label: "All Types" },
    { value: "CONCEPTUAL ESTIMATE", label: "Conceptual" },
    { value: "GMP ESTIMATE", label: "GMP" },
    { value: "LUMP SUM PROPOSAL", label: "Lump Sum" },
  ]

  return (
    <div className="space-y-6">
      {/* Estimates Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Conceptual Estimates</p>
                <p className="text-2xl font-bold text-blue-600">
                  {filteredProjects.filter((p) => p.estimateType === "CONCEPTUAL ESTIMATE").length}
                </p>
              </div>
              <Calculator className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">GMP Estimates</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredProjects.filter((p) => p.estimateType === "GMP ESTIMATE").length}
                </p>
              </div>
              <Target className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Lump Sum Proposals</p>
                <p className="text-2xl font-bold text-purple-600">
                  {filteredProjects.filter((p) => p.estimateType === "LUMP SUM PROPOSAL").length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Cost/SF</p>
                <p className="text-2xl font-bold">
                  $
                  {filteredProjects.length > 0
                    ? (filteredProjects.reduce((sum, p) => sum + p.costPerSqf, 0) / filteredProjects.length).toFixed(0)
                    : "0"}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-600 dark:text-orange-400" />
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
      />

      {/* Estimates Cost Analysis Table */}
      <Card>
        <CardHeader>
          <CardTitle>Estimates & Cost Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Project Name</TableHead>
                  <TableHead>Estimate Type</TableHead>
                  <TableHead>Cost Per SF</TableHead>
                  <TableHead>Cost Per LF</TableHead>
                  <TableHead>Total Estimate</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Awarded</TableHead>
                  <TableHead>Awarded Precon</TableHead>
                  <TableHead>Contributors</TableHead>
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
                      <EditableField
                        projectId={project.id}
                        field="estimateType"
                        value={project.estimateType}
                        isEditMode={isEditMode}
                        displayComponent={
                          <Badge
                            variant={
                              project.estimateType === "GMP ESTIMATE"
                                ? "default"
                                : project.estimateType === "LUMP SUM PROPOSAL"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {project.estimateType}
                          </Badge>
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <EditableField
                        projectId={project.id}
                        field="costPerSqf"
                        value={project.costPerSqf}
                        type="number"
                        isEditMode={isEditMode}
                        displayComponent={<span className="font-medium">${project.costPerSqf.toFixed(2)}</span>}
                      />
                    </TableCell>
                    <TableCell>
                      <EditableField
                        projectId={project.id}
                        field="costPerLft"
                        value={project.costPerLft}
                        type="number"
                        isEditMode={isEditMode}
                        displayComponent={
                          <span>{project.costPerLft > 0 ? `$${project.costPerLft.toFixed(2)}` : "N/A"}</span>
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <EditableField
                        projectId={project.id}
                        field="estimatedCost"
                        value={project.estimatedCost}
                        type="currency"
                        isEditMode={isEditMode}
                      />
                    </TableCell>
                    <TableCell>
                      <EditableField
                        projectId={project.id}
                        field="submitted"
                        value={project.submitted}
                        isEditMode={isEditMode}
                        displayComponent={
                          <span>{project.submitted !== "TBD" ? formatDate(project.submitted) : "TBD"}</span>
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Badge variant={project.awarded ? "default" : "outline"}>{project.awarded ? "Yes" : "No"}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={project.awardedPrecon ? "default" : "outline"}>
                        {project.awardedPrecon ? "Yes" : "No"}
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
                      <div className="flex items-center gap-2">
                        <ProjectLinkButton
                          projectId={project.id}
                          onNavigate={onProjectNavigation}
                          tooltip={`View estimate details for ${project.name}`}
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

export default EstimatesTab
