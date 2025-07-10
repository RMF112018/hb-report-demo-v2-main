/**
 * @fileoverview BidManagementNavigation Component
 * @version 3.0.0
 * @description Navigation component for bid management functionality within project pages
 */

"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Building2,
  FileText,
  Users,
  BarChart3,
  Target,
  Activity,
  Package,
  ChevronRight,
  MessageSquare,
  Settings,
  PieChart,
} from "lucide-react"

interface BidManagementNavigationProps {
  projectId?: string
  activeSection?: string
  onSectionChange?: (section: string) => void
  onPackageSelect?: (packageId: string) => void
  selectedBidPackage?: string | null
  projectData?: any
  className?: string
}

const BidManagementNavigation: React.FC<BidManagementNavigationProps> = ({
  projectId,
  activeSection = "overview",
  onSectionChange,
  onPackageSelect,
  selectedBidPackage,
  projectData,
  className = "",
}) => {
  const [bidPackagesExpanded, setBidPackagesExpanded] = useState(false)

  // Use the same bid packages data as BiddingOverview for consistency
  const bidPackages = [
    { id: "01-00", name: "Materials Testing", status: "active", bidCount: 1, companies: 13, viewed: 6, bidding: 2 },
    { id: "02-21", name: "Surveying", status: "active", bidCount: 1, companies: 11, viewed: 4, bidding: 3 },
    { id: "03-33", name: "Concrete", status: "pending", bidCount: 0, companies: 29, viewed: 13, bidding: 1 },
    { id: "03-35", name: "Hollow Core Concrete", status: "pending", bidCount: 0, companies: 1, viewed: 0, bidding: 0 },
    { id: "04-22", name: "Masonry", status: "pending", bidCount: 0, companies: 14, viewed: 9, bidding: 0 },
    { id: "05-70", name: "Decorative Metals", status: "pending", bidCount: 0, companies: 14, viewed: 3, bidding: 0 },
    { id: "06-11", name: "Wood Framing", status: "pending", bidCount: 0, companies: 30, viewed: 10, bidding: 1 },
    { id: "06-17", name: "Wood Trusses", status: "pending", bidCount: 0, companies: 8, viewed: 7, bidding: 3 },
    { id: "06-41", name: "Millwork", status: "pending", bidCount: 0, companies: 22, viewed: 3, bidding: 0 },
    {
      id: "06-61",
      name: "Rough Carpentry Hardware",
      status: "pending",
      bidCount: 0,
      companies: 6,
      viewed: 0,
      bidding: 0,
    },
  ]

  const handleBidPackageClick = (packageId: string) => {
    // Call the same onPackageSelect callback as BiddingOverview
    if (onPackageSelect) {
      onPackageSelect(packageId)
    }
  }

  const handleBidPackagesToggle = () => {
    setBidPackagesExpanded(!bidPackagesExpanded)
  }

  const handleSectionClick = (sectionId: string) => {
    if (onSectionChange) {
      onSectionChange(sectionId)
    }
  }

  return (
    <Card className={`bid-management-navigation ${className} border-border`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Bid Management</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <nav className="space-y-1 p-4">
          {/* Bid Packages - Expandable */}
          <div>
            <button
              onClick={handleBidPackagesToggle}
              className="flex items-center justify-between w-full p-2 rounded-lg text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <div className="flex items-center">
                <Package className="h-4 w-4 mr-3" />
                <span className="text-sm font-medium">Bid Packages</span>
                <ChevronRight
                  className={`h-3 w-3 ml-2 transition-transform ${bidPackagesExpanded ? "rotate-90" : ""}`}
                />
              </div>
              <Badge variant="secondary" className="text-xs">
                {bidPackages.length}
              </Badge>
            </button>

            {/* Expandable Bid Packages List */}
            {bidPackagesExpanded && (
              <div className="ml-6 mt-2 space-y-1 border-l border-border pl-3">
                {bidPackages.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => handleBidPackageClick(pkg.id)}
                    className={`flex items-center justify-between w-full p-2 rounded-md text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                      selectedBidPackage === pkg.id ? "bg-blue-50 dark:bg-blue-950" : ""
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          pkg.status === "active" ? "bg-green-500" : "bg-yellow-500"
                        }`}
                      />
                      <div>
                        <div className="text-xs font-medium">{pkg.id}</div>
                        <div className="text-xs text-muted-foreground">{pkg.name}</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {pkg.bidCount}
                    </Badge>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Other Navigation Items */}
          {[
            { id: "messages", label: "Messages", icon: MessageSquare, count: 3 },
            { id: "files", label: "Files", icon: FileText, count: 12 },
            { id: "forms", label: "Forms", icon: Settings, count: 1 },
            { id: "team", label: "Team", icon: Users, count: 4 },
            { id: "reports", label: "Reports", icon: BarChart3, count: 1 },
            { id: "details", label: "Project Details", icon: Building2 },
            { id: "bid-tabs", label: "Bid Tabs", icon: PieChart },
          ].map((item) => {
            const IconComponent = item.icon
            return (
              <button
                key={item.id}
                className="flex items-center justify-between w-full p-2 rounded-lg text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => handleSectionClick(item.id)}
              >
                <div className="flex items-center">
                  <IconComponent className="h-4 w-4 mr-3" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <Badge variant="secondary" className="text-xs">
                    {item.count}
                  </Badge>
                )}
              </button>
            )
          })}
        </nav>
      </CardContent>
    </Card>
  )
}

export default BidManagementNavigation
