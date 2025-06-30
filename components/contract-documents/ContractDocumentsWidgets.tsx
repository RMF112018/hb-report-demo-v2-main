"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Clock,
  Brain,
  DollarSign
} from "lucide-react"

export interface ContractDocumentsStats {
  totalDocuments: number
  pendingReview: number
  highRiskDocuments: number
  complianceRate: number
  avgReviewTime: number
  aiInsightsGenerated: number
  costSavingsIdentified: number
  riskItemsResolved: number
}

interface ContractDocumentsWidgetsProps {
  stats: ContractDocumentsStats
}

export function ContractDocumentsWidgets({ stats }: ContractDocumentsWidgetsProps) {
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getComplianceColor = (rate: number) => {
    if (rate >= 95) return "text-green-600"
    if (rate >= 90) return "text-yellow-600"
    return "text-red-600"
  }

  const getComplianceIcon = (rate: number) => {
    if (rate >= 95) return <CheckCircle className="h-3 w-3 text-green-500" />
    if (rate >= 90) return <Clock className="h-3 w-3 text-yellow-500" />
    return <AlertTriangle className="h-3 w-3 text-red-500" />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Total Documents */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 dark:from-blue-950 dark:to-indigo-950 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Documents</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {stats.totalDocuments}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <CheckCircle className="h-3 w-3 text-blue-500" />
                <span className="text-xs text-blue-700 dark:text-blue-300">
                  Active Portfolio
                </span>
              </div>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Rate */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 dark:from-green-950 dark:to-emerald-950 dark:border-green-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Compliance Rate</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                {formatPercentage(stats.complianceRate)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {getComplianceIcon(stats.complianceRate)}
                <span className="text-xs text-green-700 dark:text-green-300">
                  Industry Leading
                </span>
              </div>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
              <Shield className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* High Risk Documents */}
      <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200 dark:from-red-950 dark:to-rose-950 dark:border-red-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600 dark:text-red-400">High Risk Documents</p>
              <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                {stats.highRiskDocuments}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {stats.highRiskDocuments > 0 ? (
                  <AlertTriangle className="h-3 w-3 text-red-500" />
                ) : (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                )}
                <span className="text-xs text-red-700 dark:text-red-300">
                  Require attention
                </span>
              </div>
            </div>
            <div className="p-2 bg-red-100 dark:bg-red-800 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Review */}
      <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 dark:from-orange-950 dark:to-amber-950 dark:border-orange-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Pending Review</p>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                {stats.pendingReview}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-800 dark:text-orange-200 dark:border-orange-600">
                  {stats.avgReviewTime.toFixed(1)} days avg
                </Badge>
              </div>
            </div>
            <div className="p-2 bg-orange-100 dark:bg-orange-800 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600 dark:text-orange-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights & Savings */}
      <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 dark:from-purple-950 dark:to-violet-950 dark:border-purple-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Cost Savings ID'd</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {formatCurrency(stats.costSavingsIdentified)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-purple-500" />
                <span className="text-xs text-purple-700 dark:text-purple-300">
                  {stats.aiInsightsGenerated} AI insights
                </span>
              </div>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
              <Brain className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 