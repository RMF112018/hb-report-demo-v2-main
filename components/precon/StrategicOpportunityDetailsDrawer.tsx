"use client"

import React from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Building,
  MapPin,
  Calendar,
  DollarSign,
  User,
  Tag,
  TrendingUp,
  Target,
  X,
  Edit,
  Save,
  Trash2,
} from "lucide-react"
import type { StrategicOpportunity } from "./StrategicOpportunityGrid"

/**
 * StrategicOpportunityDetailsDrawer props
 */
export interface StrategicOpportunityDetailsDrawerProps {
  opportunity: StrategicOpportunity
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * StrategicOpportunityDetailsDrawer Component
 * Displays detailed information about a strategic opportunity
 */
export function StrategicOpportunityDetailsDrawer({
  opportunity,
  open,
  onOpenChange,
}: StrategicOpportunityDetailsDrawerProps) {
  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case "prospecting":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "qualification":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "proposal":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "negotiation":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "closed won":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "closed lost":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getProbabilityColor = (prob: number) => {
    if (prob >= 80) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    if (prob >= 60) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    if (prob >= 40) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] sm:w-[700px] overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Strategic Opportunity Details
            </SheetTitle>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Project Header */}
          <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    {opportunity.projectName}
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{opportunity.clientOrg}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="h-8">
                    <Save className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{opportunity.regionCity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{opportunity.marketSector}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Estimated Value</span>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                  {formatCurrency(opportunity.estimatedValue)}
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Probability</span>
                </div>
                <div className="mt-1">
                  <Badge className={`${getProbabilityColor(opportunity.probabilityPercent)}`}>
                    {opportunity.probabilityPercent}%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Forecast Close</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                  {formatDate(opportunity.forecastCloseDate)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stage and Assignment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Stage</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Badge className={`${getStageColor(opportunity.stage)}`}>{opportunity.stage}</Badge>
              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Assigned Representative
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-900 dark:text-white">{opportunity.assignedRep}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tags */}
          <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                {opportunity.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" className="flex-1">
              <Edit className="h-4 w-4 mr-2" />
              Edit Opportunity
            </Button>
            <Button variant="outline" className="flex-1">
              <Target className="h-4 w-4 mr-2" />
              View in CRM
            </Button>
            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
