/**
 * @fileoverview Bid Management Center - Main Orchestrator Component
 * @version 3.0.0
 * @description Production-ready bid management system with comprehensive project and package management
 */

"use client"

import React, { useState, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Badge } from "../../ui/badge"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Alert, AlertDescription } from "../../ui/alert"
import { Skeleton } from "../../ui/skeleton"
import {
  Search,
  Filter,
  Plus,
  FolderOpen,
  Users,
  MessageSquare,
  FileText,
  BarChart3,
  Settings,
  Calendar,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react"

// Type imports
import { BidManagementCenterProps, BidProject, BidPackage } from "./types/bid-management"

// Hook imports
import { useBidProjects } from "./hooks/use-bid-projects"

// Component imports
import BidProjectList from "./components/BidProjectList"

/**
 * Main Bid Management Center Component
 * Orchestrates all bid management functionality with role-based access control
 */
const BidManagementCenter: React.FC<BidManagementCenterProps> = ({
  userRole,
  projectId,
  initialProject,
  className = "",
  onProjectSelect,
}) => {
  // State management
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  // Custom hooks
  const {
    biddingProjects,
    selectedProject,
    isLoading: projectsLoading,
    error: projectsError,
    selectProject,
    getProjectStats,
  } = useBidProjects(projectId)

  // Removed useBidPackages hook as it's no longer needed

  // Computed values
  const projectStats = useMemo(() => getProjectStats(), [getProjectStats])

  // Filtered data
  const filteredProjects = useMemo(() => {
    if (!searchTerm) return biddingProjects
    return biddingProjects.filter(
      (project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.project_number.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [biddingProjects, searchTerm])

  // Event handlers
  const handleProjectSelect = useCallback(
    (project: BidProject) => {
      // Follow the same routing logic as sidebar project selection
      if (onProjectSelect) {
        onProjectSelect(project.id)
      }
    },
    [onProjectSelect]
  )

  // Removed handlePackageSelect as it's no longer needed

  const handleCreateProject = useCallback(() => {
    // Open project creation modal or form
    console.log("Create new project")
  }, [])

  // Loading state
  if (projectsLoading && biddingProjects.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    )
  }

  // Error state
  if (projectsError) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{projectsError}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bid Management Center</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage bidding projects, packages, and team collaboration
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button onClick={handleCreateProject} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* KPI Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectStats.active}</div>
            <p className="text-xs text-muted-foreground">+{projectStats.awarded} awarded this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Project Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(projectStats.totalValue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Avg: ${(projectStats.averageValue / 1000000).toFixed(1)}M</p>
          </CardContent>
        </Card>
      </div>

      {/* Alert removed per user request */}

      {/* Search and Filter Bar */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects or clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        {selectedProject && (
          <Badge variant="outline" className="px-3 py-1">
            {selectedProject.name}
          </Badge>
        )}
      </div>

      {/* Projects Table */}
      <div className="space-y-4">
        <BidProjectList
          projects={filteredProjects}
          selectedProject={selectedProject}
          onProjectSelect={handleProjectSelect}
          onCreateProject={handleCreateProject}
          userRole={userRole}
        />
      </div>
    </div>
  )
}

export default BidManagementCenter
