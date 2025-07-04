"use client"

import React from "react"
import { StageViewProps } from "@/types/project-stage-config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Calculator,
  Users,
  TrendingUp,
  Clock,
  FileText,
  Mail,
  DollarSign,
  Target,
  AlertCircle,
  CheckCircle,
  Building,
} from "lucide-react"

export const BiddingStageView = ({ project, projectData, stageConfig }: StageViewProps) => {
  // Mock bidding data
  const biddingData = {
    estimateCompletion: 78.5,
    subcontractorResponseRate: 67.2,
    bidCompetitiveness: 8.7,
    totalEstimateValue: 2845000,
    contingencyPercentage: 8.5,
    bidDueDate: "2024-02-15T17:00:00Z",
    daysUntilBid: 12,
    estimateBreakdown: [
      { category: "General Conditions", value: 425000, percentage: 14.9, status: "complete" },
      { category: "Sitework", value: 380000, percentage: 13.4, status: "complete" },
      { category: "Concrete", value: 650000, percentage: 22.8, status: "in_progress" },
      { category: "Masonry", value: 290000, percentage: 10.2, status: "pending" },
      { category: "Metals", value: 480000, percentage: 16.9, status: "complete" },
      { category: "Thermal & Moisture", value: 210000, percentage: 7.4, status: "pending" },
      { category: "Finishes", value: 410000, percentage: 14.4, status: "pending" },
    ],
    subcontractorBids: [
      {
        name: "ABC Concrete",
        trade: "Concrete",
        amount: 650000,
        status: "received",
        responseTime: "2 days",
        rating: 4.2,
      },
      {
        name: "Metro Masonry",
        trade: "Masonry",
        amount: 290000,
        status: "pending",
        responseTime: "5 days",
        rating: 4.5,
      },
      { name: "Steel Pro", trade: "Metals", amount: 480000, status: "received", responseTime: "1 day", rating: 4.8 },
      {
        name: "Finish First",
        trade: "Finishes",
        amount: 410000,
        status: "pending",
        responseTime: "3 days",
        rating: 4.1,
      },
    ],
    marketAnalysis: {
      marketCondition: "Competitive",
      priceEscalation: 3.2,
      laborAvailability: "Good",
      materialPricing: "Stable",
    },
  }

  const completedEstimates = biddingData.estimateBreakdown.filter((item) => item.status === "complete").length
  const totalEstimateCategories = biddingData.estimateBreakdown.length
  const receivedBids = biddingData.subcontractorBids.filter((bid) => bid.status === "received").length
  const totalBids = biddingData.subcontractorBids.length

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "complete":
      case "received":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "pending":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Stage Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimate Progress</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{biddingData.estimateCompletion}%</div>
            <p className="text-xs text-muted-foreground">
              {completedEstimates} of {totalEstimateCategories} categories complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sub Response Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{biddingData.subcontractorResponseRate}%</div>
            <p className="text-xs text-muted-foreground">
              {receivedBids} of {totalBids} bids received
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bid Competitiveness</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{biddingData.bidCompetitiveness}/10</div>
            <p className="text-xs text-muted-foreground">Market position estimate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days to Bid</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{biddingData.daysUntilBid}</div>
            <p className="text-xs text-muted-foreground">Due {new Date(biddingData.bidDueDate).toLocaleDateString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Estimate Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Estimate Breakdown
            <Badge variant="outline" className="ml-2">
              {formatCurrency(biddingData.totalEstimateValue)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {biddingData.estimateBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="font-medium">{item.category}</span>
                    <span className="text-sm text-muted-foreground">{item.percentage}% of total</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">{formatCurrency(item.value)}</span>
                  <Badge
                    variant={
                      item.status === "complete" ? "default" : item.status === "in_progress" ? "secondary" : "outline"
                    }
                    className={`text-xs ${getStatusColor(item.status)}`}
                  >
                    {item.status === "complete"
                      ? "Complete"
                      : item.status === "in_progress"
                      ? "In Progress"
                      : "Pending"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Estimate Value</span>
              <span className="text-lg font-bold">{formatCurrency(biddingData.totalEstimateValue)}</span>
            </div>
            <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
              <span>Contingency ({biddingData.contingencyPercentage}%)</span>
              <span>{formatCurrency((biddingData.totalEstimateValue * biddingData.contingencyPercentage) / 100)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subcontractor Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Subcontractor Bids
            <Badge variant="outline" className="ml-2">
              {receivedBids}/{totalBids} Received
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {biddingData.subcontractorBids.map((bid, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="font-medium">{bid.name}</span>
                    <span className="text-sm text-muted-foreground">{bid.trade}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(bid.amount)}</div>
                    <div className="text-sm text-muted-foreground">Rating: {bid.rating}/5.0</div>
                  </div>
                  <Badge
                    variant={bid.status === "received" ? "default" : "outline"}
                    className={`text-xs ${getStatusColor(bid.status)}`}
                  >
                    {bid.status === "received" ? "Received" : "Pending"}
                  </Badge>
                  <span className="text-sm text-muted-foreground min-w-0">{bid.responseTime}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <Button className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Send Bid Request
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Manage Subcontractors
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Bid Comparison
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Market Analysis & Bid Strategy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Market Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Market Condition</span>
                <Badge variant="secondary">{biddingData.marketAnalysis.marketCondition}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Price Escalation</span>
                <span className="text-sm font-medium">+{biddingData.marketAnalysis.priceEscalation}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Labor Availability</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  {biddingData.marketAnalysis.laborAvailability}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Material Pricing</span>
                <Badge variant="default" className="bg-blue-100 text-blue-800">
                  {biddingData.marketAnalysis.materialPricing}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Bid Strategy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-sm">Competitive Positioning</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Our bid is positioned well within the competitive range based on market analysis.
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium text-sm">Risk Factors</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Monitor material price volatility and subcontractor availability.
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-sm">Margin Analysis</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Current margin projection: 12.5% based on estimate completion.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bid Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Bid Submission Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Estimate completed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Subcontractor bids collected</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm">Bid bond obtained</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm">Insurance certificates ready</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Schedule developed</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm">Proposal narratives complete</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm">Marketing materials prepared</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm">Final review completed</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Generate Bid Package
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Final Review
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
