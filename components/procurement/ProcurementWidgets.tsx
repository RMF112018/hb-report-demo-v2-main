"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  DollarSign, 
  Package, 
  Building2, 
  Shield, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  Target
} from "lucide-react"

export interface ProcurementStats {
  totalValue: number
  activeBuyouts: number
  completedBuyouts: number
  pendingContracts: number
  vendorCount: number
  complianceRate: number
  avgSavings: number
  onTimeDelivery: number
  byCategory: Record<string, number>
  byStatus: Record<string, number>
}

interface ProcurementWidgetsProps {
  stats: ProcurementStats
}

export function ProcurementWidgets({ stats }: ProcurementWidgetsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Total Procurement Value */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 dark:from-blue-950 dark:to-indigo-950 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Value</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {formatCurrency(stats.totalValue)}
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                All procurement contracts
              </p>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Buyouts */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 dark:from-green-950 dark:to-emerald-950 dark:border-green-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Active Buyouts</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                {stats.activeBuyouts}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300 dark:bg-green-800 dark:text-green-200 dark:border-green-600">
                  {stats.completedBuyouts} completed
                </Badge>
              </div>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
              <Package className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vendor Management */}
      <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 dark:from-purple-950 dark:to-violet-950 dark:border-purple-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Vendors</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {stats.vendorCount}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-1"></div>
                  <span className="text-xs text-purple-700 dark:text-purple-300">Active partners</span>
                </div>
              </div>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
              <Building2 className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Rate */}
      <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 dark:from-orange-950 dark:to-amber-950 dark:border-orange-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Compliance</p>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                {formatPercentage(stats.complianceRate)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {stats.complianceRate >= 95 ? (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                ) : stats.complianceRate >= 85 ? (
                  <Clock className="h-3 w-3 text-yellow-500" />
                ) : (
                  <AlertTriangle className="h-3 w-3 text-red-500" />
                )}
                <span className="text-xs text-orange-700 dark:text-orange-300">
                  {stats.pendingContracts} pending
                </span>
              </div>
            </div>
            <div className="p-2 bg-orange-100 dark:bg-orange-800 rounded-lg">
              <Shield className="h-6 w-6 text-orange-600 dark:text-orange-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200 dark:from-teal-950 dark:to-cyan-950 dark:border-teal-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-teal-600 dark:text-teal-400">Performance</p>
              <p className="text-2xl font-bold text-teal-900 dark:text-teal-100">
                {formatPercentage(stats.onTimeDelivery)}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs bg-teal-100 text-teal-700 border-teal-300 dark:bg-teal-800 dark:text-teal-200 dark:border-teal-600">
                  {formatPercentage(stats.avgSavings)} savings
                </Badge>
              </div>
            </div>
            <div className="p-2 bg-teal-100 dark:bg-teal-800 rounded-lg">
              <TrendingUp className="h-6 w-6 text-teal-600 dark:text-teal-300" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 