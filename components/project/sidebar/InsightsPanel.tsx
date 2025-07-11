"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Expandable HBI Insights Component
const ExpandableHBIInsights: React.FC<{ config: any[]; title: string }> = ({ config, title }) => {
  const [isExpanded, setIsExpanded] = React.useState(false)

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const itemsToShow = isExpanded ? config : config.slice(0, 3)
  const hasMore = config.length > 3

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {itemsToShow.map((item, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div
                className={`w-2 h-2 rounded-full mt-2 ${
                  item.type === "alert" ? "bg-red-500" : item.type === "warning" ? "bg-yellow-500" : "bg-green-500"
                }`}
              />
              <div className="flex-1">
                <h4 className="text-sm font-medium">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.description}</p>
                {item.metric && <div className="text-xs text-blue-600 mt-1">{item.metric}</div>}
              </div>
            </div>
          ))}

          {hasMore && (
            <button onClick={toggleExpanded} className="text-xs text-blue-600 hover:underline">
              {isExpanded ? `Show less` : `Show ${config.length - 3} more insights`}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface InsightsPanelProps {
  projectId: string
  projectData: any
  user: any
  userRole: string
  activeTab?: string
  getHBIInsightsTitle: () => string
  getHBIInsights: () => any[]
}

export default function InsightsPanel({
  projectId,
  projectData,
  user,
  userRole,
  activeTab,
  getHBIInsightsTitle,
  getHBIInsights,
}: InsightsPanelProps) {
  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">{getHBIInsightsTitle()}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ExpandableHBIInsights config={getHBIInsights()} title={getHBIInsightsTitle()} />
      </CardContent>
    </Card>
  )
}
