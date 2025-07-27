export interface ReviewData {
  id: string
  reviewType: string
  projectStage: string
  reviewDate: string
  reviewerName: string
  reviewerRole: string
  overallScore: number
  status: "completed" | "in-progress" | "pending"
  scoring: {
    designFeasibility: number
    coordinationClarity: number
    codeCompliance: number
    costScheduleImpact: number
    constructabilityRisk: number
    bimReviewQuality: number
  }
  comments: string
  recommendations: string[]
  attachments: string[]
  // Additional properties for detailed logging
  reviewDuration?: number // in hours
  issuesIdentified?: number
  issuesResolved?: number
  priority?: "high" | "medium" | "low"
  tags?: string[]
  // Legacy properties for backward compatibility
  project_id?: string
  project_name?: string
  stage?: string
  date?: string
  reviewer?: string
  scores?: Record<string, number>
  overall_score?: number
  weighted_score?: number
  report_url?: string | null
  created_at?: string
  updated_at?: string
}

export interface ConstructabilityReviewCenterProps {
  projectId: string
  projectData: any
  userRole: string
  user?: any
}

export interface ConstructabilityReviewDashboardProps {
  projectId: string
  projectData: any
  userRole: string
  user?: any
  reviews?: ReviewData[]
  onEditReview?: (reviewId: string) => void
}

export interface ConstructabilityReviewLogProps {
  projectId: string
  projectData: any
  userRole: string
  user?: any
  reviews?: ReviewData[]
  onEditReview?: (reviewId: string) => void
  onCreateReview?: () => void
}
