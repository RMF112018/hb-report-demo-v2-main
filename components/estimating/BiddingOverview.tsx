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
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  FileText,
  Users,
  Calculator,
  TrendingUp,
  Search,
  Filter,
  Columns,
  Download,
  Upload,
  Plus,
  MoreHorizontal,
  Copy,
  MessageCircle,
  ChevronDown,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface BiddingOverviewProps {
  projectId: string
  projectData: any
  userRole: string
  user: any
  onPackageSelect: (packageId: string) => void
  onPackageSelectWithTab?: (packageId: string, tab: string) => void
}

const BiddingOverview: React.FC<BiddingOverviewProps> = ({
  projectId,
  projectData,
  userRole,
  user,
  onPackageSelect,
  onPackageSelectWithTab,
}) => {
  const bidPackages = [
    {
      id: "01-00",
      name: "Materials Testing",
      lead: "WS",
      bidsDate: "4/18/2025",
      bidsTime: "5:00 PM EDT",
      companies: 13,
      viewed: 6,
      bidding: 2,
      bids: 1,
      estimatedCost: null,
      softAwardedCompany: "Level bids",
      leveledBid: null,
      hasLevelBids: true,
    },
    {
      id: "02-21",
      name: "Surveying",
      lead: "WS",
      bidsDate: "4/18/2025",
      bidsTime: "5:00 PM EDT",
      companies: 11,
      viewed: 4,
      bidding: 3,
      bids: 1,
      estimatedCost: null,
      softAwardedCompany: "Level bids",
      leveledBid: null,
      hasLevelBids: true,
    },
    {
      id: "03-33",
      name: "Concrete",
      lead: "WS",
      bidsDate: "4/18/2025",
      bidsTime: "5:00 PM EDT",
      companies: 29,
      viewed: 13,
      bidding: 1,
      bids: 0,
      estimatedCost: null,
      softAwardedCompany: "no bids",
      leveledBid: null,
      hasLevelBids: false,
    },
    {
      id: "03-35",
      name: "Hollow Core Concrete",
      lead: "WS",
      bidsDate: "4/18/2025",
      bidsTime: "5:00 PM EDT",
      companies: 1,
      viewed: 0,
      bidding: 0,
      bids: 0,
      estimatedCost: null,
      softAwardedCompany: "no bids",
      leveledBid: null,
      hasLevelBids: false,
    },
    {
      id: "04-22",
      name: "Masonry",
      lead: "WS",
      bidsDate: "4/18/2025",
      bidsTime: "5:00 PM EDT",
      companies: 14,
      viewed: 9,
      bidding: 0,
      bids: 0,
      estimatedCost: null,
      softAwardedCompany: "no bids",
      leveledBid: null,
      hasLevelBids: false,
    },
    {
      id: "05-70",
      name: "Decorative Metals",
      lead: "WS",
      bidsDate: "4/18/2025",
      bidsTime: "5:00 PM EDT",
      companies: 14,
      viewed: 3,
      bidding: 0,
      bids: 0,
      estimatedCost: null,
      softAwardedCompany: "no bids",
      leveledBid: null,
      hasLevelBids: false,
    },
    {
      id: "06-11",
      name: "Wood Framing",
      lead: "WS",
      bidsDate: "4/18/2025",
      bidsTime: "5:00 PM EDT",
      companies: 30,
      viewed: 10,
      bidding: 1,
      bids: 0,
      estimatedCost: null,
      softAwardedCompany: "no bids",
      leveledBid: null,
      hasLevelBids: false,
    },
    {
      id: "06-17",
      name: "Wood Trusses",
      lead: "WS",
      bidsDate: "4/18/2025",
      bidsTime: "5:00 PM EDT",
      companies: 8,
      viewed: 7,
      bidding: 3,
      bids: 0,
      estimatedCost: null,
      softAwardedCompany: "no bids",
      leveledBid: null,
      hasLevelBids: false,
    },
    {
      id: "06-41",
      name: "Millwork",
      lead: "WS",
      bidsDate: "4/18/2025",
      bidsTime: "5:00 PM EDT",
      companies: 22,
      viewed: 3,
      bidding: 0,
      bids: 0,
      estimatedCost: null,
      softAwardedCompany: "no bids",
      leveledBid: null,
      hasLevelBids: false,
    },
    {
      id: "06-61",
      name: "Rough Carpentry Hardware",
      lead: "WS",
      bidsDate: "4/18/2025",
      bidsTime: "5:00 PM EDT",
      companies: 6,
      viewed: 0,
      bidding: 0,
      bids: 0,
      estimatedCost: null,
      softAwardedCompany: "no bids",
      leveledBid: null,
      hasLevelBids: false,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Filter bid packages" className="pl-9 w-64" />
          </div>
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Find
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Columns className="h-4 w-4 mr-2" />
            Column
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Bid Package
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bidPackages.length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bidPackages.reduce((sum, pkg) => sum + pkg.companies, 0)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">
                {(bidPackages.reduce((sum, pkg) => sum + pkg.companies, 0) / bidPackages.length).toFixed(1)}
              </span>{" "}
              avg per package
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Bidding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bidPackages.reduce((sum, pkg) => sum + pkg.bidding, 0)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-orange-600">{bidPackages.filter((pkg) => pkg.bidding > 0).length}</span> packages
              active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Bids Received</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bidPackages.reduce((sum, pkg) => sum + pkg.bids, 0)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{bidPackages.filter((pkg) => pkg.bids > 0).length}</span> packages with
              bids
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bid Packages Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Bid Packages</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input type="checkbox" className="rounded" />
                </TableHead>
                <TableHead className="w-16">Lead</TableHead>
                <TableHead className="w-20">Number</TableHead>
                <TableHead className="min-w-48">Name</TableHead>
                <TableHead className="w-32">Bids Due</TableHead>
                <TableHead className="w-24">Companies</TableHead>
                <TableHead className="w-20">Viewed</TableHead>
                <TableHead className="w-20">Bidding</TableHead>
                <TableHead className="w-16">Bids</TableHead>
                <TableHead className="w-32">Estimated Cost</TableHead>
                <TableHead className="min-w-40">Soft Awarded Company</TableHead>
                <TableHead className="w-28">Leveled Bid</TableHead>
                <TableHead className="w-20">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bidPackages.map((pkg) => (
                <TableRow key={pkg.id} className="hover:bg-muted/50">
                  <TableCell>
                    <input type="checkbox" className="rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {pkg.lead}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{pkg.id}</span>
                  </TableCell>
                  <TableCell>
                    <button
                      className="text-blue-600 hover:text-blue-800 hover:underline text-left"
                      onClick={() => onPackageSelect(pkg.id)}
                    >
                      {pkg.name}
                    </button>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{pkg.bidsDate}</div>
                      <div className="text-muted-foreground">{pkg.bidsTime}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium">{pkg.companies}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium">{pkg.viewed}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium">{pkg.bidding}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium">{pkg.bids}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-muted-foreground">-</span>
                  </TableCell>
                  <TableCell>
                    {pkg.hasLevelBids ? (
                      <button
                        className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                        onClick={() =>
                          onPackageSelectWithTab
                            ? onPackageSelectWithTab(pkg.id, "bid-leveling")
                            : onPackageSelect(pkg.id)
                        }
                      >
                        Level bids »
                      </button>
                    ) : (
                      <span className="text-muted-foreground text-sm italic">no bids</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-muted-foreground">-</span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default BiddingOverview
