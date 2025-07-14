/**
 * @fileoverview Market Intelligence Dashboard Page
 * @module MarketIntelDashboard
 * @version 1.0.0
 * @author HB Development Team
 * @since 2025-01-31
 *
 * AI-powered market intelligence dashboard with comprehensive market analysis,
 * competitive positioning, and predictive insights for commercial construction.
 *
 * Accessible to all user roles except "admin"
 * Uses beta dashboard layout format with Power BI embedded visualizations
 */

"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Brain,
  BarChart3,
  TrendingUp,
  Globe,
  Target,
  AlertTriangle,
  RefreshCw,
  Settings,
  Download,
  Share2,
  Eye,
  Zap,
  Activity,
  Home,
  ChevronRight,
  Building2,
  Sparkles,
  Bot,
} from "lucide-react"
import type { DashboardCard } from "@/types/dashboard"
import type { UserRole } from "../../project/[projectId]/types/project"

// Market Intelligence Dashboard Cards
import SimpleMarketIntelCard from "@/components/cards/SimpleMarketIntelCard"
import MarketAnalyticsCard from "@/components/cards/MarketAnalyticsCard"
import AIMarketInsightsCard from "@/components/cards/AIMarketInsightsCard"
import { FloridaMarketGrowthCard } from "@/components/cards/FloridaMarketGrowthCard"
import { RegionalHotspotsCard } from "@/components/cards/RegionalHotspotsCard"
import { DeveloperSentimentCard } from "@/components/cards/DeveloperSentimentCard"
import { ThreatTrackerCard } from "@/components/cards/ThreatTrackerCard"
import { AIOpportunitiesCard } from "@/components/cards/AIOpportunitiesCard"
import { CompetitorBenchmarkCard } from "@/components/cards/CompetitorBenchmarkCard"
import { RiskRewardRadarCard } from "@/components/cards/RiskRewardRadarCard"

interface User {
  firstName?: string
  lastName?: string
  email?: string
  role?: string
}

// Role-based access control - exclude admin
const ALLOWED_ROLES: UserRole[] = ["executive", "project-executive", "project-manager", "estimator", "presentation"]

