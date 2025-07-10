/**
 * @fileoverview Bid Package List Component
 * @version 3.0.0
 * @description Displays and manages a list of bid packages with filtering and actions
 */

"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card"
import { Badge } from "../../../ui/badge"
import { Button } from "../../../ui/button"
import { Plus, Calendar, DollarSign, Users, FileText, Clock } from "lucide-react"
import { BidPackage } from "../types/bid-management"

interface BidPackageListProps {
  projectId: string
  packages: BidPackage[]
  selectedPackage?: BidPackage | null
  onPackageSelect: (pkg: BidPackage) => void
  onPackageCreate: () => void
  onPackageEdit: (pkg: BidPackage) => void
  onPackageDelete: (packageId: string) => void
}

const BidPackageList: React.FC<BidPackageListProps> = ({
  projectId,
  packages,
  selectedPackage,
  onPackageSelect,
  onPackageCreate,
  onPackageEdit,
  onPackageDelete,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
      case "sent":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      case "responses-due":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
      case "under-review":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100"
      case "awarded":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getDaysUntilDue = (dateString: string) => {
    const dueDate = new Date(dateString)
    const today = new Date()
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Bid Packages</h2>
        <Button onClick={onPackageCreate} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Package
        </Button>
      </div>

      <div className="space-y-3">
        {packages.map((pkg) => {
          const daysUntilDue = getDaysUntilDue(pkg.dueDate)
          const isOverdue = daysUntilDue < 0

          return (
            <Card
              key={pkg.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedPackage?.id === pkg.id
                  ? "ring-2 ring-blue-500 border-blue-500"
                  : "border-gray-200 dark:border-gray-700"
              }`}
              onClick={() => onPackageSelect(pkg)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base font-medium">{pkg.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{pkg.scope}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className={getStatusColor(pkg.status)}>
                      {pkg.status.replace("-", " ")}
                    </Badge>
                    {isOverdue && (
                      <Badge variant="destructive" className="text-xs">
                        Overdue
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <DollarSign className="h-4 w-4 mr-2" />
                    {formatCurrency(pkg.estimatedValue)}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    Due: {formatDate(pkg.dueDate)}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    {pkg.assignedTeam.length} team members
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <FileText className="h-4 w-4 mr-2" />
                    {pkg.responses.length} responses
                  </div>
                </div>

                {/* Due date indicator */}
                {daysUntilDue >= 0 && daysUntilDue <= 7 && (
                  <div className="mt-3 flex items-center text-orange-600 text-sm">
                    <Clock className="h-4 w-4 mr-2" />
                    {daysUntilDue === 0 ? "Due today" : `Due in ${daysUntilDue} day${daysUntilDue > 1 ? "s" : ""}`}
                  </div>
                )}

                {/* Invited subs preview */}
                {pkg.invitedSubs.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-1">
                      Invited: {pkg.invitedSubs.length} subcontractors
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {pkg.invitedSubs.slice(0, 3).map((sub, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {sub}
                        </Badge>
                      ))}
                      {pkg.invitedSubs.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{pkg.invitedSubs.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {packages.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No bid packages found</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default BidPackageList
