"use client"

import { useState, useMemo } from "react"
import {
  CreditCard,
  AlertCircle,
  Calendar,
  TrendingUp,
  DollarSign,
  Clock,
  FileText,
  Search,
  Download,
  Filter,
  ChevronDown,
  ChevronUp,
  Zap,
  AlertTriangle,
  CheckCircle,
  Info,
  Bot,
  Target,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Import AR aging data
import arAgingData from "@/data/mock/financial/ar-aging.json"

interface ARAgingProps {
  userRole: string
  projectData: any
}

// AR Aging item interface
interface ARAgingItem {
  project_id: number
  project_name: string
  project_manager: string
  percent_complete: number
  balance_to_finish: number
  retainage: number
  total_ar: number
  current: number
  days_1_30: number
  days_31_60: number
  days_60_plus: number
  comments: string
}

export default function ARAgingCard({ userRole, projectData }: ARAgingProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isInsightsCollapsed, setIsInsightsCollapsed] = useState(false)

  // Filter AR aging data to single project (2525840 - Palm Beach Luxury Estate)
  const filteredARData = useMemo(() => {
    return (arAgingData as ARAgingItem[]).filter((item) => item.project_id === 2525840)
  }, [])

  // Apply search filter
  const processedARData = useMemo(() => {
    let data = [...filteredARData]

    if (searchTerm) {
      data = data.filter(
        (item) =>
          item.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.project_manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.comments.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return data
  }, [filteredARData, searchTerm])

  // Calculate totals for each aging category
  const totals = useMemo(() => {
    return processedARData.reduce(
      (acc, item) => ({
        balance_to_finish: acc.balance_to_finish + item.balance_to_finish,
        retainage: acc.retainage + item.retainage,
        total_ar: acc.total_ar + item.total_ar,
        current: acc.current + item.current,
        days_1_30: acc.days_1_30 + item.days_1_30,
        days_31_60: acc.days_31_60 + item.days_31_60,
        days_60_plus: acc.days_60_plus + item.days_60_plus,
      }),
      {
        balance_to_finish: 0,
        retainage: 0,
        total_ar: 0,
        current: 0,
        days_1_30: 0,
        days_31_60: 0,
        days_60_plus: 0,
      }
    )
  }, [processedARData])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const exportToCSV = () => {
    const headers = [
      "Project Name",
      "Project Manager",
      "% Complete",
      "Balance to Finish",
      "Retainage",
      "Total AR",
      "Current",
      "1-30 Days",
      "31-60 Days",
      "60+ Days",
      "Comments",
    ]

    const csvContent = [
      headers.join(","),
      ...processedARData.map((item) =>
        [
          `"${item.project_name}"`,
          `"${item.project_manager}"`,
          item.percent_complete,
          item.balance_to_finish,
          item.retainage,
          item.total_ar,
          item.current,
          item.days_1_30,
          item.days_31_60,
          item.days_60_plus,
          `"${item.comments}"`,
        ].join(",")
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "ar_aging_analysis.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Get row styling based on aging status
  const getRowStyling = (item: ARAgingItem) => {
    if (item.days_60_plus > 0) {
      return "bg-red-50 dark:bg-red-950/20 border-l-4 border-l-red-500 dark:border-l-red-400" // Red highlight for 60+ days
    }
    if (item.days_1_30 > 0 || item.days_31_60 > 0) {
      return "bg-yellow-50 dark:bg-yellow-950/20 border-l-4 border-l-yellow-500 dark:border-l-yellow-400" // Yellow highlight for 1-60 days
    }
    return "" // Default styling
  }

  return (
    <div className="space-y-6">
      {/* HBI AR Aging Insights - General Analysis */}
      <Card className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-gray-800 dark:text-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                <Zap className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              HBI AR Aging Insights
              <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                AI-Powered
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsInsightsCollapsed(!isInsightsCollapsed)}
              className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              {isInsightsCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
          </CardTitle>
          {!isInsightsCollapsed && (
            <CardDescription className="text-gray-600 dark:text-gray-400">
              AI analysis and strategic recommendations for accounts receivable management
            </CardDescription>
          )}
        </CardHeader>
        {!isInsightsCollapsed && (
          <CardContent className="space-y-4">
            {/* Key AI Insights */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800 dark:text-orange-200">
                  <strong>Collection Priority Alert:</strong> {formatCurrency(totals.days_60_plus)} in 60+ day aging.
                  HBI recommends immediate collection action and client communication strategy.
                </AlertDescription>
              </Alert>

              <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 dark:text-blue-200">
                  <strong>Cash Flow Impact:</strong> Total AR at {formatCurrency(totals.total_ar)} with
                  {((totals.current / totals.total_ar) * 100).toFixed(1)}% current.{" "}
                  {totals.current / totals.total_ar > 0.7 ? "Healthy" : "Concerning"} aging profile.
                </AlertDescription>
              </Alert>

              <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  <strong>Retainage Analysis:</strong> {formatCurrency(totals.retainage)} in retainage held.
                  {totals.retainage / totals.total_ar > 0.1
                    ? "High retainage ratio may impact cash flow"
                    : "Retainage levels within normal range"}
                  .
                </AlertDescription>
              </Alert>
            </div>

            {/* AR Intelligence Summary */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Bot className="h-4 w-4" />
                Accounts Receivable Intelligence
              </h4>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-sm">Collection Performance</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    HBI identified {totals.days_60_plus > 0 ? "critical" : totals.days_31_60 > 0 ? "moderate" : "low"}{" "}
                    collection risk with
                    {formatCurrency(totals.days_1_30 + totals.days_31_60 + totals.days_60_plus)} in aged receivables
                    requiring attention.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-sm">Cash Flow Optimization</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Projected cash impact of {formatCurrency(totals.balance_to_finish)} remaining to bill.
                    {totals.balance_to_finish > totals.total_ar ? "Strong" : "Moderate"} future billing pipeline.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-2 w-2 rounded-full bg-gray-500 animate-pulse"></div>
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        Interactive AR Analysis Available
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Review aging buckets, identify collection priorities, and track project completion status using
                      the detailed AR aging table below.
                    </p>
                  </div>
                  <div className="text-2xl">💳</div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Controls and Export */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search project, manager, or comments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="px-3 py-1">
              {processedARData.length} Record{processedARData.length !== 1 ? "s" : ""}
            </Badge>
            <Badge
              variant="outline"
              className="px-3 py-1 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
            >
              DEMO
            </Badge>
          </div>
        </div>
        <Button variant="outline" onClick={exportToCSV} size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* AR Aging Table */}
      <Card>
        <CardContent className="p-6">
          <div className="rounded-md border">
            <div className="overflow-auto max-h-[600px]">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b-2 border-border/50 shadow-lg">
                  <TableRow className="bg-background/95 backdrop-blur-md">
                    <TableHead className="min-w-[200px]">Project Details</TableHead>
                    <TableHead className="text-right w-[120px]">% Complete</TableHead>
                    <TableHead className="text-right w-[120px]">Balance to Finish</TableHead>
                    <TableHead className="text-right w-[120px]">Retainage</TableHead>
                    <TableHead className="text-right w-[120px]">Total AR</TableHead>
                    <TableHead className="text-right w-[120px]">Current</TableHead>
                    <TableHead className="text-right w-[120px]">1-30 Days</TableHead>
                    <TableHead className="text-right w-[120px]">31-60 Days</TableHead>
                    <TableHead className="text-right w-[120px]">60+ Days</TableHead>
                    <TableHead className="min-w-[150px]">Comments</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedARData.map((item, index) => (
                    <TableRow key={index} className={`hover:bg-muted/50 ${getRowStyling(item)}`}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-sm">{item.project_name}</div>
                          <div className="text-xs text-muted-foreground">PM: {item.project_manager}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        <Badge variant="outline" className="text-xs">
                          {formatPercentage(item.percent_complete)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {formatCurrency(item.balance_to_finish)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">{formatCurrency(item.retainage)}</TableCell>
                      <TableCell className="text-right font-mono text-sm font-medium">
                        {formatCurrency(item.total_ar)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">{formatCurrency(item.current)}</TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        <span className={item.days_1_30 > 0 ? "text-yellow-600 dark:text-yellow-400 font-medium" : ""}>
                          {formatCurrency(item.days_1_30)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        <span className={item.days_31_60 > 0 ? "text-yellow-600 dark:text-yellow-400 font-medium" : ""}>
                          {formatCurrency(item.days_31_60)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        <span className={item.days_60_plus > 0 ? "text-red-600 dark:text-red-400 font-bold" : ""}>
                          {formatCurrency(item.days_60_plus)}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm max-w-[150px] truncate">{item.comments || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow className="bg-muted/50 font-semibold">
                    <TableCell className="font-bold">Totals</TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right font-mono text-sm font-bold">
                      {formatCurrency(totals.balance_to_finish)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm font-bold">
                      {formatCurrency(totals.retainage)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm font-bold">
                      {formatCurrency(totals.total_ar)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm font-bold">
                      {formatCurrency(totals.current)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm font-bold">
                      <span className={totals.days_1_30 > 0 ? "text-yellow-600 dark:text-yellow-400" : ""}>
                        {formatCurrency(totals.days_1_30)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm font-bold">
                      <span className={totals.days_31_60 > 0 ? "text-yellow-600 dark:text-yellow-400" : ""}>
                        {formatCurrency(totals.days_31_60)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm font-bold">
                      <span className={totals.days_60_plus > 0 ? "text-red-600 dark:text-red-400" : ""}>
                        {formatCurrency(totals.days_60_plus)}
                      </span>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </div>

          {/* Data Quality Notice */}
          {processedARData.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No AR aging records found{searchTerm ? " matching your search" : " for this project"}.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
