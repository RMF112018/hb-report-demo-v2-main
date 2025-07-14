/**
 * @fileoverview Constructability Review Log Component
 * @module ConstructabilityReviewLog
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-12-20
 */

"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Copy,
  Send,
  MoreHorizontal,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Star,
  Calendar,
  User,
  FileText,
  MessageSquare,
  Paperclip,
  CheckCircle,
  Clock,
  AlertTriangle,
  Award,
  Target,
  TrendingUp,
  TrendingDown,
  Building,
  RefreshCw,
  Plus,
  X,
  SlidersHorizontal,
  CalendarDays,
  Users,
  Activity,
  ExternalLink,
  Share,
  Bookmark,
} from "lucide-react"

interface ReviewData {
  id: string
  reviewType: string
  projectStage: string
  reviewDate: string
  reviewerName: string
  reviewerRole: string
  overallScore: number
  status: "completed" | "in-progress" | "pending"
  scoring: {
    designFeasibility: number
    coordinationClarity: number
    codeCompliance: number
    costScheduleImpact: number
    constructabilityRisk: number
    bimReviewQuality: number
  }
  comments: string
  recommendations: string[]
  attachments: string[]
  reviewDuration: number // in hours
  issuesIdentified: number
  issuesResolved: number
  priority: "high" | "medium" | "low"
  tags: string[]
}

interface ConstructabilityReviewLogProps {
  projectId: string
  projectData: any
  userRole: string
  user: any
}

