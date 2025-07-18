"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Calculator, CheckCircle, Send, RefreshCw } from "lucide-react"

export interface ApprovalStep {
  id: string
  title: string
  description: string
  status: "pending" | "complete" | "skipped"
  approver: string
  completedBy?: string
  completedAt?: Date
  required: boolean
}

export interface FinalSummaryCalculations {
  subtotal: number
  gcTotal: number
  grTotal: number
  baseTotal: number
  overhead: number
  profit: number
  contingency: number
  total: number
  approvalProgress: number
}

interface FinalCostSummaryCardProps {
  calculations: FinalSummaryCalculations
}

export function FinalCostSummaryCard({ calculations }: FinalCostSummaryCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-900/30 border-blue-200 dark:border-blue-800 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200 text-sm">
          <Calculator className="h-4 w-4" />
          Final Cost Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span>Direct Costs:</span>
            <span className="font-semibold">{formatCurrency(calculations.subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span>General Conditions:</span>
            <span className="font-semibold">{formatCurrency(calculations.gcTotal)}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span>General Requirements:</span>
            <span className="font-semibold">{formatCurrency(calculations.grTotal)}</span>
          </div>
          <div className="flex items-center justify-between border-t pt-1.5 text-xs">
            <span className="font-medium">Subtotal:</span>
            <span className="font-semibold">{formatCurrency(calculations.baseTotal)}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span>Overhead (8%):</span>
            <span className="font-semibold">{formatCurrency(calculations.overhead)}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span>Profit (10%):</span>
            <span className="font-semibold">{formatCurrency(calculations.profit)}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span>Contingency (5%):</span>
            <span className="font-semibold">{formatCurrency(calculations.contingency)}</span>
          </div>
          <div className="flex items-center justify-between border-t-2 pt-1.5 text-sm">
            <span className="font-bold text-blue-800 dark:text-blue-200">Total Bid:</span>
            <span className="font-bold text-lg text-blue-900 dark:text-blue-100">
              {formatCurrency(calculations.total)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface ApprovalWorkflowCardProps {
  approvalSteps: ApprovalStep[]
  approvalProgress: number
  isSubmitting?: boolean
  onSubmit?: () => void
  onApprovalStep?: (stepId: string, action: "approve" | "reject") => void
}

export function ApprovalWorkflowCard({
  approvalSteps,
  approvalProgress,
  isSubmitting = false,
  onSubmit,
  onApprovalStep,
}: ApprovalWorkflowCardProps) {
  const handleApprovalStep = (stepId: string, action: "approve" | "reject") => {
    if (onApprovalStep) {
      onApprovalStep(stepId, action)
    }
  }

  // Conditional progress bar color based on progress value
  const getProgressColor = (progress: number) => {
    if (progress <= 25) return "bg-red-600 dark:bg-red-500"
    if (progress <= 50) return "bg-orange-600 dark:bg-orange-500"
    if (progress <= 75) return "bg-yellow-600 dark:bg-yellow-500"
    return "bg-green-600 dark:bg-green-500"
  }

  return (
    <Card className="dark:bg-gray-800/50 dark:border-gray-700 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <CheckCircle className="h-4 w-4 text-green-600" />
          Approval Workflow
        </CardTitle>
        <CardDescription className="text-xs">Review and approval status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1.5">
          {approvalSteps.map((step) => (
            <div
              key={step.id}
              className="flex items-center justify-between p-1.5 bg-muted/30 rounded-lg dark:bg-gray-700/30"
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-xs truncate">{step.title}</div>
                <div className="text-xs text-muted-foreground truncate">{step.description}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Approver: {step.approver}</div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Badge
                  className={
                    step.status === "complete"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs"
                      : step.status === "skipped"
                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-xs"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 text-xs"
                  }
                >
                  {step.status === "complete" ? "Approved" : step.status === "skipped" ? "Rejected" : "Pending"}
                </Badge>
                {step.status === "pending" && (
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      onClick={() => handleApprovalStep(step.id, "approve")}
                      className="h-6 w-6 p-0 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white dark:text-white"
                    >
                      <CheckCircle className="h-2.5 w-2.5 text-white" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleApprovalStep(step.id, "reject")}
                      className="h-6 w-6 p-0 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white dark:text-white"
                    >
                      ✕
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-1.5 border-t dark:border-gray-700">
          <div className="flex items-center justify-between text-xs mb-1">
            <span>Approval Progress:</span>
            <span className="font-medium">{approvalProgress.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-colors duration-300 ${getProgressColor(approvalProgress)}`}
              style={{ width: `${approvalProgress}%` }}
            />
          </div>
        </div>

        {approvalProgress === 100 && (
          <Button
            className="w-full mt-2 text-xs h-8 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white dark:text-white"
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? <RefreshCw className="h-3 w-3 animate-spin mr-1" /> : <Send className="h-3 w-3 mr-1" />}
            Submit for Client Review
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Legacy component for backward compatibility
interface FinalSummaryContentProps {
  calculations: FinalSummaryCalculations
  approvalSteps: ApprovalStep[]
  isSubmitting?: boolean
  onSubmit?: () => void
  onApprovalStep?: (stepId: string, action: "approve" | "reject") => void
}

export function FinalSummaryContent({
  calculations,
  approvalSteps,
  isSubmitting = false,
  onSubmit,
  onApprovalStep,
}: FinalSummaryContentProps) {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <FinalCostSummaryCard calculations={calculations} />
      <ApprovalWorkflowCard
        approvalSteps={approvalSteps}
        approvalProgress={calculations.approvalProgress}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
        onApprovalStep={onApprovalStep}
      />
    </div>
  )
}
