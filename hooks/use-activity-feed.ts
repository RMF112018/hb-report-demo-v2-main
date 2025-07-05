import { useState, useEffect, useMemo } from "react"
import { ActivityFeedItem, ActivityFeedConfig, ActivityFeedFilters } from "@/types/activity-feed"
import activityFeedData from "@/data/mock/activity-feed.json"

export function useActivityFeed(config: ActivityFeedConfig) {
  const [filters, setFilters] = useState<ActivityFeedFilters>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get filtered data based on config
  const filteredData = useMemo(() => {
    const data = activityFeedData as Record<string, ActivityFeedItem[]>
    // Map hyphenated role names to underscored JSON keys
    const roleMapping: Record<string, string> = {
      "project-executive": "project_executive",
      "project-manager": "project_manager",
      executive: "executive",
      estimator: "estimator",
    }
    const jsonKey = roleMapping[config.userRole] || config.userRole
    let activities = data[jsonKey] || []

    // Apply project filter if specified
    if (config.projectId) {
      activities = activities.filter((activity) => activity.project_id === config.projectId)
    }

    return activities
  }, [config.userRole, config.projectId])

  // Apply additional filters if provided
  const applyFilters = (filters: ActivityFeedFilters) => {
    let filtered = [...filteredData]

    if (filters.types && filters.types.length > 0) {
      filtered = filtered.filter((activity) => filters.types!.includes(activity.type))
    }

    if (filters.source && filters.source.length > 0) {
      filtered = filtered.filter((activity) => filters.source!.includes(activity.source))
    }

    if (filters.dateRange) {
      filtered = filtered.filter((activity) => {
        const activityDate = new Date(activity.timestamp)
        return activityDate >= filters.dateRange!.from && activityDate <= filters.dateRange!.to
      })
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (activity) =>
          activity.project_name.toLowerCase().includes(searchLower) ||
          activity.description.toLowerCase().includes(searchLower) ||
          activity.type.toLowerCase().includes(searchLower)
      )
    }

    return filtered
  }

  // Export to CSV
  const exportToCSV = (data: ActivityFeedItem[], filename: string = "activity-feed.csv") => {
    const headers = ["Project", "Type", "Description", "Date", "Time", "Source", "User"]
    const csvData = data.map((item) => [
      item.project_name,
      item.type,
      item.description,
      new Date(item.timestamp).toLocaleDateString(),
      new Date(item.timestamp).toLocaleTimeString(),
      item.source,
      item.user || "",
    ])

    const csvContent = [headers, ...csvData].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", filename)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  // Initialize data on mount
  useEffect(() => {
    // Future: This could be enhanced to fetch data from APIs
    setIsLoading(false)
  }, [])

  return {
    activities: filteredData,
    filters,
    setFilters,
    isLoading,
    error,
    applyFilters,
    exportToCSV,
    totalCount: filteredData.length,
  }
}
