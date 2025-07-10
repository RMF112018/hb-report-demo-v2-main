"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  ChevronDown,
  ChevronRight,
  Filter,
  Download,
  ArrowUpDown,
  DollarSign,
  TrendingUp,
  Calculator,
  Percent,
  Building2,
  Activity,
} from "lucide-react"

// Import mock data
import jchrData from "@/data/mock/financial/jchr.json"

interface JCHRCardProps {
  userRole: string
  projectData: any
}

interface JobCostItem {
  costCode: string
  description: string
  budgetAmount: number
  actualCost: number
  commitments: number
  variance: number
  percentComplete: number
  lastUpdated: string
}

interface ProjectData {
  project_id: number
  project_name: string
  jobCostItems: JobCostItem[]
}

interface GroupedData {
  division: string
  items: JobCostItem[]
  totals: {
    budget: number
    actual: number
    commitments: number
    variance: number
  }
}

export default function JCHRCard({ userRole, projectData }: JCHRCardProps) {
  const [sortField, setSortField] = useState<string>("costCode")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterVendor, setFilterVendor] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [expandedDivisions, setExpandedDivisions] = useState<Set<string>>(new Set())

  // Get project data - using project_id 2525804 as specified in requirements
  const currentProject = useMemo(() => {
    const targetProjectId = 2525804
    return (jchrData as ProjectData[]).find((p) => p.project_id === targetProjectId) || (jchrData as ProjectData[])[0]
  }, [])

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)
  }

  // Parse cost code to extract division and category
  const parseCostCode = (costCode: string) => {
    const parts = costCode.split(".")
    const division = parts[0] || "Unknown"
    const category = costCode.includes(".MAT")
      ? "Material"
      : costCode.includes(".LAB")
      ? "Labor"
      : costCode.includes(".LBN")
      ? "Labor Burden"
      : costCode.includes(".SUB")
      ? "Subcontract"
      : costCode.includes(".OVH")
      ? "Overhead"
      : "Other"
    return { division, category }
  }

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    if (!currentProject) return null

    const totalBudget = currentProject.jobCostItems.reduce((sum, item) => sum + item.budgetAmount, 0)
    const totalActual = currentProject.jobCostItems.reduce((sum, item) => sum + item.actualCost, 0)
    const totalCommitments = currentProject.jobCostItems.reduce((sum, item) => sum + item.commitments, 0)
    const totalVariance = currentProject.jobCostItems.reduce((sum, item) => sum + item.variance, 0)
    const percentSpent = totalBudget > 0 ? (totalActual / totalBudget) * 100 : 0

    // Calculate current period spend (mock data - would be filtered by date in real implementation)
    const currentPeriodSpend = totalActual * 0.12 // Assuming 12% of total costs are current period

    return {
      totalBudget,
      totalActual,
      totalCommitments,
      totalVariance,
      percentSpent,
      currentPeriodSpend,
      contractValue: totalBudget * 1.15, // Assuming 15% markup
      profitMargin: ((totalBudget * 1.15 - totalActual) / (totalBudget * 1.15)) * 100,
      financialHealth: Math.max(0, Math.min(100, 100 - (Math.abs(totalVariance) / totalBudget) * 100)),
    }
  }, [currentProject])

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    if (!currentProject) return []

    let filtered = currentProject.jobCostItems.filter((item) => {
      const { category } = parseCostCode(item.costCode)
      const matchesCategory = filterCategory === "all" || category.toLowerCase() === filterCategory.toLowerCase()
      const matchesSearch =
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.costCode.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })

    // Sort data
    filtered.sort((a, b) => {
      let aValue: any = a[sortField as keyof JobCostItem]
      let bValue: any = b[sortField as keyof JobCostItem]

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [currentProject, sortField, sortDirection, filterCategory, searchTerm])

  // Group data by division
  const groupedData = useMemo(() => {
    const groups: { [key: string]: GroupedData } = {}

    filteredAndSortedData.forEach((item) => {
      const { division } = parseCostCode(item.costCode)

      if (!groups[division]) {
        groups[division] = {
          division,
          items: [],
          totals: { budget: 0, actual: 0, commitments: 0, variance: 0 },
        }
      }

      groups[division].items.push(item)
      groups[division].totals.budget += item.budgetAmount
      groups[division].totals.actual += item.actualCost
      groups[division].totals.commitments += item.commitments
      groups[division].totals.variance += item.variance
    })

    return Object.values(groups)
  }, [filteredAndSortedData])

  // Toggle division expansion
  const toggleDivision = (division: string) => {
    const newExpanded = new Set(expandedDivisions)
    if (newExpanded.has(division)) {
      newExpanded.delete(division)
    } else {
      newExpanded.add(division)
    }
    setExpandedDivisions(newExpanded)
  }

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  if (!currentProject || !summaryMetrics) {
    return <div>Loading JCHR data...</div>
  }

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <span>Job Cost History Report</span>
              <Badge variant="outline">{currentProject.project_name}</Badge>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search by description or cost code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="material">Material</SelectItem>
                <SelectItem value="labor">Labor</SelectItem>
                <SelectItem value="labor burden">Labor Burden</SelectItem>
                <SelectItem value="subcontract">Subcontract</SelectItem>
                <SelectItem value="overhead">Overhead</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Job Cost Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("costCode")}
                      className="flex items-center"
                    >
                      Cost Code
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("budgetAmount")}
                      className="flex items-center"
                    >
                      Budget
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("actualCost")}
                      className="flex items-center"
                    >
                      Actual Cost
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Commitments</TableHead>
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("variance")}
                      className="flex items-center"
                    >
                      Variance
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">% Complete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupedData.map((group) => (
                  <React.Fragment key={group.division}>
                    {/* Division Header */}
                    <TableRow className="bg-muted/50 font-semibold">
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => toggleDivision(group.division)}>
                          {expandedDivisions.has(group.division) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell colSpan={2}>Division {group.division}</TableCell>
                      <TableCell></TableCell>
                      <TableCell className="text-right">{formatCurrency(group.totals.budget)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(group.totals.actual)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(group.totals.commitments)}</TableCell>
                      <TableCell className="text-right">
                        <span className={group.totals.variance >= 0 ? "text-red-600" : "text-green-600"}>
                          {group.totals.variance >= 0 ? "+" : ""}
                          {formatCurrency(group.totals.variance)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {group.totals.budget > 0
                          ? ((group.totals.actual / group.totals.budget) * 100).toFixed(1)
                          : "0.0"}
                        %
                      </TableCell>
                    </TableRow>

                    {/* Division Items */}
                    {expandedDivisions.has(group.division) &&
                      group.items.map((item) => {
                        const { category } = parseCostCode(item.costCode)
                        return (
                          <TableRow key={item.costCode}>
                            <TableCell></TableCell>
                            <TableCell className="font-mono text-sm">{item.costCode}</TableCell>
                            <TableCell className="text-sm">{item.description}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  category === "Material"
                                    ? "border-blue-200 text-blue-700"
                                    : category === "Labor"
                                    ? "border-green-200 text-green-700"
                                    : category === "Labor Burden"
                                    ? "border-yellow-200 text-yellow-700"
                                    : category === "Subcontract"
                                    ? "border-purple-200 text-purple-700"
                                    : "border-gray-200 text-gray-700"
                                }
                              >
                                {category}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(item.budgetAmount)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.actualCost)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.commitments)}</TableCell>
                            <TableCell className="text-right">
                              <span className={item.variance >= 0 ? "text-red-600" : "text-green-600"}>
                                {item.variance >= 0 ? "+" : ""}
                                {formatCurrency(item.variance)}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">{item.percentComplete.toFixed(1)}%</TableCell>
                          </TableRow>
                        )
                      })}
                  </React.Fragment>
                ))}

                {/* Grand Total Row */}
                <TableRow className="bg-primary/10 font-bold border-t-2">
                  <TableCell></TableCell>
                  <TableCell colSpan={3}>TOTAL JOB COST</TableCell>
                  <TableCell className="text-right">{formatCurrency(summaryMetrics.totalBudget)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(summaryMetrics.totalActual)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(summaryMetrics.totalCommitments)}</TableCell>
                  <TableCell className="text-right">
                    <span className={summaryMetrics.totalVariance >= 0 ? "text-red-600" : "text-green-600"}>
                      {summaryMetrics.totalVariance >= 0 ? "+" : ""}
                      {formatCurrency(summaryMetrics.totalVariance)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{summaryMetrics.percentSpent.toFixed(1)}%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