const ConstructabilityReviewLog: React.FC<ConstructabilityReviewLogProps> = ({
  projectId,
  projectData,
  userRole,
  user,
}) => {
  const [reviews, setReviews] = useState<ReviewData[]>([])
  const [filteredReviews, setFilteredReviews] = useState<ReviewData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [stageFilter, setStageFilter] = useState<string>("all")
  const [reviewerFilter, setReviewerFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<keyof ReviewData>("reviewDate")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedReview, setSelectedReview] = useState<ReviewData | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Load mock data
  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 800))

        const mockReviews: ReviewData[] = [
          {
            id: "CR-001",
            reviewType: "100% DD Review",
            projectStage: "Design Development",
            reviewDate: "2024-01-15",
            reviewerName: "Sarah Johnson",
            reviewerRole: "Senior Project Manager",
            overallScore: 8.5,
            status: "completed",
            scoring: {
              designFeasibility: 9,
              coordinationClarity: 8,
              codeCompliance: 9,
              costScheduleImpact: 8,
              constructabilityRisk: 8,
              bimReviewQuality: 9,
            },
            comments:
              "Excellent design coordination with minimal constructability issues identified. The team has done outstanding work in addressing previous review comments.",
            recommendations: [
              "Consider precast concrete for improved schedule",
              "Review MEP coordination in mechanical room",
            ],
            attachments: ["review_report.pdf", "marked_drawings.pdf", "response_matrix.xlsx"],
            reviewDuration: 6,
            issuesIdentified: 3,
            issuesResolved: 3,
            priority: "high",
            tags: ["design-development", "coordination", "excellent"],
          },
          {
            id: "CR-002",
            reviewType: "80% CD Review",
            projectStage: "Construction Documents",
            reviewDate: "2024-01-20",
            reviewerName: "Mike Chen",
            reviewerRole: "Construction Manager",
            overallScore: 7.8,
            status: "completed",
            scoring: {
              designFeasibility: 8,
              coordinationClarity: 7,
              codeCompliance: 8,
              costScheduleImpact: 8,
              constructabilityRisk: 7,
              bimReviewQuality: 8,
            },
            comments:
              "Good progress with some coordination issues requiring attention. Overall design is sound but needs refinement.",
            recommendations: ["Resolve structural-MEP conflicts", "Clarify construction sequencing"],
            attachments: ["cd_review.pdf", "clash_report.pdf"],
            reviewDuration: 8,
            issuesIdentified: 7,
            issuesResolved: 5,
            priority: "medium",
            tags: ["construction-documents", "coordination", "needs-attention"],
          },
          {
            id: "CR-003",
            reviewType: "95% CD Review",
            projectStage: "Construction Documents",
            reviewDate: "2024-01-25",
            reviewerName: "Lisa Rodriguez",
            reviewerRole: "Quality Manager",
            overallScore: 8.8,
            status: "completed",
            scoring: {
              designFeasibility: 9,
              coordinationClarity: 9,
              codeCompliance: 9,
              costScheduleImpact: 8,
              constructabilityRisk: 9,
              bimReviewQuality: 9,
            },
            comments:
              "Outstanding coordination and constructability. Ready for construction with only minor refinements needed.",
            recommendations: ["Minor detail refinements", "Final specification review"],
            attachments: ["final_review.pdf", "specs_comments.pdf"],
            reviewDuration: 4,
            issuesIdentified: 2,
            issuesResolved: 2,
            priority: "low",
            tags: ["construction-documents", "final-review", "outstanding"],
          },
        ]

        setReviews(mockReviews)
        setFilteredReviews(mockReviews)
      } catch (error) {
        console.error("Error loading reviews:", error)
      } finally {
        setLoading(false)
      }
    }

    loadReviews()
  }, [projectId])

  // Filter and sort reviews
  useEffect(() => {
    let filtered = reviews.filter((review) => {
      const matchesSearch =
        review.reviewType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.reviewerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comments.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || review.status === statusFilter
      const matchesStage = stageFilter === "all" || review.projectStage === stageFilter
      const matchesReviewer = reviewerFilter === "all" || review.reviewerName === reviewerFilter

      return matchesSearch && matchesStatus && matchesStage && matchesReviewer
    })

    // Sort reviews
    filtered.sort((a, b) => {
      let aVal = a[sortBy]
      let bVal = b[sortBy]

      if (sortBy === "reviewDate") {
        aVal = new Date(aVal as string).getTime()
        bVal = new Date(bVal as string).getTime()
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })

    setFilteredReviews(filtered)
    setCurrentPage(1)
  }, [reviews, searchTerm, statusFilter, stageFilter, reviewerFilter, sortBy, sortOrder])

  const handleSort = (column: keyof ReviewData) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("desc")
    }
  }

  const getSortIcon = (column: keyof ReviewData) => {
    if (sortBy !== column) return <ArrowUpDown className="h-4 w-4" />
    return sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "pending":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return "text-green-600 dark:text-green-400"
    if (score >= 7.0) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  // Pagination
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentReviews = filteredReviews.slice(startIndex, endIndex)

  const exportReviews = () => {
    // Mock export functionality
    const csvContent = [
      ["Review ID", "Type", "Stage", "Date", "Reviewer", "Score", "Status"].join(","),
      ...filteredReviews.map((review) =>
        [
          review.id,
          review.reviewType,
          review.projectStage,
          review.reviewDate,
          review.reviewerName,
          review.overallScore,
          review.status,
        ].join(",")
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `constructability-reviews-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setStageFilter("all")
    setReviewerFilter("all")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading review log...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Review Log</h3>
          <p className="text-sm text-muted-foreground">
            Complete history of constructability reviews with detailed tracking
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={exportReviews}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Review
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Stage</label>
              <Select value={stageFilter} onValueChange={setStageFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  <SelectItem value="Schematic Design">Schematic Design</SelectItem>
                  <SelectItem value="Design Development">Design Development</SelectItem>
                  <SelectItem value="Construction Documents">Construction Documents</SelectItem>
                  <SelectItem value="Pre-Construction">Pre-Construction</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Reviewer</label>
              <Select value={reviewerFilter} onValueChange={setReviewerFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reviewers</SelectItem>
                  {Array.from(new Set(reviews.map((r) => r.reviewerName))).map((reviewer) => (
                    <SelectItem key={reviewer} value={reviewer}>
                      {reviewer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Actions</label>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
                <Button variant="outline" size="sm">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Advanced
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredReviews.length)} of {filteredReviews.length} reviews
        </p>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select value={sortBy} onValueChange={(value: keyof ReviewData) => setSortBy(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="reviewDate">Date</SelectItem>
              <SelectItem value="overallScore">Score</SelectItem>
              <SelectItem value="reviewType">Type</SelectItem>
              <SelectItem value="reviewerName">Reviewer</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reviews Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">
                  <Button variant="ghost" onClick={() => handleSort("id")} className="h-8 p-0">
                    Review ID {getSortIcon("id")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("reviewType")} className="h-8 p-0">
                    Type {getSortIcon("reviewType")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("projectStage")} className="h-8 p-0">
                    Stage {getSortIcon("projectStage")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("reviewDate")} className="h-8 p-0">
                    Date {getSortIcon("reviewDate")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("reviewerName")} className="h-8 p-0">
                    Reviewer {getSortIcon("reviewerName")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("overallScore")} className="h-8 p-0">
                    Score {getSortIcon("overallScore")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("status")} className="h-8 p-0">
                    Status {getSortIcon("status")}
                  </Button>
                </TableHead>
                <TableHead>Progress</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">{review.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>{review.reviewType}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{review.projectStage}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(review.reviewDate).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{review.reviewerName}</p>
                        <p className="text-xs text-muted-foreground">{review.reviewerRole}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold ${getScoreColor(review.overallScore)}`}>
                        {review.overallScore.toFixed(1)}
                      </span>
                      <Star className="h-4 w-4 text-yellow-500" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(review.status)}>{review.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <span>
                            {review.issuesResolved}/{review.issuesIdentified}
                          </span>
                          <span>issues</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(review.issuesResolved / review.issuesIdentified) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedReview(review)
                          setShowDetailModal(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Review
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Share className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open in New Tab
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">{filteredReviews.length} total reviews</div>
      </div>

      {/* Review Detail Modal */}
      {selectedReview && (
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedReview.reviewType}</DialogTitle>
              <DialogDescription>
                {selectedReview.projectStage} • {new Date(selectedReview.reviewDate).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="scoring">Scoring</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                <TabsTrigger value="attachments">Attachments</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Review Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Reviewer</span>
                        <span className="font-medium">{selectedReview.reviewerName}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Role</span>
                        <span className="font-medium">{selectedReview.reviewerRole}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-medium">{selectedReview.reviewDuration}h</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Priority</span>
                        <Badge className={getPriorityColor(selectedReview.priority)}>{selectedReview.priority}</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Overall Score</span>
                        <span className={`font-bold ${getScoreColor(selectedReview.overallScore)}`}>
                          {selectedReview.overallScore.toFixed(1)}/10
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Issues Identified</span>
                        <span className="font-medium">{selectedReview.issuesIdentified}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Issues Resolved</span>
                        <span className="font-medium">{selectedReview.issuesResolved}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Resolution Rate</span>
                        <span className="font-medium">
                          {((selectedReview.issuesResolved / selectedReview.issuesIdentified) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Comments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedReview.comments}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedReview.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="scoring" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(selectedReview.scoring).map(([key, value]) => (
                    <Card key={key}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</p>
                            <p className={`text-xl font-bold ${getScoreColor(value)}`}>{value}/10</p>
                          </div>
                          <div className="w-16 h-16 relative">
                            <svg className="w-16 h-16 transform -rotate-90">
                              <circle
                                cx="32"
                                cy="32"
                                r="28"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                                className="text-gray-200"
                              />
                              <circle
                                cx="32"
                                cy="32"
                                r="28"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                                strokeDasharray={`${(value / 10) * 175.929} 175.929`}
                                className={
                                  value >= 8.5 ? "text-green-500" : value >= 7.0 ? "text-yellow-500" : "text-red-500"
                                }
                              />
                            </svg>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedReview.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs text-blue-600 font-medium">{index + 1}</span>
                          </div>
                          <p className="text-sm">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="attachments" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Attachments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedReview.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Paperclip className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{attachment}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default ConstructabilityReviewLog
