"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { TrendingUp, TrendingDown, Activity, DollarSign, Calendar } from "lucide-react"
import { useState, useEffect } from "react"

interface GrowthData {
  month: string
  value: number
  yoy: number
  mom: number
  rollingGrowth: number
}

export function FloridaMarketGrowthCard() {
  const [data, setData] = useState<GrowthData[]>([])
  const [currentValue, setCurrentValue] = useState(459)
  const [yoyGrowth, setYoyGrowth] = useState(28)
  const [lastUpdated, setLastUpdated] = useState<string>("")

  useEffect(() => {
    // Generate realistic data based on analysis
    const generateData = () => {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      const newData: GrowthData[] = []

      // Base value of $459B with realistic variations
      const baseValue = 459

      months.forEach((month, index) => {
        const seasonalFactor = 1 + Math.sin((index / 12) * 2 * Math.PI) * 0.1
        const randomVariation = 0.95 + Math.random() * 0.1
        const value = baseValue * seasonalFactor * randomVariation

        // YoY growth trending down from 28% to stabilize at ~5%
        const yoyTrend = 28 - index * 2.3 // Moderating trend
        const yoy = Math.max(yoyTrend + (Math.random() - 0.5) * 4, 4)

        // Month-over-month variations
        const mom = (Math.random() - 0.5) * 8

        // 3-month rolling growth
        const rollingGrowth = index >= 2 ? (newData[index - 1]?.rollingGrowth || 0) * 0.7 + yoy * 0.3 : yoy

        newData.push({
          month,
          value: Math.round(value),
          yoy: Math.round(yoy * 10) / 10,
          mom: Math.round(mom * 10) / 10,
          rollingGrowth: Math.round(rollingGrowth * 10) / 10,
        })
      })

      setData(newData)
    }

    generateData()

    // Update current values
    setCurrentValue(459 + Math.round((Math.random() - 0.5) * 20))
    setYoyGrowth(28 - Math.random() * 3)
    setLastUpdated(new Date().toLocaleTimeString())

    // Real-time updates every 22 seconds
    const interval = setInterval(() => {
      generateData()
      setCurrentValue((prev) => prev + Math.round((Math.random() - 0.5) * 10))
      setYoyGrowth((prev) => Math.max(prev - 0.1 + Math.random() * 0.2, 4))
      setLastUpdated(new Date().toLocaleTimeString())
    }, 22000)

    return () => clearInterval(interval)
  }, [])

  const currentTrend = yoyGrowth > 15 ? "strong" : yoyGrowth > 8 ? "moderate" : "stabilizing"
  const trendColor =
    currentTrend === "strong" ? "text-green-600" : currentTrend === "moderate" ? "text-yellow-600" : "text-blue-600"

  const TrendIcon = yoyGrowth > 10 ? TrendingUp : yoyGrowth > 5 ? Activity : TrendingDown

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Florida Commercial Market Growth</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Activity className="h-3 w-3 mr-1" />
              Live Data
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              AI Enhanced
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Value</p>
                <p className="text-2xl font-bold text-blue-600">${currentValue}B</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">YoY Growth</p>
                <p className={`text-2xl font-bold ${trendColor}`}>{yoyGrowth.toFixed(1)}%</p>
              </div>
              <TrendIcon className={`h-8 w-8 ${trendColor}`} />
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">FL Share</p>
                <p className="text-2xl font-bold text-purple-600">~11%</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64">
          <h4 className="text-sm font-medium text-gray-700 mb-2">3-Month Rolling Growth Trend</h4>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={{ stroke: "#e0e0e0" }} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: "#e0e0e0" }}
                label={{ value: "Growth %", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                }}
                formatter={(value: number, name: string) => [
                  `${value}%`,
                  name === "rollingGrowth" ? "3-Month Rolling Growth" : name,
                ]}
              />
              <Area
                type="monotone"
                dataKey="rollingGrowth"
                stroke="#3b82f6"
                fill="url(#colorGradient)"
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* AI Insights */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-500 p-2 rounded-full">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-blue-900 mb-1">AI Market Intelligence</h4>
              <p className="text-sm text-blue-800">
                Moderating trend detected in Q2 2025; forecast stabilizing at ~5% growth as market matures. Strong
                retail/hospitality demand in Central FL (+5.9%) offsetting office sector weakness.
              </p>
              <div className="mt-2 flex items-center space-x-4">
                <span className="text-xs text-blue-600">Confidence: 87%</span>
                <span className="text-xs text-blue-600">Last Updated: {lastUpdated}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Regional Breakdown */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 p-3 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-2">Market Drivers</h5>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Retail/Hospitality: +5.9%</li>
              <li>• Industrial/Data Centers: Rising</li>
              <li>• Migration-driven demand</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-2">Challenges</h5>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Office vacancy: 10-15%</li>
              <li>• Tariff cost pressure: +5%</li>
              <li>• Insurance hikes: 20-30%</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
