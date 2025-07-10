/**
 * @fileoverview Custom hook for managing bid projects
 * @version 3.0.0
 * @description Provides state management and operations for bid projects
 */

import { useState, useEffect, useCallback } from "react"
import { BidProject, UseBidProjectsReturn } from "../types/bid-management"

// Mock data import
import mockBidProjects from "../mock-data/bid-projects.json"

/**
 * Custom hook for bid project management
 * @param initialProjectId - Optional initial project ID to select
 * @returns {UseBidProjectsReturn} Project data and operations
 */
export const useBidProjects = (initialProjectId?: string): UseBidProjectsReturn => {
  const [biddingProjects, setBiddingProjects] = useState<BidProject[]>([])
  const [selectedProject, setSelectedProject] = useState<BidProject | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Simulates API call to fetch bid projects
   */
  const fetchBidProjects = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Load mock data
      const projects = mockBidProjects as BidProject[]
      setBiddingProjects(projects)

      // Set initial selected project if provided
      if (initialProjectId) {
        const initialProject = projects.find((p) => p.id === initialProjectId)
        if (initialProject) {
          setSelectedProject(initialProject)
        }
      }
    } catch (err) {
      console.error("Error fetching bid projects:", err)
      setError("Failed to load bid projects")
    } finally {
      setIsLoading(false)
    }
  }, [initialProjectId])

  /**
   * Creates a new bid project
   * @param projectData - Project data without ID and timestamps
   */
  const createProject = useCallback(
    async (projectData: Omit<BidProject, "id" | "created_date" | "last_modified">): Promise<BidProject> => {
      try {
        setIsLoading(true)
        setError(null)

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300))

        // Create new project with generated ID and timestamps
        const newProject: BidProject = {
          ...projectData,
          id: `bid-${Date.now()}`,
          created_date: new Date().toISOString(),
          last_modified: new Date().toISOString(),
        }

        // Update local state
        setBiddingProjects((prev) => [newProject, ...prev])

        return newProject
      } catch (err) {
        console.error("Error creating bid project:", err)
        setError("Failed to create project")
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  /**
   * Updates an existing bid project
   * @param projectId - Project ID to update
   * @param updates - Partial project data to update
   */
  const updateProject = useCallback(
    async (projectId: string, updates: Partial<BidProject>): Promise<void> => {
      try {
        setIsLoading(true)
        setError(null)

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300))

        // Update project in local state
        setBiddingProjects((prev) =>
          prev.map((project) =>
            project.id === projectId ? { ...project, ...updates, last_modified: new Date().toISOString() } : project
          )
        )

        // Update selected project if it's the one being updated
        if (selectedProject?.id === projectId) {
          setSelectedProject((prev) => (prev ? { ...prev, ...updates } : null))
        }
      } catch (err) {
        console.error("Error updating bid project:", err)
        setError("Failed to update project")
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [selectedProject]
  )

  /**
   * Deletes a bid project
   * @param projectId - Project ID to delete
   */
  const deleteProject = useCallback(
    async (projectId: string): Promise<void> => {
      try {
        setIsLoading(true)
        setError(null)

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300))

        // Remove project from local state
        setBiddingProjects((prev) => prev.filter((project) => project.id !== projectId))

        // Clear selected project if it was deleted
        if (selectedProject?.id === projectId) {
          setSelectedProject(null)
        }
      } catch (err) {
        console.error("Error deleting bid project:", err)
        setError("Failed to delete project")
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [selectedProject]
  )

  /**
   * Selects a project for detailed view
   * @param project - Project to select
   */
  const selectProject = useCallback((project: BidProject | null): void => {
    setSelectedProject(project)
  }, [])

  /**
   * Refreshes the project list
   */
  const refetch = useCallback(async (): Promise<void> => {
    await fetchBidProjects()
  }, [fetchBidProjects])

  /**
   * Filters projects by status
   * @param status - Status to filter by
   * @returns Filtered projects
   */
  const getProjectsByStatus = useCallback(
    (status: BidProject["status"]): BidProject[] => {
      return biddingProjects.filter((project) => project.status === status)
    },
    [biddingProjects]
  )

  /**
   * Gets projects assigned to a specific team lead
   * @param teamLead - Team lead name
   * @returns Filtered projects
   */
  const getProjectsByTeamLead = useCallback(
    (teamLead: string): BidProject[] => {
      return biddingProjects.filter((project) => project.team_lead === teamLead)
    },
    [biddingProjects]
  )

  /**
   * Gets project statistics
   * @returns Project statistics object
   */
  const getProjectStats = useCallback(() => {
    const stats = {
      total: biddingProjects.length,
      active: biddingProjects.filter((p) => p.status === "active").length,
      awarded: biddingProjects.filter((p) => p.status === "awarded").length,
      lost: biddingProjects.filter((p) => p.status === "lost").length,
      withdrawn: biddingProjects.filter((p) => p.status === "withdrawn").length,
      totalValue: biddingProjects.reduce((sum, p) => sum + p.estimated_value, 0),
      averageValue:
        biddingProjects.length > 0
          ? biddingProjects.reduce((sum, p) => sum + p.estimated_value, 0) / biddingProjects.length
          : 0,
    }
    return stats
  }, [biddingProjects])

  // Load initial data
  useEffect(() => {
    fetchBidProjects()
  }, [fetchBidProjects])

  return {
    biddingProjects,
    selectedProject,
    isLoading,
    error,
    createProject,
    updateProject,
    deleteProject,
    selectProject,
    refetch,
    getProjectsByStatus,
    getProjectsByTeamLead,
    getProjectStats,
  }
}

export default useBidProjects
