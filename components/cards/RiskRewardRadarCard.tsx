"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import { Shield, TrendingUp, AlertTriangle, Target, Zap, Users } from "lucide-react"
import { useState, useEffect } from "react"

interface SWOTData {
  category: "strengths" | "weaknesses" | "opportunities" | "threats"
  factor: string
  impact: number
  region: string
  description: string
}

interface PorterData {
  force: string
  intensity: number
  description: string
  keyFactors: string[]
}

interface RadarData {
  dimension: string
  risk: number
  reward: number
  fullMark: 100
}

export function RiskRewardRadarCard() {
  const [swotData, setSWOTData] = useState<SWOTData[]>([])
  const [porterData, setPorterData] = useState<PorterData[]>([])
  const [radarData, setRadarData] = useState<RadarData[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [lastUpdated, setLastUpdated] = useState<string>("")

  useEffect(() => {
    const generateData = () => {
      // SWOT Analysis data
      const baseSWOT: SWOTData[] = [
        // Strengths
        {
          category: "strengths",
          factor: "Population Influx",
          impact: 85,
          region: "Statewide",
          description: "No state income tax attracting residents",
        },
        {
          category: "strengths",
          factor: "Tech/ESG Edge",
          impact: 75,
          region: "SE Florida",
          description: "Innovation in sustainability and technology",
        },
        {
          category: "strengths",
          factor: "Regional Hotspots",
          impact: 80,
          region: "SE Florida",
          description: "Strong luxury market demand",
        },

        // Weaknesses
        {
          category: "weaknesses",
          factor: "High Capital Barriers",
          impact: 70,
          region: "Statewide",
          description: "Significant upfront investment requirements",
        },
        {
          category: "weaknesses",
          factor: "Labor Shortages",
          impact: 75,
          region: "Statewide",
          description: "Skilled workforce scarcity",
        },
        {
          category: "weaknesses",
          factor: "Regulatory Complexity",
          impact: 65,
          region: "Statewide",
          description: "Complex permitting processes",
        },

        // Opportunities
        {
          category: "opportunities",
          factor: "Sustainability Niches",
          impact: 82,
          region: "Statewide",
          description: "Growing demand for green buildings",
        },
        {
          category: "opportunities",
          factor: "Industrial Growth SW",
          impact: 78,
          region: "SW Florida",
          description: "Data centers and logistics facilities",
        },
        {
          category: "opportunities",
          factor: "Multifamily Stabilization",
          impact: 72,
          region: "Statewide",
          description: "Market normalizing end-2025",
        },

        // Threats
        {
          category: "threats",
          factor: "Insurance/Climate",
          impact: 85,
          region: "Statewide",
          description: "Rising insurance costs and climate risks",
        },
        {
          category: "threats",
          factor: "Tariffs/Interest Rates",
          impact: 70,
          region: "Statewide",
          description: "Material cost increases and financing pressure",
        },
        {
          category: "threats",
          factor: "Oversupply Risk",
          impact: 65,
          region: "Statewide",
          description: "Market saturation in certain sectors",
        },
      ]

      // Porter's Five Forces data
      const basePorter: PorterData[] = [
        {
          force: "New Entrants",
          intensity: 65,
          description: "Medium barrier - High capital requirements but policy easing",
          keyFactors: ["Capital requirements", "Policy changes", "Market accessibility"],
        },
        {
          force: "Supplier Power",
          intensity: 85,
          description: "High - Material shortages inflate costs significantly",
          keyFactors: ["Material shortages", "Supply chain disruptions", "Cost inflation"],
        },
        {
          force: "Buyer Power",
          intensity: 60,
          description: "Medium - Price sensitive but strong demand fundamentals",
          keyFactors: ["Price sensitivity", "Market demand", "Financing availability"],
        },
        {
          force: "Substitutes",
          intensity: 35,
          description: "Low - Limited alternatives to new construction",
          keyFactors: ["Renovation alternatives", "Modular construction", "Technology solutions"],
        },
        {
          force: "Rivalry",
          intensity: 80,
          description: "High - Intense competition especially in SE Florida",
          keyFactors: ["Market concentration", "Competitive pressure", "Differentiation"],
        },
      ]

      // Add random variations
      const newSWOT: SWOTData[] = baseSWOT.map((item) => ({
        ...item,
        impact: Math.max(0, Math.min(100, item.impact + (Math.random() - 0.5) * 10)),
      }))

      const newPorter: PorterData[] = basePorter.map((item) => ({
        ...item,
        intensity: Math.max(0, Math.min(100, item.intensity + (Math.random() - 0.5) * 8)),
      }))

      // Generate radar data combining both analyses
      const newRadarData: RadarData[] = [
        {
          dimension: "Market Entry",
          risk: 65, // New entrants intensity
          reward: 82, // Sustainability opportunities
          fullMark: 100,
        },
        {
          dimension: "Supply Chain",
          risk: 85, // Supplier power
          reward: 75, // Tech/ESG edge
          fullMark: 100,
        },
        {
          dimension: "Competition",
          risk: 80, // Rivalry intensity
          reward: 80, // Regional hotspots
          fullMark: 100,
        },
        {
          dimension: "Climate/Insurance",
          risk: 85, // Major threat
          reward: 35, // Low substitute threat
          fullMark: 100,
        },
        {
          dimension: "Demand",
          risk: 60, // Buyer power
          reward: 85, // Population influx
          fullMark: 100,
        },
      ]

      setSWOTData(newSWOT)
      setPorterData(newPorter)
      setRadarData(newRadarData)
      setLastUpdated(new Date().toLocaleTimeString())
    }

    generateData()

    // Update every 35 seconds
    const interval = setInterval(generateData, 35000)
    return () => clearInterval(interval)
  }, [])

  const getSWOTCategory = (category: SWOTData["category"]) => {
    return swotData.filter((item) => item.category === category)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "strengths":
        return "bg-green-50 text-green-700 border-green-200"
      case "weaknesses":
        return "bg-red-50 text-red-700 border-red-200"
      case "opportunities":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "threats":
        return "bg-orange-50 text-orange-700 border-orange-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "strengths":
        return <TrendingUp className="h-4 w-4" />
      case "weaknesses":
        return <AlertTriangle className="h-4 w-4" />
      case "opportunities":
        return <Target className="h-4 w-4" />
      case "threats":
        return <Shield className="h-4 w-4" />
      default:
        return <Zap className="h-4 w-4" />
    }
  }

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 80) return "bg-red-500"
    if (intensity >= 65) return "bg-yellow-500"
    return "bg-green-500"
  }

  const overallRisk = radarData.reduce((sum, item) => sum + item.risk, 0) / radarData.length
  const overallReward = radarData.reduce((sum, item) => sum + item.reward, 0) / radarData.length
  const riskRewardRatio = (overallReward / overallRisk).toFixed(2)

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Risk/Reward Radar</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              <Shield className="h-3 w-3 mr-1" />
              Strategic Analysis
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              AI Enhanced
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* AI Strategic Assessment */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-start space-x-3">
            <div className="bg-purple-500 p-2 rounded-full">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-purple-900 mb-1">AI Strategic Intelligence</h4>
              <p className="text-sm text-purple-800">
                Rivalry high in SE Florida; tariff-driven cost pressure escalating. Insurance/climate represents primary
                risk factor (85% intensity), balanced by strong population growth opportunities (85% reward potential).
              </p>
              <div className="mt-2 flex items-center space-x-4">
                <span className="text-xs text-purple-600">Risk/Reward Ratio: {riskRewardRatio}</span>
                <span className="text-xs text-purple-600">Last Updated: {lastUpdated}</span>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="swot">SWOT Analysis</TabsTrigger>
            <TabsTrigger value="porter">Porter Forces</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Risk/Reward Radar Chart */}
            <div className="grid grid-cols-2 gap-4">
              <div className="h-64">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Risk vs Reward Analysis</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar
                      name="Risk"
                      dataKey="risk"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Radar
                      name="Reward"
                      dataKey="reward"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Summary Metrics */}
              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-red-900">Overall Risk</h5>
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <p className="text-2xl font-bold text-red-600">{overallRisk.toFixed(0)}</p>
                  <p className="text-sm text-red-800">Climate/Insurance primary driver</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-green-900">Overall Reward</h5>
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-green-600">{overallReward.toFixed(0)}</p>
                  <p className="text-sm text-green-800">Population growth key factor</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-blue-900">Risk/Reward Ratio</h5>
                    <Target className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{riskRewardRatio}</p>
                  <p className="text-sm text-blue-800">{parseFloat(riskRewardRatio) > 1 ? "Favorable" : "Cautious"}</p>
                </div>
              </div>
            </div>

            {/* Key Insights */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-3">Top Risk Factors</h5>
                <div className="space-y-2">
                  {radarData
                    .sort((a, b) => b.risk - a.risk)
                    .slice(0, 3)
                    .map((item, index) => (
                      <div key={item.dimension} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{item.dimension}</span>
                        <span className="text-sm font-medium text-red-600">{item.risk}%</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-3">Top Reward Factors</h5>
                <div className="space-y-2">
                  {radarData
                    .sort((a, b) => b.reward - a.reward)
                    .slice(0, 3)
                    .map((item, index) => (
                      <div key={item.dimension} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{item.dimension}</span>
                        <span className="text-sm font-medium text-green-600">{item.reward}%</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="swot" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Strengths & Opportunities */}
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <h5 className="font-medium text-green-900">Strengths</h5>
                  </div>
                  <div className="space-y-2">
                    {getSWOTCategory("strengths").map((item, index) => (
                      <div key={index} className="bg-white p-3 rounded border border-green-100">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-green-900">{item.factor}</span>
                          <span className="text-xs text-green-600">{item.impact}%</span>
                        </div>
                        <p className="text-xs text-green-700">{item.description}</p>
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded mt-1 inline-block">
                          {item.region}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <Target className="h-5 w-5 text-blue-600" />
                    <h5 className="font-medium text-blue-900">Opportunities</h5>
                  </div>
                  <div className="space-y-2">
                    {getSWOTCategory("opportunities").map((item, index) => (
                      <div key={index} className="bg-white p-3 rounded border border-blue-100">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-blue-900">{item.factor}</span>
                          <span className="text-xs text-blue-600">{item.impact}%</span>
                        </div>
                        <p className="text-xs text-blue-700">{item.description}</p>
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded mt-1 inline-block">
                          {item.region}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Weaknesses & Threats */}
              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <h5 className="font-medium text-red-900">Weaknesses</h5>
                  </div>
                  <div className="space-y-2">
                    {getSWOTCategory("weaknesses").map((item, index) => (
                      <div key={index} className="bg-white p-3 rounded border border-red-100">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-red-900">{item.factor}</span>
                          <span className="text-xs text-red-600">{item.impact}%</span>
                        </div>
                        <p className="text-xs text-red-700">{item.description}</p>
                        <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded mt-1 inline-block">
                          {item.region}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <Shield className="h-5 w-5 text-orange-600" />
                    <h5 className="font-medium text-orange-900">Threats</h5>
                  </div>
                  <div className="space-y-2">
                    {getSWOTCategory("threats").map((item, index) => (
                      <div key={index} className="bg-white p-3 rounded border border-orange-100">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-orange-900">{item.factor}</span>
                          <span className="text-xs text-orange-600">{item.impact}%</span>
                        </div>
                        <p className="text-xs text-orange-700">{item.description}</p>
                        <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded mt-1 inline-block">
                          {item.region}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="porter" className="space-y-4">
            <div className="h-64">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Porter's Five Forces Intensity</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={porterData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="force" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                  <YAxis tick={{ fontSize: 12 }} label={{ value: "Intensity", angle: -90, position: "insideLeft" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="intensity" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {porterData.map((force, index) => (
                <div key={force.force} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{force.force}</h5>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getIntensityColor(force.intensity)}`}
                          style={{ width: `${force.intensity}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{force.intensity}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{force.description}</p>
                  <div>
                    <span className="text-xs text-gray-500">Key Factors:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {force.keyFactors.map((factor, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {factor}
                        </Badge>
                      ))}
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
