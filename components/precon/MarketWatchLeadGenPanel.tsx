"use client"

import React, { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUp,
  Building2,
  Users,
  MapPin,
  Calendar,
  DollarSign,
  Target,
  Lightbulb,
  ArrowRight,
  Filter,
  Search,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  User,
} from "lucide-react"

// Types
interface MarketLead {
  id: string
  source: string
  leadTitle: string
  sector: string
  region: string
  deadline: string
  link: string
  confidenceScore: number
  matchedRep: string
  estimatedValue: number
  description: string
  tags: string[]
}

interface OpenGovLead {
  id: string
  title: string
  location: string
  postedDate: string
  deadline: string
  category: string
  sourceUrl: string
  estimatedValue: string
  description: string
}

interface HBIMatch {
  id: string
  leadId: string
  repName: string
  matchReason: string
  confidence: number
  suggestedApproach: string
  clientHistory?: string
  estimatedCloseRate: number
}

interface MarketWatchLeadGenPanelProps {
  leads?: MarketLead[]
  hbiMatches?: HBIMatch[]
  loading?: boolean
  error?: string
}

// Helper functions
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const formatDeadline = (deadline: string) => {
  const date = new Date(deadline)
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return "Expired"
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Tomorrow"
  if (diffDays <= 7) return `${diffDays} days`

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

const getDeadlineColor = (deadline: string) => {
  const date = new Date(deadline)
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return "text-red-600 dark:text-red-400"
  if (diffDays <= 3) return "text-red-600 dark:text-red-400"
  if (diffDays <= 7) return "text-yellow-600 dark:text-yellow-400"
  return "text-green-600 dark:text-green-400"
}

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 90) return "text-green-600 dark:text-green-400"
  if (confidence >= 80) return "text-blue-600 dark:text-blue-400"
  if (confidence >= 70) return "text-yellow-600 dark:text-yellow-400"
  return "text-red-600 dark:text-red-400"
}

const getConfidenceBadgeColor = (confidence: number) => {
  if (confidence >= 90) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
  if (confidence >= 80) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
  if (confidence >= 70) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
  return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
}

