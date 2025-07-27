"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Activity, TrendingUp, TrendingDown, AlertTriangle, Shield, DollarSign } from "lucide-react"
import { useState, useEffect } from "react"

interface SentimentData {
  metric: string
  value: number
  change: number
  impact: "positive" | "negative" | "neutral"
  weight: number
}

interface IndexData {
  month: string
  mpi: number
  insurance: number
  gdp: number
  composite: number
}

export function DeveloperSentimentCard() {
  const [data, setData] = useState<SentimentData[]>([])
  const [indexData, setIndexData] = useState<IndexData[]>([])
  const [compositeScore, setCompositeScore] = useState(52)
  const [lastUpdated, setLastUpdated] = useState<string>("")

  useEffect(() => {
    const generateData = () => {
      // Current sentiment metrics based on analysis
      const baseMetrics: SentimentData[] = [
        { metric: "MPI (Multi-family Production)", value: 45, change: -2.5, impact: "negative", weight: 0.4 },
        { metric: "Insurance Rate Impact", value: 25, change: 5.2, impact: "negative", weight: 0.3 },
        { metric: "GDP Growth Rate", value: 72, change: 1.8, impact: "positive", weight: 0.2 },
        { metric: "Job Market Strength", value: 68, change: 2.3, impact: "positive", weight: 0.1 },
      ]

      const newData: SentimentData[] = baseMetrics.map((item) => ({
        ...item,
        value: Math.max(0, Math.min(100, item.value + (Math.random() - 0.5) * 4)),
        change: item.change + (Math.random() - 0.5) * 0.8,
      }))

      // Calculate composite score
      const weighted = newData.reduce((sum, item) => sum + item.value * item.weight, 0)
      setCompositeScore(Math.round(weighted))

      // Historical index data
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
      const newIndexData: IndexData[] = months.map((month, index) => ({
        month,
        mpi: 45 + (Math.random() - 0.5) * 8,
        insurance: 25 + (Math.random() - 0.5) * 6,
        gdp: 2.5 + (Math.random() - 0.5) * 0.8,
        composite: 52 + (Math.random() - 0.5) * 8,
      }))

      setData(newData)
      setIndexData(newIndexData)
      setLastUpdated(new Date().toLocaleTimeString())
    }

    generateData()

    // Update every 28 seconds
    const interval = setInterval(generateData, 28000)
    return () => clearInterval(interval)
  }, [])

  const getSentimentLevel = (score: number) => {
    if (score >= 70) return { level: "Optimistic", color: "text-green-600", bg: "bg-green-50" }
    if (score >= 50) return { level: "Mixed", color: "text-yellow-600", bg: "bg-yellow-50" }
    return { level: "Cautious", color: "text-red-600", bg: "bg-red-50" }
  }

  const sentimentLevel = getSentimentLevel(compositeScore)

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "positive":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "negative":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getProgressColor = (value: number) => {
    if (value >= 70) return "bg-green-500"
    if (value >= 50) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Developer Sentiment Index</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              <Activity className="h-3 w-3 mr-1" />
              Composite
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              AI Enhanced
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Composite Score Gauge */}
        <div className="text-center">
          <div className="relative w-48 h-48 mx-auto mb-4">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* Background circle */}
              <circle cx="100" cy="100" r="80" fill="none" stroke="#f1f5f9" strokeWidth="12" />
              {/* Progress circle */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke={compositeScore >= 70 ? "#10b981" : compositeScore >= 50 ? "#f59e0b" : "#ef4444"}
                strokeWidth="12"
                strokeDasharray={`${(compositeScore / 100) * 502.4} 502.4`}
                strokeDashoffset="0"
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
                className="transition-all duration-1000"
              />
              {/* Score text */}
              <text x="100" y="95" textAnchor="middle" className="text-3xl font-bold fill-current">
                {compositeScore}
              </text>
              <text x="100" y="115" textAnchor="middle" className="text-sm fill-current text-gray-600">
                Composite Score
              </text>
            </svg>
          </div>

          <div className={`inline-flex items-center px-4 py-2 rounded-full ${sentimentLevel.bg}`}>
            <span className={`font-medium ${sentimentLevel.color}`}>{sentimentLevel.level} Sentiment</span>
          </div>
        </div>

        {/* AI Insight */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-start space-x-3">
            <div className="bg-orange-500 p-2 rounded-full">
              <AlertTriangle className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-orange-900 mb-1">AI Market Intelligence</h4>
              <p className="text-sm text-orange-800">
                Developer sentiment mixed; rising insurance costs (+20-30%) offset by positive job growth (+2-3% GDP).
                MPI at 45 indicates cautious approach to multifamily development.
              </p>
              <div className="mt-2 flex items-center space-x-4">
                <span className="text-xs text-orange-600">Confidence: 84%</span>
                <span className="text-xs text-orange-600">Last Updated: {lastUpdated}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Metric Breakdown */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">Contributing Factors</h4>

          {data.map((item, index) => (
            <div key={item.metric} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getImpactIcon(item.impact)}
                  <span className="font-medium text-gray-900 text-sm">{item.metric}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{item.value.toFixed(0)}</span>
                  <span className={`text-xs ${item.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {item.change >= 0 ? "+" : ""}
                    {item.change.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Weight: {(item.weight * 100).toFixed(0)}%</span>
                  <span>Impact: {item.impact}</span>
                </div>
                <Progress
                  value={item.value}
                  className="h-2"
                  style={{
                    backgroundColor: "#f1f5f9",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Trend Chart */}
        <div className="h-64">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Historical Sentiment Trend</h4>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={indexData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} label={{ value: "Index Score", angle: -90, position: "insideLeft" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="mpi" fill="#3b82f6" name="MPI" />
              <Line
                type="monotone"
                dataKey="composite"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ r: 4 }}
                name="Composite Score"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Key Insights */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <h5 className="font-medium text-blue-900">Risk Factors</h5>
            </div>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Insurance hikes: 20-30%</li>
              <li>• MPI below 50 threshold</li>
              <li>• Climate risk concerns</li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <h5 className="font-medium text-green-900">Growth Drivers</h5>
            </div>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• GDP growth: 2-3%</li>
              <li>• Job market strength</li>
              <li>• Population influx</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
