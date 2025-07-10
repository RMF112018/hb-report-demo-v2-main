/**
 * @fileoverview Bid Package Details Component
 * @version 3.0.0
 * @description Displays detailed information about a selected bid package
 */

"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card"
import { Badge } from "../../../ui/badge"
import { Button } from "../../../ui/button"
import { Edit, Calendar, DollarSign, Users, FileText } from "lucide-react"
import { BidPackage } from "../types/bid-management"

interface BidPackageDetailsProps {
  package: BidPackage
  onPackageUpdate: (updates: Partial<BidPackage>) => void
  isEditable: boolean
  className?: string
}

const BidPackageDetails: React.FC<BidPackageDetailsProps> = ({
  package: pkg,
  onPackageUpdate,
  isEditable,
  className = "",
}) => {
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
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

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

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{pkg.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{pkg.scope}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className={getStatusColor(pkg.status)}>
                {pkg.status.replace("-", " ")}
              </Badge>
              {isEditable && (
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">Estimated Value:</span>
                <span className="ml-2">{formatCurrency(pkg.estimatedValue)}</span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">Due Date:</span>
                <span className="ml-2">{formatDate(pkg.dueDate)}</span>
              </div>
              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">Team Members:</span>
                <span className="ml-2">{pkg.assignedTeam.length}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">Responses:</span>
                <span className="ml-2">{pkg.responses.length}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="font-medium">Invited Subs:</span>
                <span className="ml-2">{pkg.invitedSubs.length}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="font-medium">Attachments:</span>
                <span className="ml-2">{pkg.attachments.length}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-sm text-muted-foreground">{pkg.description}</p>
          </div>
        </CardContent>
      </Card>

      {pkg.responses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Bid Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pkg.responses.map((response) => (
                <div key={response.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium">{response.vendorName}</h5>
                    <Badge variant="outline">{response.status}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Bid Amount:</span>
                      <span className="ml-2">{formatCurrency(response.bidAmount)}</span>
                    </div>
                    <div>
                      <span className="font-medium">Risk Level:</span>
                      <span className="ml-2 capitalize">{response.riskLevel}</span>
                    </div>
                  </div>
                  {response.notes && <p className="text-sm text-muted-foreground mt-2">{response.notes}</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default BidPackageDetails
