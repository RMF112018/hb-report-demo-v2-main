/**
 * @fileoverview AI Warranty Analysis Panel Component
 * @module AIWarrantyAnalysisPanel
 * @version 1.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Component for displaying comprehensive AI-powered warranty analysis
 * Features: Trade/vendor matching, timeline suggestions, historical insights, auto-drafted documents
 */

"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Progress } from "../ui/progress"
import { Alert, AlertDescription } from "../ui/alert"
import { Separator } from "../ui/separator"
import { ScrollArea } from "../ui/scroll-area"
import {
  Brain,
  Wand2,
  Sparkles,
  History,
  Award,
  Send,
  Copy,
  Users,
  Database,
  Cpu,
  Info,
  Lightbulb,
  Zap,
  BarChart3,
  Timer,
  CheckCircle,
  ExternalLink,
  FileText,
  Download,
  Clock,
  Target,
  TrendingUp,
  AlertTriangle,
  Shield,
  Building,
  Calendar,
  Star,
  ThumbsUp,
  Wrench,
  Eye,
  Edit,
  Phone,
  Mail,
} from "lucide-react"

// HBI Analysis Interfaces
interface AIWarrantyAnalysis {
  tradeMatchConfidence: number
  vendorMatchConfidence: number
  suggestedTrade: string
  suggestedVendor: {
    id: string
    name: string
    contact: string
    phone: string
    email: string
    compassId?: string
    matchReason: string
  }
  riskAssessment: "low" | "medium" | "high" | "critical"
  urgencyScore: number
  similarIssuesCount: number
  generatedAt: string
}

interface HistoricalReference {
  similarIssues: SimilarIssue[]
  averageResolutionTime: number
  successRate: number
  commonCauses: string[]
  recommendedActions: string[]
  costTrends: {
    min: number
    max: number
    average: number
  }
}

interface SimilarIssue {
  id: string
  title: string
  resolutionTime: number
  status: string
  solution: string
  matchScore: number
}

interface WarrantyData {
  manufacturerWarranty: {
    provider: string
    startDate: string
    endDate: string
    coverage: string[]
    terms: string
  }
  contractorWarranty: {
    provider: string
    startDate: string
    endDate: string
    coverage: string[]
    terms: string
  }
  submittalsData: {
    submittalId: string
    productData: string
    warrantyTerms: string
    installationDate: string
  }
  autoUpdated: boolean
  lastSync: string
}

interface SuggestedTimeline {
  initialResponse: number // hours
  investigation: number // days
  resolution: number // days
  closeout: number // days
  totalDays: number
  confidenceLevel: number
  basedOn: string[]
}

interface AIGeneratedDocument {
  id: string
  type: "warranty_letter" | "claim_form" | "notice" | "demand"
  title: string
  content: string
  recipient: string
  generatedAt: string
  status: "draft" | "review" | "approved" | "sent"
  confidence: number
}

interface AIWarrantyAnalysisPanelProps {
  issueId: string
  aiAnalysis?: AIWarrantyAnalysis
  historicalReference?: HistoricalReference
  warrantyData?: WarrantyData
  suggestedTimeline?: SuggestedTimeline
  aiGeneratedDocuments?: AIGeneratedDocument[]
}

