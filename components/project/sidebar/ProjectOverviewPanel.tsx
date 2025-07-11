"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Expandable Description Component
const ExpandableDescription: React.FC<{ description: string }> = ({ description }) => {
  const [isExpanded, setIsExpanded] = React.useState(false)

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const maxLength = 100
  const shouldTruncate = description.length > maxLength
  const displayText = isExpanded || !shouldTruncate ? description : `${description.substring(0, maxLength)}...`

  return (
    <div>
      <p className="text-sm text-muted-foreground">{displayText}</p>
      {shouldTruncate && (
        <button onClick={toggleExpanded} className="text-xs text-blue-600 hover:underline mt-1">
          {isExpanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  )
}

interface ProjectOverviewPanelProps {
  projectId: string
  projectData: any
  user: any
  userRole: string
  projectMetrics: any
}

export default function ProjectOverviewPanel({
  projectId,
  projectData,
  user,
  userRole,
  projectMetrics,
}: ProjectOverviewPanelProps) {
  // Check project stage
  const isBiddingStage = projectData?.project_stage_name === "Bidding"
  const isConstructionStage = projectData?.project_stage_name === "Construction"

  // Calculate bidding-specific metrics
  const getBiddingMetrics = () => {
    const today = new Date()
    const clientBidDueDate = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
    const subBidDueDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    const deliverablesToMarketing = new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000) // 10 days from now
    const preSubmissionReview = new Date(today.getTime() + 12 * 24 * 60 * 60 * 1000) // 12 days from now
    const winStrategy = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000) // 5 days from now

    // Calculate coverage score (mock calculation based on project stage timing)
    const daysUntilClientDue = Math.ceil((clientBidDueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    const baseCoverage = 3.25 // Base coverage score
    const timeFactorAdjustment = daysUntilClientDue > 10 ? 0.75 : daysUntilClientDue > 5 ? 0.25 : -0.25
    const coverageScore = Math.max(1.0, Math.min(5.0, baseCoverage + timeFactorAdjustment))

    return {
      clientBidDueDate: clientBidDueDate.toLocaleDateString(),
      subBidDueDate: subBidDueDate.toLocaleDateString(),
      coverageScore: coverageScore.toFixed(2),
      deliverablesToMarketing: deliverablesToMarketing.toLocaleDateString(),
      preSubmissionReview: `${preSubmissionReview.toLocaleDateString()} 10:00`,
      winStrategy: `${winStrategy.toLocaleDateString()} 14:30`,
    }
  }

  // Calculate construction-specific metrics
  const getConstructionMetrics = () => {
    // Mock data for PCCOs and PCOs
    const totalPCCOsApproved = 8
    const pcosPendingPCCO = 3

    // Get dates from projectData and format as mm/dd/yyyy
    const formatDate = (dateString: string) => {
      if (!dateString) return "N/A"
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US")
    }

    return {
      totalPCCOsApproved,
      pcosPendingPCCO,
      approvedExtensions: projectData?.approved_extensions || 0,
      contractCompletionDate: formatDate(projectData?.original_completion_date),
      projectedCompletionDate: formatDate(projectData?.projected_completion_date),
    }
  }

  const biddingMetrics = getBiddingMetrics()
  const constructionMetrics = getConstructionMetrics()

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Project Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {/* Project Description */}
        <div className="pb-3 border-b border-border">
          <p className="text-xs text-muted-foreground mb-2">Description</p>
          <ExpandableDescription description={projectData?.description || "No description available"} />
        </div>

        {/* Project Metrics - Conditional based on project stage */}
        <div className="space-y-2">
          {isBiddingStage ? (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Client Bid Due Date</span>
                <span className="font-medium">{biddingMetrics.clientBidDueDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sub Bid Due Date</span>
                <span className="font-medium">{biddingMetrics.subBidDueDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current Coverage Score</span>
                <span
                  className={`font-medium ${
                    parseFloat(biddingMetrics.coverageScore) >= 4.0
                      ? "text-green-600"
                      : parseFloat(biddingMetrics.coverageScore) >= 3.0
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {biddingMetrics.coverageScore}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Deliverables to Marketing</span>
                <span className="font-medium">{biddingMetrics.deliverablesToMarketing}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pre-Submission Review</span>
                <span className="font-medium">{biddingMetrics.preSubmissionReview}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Win Strategy</span>
                <span className="font-medium">{biddingMetrics.winStrategy}</span>
              </div>
            </>
          ) : isConstructionStage ? (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Contract Value</span>
                <span className="font-medium">${projectMetrics.totalBudget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Job Cost to Date</span>
                <span className="font-medium">${projectMetrics.spentToDate.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total PCCOs Approved</span>
                <span className="font-medium">{constructionMetrics.totalPCCOsApproved}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">PCOs Pending PCCO</span>
                <span className="font-medium">{constructionMetrics.pcosPendingPCCO}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Approved Extensions</span>
                <span className="font-medium">{constructionMetrics.approvedExtensions}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Contract Completion Date</span>
                <span className="font-medium">{constructionMetrics.contractCompletionDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Projected Completion Date</span>
                <span className="font-medium">{constructionMetrics.projectedCompletionDate}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Contract Value</span>
                <span className="font-medium">${projectMetrics.totalBudget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Spent to Date</span>
                <span className="font-medium">${projectMetrics.spentToDate.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Schedule Progress</span>
                <span className="font-medium text-blue-600">{projectMetrics.scheduleProgress}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Budget Progress</span>
                <span className="font-medium text-green-600">{projectMetrics.budgetProgress}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Team Members</span>
                <span className="font-medium">{projectMetrics.activeTeamMembers}</span>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
