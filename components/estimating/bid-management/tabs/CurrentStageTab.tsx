"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Building2, FileText, Layers, DollarSign } from "lucide-react"
import { TabProps } from "./shared/types"
import { formatCurrency } from "./shared/utils"
import { EditableField, ProjectNameLink, ControlsRow } from "./shared/components"
import ProjectLinkButton from "../ProjectLinkButton"

interface CurrentStageTabProps extends TabProps {}

const CurrentStageTab: React.FC<CurrentStageTabProps> = ({
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
    { value: "all", label: "All Stages" },
    { value: "DD", label: "Design Development" },
    { value: "CD", label: "Construction Documents" },
    { value: "SD", label: "Schematic Design" },
  ]

  return (
    <div className="space-y-6">
      {/* Stage Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Design Development</p>
                <p className="text-2xl font-bold text-blue-600">
                  {filteredProjects.filter((p) => p.currentStage === "DD").length}
                </p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Construction Documents</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredProjects.filter((p) => p.currentStage === "CD").length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Schematic Design</p>
                <p className="text-2xl font-bold text-purple-600">
                  {filteredProjects.filter((p) => p.currentStage === "SD").length}
                </p>
              </div>
              <Layers className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Budget</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(filteredProjects.reduce((sum, p) => sum + p.projectBudget, 0))}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400" />
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

      {/* Current Stage Budget Table */}
      <Card>
        <CardHeader>
          <CardTitle>Current Stage & Budget Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Project Name</TableHead>
                  <TableHead>Current Stage</TableHead>
                  <TableHead>Project Budget</TableHead>
                  <TableHead>Original Budget</TableHead>
                  <TableHead>Billed to Date</TableHead>
                  <TableHead>Remaining Budget</TableHead>
                  <TableHead>Budget Variance</TableHead>
                  <TableHead>Contributors</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => {
                  const budgetVariance = project.projectBudget - project.originalBudget
                  const variancePercentage = (budgetVariance / project.originalBudget) * 100

                  return (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">
                        <ProjectNameLink project={project} onProjectNavigation={onProjectNavigation} />
                      </TableCell>
                      <TableCell>
                        <EditableField
                          projectId={project.id}
                          field="currentStage"
                          value={project.currentStage}
                          isEditMode={isEditMode}
                          displayComponent={
                            <Badge
                              variant={
                                project.currentStage === "CD"
                                  ? "default"
                                  : project.currentStage === "DD"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {project.currentStage}
                            </Badge>
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <EditableField
                          projectId={project.id}
                          field="projectBudget"
                          value={project.projectBudget}
                          type="currency"
                          isEditMode={isEditMode}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableField
                          projectId={project.id}
                          field="originalBudget"
                          value={project.originalBudget}
                          type="currency"
                          isEditMode={isEditMode}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableField
                          projectId={project.id}
                          field="billedToDate"
                          value={project.billedToDate}
                          type="currency"
                          isEditMode={isEditMode}
                        />
                      </TableCell>
                      <TableCell>{formatCurrency(project.remainingBudget)}</TableCell>
                      <TableCell>
                        <div className={`font-medium ${budgetVariance > 0 ? "text-red-600" : "text-green-600"}`}>
                          {budgetVariance > 0 ? "+" : ""}
                          {formatCurrency(budgetVariance)}
                          <div className="text-xs text-gray-500">
                            {variancePercentage > 0 ? "+" : ""}
                            {variancePercentage.toFixed(1)}%
                          </div>
                        </div>
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
                            tooltip={`View budget details for ${project.name}`}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CurrentStageTab
