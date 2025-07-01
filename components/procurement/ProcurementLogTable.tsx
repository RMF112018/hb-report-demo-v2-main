"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Eye, ExternalLink, TrendingUp, TrendingDown } from "lucide-react"
import type { ProcurementLogRecord } from "@/types/procurement"

interface ProcurementLogTableProps {
  records: ProcurementLogRecord[]
  onRecordEdit: (record: ProcurementLogRecord) => void
  onRecordView: (record: ProcurementLogRecord) => void
  isLoading: boolean
  userRole: string
}

export function ProcurementLogTable({
  records,
  onRecordEdit,
  onRecordView,
  isLoading,
  userRole
}: ProcurementLogTableProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      planning: { variant: "secondary" as const, color: "bg-gray-100 text-gray-800" },
      bidding: { variant: "outline" as const, color: "bg-blue-100 text-blue-800" },
      negotiation: { variant: "outline" as const, color: "bg-yellow-100 text-yellow-800" },
      awarded: { variant: "default" as const, color: "bg-green-100 text-green-800" },
      active: { variant: "default" as const, color: "bg-emerald-100 text-emerald-800" },
      completed: { variant: "secondary" as const, color: "bg-blue-100 text-blue-800" },
      cancelled: { variant: "destructive" as const, color: "bg-red-100 text-red-800" },
      pending_approval: { variant: "outline" as const, color: "bg-orange-100 text-orange-800" }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.planning
    return (
      <Badge variant={config.variant} className={config.color}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    )
  }

  const getComplianceBadge = (status: string) => {
    const config = {
      compliant: { variant: "default" as const, color: "bg-green-100 text-green-800" },
      warning: { variant: "outline" as const, color: "bg-yellow-100 text-yellow-800" },
      "non-compliant": { variant: "destructive" as const, color: "bg-red-100 text-red-800" }
    }
    
    const selectedConfig = config[status as keyof typeof config] || config.warning
    return (
      <Badge variant={selectedConfig.variant} className={selectedConfig.color}>
        {status.replace('-', ' ').toUpperCase()}
      </Badge>
    )
  }

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', { 
      style: 'currency', 
      currency: 'USD', 
      minimumFractionDigits: 0 
    })
  }

  const formatVariance = (variance: number, percentage: number) => {
    const isPositive = variance >= 0
    return (
      <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        <span className="text-xs">
          {formatCurrency(Math.abs(variance))} ({Math.abs(percentage).toFixed(1)}%)
        </span>
      </div>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B35]"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (records.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">No procurement records found.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Commitment</TableHead>
              <TableHead className="w-[150px]">Vendor</TableHead>
              <TableHead className="w-[120px]">CSI Code</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[120px]">Contract Amount</TableHead>
              <TableHead className="w-[120px]">Budget</TableHead>
              <TableHead className="w-[120px]">Variance</TableHead>
              <TableHead className="w-[100px]">Compliance</TableHead>
              <TableHead className="w-[100px]">Bid Tab Link</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id} className="hover:bg-muted/50">
                <TableCell>
                  <div>
                    <div className="font-medium text-sm">{record.commitment_title}</div>
                    <div className="text-xs text-muted-foreground">{record.commitment_number}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-sm">{record.vendor_name}</div>
                    <div className="text-xs text-muted-foreground">{record.vendor_contact.name}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-sm">{record.csi_code}</div>
                    <div className="text-xs text-muted-foreground">{record.csi_description}</div>
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(record.status)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(record.contract_amount)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(record.budget_amount)}
                </TableCell>
                <TableCell>
                  {formatVariance(record.variance, record.variance_percentage)}
                </TableCell>
                <TableCell>
                  {getComplianceBadge(record.compliance_status)}
                </TableCell>
                <TableCell>
                  {record.bid_tab_link ? (
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">
                        {record.bid_tab_link.csi_match ? "✓" : "⚠"} {record.bid_tab_link.description_match}%
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => {
                          // Handle bid tab link navigation
                        }}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      Not Linked
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => onRecordView(record)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {(userRole === "project-manager" || userRole === "project-executive" || userRole === "executive") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => onRecordEdit(record)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 