function MarketIntelDashboardContent({ user }: { user: User }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isFocusMode, setIsFocusMode] = useState(false)

  // Determine user role
  const userRole = useMemo((): UserRole => {
    if (!user?.role) return "estimator"

    switch (user.role) {
      case "executive":
        return "executive"
      case "project-executive":
        return "project-executive"
      case "project-manager":
        return "project-manager"
      case "estimator":
        return "estimator"
      case "presentation":
        return "presentation"
      default:
        return "estimator"
    }
  }, [user])

  // Access control - redirect admin users
  useEffect(() => {
    if (user?.role === "admin") {
      router.push("/main-app")
      return
    }
  }, [user?.role, router])

  // Handle ESC key to exit focus mode
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isFocusMode) {
        setIsFocusMode(false)
      }
    }

    if (isFocusMode) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "auto"
    }
  }, [isFocusMode])

  const handleRefresh = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setLastUpdated(new Date())
    setIsLoading(false)
  }

  // Get user display name
  const userName = user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email || "User"

  // Define market intelligence dashboard cards based on user role
  const getMarketIntelCards = (): DashboardCard[] => {
    const baseCards: DashboardCard[] = [
      // Row 1: Florida Market Growth and Regional Hotspots
      {
        id: "florida-market-growth",
        type: "florida-market-growth",
        title: "Florida Commercial Market Growth",
        size: "wide",
        position: { x: 0, y: 0 },
        span: { cols: 8, rows: 8 },
        visible: true,
        config: {
          userRole: userRole,
          showRealTime: true,
        },
      },
      {
        id: "regional-hotspots",
        type: "regional-hotspots",
        title: "Regional Hotspots by Sector",
        size: "wide",
        position: { x: 8, y: 0 },
        span: { cols: 8, rows: 8 },
        visible: true,
        config: {
          userRole: userRole,
          showRealTime: true,
        },
      },

      // Row 2: Developer Sentiment and Threat Tracker
      {
        id: "developer-sentiment",
        type: "developer-sentiment",
        title: "Developer Sentiment Index",
        size: "wide",
        position: { x: 0, y: 8 },
        span: { cols: 8, rows: 8 },
        visible: true,
        config: {
          userRole: userRole,
          showRealTime: true,
        },
      },
      {
        id: "threat-tracker",
        type: "threat-tracker",
        title: "Threat Tracker",
        size: "wide",
        position: { x: 8, y: 8 },
        span: { cols: 8, rows: 8 },
        visible: true,
        config: {
          userRole: userRole,
          showRealTime: true,
        },
      },

      // Row 3: AI Opportunities and Risk/Reward Radar
      {
        id: "ai-opportunities",
        type: "ai-opportunities",
        title: "AI-Identified Opportunities",
        size: "wide",
        position: { x: 0, y: 16 },
        span: { cols: 8, rows: 8 },
        visible: true,
        config: {
          userRole: userRole,
          showRealTime: true,
        },
      },
      {
        id: "risk-reward-radar",
        type: "risk-reward-radar",
        title: "Risk/Reward Radar",
        size: "wide",
        position: { x: 8, y: 16 },
        span: { cols: 8, rows: 8 },
        visible: true,
        config: {
          userRole: userRole,
          showRealTime: true,
        },
      },

      // Row 4: Competitor Benchmark (Full Width)
      {
        id: "competitor-benchmark",
        type: "competitor-benchmark",
        title: "Competitor Benchmark",
        size: "full-width",
        position: { x: 0, y: 24 },
        span: { cols: 16, rows: 8 },
        visible: true,
        config: {
          userRole: userRole,
          showRealTime: true,
        },
      },
    ]

    // Role-specific additional cards or customizations
    if (userRole === "executive" || userRole === "project-executive") {
      // Executives get enhanced strategic view configurations
      baseCards.forEach((card) => {
        if (card.config) {
          card.config.strategicView = true
        }
      })
    }

    if (userRole === "estimator") {
      // Estimators get enhanced bidding intelligence focus
      baseCards.forEach((card) => {
        if (card.config) {
          card.config.biddingFocus = true
        }
      })
    }

    return baseCards
  }

  const marketIntelCards = getMarketIntelCards()

  // Loading state
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Market Intelligence Dashboard...</p>
        </div>
      </div>
    )
  }

  // Access denied for admin users
  if (user.role === "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <AlertTriangle className="h-5 w-5" />
              Access Restricted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              The Market Intelligence Dashboard is not available for IT Administrator users.
            </p>
            <Button onClick={() => router.push("/main-app")} className="w-full">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          {/* Breadcrumb Navigation */}
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/main-app"
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="flex items-center gap-1">
                  <Brain className="h-4 w-4" />
                  Market Intelligence
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header Content */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Market Intelligence Dashboard</h1>
                  <p className="text-muted-foreground">
                    AI-powered market analysis and competitive positioning for {userName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                  <Brain className="h-3 w-3 mr-1" />
                  AI Enhanced
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  Power BI
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Activity className="h-3 w-3 mr-1" />
                  Live Data
                </Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Access
                </Badge>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="hidden sm:flex"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                {isLoading ? "Updating..." : "Refresh"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFocusMode(!isFocusMode)}
                className="hidden sm:flex"
              >
                <Eye className="h-4 w-4 mr-2" />
                {isFocusMode ? "Exit Focus" : "Focus Mode"}
              </Button>
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Live market data</span>
              </div>
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                <span>AI models active</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{marketIntelCards.length} analytics modules</span>
              <span>{userRole} view</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="container mx-auto px-4 py-4">
        <Alert className="border-indigo-200 bg-indigo-50 dark:bg-indigo-950/20">
          <Brain className="h-4 w-4" />
          <AlertDescription>
            <strong>AI-Powered Market Intelligence:</strong> This dashboard provides real-time market analysis using
            machine learning models trained on commercial construction data. Insights include competitive positioning,
            market trends, and predictive analytics to inform strategic decisions.
          </AlertDescription>
        </Alert>
      </div>

      {/* Dashboard Content */}
      <div
        className={`container mx-auto px-4 pb-8 ${
          isFocusMode ? "fixed inset-0 z-50 bg-background overflow-auto pt-4" : ""
        }`}
      >
        <DashboardLayout
          cards={marketIntelCards}
          onLayoutChange={() => {}} // Read-only dashboard
          onCardRemove={() => {}} // Read-only dashboard
          onCardConfigure={() => {}} // Read-only dashboard
          onCardSizeChange={() => {}} // Read-only dashboard
          onCardAdd={() => {}} // Read-only dashboard
          onSave={() => {}} // Read-only dashboard
          onReset={() => {}} // Read-only dashboard
          isEditing={false} // Always read-only
          onToggleEdit={() => {}} // Disabled
          layoutDensity="normal"
          userRole={userRole}
          dashboards={[]}
          currentDashboardId={undefined}
          onDashboardSelect={() => {}}
          useBetaDashboard={true} // Use beta dashboard layout
        />
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>© 2025 Hedrick Brothers Construction</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                Market Intelligence v1.0
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                System Status: Operational
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span>AI Models: Active</span>
              <span>•</span>
              <span>Data Quality: 94.1%</span>
              <span>•</span>
              <span>Last Model Update: 2 hours ago</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function MarketIntelDashboardPage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Please log in to access the Market Intelligence Dashboard.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <MarketIntelDashboardContent user={user} />
}
