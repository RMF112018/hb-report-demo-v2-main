"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Lightbulb, TrendingUp, Zap, Leaf, Building, Target, Star } from "lucide-react"
import { useState, useEffect } from "react"

interface OpportunityData {
  opportunity: string
  category: "technology" | "sustainability" | "market"
  potential: number
  timeline: string
  confidence: number
  tags: string[]
  description: string
}

interface TrendData {
  month: string
  modular: number
  ai: number
  esg: number
}

export function AIOpportunitiesCard() {
  const [data, setData] = useState<OpportunityData[]>([])
  const [trendData, setTrendData] = useState<TrendData[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [lastUpdated, setLastUpdated] = useState<string>("")

  useEffect(() => {
    const generateData = () => {
      const baseOpportunities: OpportunityData[] = [
        {
          opportunity: "Modular Construction",
          category: "technology",
          potential: 85,
          timeline: "6-12 months",
          confidence: 88,
          tags: ["Speed", "Cost Savings", "Quality Control"],
          description: "20-30% faster delivery with controlled quality",
        },
        {
          opportunity: "AI Project Forecasting",
          category: "technology",
          potential: 78,
          timeline: "3-6 months",
          confidence: 82,
          tags: ["Predictive", "Risk Reduction", "Efficiency"],
          description: "Enhanced project planning and risk management",
        },
        {
          opportunity: "ESG-Linked Projects",
          category: "sustainability",
          potential: 75,
          timeline: "12-18 months",
          confidence: 85,
          tags: ["Green Building", "Incentives", "Premium"],
          description: "Access to green financing and tax incentives",
        },
        {
          opportunity: "PropTech Integration",
          category: "technology",
          potential: 70,
          timeline: "3-9 months",
          confidence: 79,
          tags: ["Digital", "Automation", "Analytics"],
          description: "Streamlined operations and data insights",
        },
        {
          opportunity: "Healthcare Facility Boom",
          category: "market",
          potential: 82,
          timeline: "6-24 months",
          confidence: 90,
          tags: ["Aging Population", "Demand", "Specialized"],
          description: "Growing demand for healthcare infrastructure",
        },
        {
          opportunity: "Renewable Energy Integration",
          category: "sustainability",
          potential: 72,
          timeline: "9-18 months",
          confidence: 83,
          tags: ["Solar", "Storage", "Grid Independence"],
          description: "On-site renewable energy systems",
        },
      ]

      const newData: OpportunityData[] = baseOpportunities.map((opp) => ({
        ...opp,
        potential: Math.max(0, Math.min(100, opp.potential + (Math.random() - 0.5) * 8)),
        confidence: Math.max(0, Math.min(100, opp.confidence + (Math.random() - 0.5) * 6)),
      }))

      // Historical trend data
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
      const newTrendData: TrendData[] = months.map((month, index) => ({
        month,
        modular: 20 + index * 5 + (Math.random() - 0.5) * 8,
        ai: 15 + index * 3 + (Math.random() - 0.5) * 6,
        esg: 25 + index * 4 + (Math.random() - 0.5) * 7,
      }))

      setData(newData)
      setTrendData(newTrendData)
      setLastUpdated(new Date().toLocaleTimeString())
    }

    generateData()

    // Update every 24 seconds
    const interval = setInterval(generateData, 24000)
    return () => clearInterval(interval)
  }, [])

  const getCategoryData = (category: OpportunityData["category"]) => {
    return data.filter((item) => item.category === category)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "technology":
        return <Zap className="h-4 w-4 text-blue-500" />
      case "sustainability":
        return <Leaf className="h-4 w-4 text-green-500" />
      case "market":
        return <Building className="h-4 w-4 text-purple-500" />
      default:
        return <Target className="h-4 w-4 text-gray-500" />
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return "text-green-600"
    if (confidence >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const topOpportunity = data.reduce((max, item) => (item.potential > (max?.potential || 0) ? item : max), data[0])

  const pieData = [
    { name: "Technology", value: getCategoryData("technology").length, color: "#3b82f6" },
    { name: "Sustainability", value: getCategoryData("sustainability").length, color: "#10b981" },
    { name: "Market", value: getCategoryData("market").length, color: "#8b5cf6" },
  ]

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">AI-Identified Opportunities</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Lightbulb className="h-3 w-3 mr-1" />
              AI Insights
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              Live Analysis
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* AI Opportunity Assessment */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-start space-x-3">
            <div className="bg-green-500 p-2 rounded-full">
              <Lightbulb className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-green-900 mb-1">AI Opportunity Intelligence</h4>
              <p className="text-sm text-green-800">
                Modular delivery accelerates timelines by 20–30%; ESG-linked projects trending with premium pricing. AI
                forecasting shows 85% confidence in technology adoption opportunities.
              </p>
              <div className="mt-2 flex items-center space-x-4">
                <span className="text-xs text-green-600">Analysis Confidence: 85%</span>
                <span className="text-xs text-green-600">Last Updated: {lastUpdated}</span>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="technology">Technology</TabsTrigger>
            <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
            <TabsTrigger value="market">Market</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Distribution Chart */}
            <div className="grid grid-cols-2 gap-4">
              <div className="h-64">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Opportunity Distribution</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="h-64">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Trend Analysis</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      label={{ value: "Interest %", angle: -90, position: "insideLeft" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px",
                      }}
                    />
                    <Line type="monotone" dataKey="modular" stroke="#3b82f6" strokeWidth={2} name="Modular" />
                    <Line type="monotone" dataKey="ai" stroke="#8b5cf6" strokeWidth={2} name="AI Tech" />
                    <Line type="monotone" dataKey="esg" stroke="#10b981" strokeWidth={2} name="ESG" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Opportunity Cards */}
            <div className="space-y-3">
              {data.map((opp, index) => (
                <div key={opp.opportunity} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(opp.category)}
                      <span className="font-medium text-gray-900 text-sm">{opp.opportunity}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className={`text-xs px-2 py-1 ${
                          opp.category === "technology"
                            ? "bg-blue-50 text-blue-700"
                            : opp.category === "sustainability"
                            ? "bg-green-50 text-green-700"
                            : "bg-purple-50 text-purple-700"
                        }`}
                      >
                        {opp.category}
                      </Badge>
                      <span className={`text-xs font-medium ${getConfidenceColor(opp.confidence)}`}>
                        {opp.confidence}%
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{opp.description}</p>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <span className="text-xs text-gray-500">Potential</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="h-2 rounded-full bg-blue-500" style={{ width: `${opp.potential}%` }} />
                        </div>
                        <span className="text-xs font-medium">{opp.potential}%</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Timeline</span>
                      <p className="text-sm font-medium">{opp.timeline}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Tags</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {opp.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="technology" className="space-y-4">
            <div className="h-64">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Technology Opportunities</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getCategoryData("technology")}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="opportunity" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                  <YAxis tick={{ fontSize: 12 }} label={{ value: "Potential %", angle: -90, position: "insideLeft" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="potential" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="sustainability" className="space-y-4">
            <div className="h-64">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Sustainability Opportunities</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getCategoryData("sustainability")}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="opportunity" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                  <YAxis tick={{ fontSize: 12 }} label={{ value: "Potential %", angle: -90, position: "insideLeft" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="potential" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="market" className="space-y-4">
            <div className="h-64">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Market Opportunities</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getCategoryData("market")}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="opportunity" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                  <YAxis tick={{ fontSize: 12 }} label={{ value: "Potential %", angle: -90, position: "insideLeft" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="potential" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>

        {/* Top Opportunity Highlight */}
        {topOpportunity && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <Star className="h-5 w-5 text-blue-600" />
              <div>
                <h5 className="font-medium text-blue-900">Top Opportunity</h5>
                <p className="text-sm text-blue-800">
                  {topOpportunity.opportunity}: {topOpportunity.description}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Potential: {topOpportunity.potential}% | Timeline: {topOpportunity.timeline}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
