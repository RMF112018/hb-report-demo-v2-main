/**
 * @fileoverview Custom hook for managing bid packages
 * @version 3.0.0
 * @description Provides state management and operations for bid packages
 */

import { useState, useEffect, useCallback } from "react"
import { BidPackage, UseBidPackagesReturn } from "../types/bid-management"

// Mock data import
import mockBidPackages from "../mock-data/bid-packages.json"

/**
 * Custom hook for bid package management
 * @param projectId - Project ID to filter packages
 * @returns {UseBidPackagesReturn} Package data and operations
 */
export const useBidPackages = (projectId?: string): UseBidPackagesReturn => {
  const [packages, setPackages] = useState<BidPackage[]>([])
  const [selectedPackage, setSelectedPackage] = useState<BidPackage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Simulates API call to fetch bid packages
   */
  const fetchBidPackages = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 400))

      // Load mock data
      let allPackages = mockBidPackages as BidPackage[]

      // Filter by project if projectId is provided
      if (projectId) {
        allPackages = allPackages.filter((pkg) => pkg.projectId === projectId)
      }

      setPackages(allPackages)

      // Auto-select first package if available
      if (allPackages.length > 0 && !selectedPackage) {
        setSelectedPackage(allPackages[0])
      }
    } catch (err) {
      console.error("Error fetching bid packages:", err)
      setError("Failed to load bid packages")
    } finally {
      setIsLoading(false)
    }
  }, [projectId, selectedPackage])

  /**
   * Creates a new bid package
   * @param packageData - Package data without ID and timestamps
   */
  const createPackage = useCallback(
    async (packageData: Omit<BidPackage, "id" | "created_date" | "last_modified">): Promise<void> => {
      try {
        setIsLoading(true)
        setError(null)

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300))

        // Create new package with generated ID and timestamps
        const newPackage: BidPackage = {
          ...packageData,
          id: `pkg-${Date.now()}`,
          created_date: new Date().toISOString(),
          last_modified: new Date().toISOString(),
        }

        // Update local state
        setPackages((prev) => [newPackage, ...prev])

        // Auto-select the new package
        setSelectedPackage(newPackage)
      } catch (err) {
        console.error("Error creating bid package:", err)
        setError("Failed to create package")
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  /**
   * Updates an existing bid package
   * @param packageId - Package ID to update
   * @param updates - Partial package data to update
   */
  const updatePackage = useCallback(
    async (packageId: string, updates: Partial<BidPackage>): Promise<void> => {
      try {
        setIsLoading(true)
        setError(null)

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300))

        // Update package in local state
        setPackages((prev) =>
          prev.map((pkg) =>
            pkg.id === packageId ? { ...pkg, ...updates, last_modified: new Date().toISOString() } : pkg
          )
        )

        // Update selected package if it's the one being updated
        if (selectedPackage?.id === packageId) {
          setSelectedPackage((prev) => (prev ? { ...prev, ...updates } : null))
        }
      } catch (err) {
        console.error("Error updating bid package:", err)
        setError("Failed to update package")
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [selectedPackage]
  )

  /**
   * Deletes a bid package
   * @param packageId - Package ID to delete
   */
  const deletePackage = useCallback(
    async (packageId: string): Promise<void> => {
      try {
        setIsLoading(true)
        setError(null)

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300))

        // Remove package from local state
        setPackages((prev) => prev.filter((pkg) => pkg.id !== packageId))

        // Clear selected package if it was deleted
        if (selectedPackage?.id === packageId) {
          setSelectedPackage(null)
        }
      } catch (err) {
        console.error("Error deleting bid package:", err)
        setError("Failed to delete package")
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [selectedPackage]
  )

  /**
   * Selects a package for detailed view
   * @param pkg - Package to select
   */
  const selectPackage = useCallback((pkg: BidPackage | null): void => {
    setSelectedPackage(pkg)
  }, [])

  /**
   * Gets packages by status
   * @param status - Status to filter by
   * @returns Filtered packages
   */
  const getPackagesByStatus = useCallback(
    (status: BidPackage["status"]): BidPackage[] => {
      return packages.filter((pkg) => pkg.status === status)
    },
    [packages]
  )

  /**
   * Gets packages by team member
   * @param teamMemberId - Team member ID
   * @returns Filtered packages
   */
  const getPackagesByTeamMember = useCallback(
    (teamMemberId: string): BidPackage[] => {
      return packages.filter((pkg) => pkg.assignedTeam.some((member) => member.id === teamMemberId))
    },
    [packages]
  )

  /**
   * Gets package statistics
   * @returns Package statistics object
   */
  const getPackageStats = useCallback(() => {
    const stats = {
      total: packages.length,
      draft: packages.filter((p) => p.status === "draft").length,
      sent: packages.filter((p) => p.status === "sent").length,
      responsesDue: packages.filter((p) => p.status === "responses-due").length,
      underReview: packages.filter((p) => p.status === "under-review").length,
      awarded: packages.filter((p) => p.status === "awarded").length,
      totalValue: packages.reduce((sum, p) => sum + p.estimatedValue, 0),
      averageValue: packages.length > 0 ? packages.reduce((sum, p) => sum + p.estimatedValue, 0) / packages.length : 0,
      totalResponses: packages.reduce((sum, p) => sum + p.responses.length, 0),
      averageResponses:
        packages.length > 0 ? packages.reduce((sum, p) => sum + p.responses.length, 0) / packages.length : 0,
    }
    return stats
  }, [packages])

  /**
   * Gets packages with pending responses
   * @returns Packages with pending responses
   */
  const getPackagesWithPendingResponses = useCallback((): BidPackage[] => {
    return packages.filter((pkg) => pkg.status === "sent" || pkg.status === "responses-due")
  }, [packages])

  /**
   * Gets packages due soon (within next 7 days)
   * @returns Packages due soon
   */
  const getPackagesDueSoon = useCallback((): BidPackage[] => {
    const now = new Date()
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    return packages.filter((pkg) => {
      const dueDate = new Date(pkg.dueDate)
      return dueDate >= now && dueDate <= oneWeekFromNow
    })
  }, [packages])

  /**
   * Gets overdue packages
   * @returns Overdue packages
   */
  const getOverduePackages = useCallback((): BidPackage[] => {
    const now = new Date()

    return packages.filter((pkg) => {
      const dueDate = new Date(pkg.dueDate)
      return dueDate < now && (pkg.status === "sent" || pkg.status === "responses-due")
    })
  }, [packages])

  // Load initial data when projectId changes
  useEffect(() => {
    fetchBidPackages()
  }, [fetchBidPackages])

  return {
    packages,
    selectedPackage,
    isLoading,
    error,
    createPackage,
    updatePackage,
    deletePackage,
    selectPackage,
    getPackagesByStatus,
    getPackagesByTeamMember,
    getPackageStats,
    getPackagesWithPendingResponses,
    getPackagesDueSoon,
    getOverduePackages,
  }
}

export default useBidPackages
