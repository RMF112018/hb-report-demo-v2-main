import { ProjectPursuit } from "@/types/estimating"

export interface DashboardMetrics {
  totalProjects: number
  openProjects: number
  awardedProjects: number
  totalValue: number
  avgConfidence: number
  responseRate: number
  totalBidders: number
  totalResponses: number
}

export interface TabProps {
  filteredProjects: ProjectPursuit[]
  dashboardMetrics: DashboardMetrics
  onProjectNavigation: (projectId: string) => void
  isEditMode: boolean

  // Additional shared props
  searchTerm: string
  onSearchChange: (term: string) => void
  statusFilter: string
  onStatusFilterChange: (status: string) => void
  isLoading: boolean
  onSync: () => void
}