export function MarketWatchLeadGenPanel({
  leads = [],
  hbiMatches = [],
  loading = false,
  error,
}: MarketWatchLeadGenPanelProps) {
  const [selectedSector, setSelectedSector] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())

  // Load market leads data
  const [marketLeads, setMarketLeads] = useState<MarketLead[]>([])
  const [openGovLeads, setOpenGovLeads] = useState<OpenGovLead[]>([])
  const [leadsLoading, setLeadsLoading] = useState(true)

  useEffect(() => {
    const loadMarketLeads = async () => {
      try {
        const response = await fetch("/data/mock/marketLeads.json")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setMarketLeads(data)
      } catch (error) {
        console.error("Failed to load market leads:", error)
        // Use fallback mock data if fetch fails
        setMarketLeads([
          {
            id: "1",
            source: "Palm Beach County RFQ",
            leadTitle: "Palm Beach County Courthouse Renovation",
            sector: "Public Safety",
            region: "Palm Beach County",
            deadline: "2024-03-15T17:00:00Z",
            link: "https://www.palmbeachcounty.gov/procurement/rfq-2024-001",
            confidenceScore: 92,
            matchedRep: "Sarah Johnson",
            estimatedValue: 45000000,
            description:
              "Comprehensive renovation of the main courthouse facility including structural upgrades, HVAC replacement, and ADA compliance improvements.",
            tags: ["Government", "Renovation", "Public Safety", "Infrastructure"],
          },
          {
            id: "2",
            source: "OpenGov Procurement",
            leadTitle: "Tampa Bay Medical Center Expansion",
            sector: "Healthcare",
            region: "Tampa Bay",
            deadline: "2024-03-30T17:00:00Z",
            link: "https://procurement.opengov.com/portal/fl/tampa/projects/12345",
            confidenceScore: 95,
            matchedRep: "Lisa Rodriguez",
            estimatedValue: 28000000,
            description:
              "Phase 2 expansion of the existing medical center including new patient wings, parking structure, and emergency department upgrades.",
            tags: ["Healthcare", "Expansion", "Medical", "Hospital"],
          },
        ])
      } finally {
        setLeadsLoading(false)
      }
    }

    const loadOpenGovLeads = async () => {
      try {
        const response = await fetch("/data/mock/scrapedOpenGovLeads.json")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setOpenGovLeads(data)
      } catch (error) {
        console.error("Failed to load OpenGov leads:", error)
        // Use fallback mock data if fetch fails
        setOpenGovLeads([
          {
            id: "og-001",
            title: "Miami-Dade County Courthouse Renovation and Expansion",
            location: "Miami-Dade County, FL",
            postedDate: "2024-01-15T08:00:00Z",
            deadline: "2024-03-20T17:00:00Z",
            category: "Public Safety",
            sourceUrl: "https://procurement.opengov.com/portal/miami-dade-county-fl/projects/12345",
            estimatedValue: "$45,000,000",
            description:
              "Comprehensive renovation and expansion of the Miami-Dade County Courthouse including structural upgrades, HVAC systems, and accessibility improvements.",
          },
          {
            id: "og-002",
            title: "Orlando International Airport Terminal 3 Construction",
            location: "Orlando, FL",
            postedDate: "2024-01-12T10:30:00Z",
            deadline: "2024-04-15T17:00:00Z",
            category: "Transportation",
            sourceUrl: "https://procurement.opengov.com/portal/orlando-airport/projects/67890",
            estimatedValue: "$120,000,000",
            description:
              "Construction of new Terminal 3 at Orlando International Airport including baggage handling systems and retail space.",
          },
        ])
      }
    }

    loadMarketLeads()
    loadOpenGovLeads()
  }, [])

  // Get unique sectors for filter
  const sectors = useMemo(() => {
    const uniqueSectors = new Set(marketLeads.map((lead) => lead.sector))
    return Array.from(uniqueSectors).sort()
  }, [marketLeads])

  // Filter and sort leads
  const filteredLeads = useMemo(() => {
    return marketLeads
      .filter((lead) => {
        const matchesSector = selectedSector === "all" || lead.sector === selectedSector
        const matchesSearch =
          lead.leadTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.region.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesSector && matchesSearch
      })
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
  }, [marketLeads, selectedSector, searchTerm])

  // Generate HBI insights based on market leads data
  const repInsights = useMemo(() => {
    const repData = new Map<
      string,
      {
        name: string
        matchedLeads: MarketLead[]
        focusSector: string
        totalValue: number
        avgConfidence: number
        suggestedAction: string
        priority: "high" | "medium" | "low"
      }
    >()

    // Group leads by matched rep
    marketLeads.forEach((lead) => {
      if (!repData.has(lead.matchedRep)) {
        repData.set(lead.matchedRep, {
          name: lead.matchedRep,
          matchedLeads: [],
          focusSector: lead.sector,
          totalValue: 0,
          avgConfidence: 0,
          suggestedAction: "",
          priority: "medium",
        })
      }

      const rep = repData.get(lead.matchedRep)!
      rep.matchedLeads.push(lead)
      rep.totalValue += lead.estimatedValue
    })

    // Calculate insights for each rep
    repData.forEach((rep, repName) => {
      // Calculate average confidence
      rep.avgConfidence = Math.round(
        rep.matchedLeads.reduce((sum, lead) => sum + lead.confidenceScore, 0) / rep.matchedLeads.length
      )

      // Determine focus sector (most common)
      const sectorCounts = new Map<string, number>()
      rep.matchedLeads.forEach((lead) => {
        sectorCounts.set(lead.sector, (sectorCounts.get(lead.sector) || 0) + 1)
      })
      rep.focusSector = Array.from(sectorCounts.entries()).sort((a, b) => b[1] - a[1])[0][0]

      // Generate suggested action based on rep's focus
      const actions = {
        Healthcare: "Schedule meetings with local hospital administrators",
        Transportation: "Engage with DOT officials for upcoming RFPs",
        Education: "Connect with school district procurement teams",
        Commercial: "Reach out to major developers in target regions",
        Hospitality: "Network with hotel management companies",
        Municipal: "Attend city council meetings and public hearings",
        Federal: "Register for federal contractor databases",
        "Multifamily Housing": "Partner with affordable housing developers",
        "Public Safety": "Build relationships with law enforcement agencies",
        Retail: "Target shopping center developers and REITs",
      }
      rep.suggestedAction = actions[rep.focusSector as keyof typeof actions] || "Focus on high-value opportunities"

      // Determine priority based on lead count and average confidence
      if (rep.matchedLeads.length >= 3 && rep.avgConfidence >= 85) {
        rep.priority = "high"
      } else if (rep.matchedLeads.length >= 2 && rep.avgConfidence >= 75) {
        rep.priority = "medium"
      } else {
        rep.priority = "low"
      }
    })

    return Array.from(repData.values()).sort((a, b) => {
      // Sort by priority first, then by lead count
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      if (priorityDiff !== 0) return priorityDiff
      return b.matchedLeads.length - a.matchedLeads.length
    })
  }, [marketLeads])

  // Toggle card expansion
  const toggleCardExpansion = (leadId: string) => {
    const newExpanded = new Set(expandedCards)
    if (newExpanded.has(leadId)) {
      newExpanded.delete(leadId)
    } else {
      newExpanded.add(leadId)
    }
    setExpandedCards(newExpanded)
  }

  if (loading || leadsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading market data...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="text-center text-red-600 dark:text-red-400">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p>Error loading market data: {error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Subtitle */}
      <div className="text-left">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Emerging Opportunities in Florida's Construction Pipeline
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          AI-powered lead generation and market intelligence for strategic business development
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Feed - Primary Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Lead Feed
                  </CardTitle>
                  <CardDescription>
                    {filteredLeads.length} opportunities from {marketLeads.length} total leads
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search leads..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <Select value={selectedSector} onValueChange={setSelectedSector}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All Sectors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sectors</SelectItem>
                      {sectors.map((sector) => (
                        <SelectItem key={sector} value={sector}>
                          {sector}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {/* Recently Scraped Opportunities */}
                {openGovLeads.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <h3 className="font-semibold text-gray-900 dark:text-white">Recently Scraped Opportunities</h3>
                      <Badge variant="secondary" className="text-xs">
                        {openGovLeads.length} new
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {openGovLeads.slice(0, 5).map((lead) => (
                        <Card
                          key={lead.id}
                          className="hover:shadow-md transition-shadow border-l-4 border-l-orange-500"
                        >
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              {/* Header */}
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                                      {lead.title}
                                    </h3>
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-orange-50 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                                    >
                                      {lead.category}
                                    </Badge>
                                  </div>

                                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {lead.location}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <DollarSign className="h-3 w-3" />
                                      {lead.estimatedValue}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      Posted: {new Date(lead.postedDate).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-col items-end gap-2 ml-4">
                                  <div className="text-right">
                                    <div className="text-xs font-medium text-orange-600 dark:text-orange-400">
                                      OpenGov
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                      <Clock className="h-3 w-3 inline mr-1" />
                                      {formatDeadline(lead.deadline)}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Description */}
                              <div className="text-xs text-gray-600 dark:text-gray-400">{lead.description}</div>

                              {/* Actions */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs font-medium ${getDeadlineColor(lead.deadline)}`}>
                                    Deadline: {formatDeadline(lead.deadline)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button size="sm" variant="outline" asChild>
                                    <a href={lead.sourceUrl} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="h-3 w-3 mr-1" />
                                      View on OpenGov
                                    </a>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Market Leads - Sorted by Deadline */}
                <div className="space-y-3">
                  {filteredLeads
                    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                    .map((lead) => (
                      <Card key={lead.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            {/* Header with Title and Confidence */}
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                                    {lead.leadTitle}
                                  </h3>
                                  <Badge variant="outline" className="text-xs flex-shrink-0">
                                    {lead.sector}
                                  </Badge>
                                </div>

                                {/* Region and Source */}
                                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-2">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    <span className="truncate">{lead.region}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Building2 className="h-3 w-3" />
                                    <span className="truncate">{lead.source}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="h-3 w-3" />
                                    <span>{formatCurrency(lead.estimatedValue)}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Confidence Score and Rep */}
                              <div className="flex flex-col items-end gap-2 ml-4 flex-shrink-0">
                                <div className="text-right">
                                  <div className={`text-xs font-medium ${getConfidenceColor(lead.confidenceScore)}`}>
                                    {lead.confidenceScore}% confidence
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    <User className="h-3 w-3 inline mr-1" />
                                    {lead.matchedRep}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Deadline and Actions */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span className={`text-sm font-medium ${getDeadlineColor(lead.deadline)}`}>
                                  {formatDeadline(lead.deadline)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline" asChild>
                                  <a href={lead.link} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    View
                                  </a>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => toggleCardExpansion(lead.id)}
                                  className="p-1"
                                >
                                  {expandedCards.has(lead.id) ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>

                            {/* Expanded Content */}
                            {expandedCards.has(lead.id) && (
                              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                                <div className="space-y-3">
                                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {lead.description}
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {lead.tags.map((tag, index) => (
                                      <Badge key={index} variant="secondary" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>

                {/* Empty State */}
                {filteredLeads.length === 0 && (
                  <div className="text-center py-8">
                    <div className="mb-4">
                      <Search className="h-12 w-12 text-gray-400 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No leads found</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Try adjusting your search terms or sector filter.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* HBI Matching Insights - Secondary Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                HBI Opportunity Fit Analysis
              </CardTitle>
              <CardDescription>AI-powered BD rep recommendations and strategic insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {repInsights.map((rep) => (
                  <Card
                    key={rep.name}
                    className={`border-l-4 ${
                      rep.priority === "high"
                        ? "border-l-green-500"
                        : rep.priority === "medium"
                        ? "border-l-yellow-500"
                        : "border-l-gray-400"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-gray-900 dark:text-white">{rep.name}</span>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                rep.priority === "high"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : rep.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                              }`}
                            >
                              {rep.priority} priority
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {rep.matchedLeads.length} leads
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {formatCurrency(rep.totalValue)}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs">Focus Sector</div>
                            <div className="font-medium text-gray-900 dark:text-white">{rep.focusSector}</div>
                          </div>
                          <div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs">Avg Confidence</div>
                            <div className={`font-medium ${getConfidenceColor(rep.avgConfidence)}`}>
                              {rep.avgConfidence}%
                            </div>
                          </div>
                        </div>

                        <div className="text-sm">
                          <div className="text-gray-500 dark:text-gray-400 text-xs mb-1">Suggested Action</div>
                          <div className="text-gray-700 dark:text-gray-300">{rep.suggestedAction}</div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {rep.matchedLeads.length} opportunity{rep.matchedLeads.length !== 1 ? "ies" : "y"}
                          </div>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {marketLeads.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No HBI insights available</p>
                    <p className="text-sm">Load market data to generate recommendations</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Market Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Leads</span>
                  <span className="font-medium">{marketLeads.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">High Confidence (90%+)</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {marketLeads.filter((l) => l.confidenceScore >= 90).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Value</span>
                  <span className="font-medium">
                    {formatCurrency(
                      Math.round(marketLeads.reduce((sum, l) => sum + l.estimatedValue, 0) / marketLeads.length)
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active Reps</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    {new Set(marketLeads.map((l) => l.matchedRep)).size}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
