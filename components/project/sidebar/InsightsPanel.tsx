"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, AlertCircle, Info, Clock } from "lucide-react"

// Expandable HBI Insights Component
const ExpandableHBIInsights: React.FC<{ config: any[]; title: string }> = ({ config, title }) => {
  const [isExpanded, setIsExpanded] = React.useState(false)

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const itemsToShow = isExpanded ? config : config.slice(0, 3)
  const hasMore = config.length > 3

  // Get icon based on insight type
  const getInsightIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  // Get color based on insight type - more subdued styling
  const getInsightColor = (type: string) => {
    switch (type) {
      case "alert":
        return "text-foreground bg-background border-border border-l-4 border-l-red-500"
      case "warning":
        return "text-foreground bg-background border-border border-l-4 border-l-yellow-500"
      case "success":
        return "text-foreground bg-background border-border border-l-4 border-l-green-500"
      case "info":
        return "text-foreground bg-background border-border border-l-4 border-l-blue-500"
      case "opportunity":
        return "text-foreground bg-background border-border border-l-4 border-l-purple-500"
      default:
        return "text-foreground bg-background border-border border-l-4 border-l-gray-400"
    }
  }

  return (
    <div className="space-y-3">
      {itemsToShow.map((item, index) => (
        <div key={item.id || index} className={`p-3 rounded-lg border ${getInsightColor(item.type)}`}>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">{getInsightIcon(item.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{item.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{item.text || item.description}</p>
                  {item.metric && <div className="text-xs text-blue-600 mt-1">{item.metric}</div>}
                </div>
                {item.action && (
                  <Button variant="ghost" size="sm" className="text-xs h-6 px-2 ml-2">
                    {item.action}
                  </Button>
                )}
              </div>
              {item.timestamp && (
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  {item.timestamp}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {hasMore && (
        <div className="text-center pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleExpanded}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            {isExpanded ? `Show less` : `Show ${config.length - 3} more insights`}
          </Button>
        </div>
      )}
    </div>
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
  const insights = getHBIInsights()
  const title = getHBIInsightsTitle()

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {insights && insights.length > 0 ? (
          <ExpandableHBIInsights config={insights} title={title} />
        ) : (
          <div className="text-sm text-muted-foreground py-4">No insights available at this time.</div>
        )}
      </CardContent>
    </Card>
  )
}