export const AIWarrantyAnalysisPanel: React.FC<AIWarrantyAnalysisPanelProps> = ({
  issueId,
  aiAnalysis,
  historicalReference,
  warrantyData,
  suggestedTimeline,
  aiGeneratedDocuments = [],
}) => {
  const [activeTab, setActiveTab] = useState("ai-analysis")
  const [generatingDocument, setGeneratingDocument] = useState(false)

  const handleGenerateDocument = async (type: string) => {
    setGeneratingDocument(true)
    // Simulate AI document generation
    setTimeout(() => {
      setGeneratingDocument(false)
      console.log(`Generated ${type} document for issue ${issueId}`)
    }, 2000)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 75) return "text-yellow-600"
    return "text-red-600"
  }

  if (!aiAnalysis && !historicalReference && !warrantyData && !suggestedTimeline) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          HBI Analysis is not available for this warranty issue. AI features require additional data processing.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ai-analysis" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            HBI Analysis
          </TabsTrigger>
          <TabsTrigger value="warranty-data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Warranty Data
          </TabsTrigger>
          <TabsTrigger value="historical" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Historical
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            AI Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai-analysis" className="space-y-4">
          {aiAnalysis && (
            <>
              {/* AI Match Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-500" />
                    AI Trade/Vendor Matching
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Trade Match Confidence</span>
                          <span className={`text-sm font-bold ${getMatchScoreColor(aiAnalysis.tradeMatchConfidence)}`}>
                            {aiAnalysis.tradeMatchConfidence}%
                          </span>
                        </div>
                        <Progress value={aiAnalysis.tradeMatchConfidence} className="mt-1" />
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Wrench className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">Suggested Trade</span>
                        </div>
                        <p className="text-sm mt-1">{aiAnalysis.suggestedTrade}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Vendor Match Confidence</span>
                          <span className={`text-sm font-bold ${getMatchScoreColor(aiAnalysis.vendorMatchConfidence)}`}>
                            {aiAnalysis.vendorMatchConfidence}%
                          </span>
                        </div>
                        <Progress value={aiAnalysis.vendorMatchConfidence} className="mt-1" />
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-green-500" />
                            <span className="font-medium">Suggested Vendor</span>
                          </div>
                          {aiAnalysis.suggestedVendor.compassId && (
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <p className="text-sm mt-1">{aiAnalysis.suggestedVendor.name}</p>
                        <p className="text-xs text-muted-foreground">{aiAnalysis.suggestedVendor.matchReason}</p>
                        <div className="text-xs text-muted-foreground mt-2">
                          <p>Contact: {aiAnalysis.suggestedVendor.contact}</p>
                          <p>Phone: {aiAnalysis.suggestedVendor.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Risk Assessment */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        <span className="font-medium">Risk Assessment</span>
                      </div>
                      <Badge className={`${getRiskColor(aiAnalysis.riskAssessment)} border text-sm`}>
                        {aiAnalysis.riskAssessment.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Zap className="h-5 w-5 text-yellow-500" />
                        <span className="font-medium">Urgency Score</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">{aiAnalysis.urgencyScore}</div>
                      <div className="text-xs text-muted-foreground">out of 100</div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <BarChart3 className="h-5 w-5 text-purple-500" />
                        <span className="font-medium">Similar Issues</span>
                      </div>
                      <div className="text-2xl font-bold text-purple-600">{aiAnalysis.similarIssuesCount}</div>
                      <div className="text-xs text-muted-foreground">in database</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Suggested Timeline */}
              {suggestedTimeline && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Timer className="h-5 w-5 text-blue-500" />
                      AI-Suggested Timeline
                      <Badge variant="outline" className="ml-2">
                        {suggestedTimeline.confidenceLevel}% confidence
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm text-muted-foreground">Initial Response</div>
                        <div className="text-lg font-bold text-blue-600">{suggestedTimeline.initialResponse}h</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-sm text-muted-foreground">Investigation</div>
                        <div className="text-lg font-bold text-orange-600">{suggestedTimeline.investigation}d</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-sm text-muted-foreground">Resolution</div>
                        <div className="text-lg font-bold text-green-600">{suggestedTimeline.resolution}d</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-sm text-muted-foreground">Total</div>
                        <div className="text-lg font-bold text-purple-600">{suggestedTimeline.totalDays}d</div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Based on:</span> {suggestedTimeline.basedOn.join(", ")}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="warranty-data" className="space-y-4">
          {warrantyData && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Auto-Pulled Warranty Data</h3>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">
                    Last synced: {new Date(warrantyData.lastSync).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Manufacturer Warranty */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-blue-500" />
                    Manufacturer Warranty
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium">Provider:</span>
                          <span className="ml-2">{warrantyData.manufacturerWarranty.provider}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Coverage Period:</span>
                          <span className="ml-2">
                            {warrantyData.manufacturerWarranty.startDate} to {warrantyData.manufacturerWarranty.endDate}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Coverage:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {warrantyData.manufacturerWarranty.coverage.map((item, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm">
                        <span className="font-medium">Terms:</span>
                        <p className="mt-1 text-muted-foreground">{warrantyData.manufacturerWarranty.terms}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contractor Warranty */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-500" />
                    Contractor Warranty
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium">Provider:</span>
                          <span className="ml-2">{warrantyData.contractorWarranty.provider}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Coverage Period:</span>
                          <span className="ml-2">
                            {warrantyData.contractorWarranty.startDate} to {warrantyData.contractorWarranty.endDate}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Coverage:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {warrantyData.contractorWarranty.coverage.map((item, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm">
                        <span className="font-medium">Terms:</span>
                        <p className="mt-1 text-muted-foreground">{warrantyData.contractorWarranty.terms}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submittals Data */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-500" />
                    Submittals Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium">Submittal ID:</span>
                          <span className="ml-2 font-mono text-sm">{warrantyData.submittalsData.submittalId}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Product Data:</span>
                          <span className="ml-2">{warrantyData.submittalsData.productData}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium">Installation Date:</span>
                          <span className="ml-2">{warrantyData.submittalsData.installationDate}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Warranty Terms:</span>
                          <span className="ml-2">{warrantyData.submittalsData.warrantyTerms}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="historical" className="space-y-4">
          {historicalReference && (
            <>
              {/* Historical Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {historicalReference.averageResolutionTime}d
                      </div>
                      <div className="text-sm text-muted-foreground">Average Resolution Time</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{historicalReference.successRate}%</div>
                      <div className="text-sm text-muted-foreground">Success Rate</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {historicalReference.similarIssues.length}
                      </div>
                      <div className="text-sm text-muted-foreground">Similar Cases</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Similar Issues */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5 text-blue-500" />
                    Similar Issues Resolved
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {historicalReference.similarIssues.map((issue) => (
                      <div key={issue.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{issue.title}</span>
                            <Badge variant="outline" className="text-green-600">
                              {issue.matchScore}% match
                            </Badge>
                          </div>
                          <Badge className="bg-green-100 text-green-800">{issue.status}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          Resolved in {issue.resolutionTime} days
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Solution:</span> {issue.solution}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Cost Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Cost Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        ${historicalReference.costTrends.min.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Minimum</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        ${historicalReference.costTrends.average.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Average</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-600">
                        ${historicalReference.costTrends.max.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Maximum</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Common Causes:</h4>
                      <div className="flex flex-wrap gap-2">
                        {historicalReference.commonCauses.map((cause, index) => (
                          <Badge key={index} variant="outline">
                            {cause}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Recommended Actions:</h4>
                      <ul className="space-y-1">
                        {historicalReference.recommendedActions.map((action, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">AI-Generated Documents</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => handleGenerateDocument("warranty_letter")}
                disabled={generatingDocument}
                className="flex items-center gap-2"
              >
                {generatingDocument ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                ) : (
                  <Wand2 className="h-4 w-4" />
                )}
                Generate Letter
              </Button>
              <Button
                variant="outline"
                onClick={() => handleGenerateDocument("claim_form")}
                disabled={generatingDocument}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Generate Claim
              </Button>
            </div>
          </div>

          {aiGeneratedDocuments.length > 0 ? (
            <div className="space-y-4">
              {aiGeneratedDocuments.map((doc) => (
                <Card key={doc.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-500" />
                        {doc.title}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-purple-600">
                          <Brain className="h-3 w-3 mr-1" />
                          {doc.confidence}% confidence
                        </Badge>
                        <Badge
                          className={
                            doc.status === "draft"
                              ? "bg-gray-100 text-gray-800"
                              : doc.status === "review"
                              ? "bg-yellow-100 text-yellow-800"
                              : doc.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }
                        >
                          {doc.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-sm">
                        <span className="font-medium">Recipient:</span> {doc.recipient}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Generated:</span> {new Date(doc.generatedAt).toLocaleString()}
                      </div>
                      <Separator />
                      <ScrollArea className="h-40 w-full border rounded p-3 bg-gray-50">
                        <pre className="text-sm whitespace-pre-wrap">{doc.content}</pre>
                      </ScrollArea>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm">
                          <Send className="h-4 w-4 mr-2" />
                          Send
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Documents Generated</h3>
                  <p className="text-muted-foreground mb-4">
                    Use the AI document generator to create warranty letters and claim forms.
                  </p>
                  <Button onClick={() => handleGenerateDocument("warranty_letter")}>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Generate First Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
