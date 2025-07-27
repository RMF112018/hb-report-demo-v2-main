"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { Target, TrendingUp, Building, Home, Users, Star, Crown, DollarSign } from "lucide-react"
import { useState, useEffect } from "react"

interface CompetitorData {
  name: string
  sector: "luxury" | "commercial" | "multifamily"
  marketShare: number
  pricing: string
  strengths: string[]
  weaknesses: string[]
  aiScore: number
  geography: string
  positioning: string
}

interface SectorMetrics {
  sector: string
  competitorCount: number
  avgMarketShare: number
  dominantPlayer: string
  avgPricing: string
}

export function CompetitorBenchmarkCard() {
  const [data, setData] = useState<CompetitorData[]>([])
  const [sectorMetrics, setSectorMetrics] = useState<SectorMetrics[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [lastUpdated, setLastUpdated] = useState<string>("")

  useEffect(() => {
    const generateData = () => {
      const baseCompetitors: CompetitorData[] = [
        // Ultra-Luxury Residential
        {
          name: "London Bay Homes",
          sector: "luxury",
          marketShare: 25,
          pricing: "$5M+ Premium",
          strengths: ["30+ years experience", "Award-winning designs", "SW FL focus"],
          weaknesses: ["Regional limitation", "High customization delays"],
          aiScore: 85,
          geography: "Naples, SW FL",
          positioning: "Timeless luxury in prime locations",
        },
        {
          name: "BCB Homes",
          sector: "luxury",
          marketShare: 20,
          pricing: "$4-10M Eco-premium",
          strengths: ["ESG integration", "25+ years expertise", "Sustainability focus"],
          weaknesses: ["Costly due to green tech", "Limited scale"],
          aiScore: 78,
          geography: "Naples",
          positioning: "Sustainable elegance",
        },
        {
          name: "John Cannon Homes",
          sector: "luxury",
          marketShare: 22,
          pricing: "$3-8M Waterfront",
          strengths: ["40+ years", "Waterfront specialists", "Central FL presence"],
          weaknesses: ["Less diversification", "Higher maintenance"],
          aiScore: 82,
          geography: "Sarasota, Central FL",
          positioning: "Crafted for distinction",
        },

        // Commercial Construction
        {
          name: "Ajax Building Company",
          sector: "commercial",
          marketShare: 35,
          pricing: "Competitive bids",
          strengths: ["$1B+ revenue", "Diverse portfolio", "Statewide presence"],
          weaknesses: ["Bureaucratic for small jobs", "Slower decision-making"],
          aiScore: 88,
          geography: "Statewide",
          positioning: "Reliable excellence",
        },
        {
          name: "DeAngelis Diamond",
          sector: "commercial",
          marketShare: 18,
          pricing: "Cost-plus",
          strengths: ["SW FL leader", "On-time delivery", "Healthcare focus"],
          weaknesses: ["Regional bias", "Limited scalability"],
          aiScore: 75,
          geography: "Naples, SW FL",
          positioning: "Building trust",
        },
        {
          name: "Manhattan Construction",
          sector: "commercial",
          marketShare: 28,
          pricing: "Fixed-price",
          strengths: ["National backing", "Safety record", "$1B+ projects"],
          weaknesses: ["High overhead", "Less flexibility"],
          aiScore: 83,
          geography: "Statewide",
          positioning: "Proven performance",
        },

        // Multi-Family Development
        {
          name: "Greystar",
          sector: "multifamily",
          marketShare: 42,
          pricing: "Market-rate",
          strengths: ["#1 nationally", "38K+ units", "Scale advantages"],
          weaknesses: ["Oversupply exposure", "Generic designs"],
          aiScore: 90,
          geography: "Statewide",
          positioning: "Premier living",
        },
        {
          name: "Mill Creek Residential",
          sector: "multifamily",
          marketShare: 25,
          pricing: "$1.5-3K/mo",
          strengths: ["61K+ units", "ESG focus", "Attainable housing"],
          weaknesses: ["Rental market softening", "Margin pressure"],
          aiScore: 77,
          geography: "Boca Raton, SE FL",
          positioning: "Thrive communities",
        },
        {
          name: "Related Group",
          sector: "multifamily",
          marketShare: 33,
          pricing: "Premium",
          strengths: ["100K+ units", "SE FL dominance", "Mixed-use expertise"],
          weaknesses: ["Luxury market volatility", "High-end focus"],
          aiScore: 85,
          geography: "Miami, SE FL",
          positioning: "Inclusive quality",
        },
      ]

      const newData: CompetitorData[] = baseCompetitors.map((comp) => ({
        ...comp,
        marketShare: Math.max(0, Math.min(100, comp.marketShare + (Math.random() - 0.5) * 6)),
        aiScore: Math.max(0, Math.min(100, comp.aiScore + (Math.random() - 0.5) * 8)),
      }))

      // Calculate sector metrics
      const sectors = ["luxury", "commercial", "multifamily"]
      const newSectorMetrics: SectorMetrics[] = sectors.map((sector) => {
        const sectorData = newData.filter((c) => c.sector === sector)
        const dominantPlayer = sectorData.reduce(
          (max, comp) => (comp.marketShare > max.marketShare ? comp : max),
          sectorData[0]
        )

        return {
          sector: sector.charAt(0).toUpperCase() + sector.slice(1),
          competitorCount: sectorData.length,
          avgMarketShare: Math.round(sectorData.reduce((sum, c) => sum + c.marketShare, 0) / sectorData.length),
          dominantPlayer: dominantPlayer?.name || "",
          avgPricing: sector === "luxury" ? "$5M+" : sector === "commercial" ? "Competitive" : "Market-rate",
        }
      })

      setData(newData)
      setSectorMetrics(newSectorMetrics)
      setLastUpdated(new Date().toLocaleTimeString())
    }

    generateData()

    // Update every 32 seconds
    const interval = setInterval(generateData, 32000)
    return () => clearInterval(interval)
  }, [])

  const getSectorData = (sector: CompetitorData["sector"]) => {
    return data.filter((item) => item.sector === sector)
  }

  const getSectorIcon = (sector: string) => {
    switch (sector) {
      case "luxury":
        return <Crown className="h-4 w-4 text-yellow-500" />
      case "commercial":
        return <Building className="h-4 w-4 text-blue-500" />
      case "multifamily":
        return <Users className="h-4 w-4 text-green-500" />
      default:
        return <Target className="h-4 w-4 text-gray-500" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBackground = (score: number) => {
    if (score >= 85) return "bg-green-500"
    if (score >= 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  const topCompetitor = data.reduce((max, item) => (item.aiScore > (max?.aiScore || 0) ? item : max), data[0])

  const radarData = sectorMetrics.map((sector) => ({
    sector: sector.sector,
    marketShare: sector.avgMarketShare,
    competitiveness: sector.avgMarketShare * 0.8, // Derived metric
    fullMark: 100,
  }))

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Competitor Benchmark</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Target className="h-3 w-3 mr-1" />
              Market Analysis
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              AI Enhanced
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* AI Competitive Assessment */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-500 p-2 rounded-full">
              <Target className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-blue-900 mb-1">AI Competitive Intelligence</h4>
              <p className="text-sm text-blue-800">
                Greystar dominates multifamily with 42% market share; John Cannon Homes strongest in waterfront custom
                builds. Commercial sector shows intense competition with Ajax Building leading at 35%.
              </p>
              <div className="mt-2 flex items-center space-x-4">
                <span className="text-xs text-blue-600">Analysis Confidence: 91%</span>
                <span className="text-xs text-blue-600">Last Updated: {lastUpdated}</span>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="luxury">Luxury</TabsTrigger>
            <TabsTrigger value="commercial">Commercial</TabsTrigger>
            <TabsTrigger value="multifamily">Multifamily</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Sector Overview */}
            <div className="grid grid-cols-3 gap-4">
              {sectorMetrics.map((sector, index) => (
                <div key={sector.sector} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    {getSectorIcon(sector.sector.toLowerCase())}
                    <h5 className="font-medium text-gray-900">{sector.sector}</h5>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Players:</span>
                      <span className="font-medium">{sector.competitorCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Avg Share:</span>
                      <span className="font-medium">{sector.avgMarketShare}%</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Leader:</span>
                      <p className="font-medium text-blue-600">{sector.dominantPlayer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Market Share Radar */}
            <div className="h-64">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Sector Competitiveness</h4>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="sector" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar
                    name="Market Share"
                    dataKey="marketShare"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Radar
                    name="Competitiveness"
                    dataKey="competitiveness"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Top Competitors List */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Top Competitors by AI Score</h4>
              {data
                .sort((a, b) => b.aiScore - a.aiScore)
                .slice(0, 6)
                .map((comp, index) => (
                  <div key={comp.name} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getSectorIcon(comp.sector)}
                        <span className="font-medium text-gray-900">{comp.name}</span>
                        <Badge
                          variant="outline"
                          className={`text-xs px-2 py-1 ${
                            comp.sector === "luxury"
                              ? "bg-yellow-50 text-yellow-700"
                              : comp.sector === "commercial"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-green-50 text-green-700"
                          }`}
                        >
                          {comp.sector}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${getScoreColor(comp.aiScore)}`}>{comp.aiScore}</span>
                        <Star className="h-4 w-4 text-yellow-500" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-gray-500">Market Share</span>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getScoreBackground(comp.aiScore)}`}
                              style={{ width: `${comp.marketShare}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">{comp.marketShare}%</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Pricing</span>
                        <p className="text-sm font-medium mt-1">{comp.pricing}</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <span className="text-xs text-gray-500">Positioning</span>
                      <p className="text-sm italic text-gray-700">"{comp.positioning}"</p>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="luxury" className="space-y-4">
            <div className="h-64">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Ultra-Luxury Residential</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getSectorData("luxury")}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                  <YAxis tick={{ fontSize: 12 }} label={{ value: "Score", angle: -90, position: "insideLeft" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="marketShare" fill="#f59e0b" name="Market Share" />
                  <Bar dataKey="aiScore" fill="#eab308" name="AI Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {getSectorData("luxury").map((comp) => (
                <div key={comp.name} className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-yellow-900">{comp.name}</h5>
                    <span className="text-sm text-yellow-700">{comp.geography}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-yellow-600">Strengths</span>
                      <ul className="text-sm text-yellow-800 mt-1">
                        {comp.strengths.slice(0, 2).map((strength, i) => (
                          <li key={i}>• {strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-xs text-yellow-600">Weaknesses</span>
                      <ul className="text-sm text-yellow-800 mt-1">
                        {comp.weaknesses.slice(0, 2).map((weakness, i) => (
                          <li key={i}>• {weakness}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="commercial" className="space-y-4">
            <div className="h-64">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Commercial Construction</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getSectorData("commercial")}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                  <YAxis tick={{ fontSize: 12 }} label={{ value: "Score", angle: -90, position: "insideLeft" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="marketShare" fill="#3b82f6" name="Market Share" />
                  <Bar dataKey="aiScore" fill="#1d4ed8" name="AI Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {getSectorData("commercial").map((comp) => (
                <div key={comp.name} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-blue-900">{comp.name}</h5>
                    <span className="text-sm text-blue-700">{comp.geography}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-blue-600">Strengths</span>
                      <ul className="text-sm text-blue-800 mt-1">
                        {comp.strengths.slice(0, 2).map((strength, i) => (
                          <li key={i}>• {strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-xs text-blue-600">Weaknesses</span>
                      <ul className="text-sm text-blue-800 mt-1">
                        {comp.weaknesses.slice(0, 2).map((weakness, i) => (
                          <li key={i}>• {weakness}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="multifamily" className="space-y-4">
            <div className="h-64">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Multi-Family Development</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getSectorData("multifamily")}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                  <YAxis tick={{ fontSize: 12 }} label={{ value: "Score", angle: -90, position: "insideLeft" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="marketShare" fill="#10b981" name="Market Share" />
                  <Bar dataKey="aiScore" fill="#059669" name="AI Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {getSectorData("multifamily").map((comp) => (
                <div key={comp.name} className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-green-900">{comp.name}</h5>
                    <span className="text-sm text-green-700">{comp.geography}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-green-600">Strengths</span>
                      <ul className="text-sm text-green-800 mt-1">
                        {comp.strengths.slice(0, 2).map((strength, i) => (
                          <li key={i}>• {strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-xs text-green-600">Weaknesses</span>
                      <ul className="text-sm text-green-800 mt-1">
                        {comp.weaknesses.slice(0, 2).map((weakness, i) => (
                          <li key={i}>• {weakness}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
