/**
 * @fileoverview Bidding Overview Component - Comprehensive Analytics Dashboard
 * @version 3.0.0
 * @description Analytics and visualization dashboard for bidding overview with KPIs, charts, and metrics
 */

"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Users, Calculator, TrendingUp } from "lucide-react"

interface BiddingOverviewProps {
  projectId: string
  projectData: any
  userRole: string
  user: any
  onPackageSelect: (packageId: string) => void
}

const BiddingOverview: React.FC<BiddingOverviewProps> = ({
  projectId,
  projectData,
  userRole,
  user,
  onPackageSelect,
}) => {
  return (
    <div className="space-y-6">
      {/* Bidding Overview Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* KPI Cards */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Invited Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">115</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">14.4</span> avg per package
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Bids Received</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-orange-600">20.9%</span> response rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Bid Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12.4M</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">-3.2%</span> under estimate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts and Analytics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bid Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bid Distribution by Package</CardTitle>
              <CardDescription>Comparison of low, average, and high bids</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <div className="flex items-end justify-between h-full space-x-2">
                  {[
                    { name: "01-00", low: 45, avg: 65, high: 85, label: "Materials Testing" },
                    { name: "02-21", low: 30, avg: 45, high: 60, label: "Surveying" },
                    { name: "03-33", low: 120, avg: 145, high: 170, label: "Concrete" },
                    { name: "04-21", low: 80, avg: 95, high: 110, label: "Masonry" },
                    { name: "05-12", low: 200, avg: 235, high: 270, label: "Structural Steel" },
                    { name: "06-10", low: 60, avg: 75, high: 90, label: "Carpentry" },
                    { name: "07-11", low: 40, avg: 55, high: 70, label: "Waterproofing" },
                    { name: "08-11", low: 25, avg: 35, high: 45, label: "Steel Doors" },
                  ].map((pkg, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="w-full max-w-16 mb-2">
                        <div className="flex flex-col space-y-1">
                          <div
                            className="bg-red-200 dark:bg-red-800 rounded-t"
                            style={{ height: `${(pkg.high / 270) * 200}px` }}
                          />
                          <div
                            className="bg-yellow-200 dark:bg-yellow-800"
                            style={{ height: `${(pkg.avg / 270) * 200}px` }}
                          />
                          <div
                            className="bg-green-200 dark:bg-green-800 rounded-b"
                            style={{ height: `${(pkg.low / 270) * 200}px` }}
                          />
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground text-center">
                        <div className="font-medium">{pkg.name}</div>
                        <div className="text-[10px] mt-1 leading-tight">{pkg.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center mt-4 space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-200 dark:bg-green-800 rounded"></div>
                    <span className="text-xs">Low Bid</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-200 dark:bg-yellow-800 rounded"></div>
                    <span className="text-xs">Average Bid</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-200 dark:bg-red-800 rounded"></div>
                    <span className="text-xs">High Bid</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bidder Performance Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bidder Performance Analysis</CardTitle>
              <CardDescription>Response rates and competitiveness by bidder</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { company: "Apex Construction LLC", packages: 8, bids: 6, winRate: 75, avgRank: 1.2 },
                  { company: "Premier Contractors", packages: 6, bids: 4, winRate: 50, avgRank: 2.1 },
                  { company: "BuildRight Corp", packages: 5, bids: 3, winRate: 33, avgRank: 2.8 },
                  { company: "Elite Builders", packages: 4, bids: 2, winRate: 25, avgRank: 3.2 },
                  { company: "Skyline Construction", packages: 3, bids: 2, winRate: 0, avgRank: 4.0 },
                ].map((bidder, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          {bidder.company
                            .split(" ")
                            .map((word) => word[0])
                            .join("")
                            .slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{bidder.company}</div>
                        <div className="text-sm text-muted-foreground">
                          {bidder.bids}/{bidder.packages} packages bid
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{bidder.winRate}% win rate</div>
                      <div className="text-sm text-muted-foreground">Avg rank: {bidder.avgRank}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cost Variance Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cost Variance Analysis</CardTitle>
              <CardDescription>Bid variance from engineer's estimate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { package: "01-00 Materials Testing", estimate: 52000, low: 45000, high: 58000 },
                  { package: "02-21 Surveying", estimate: 38000, low: 32000, high: 42000 },
                  { package: "03-33 Concrete", estimate: 1450000, low: 1250000, high: 1600000 },
                  { package: "04-21 Masonry", estimate: 985000, low: 890000, high: 1120000 },
                  { package: "05-12 Structural Steel", estimate: 2350000, low: 2100000, high: 2650000 },
                ].map((item, index) => {
                  const lowVariance = ((item.low - item.estimate) / item.estimate) * 100
                  const highVariance = ((item.high - item.estimate) / item.estimate) * 100
                  return (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{item.package}</div>
                        <div className="text-sm text-muted-foreground">Est: ${item.estimate.toLocaleString()}</div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className={`text-sm font-medium ${lowVariance < 0 ? "text-green-600" : "text-red-600"}`}>
                            {lowVariance.toFixed(1)}%
                          </div>
                          <div className="text-xs text-muted-foreground">Low</div>
                        </div>
                        <div className="text-center">
                          <div
                            className={`text-sm font-medium ${highVariance < 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {highVariance.toFixed(1)}%
                          </div>
                          <div className="text-xs text-muted-foreground">High</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Package List and Actions */}
        <div className="space-y-6">
          {/* Package Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Package Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Bidding</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Under Review</span>
                <span className="font-medium">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Awarded</span>
                <span className="font-medium">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pending</span>
                <span className="font-medium">1</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Export Bid Summary
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Send Invitations
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Calculator className="h-4 w-4 mr-2" />
                Generate Reports
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                Analysis Dashboard
              </Button>
            </CardContent>
          </Card>

          {/* Bid Package List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Bid Packages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { id: "01-00", name: "Materials Testing", status: "active", bids: 1 },
                  { id: "02-21", name: "Surveying", status: "active", bids: 1 },
                  { id: "03-33", name: "Concrete", status: "review", bids: 3 },
                  { id: "04-21", name: "Masonry", status: "awarded", bids: 2 },
                  { id: "05-12", name: "Structural Steel", status: "awarded", bids: 4 },
                  { id: "06-10", name: "Carpentry", status: "active", bids: 2 },
                  { id: "07-11", name: "Waterproofing", status: "review", bids: 1 },
                  { id: "08-11", name: "Steel Doors", status: "pending", bids: 0 },
                ].map((pkg) => (
                  <div
                    key={pkg.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => onPackageSelect(pkg.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          pkg.status === "active"
                            ? "bg-blue-500"
                            : pkg.status === "review"
                            ? "bg-yellow-500"
                            : pkg.status === "awarded"
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                      <div>
                        <div className="text-sm font-medium">{pkg.id}</div>
                        <div className="text-xs text-muted-foreground">{pkg.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{pkg.bids}</div>
                      <div className="text-xs text-muted-foreground">bids</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default BiddingOverview
