"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  BarChart,
  Bar,
} from "recharts"
import { MapPin, TrendingUp, Building, Factory, Home, Star } from "lucide-react"
import { useState, useEffect } from "react"

interface RegionalData {
  region: string
  deals: number
  value: number
  growth: number
  sectors: {
    retail: number
    industrial: number
    multifamily: number
    office: number
  }
}

interface BubbleData {
  region: string
  x: number // Deal count
  y: number // Value ($B)
  z: number // Growth rate for bubble size
  color: string
}

export function RegionalHotspotsCard() {
  const [data, setData] = useState<RegionalData[]>([])
  const [bubbleData, setBubbleData] = useState<BubbleData[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [lastUpdated, setLastUpdated] = useState<string>("")

  useEffect(() => {
    const generateData = () => {
      const regions = [
        { name: "Southeast Florida", base: 3.0, deals: 45, growth: 12, color: "#ef4444" },
        { name: "Southwest Florida", base: 2.2, deals: 38, growth: 15, color: "#3b82f6" },
        { name: "Central Florida", base: 1.8, deals: 32, growth: 8, color: "#10b981" },
        { name: "North Florida", base: 1.2, deals: 28, growth: 5, color: "#f59e0b" },
      ]

      const newData: RegionalData[] = regions.map((region) => {
        const variation = 0.9 + Math.random() * 0.2
        return {
          region: region.name,
          deals: Math.round(region.deals * variation),
          value: Math.round(region.base * variation * 10) / 10,
          growth: Math.round(region.growth * variation * 10) / 10,
          sectors: {
            retail: Math.round(30 + Math.random() * 20),
            industrial: Math.round(25 + Math.random() * 15),
            multifamily: Math.round(20 + Math.random() * 15),
            office: Math.round(15 + Math.random() * 10),
          },
        }
      })

      const newBubbleData: BubbleData[] = regions.map((region) => ({
        region: region.name.split(" ")[0], // Short name
        x: Math.round(region.deals * (0.9 + Math.random() * 0.2)),
        y: Math.round(region.base * (0.9 + Math.random() * 0.2) * 10) / 10,
        z: Math.round(region.growth * (0.9 + Math.random() * 0.2)),
        color: region.color,
      }))

      setData(newData)
      setBubbleData(newBubbleData)
      setLastUpdated(new Date().toLocaleTimeString())
    }

    generateData()

    // Update every 26 seconds
    const interval = setInterval(generateData, 26000)
    return () => clearInterval(interval)
  }, [])

  const getSectorData = (sector: keyof RegionalData["sectors"]) => {
    return data.map((item) => ({
      region: item.region.split(" ")[0],
      value: item.sectors[sector],
      fullName: item.region,
    }))
  }

  const topRegion = data.reduce((max, item) => (item.value > (max?.value || 0) ? item : max), data[0])

  const CustomBubble = (props: any) => {
    const { cx, cy, payload } = props
    const radius = Math.max(8, Math.min(25, payload.z * 1.5))

    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill={payload.color}
          fillOpacity={0.6}
          stroke={payload.color}
          strokeWidth={2}
        />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize={10} fill="white" fontWeight="bold">
          {payload.region}
        </text>
      </g>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Regional Hotspots by Sector</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <MapPin className="h-3 w-3 mr-1" />
              Live Markets
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              AI Enhanced
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Key Insight */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-start space-x-3">
            <div className="bg-green-500 p-2 rounded-full">
              <Star className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-green-900 mb-1">AI Market Intelligence</h4>
              <p className="text-sm text-green-800">
                SE Florida outpacing all regions with ${topRegion?.value || 3.0}B in Q1–Q2 2025 deals, driven by strong
                multifamily and retail sectors. Industrial growth concentrated in SW Florida.
              </p>
              <div className="mt-2 flex items-center space-x-4">
                <span className="text-xs text-green-600">Confidence: 92%</span>
                <span className="text-xs text-green-600">Last Updated: {lastUpdated}</span>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="retail">Retail</TabsTrigger>
            <TabsTrigger value="industrial">Industrial</TabsTrigger>
            <TabsTrigger value="multifamily">Multifamily</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Bubble Chart */}
            <div className="h-64">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Deal Activity Heatmap</h4>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }} data={bubbleData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" dataKey="x" name="Deal Count" tick={{ fontSize: 12 }} />
                  <YAxis type="number" dataKey="y" name="Value ($B)" tick={{ fontSize: 12 }} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                            <p className="font-medium text-gray-900">{data.region} Florida</p>
                            <p className="text-sm text-gray-600">Deals: {data.x}</p>
                            <p className="text-sm text-gray-600">Value: ${data.y}B</p>
                            <p className="text-sm text-gray-600">Growth: {data.z}%</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Scatter dataKey="y" shape={<CustomBubble />} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            {/* Regional Summary */}
            <div className="grid grid-cols-2 gap-4">
              {data.map((region, index) => (
                <div key={region.region} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{region.region}</h5>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Value:</span>
                      <span className="font-medium">${region.value}B</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Deals:</span>
                      <span className="font-medium">{region.deals}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Growth:</span>
                      <span className="font-medium text-green-600">{region.growth}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="retail" className="space-y-4">
            <div className="h-64">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Retail Sector Activity</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getSectorData("retail")}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="region" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} label={{ value: "Deals", angle: -90, position: "insideLeft" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="industrial" className="space-y-4">
            <div className="h-64">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Industrial Sector Activity</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getSectorData("industrial")}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="region" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} label={{ value: "Deals", angle: -90, position: "insideLeft" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="value" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="multifamily" className="space-y-4">
            <div className="h-64">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Multifamily Sector Activity</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getSectorData("multifamily")}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="region" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} label={{ value: "Deals", angle: -90, position: "insideLeft" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="value" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
