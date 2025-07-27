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
  Cell,
} from "recharts"
import { AlertTriangle, Shield, DollarSign, Building, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"

interface ThreatData {
  threat: string
  severity: number
  impact: number
  trend: "increasing" | "decreasing" | "stable"
  description: string
  category: "cost" | "market" | "regulatory"
}

interface RadarData {
  threat: string
  severity: number
  impact: number
  fullMark: 100
}

export function ThreatTrackerCard() {
  const [data, setData] = useState<ThreatData[]>([])
  const [radarData, setRadarData] = useState<RadarData[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [lastUpdated, setLastUpdated] = useState<string>("")

  useEffect(() => {
    const generateData = () => {
      const baseThreats: ThreatData[] = [
        {
          threat: "Tariff Cost Impact",
          severity: 75,
          impact: 85,
          trend: "increasing",
          description: "5%+ material cost increase from trade tariffs",
          category: "cost",
        },
        {
          threat: "Insurance Rate Hikes",
          severity: 80,
          impact: 90,
          trend: "increasing",
          description: "20-30% insurance premium increases",
          category: "cost",
        },
        {
          threat: "Office Vacancy Levels",
          severity: 65,
          impact: 70,
          trend: "stable",
          description: "10-15% vacancy rates in office sector",
          category: "market",
        },
        {
          threat: "Labor Shortage",
          severity: 70,
          impact: 75,
          trend: "increasing",
          description: "Skilled workforce scarcity driving wages up",
          category: "market",
        },
        {
          threat: "Climate Risk",
          severity: 60,
          impact: 85,
          trend: "increasing",
          description: "Extreme weather events impacting projects",
          category: "regulatory",
        },
        {
          threat: "Interest Rate Pressure",
          severity: 55,
          impact: 80,
          trend: "stable",
          description: "Elevated financing costs affecting demand",
          category: "cost",
        },
      ]

      const newData: ThreatData[] = baseThreats.map((threat) => ({
        ...threat,
        severity: Math.max(0, Math.min(100, threat.severity + (Math.random() - 0.5) * 10)),
        impact: Math.max(0, Math.min(100, threat.impact + (Math.random() - 0.5) * 8)),
      }))

      const newRadarData: RadarData[] = newData.map((threat) => ({
        threat: threat.threat.split(" ")[0],
        severity: threat.severity,
        impact: threat.impact,
        fullMark: 100,
      }))

      setData(newData)
      setRadarData(newRadarData)
      setLastUpdated(new Date().toLocaleTimeString())
    }

    generateData()

    // Update every 30 seconds
    const interval = setInterval(generateData, 30000)
    return () => clearInterval(interval)
  }, [])

  const getCategoryData = (category: ThreatData["category"]) => {
    return data.filter((item) => item.category === category)
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-red-500" />
      case "decreasing":
        return <TrendingUp className="h-4 w-4 text-green-500 rotate-180" />
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />
    }
  }

  const getSeverityColor = (severity: number) => {
    if (severity >= 75) return "bg-red-500"
    if (severity >= 50) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getImpactColor = (impact: number) => {
    if (impact >= 80) return "text-red-600"
    if (impact >= 60) return "text-yellow-600"
    return "text-green-600"
  }

  const highestThreat = data.reduce(
    (max, item) => (item.severity + item.impact > (max?.severity || 0) + (max?.impact || 0) ? item : max),
    data[0]
  )

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Threat Tracker</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Risk Monitor
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              AI Enhanced
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* AI Threat Assessment */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-start space-x-3">
            <div className="bg-red-500 p-2 rounded-full">
              <AlertTriangle className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-red-900 mb-1">AI Threat Intelligence</h4>
              <p className="text-sm text-red-800">
                Tariffs contributing 5% material cost rise; office vacancy at 10–15%. Insurance hikes (20-30%) represent
                highest combined threat severity.
              </p>
              <div className="mt-2 flex items-center space-x-4">
                <span className="text-xs text-red-600">Alert Level: High</span>
                <span className="text-xs text-red-600">Last Updated: {lastUpdated}</span>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="cost">Cost</TabsTrigger>
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="regulatory">Regulatory</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Radar Chart */}
            <div className="h-64">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Threat Impact vs Severity</h4>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="threat" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar
                    name="Severity"
                    dataKey="severity"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Radar
                    name="Impact"
                    dataKey="impact"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Threat Summary */}
            <div className="grid grid-cols-1 gap-3">
              {data.map((threat, index) => (
                <div key={threat.threat} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(threat.trend)}
                      <span className="font-medium text-gray-900 text-sm">{threat.threat}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className={`text-xs px-2 py-1 ${
                          threat.category === "cost"
                            ? "bg-red-50 text-red-700"
                            : threat.category === "market"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-purple-50 text-purple-700"
                        }`}
                      >
                        {threat.category}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{threat.description}</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Severity</span>
                        <span>{threat.severity.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getSeverityColor(threat.severity)}`}
                          style={{ width: `${threat.severity}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Impact</span>
                        <span className={getImpactColor(threat.impact)}>{threat.impact.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            threat.impact >= 80 ? "bg-red-500" : threat.impact >= 60 ? "bg-yellow-500" : "bg-green-500"
                          }`}
                          style={{ width: `${threat.impact}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cost" className="space-y-4">
            <div className="h-64">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Cost-Related Threats</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getCategoryData("cost")}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="threat" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    label={{ value: "Threat Level", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="severity" fill="#ef4444" name="Severity" />
                  <Bar dataKey="impact" fill="#f59e0b" name="Impact" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="market" className="space-y-4">
            <div className="h-64">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Market-Related Threats</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getCategoryData("market")}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="threat" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    label={{ value: "Threat Level", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="severity" fill="#3b82f6" name="Severity" />
                  <Bar dataKey="impact" fill="#10b981" name="Impact" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="regulatory" className="space-y-4">
            <div className="h-64">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Regulatory Threats</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getCategoryData("regulatory")}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="threat" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    label={{ value: "Threat Level", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="severity" fill="#8b5cf6" name="Severity" />
                  <Bar dataKey="impact" fill="#ec4899" name="Impact" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>

        {/* Top Threat Alert */}
        {highestThreat && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <h5 className="font-medium text-red-900">Highest Priority Threat</h5>
                <p className="text-sm text-red-800">
                  {highestThreat.threat}: {highestThreat.description}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Combined Score: {(highestThreat.severity + highestThreat.impact).toFixed(0)}/200
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
