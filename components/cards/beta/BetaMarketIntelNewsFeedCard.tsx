"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ExternalLink,
  Activity,
  DollarSign,
  Building2,
  BarChart3,
  Target,
  Clock,
  Calendar,
  MapPin,
  AlertCircle,
  CheckCircle,
  MoreVertical,
  Home,
  Users,
  Percent,
  ArrowUpDown,
  Zap,
  Globe,
  Shield,
  Gauge,
  TrendingUpIcon,
  Newspaper,
  Rss,
  Filter,
  Play,
  Pause,
  Package,
} from "lucide-react"

interface BetaMarketIntelNewsFeedCardProps {
  className?: string
  config?: any
  isCompact?: boolean
}

export default function BetaMarketIntelNewsFeedCard({
  className,
  config,
  isCompact,
}: BetaMarketIntelNewsFeedCardProps) {
  // Scale classes based on isCompact prop for 50% size reduction
  const compactScale = {
    iconSize: isCompact ? "h-3 w-3" : "h-5 w-5",
    iconSizeSmall: isCompact ? "h-2 w-2" : "h-3 w-3",
    textTitle: isCompact ? "text-sm" : "text-lg",
    textSmall: isCompact ? "text-[10px]" : "text-xs",
    textMedium: isCompact ? "text-xs" : "text-sm",
    padding: isCompact ? "p-1" : "p-2",
    paddingCard: isCompact ? "pb-1" : "pb-2",
    gap: isCompact ? "gap-1" : "gap-2",
    marginTop: isCompact ? "mt-0.5" : "mt-1",
    chartHeight: isCompact ? "h-32" : "h-48",
  }

  const [isRealTime, setIsRealTime] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentHeadlineIndex, setCurrentHeadlineIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Mock headlines data for July 21–28, 2025
  const headlines = React.useMemo(
    () => [
      {
        title: "Miami-Dade Finalizes $52M Deal for Mixed-Income Housing in Allapattah",
        href: "#/news/miami-dade-housing-deal",
        badge: "Local",
        category: "Multifamily & Luxury Residential",
        timestamp: "2 hours ago",
        source: "Miami Herald",
      },
      {
        title: "Lumber Prices Tick Up 4.2% After Canadian Supply Disruption",
        href: "#/news/lumber-price-july25",
        badge: "Materials",
        category: "Building Materials & Supply Chain",
        timestamp: "4 hours ago",
        source: "ENR",
      },
      {
        title: "Fed Signals Rate Hold Through Q4 Amid Slowing Job Growth",
        href: "#/news/fed-forecast-hold",
        badge: "FOMC",
        category: "Financial Indicators & Lending Trends",
        timestamp: "6 hours ago",
        source: "Federal Reserve",
      },
      {
        title: "Orlando Approves $95M Infrastructure Bond for Southeast Sector",
        href: "#/news/orlando-infra-bond",
        badge: "Municipal",
        category: "Public Sector Projects (Florida)",
        timestamp: "8 hours ago",
        source: "Orlando Sentinel",
      },
      {
        title: "Yardi: Florida Lease-Up Velocity Slows for Class A Multifamily",
        href: "#/news/yardi-florida-classa",
        badge: "Yardi",
        category: "Multifamily & Luxury Residential",
        timestamp: "12 hours ago",
        source: "Yardi Matrix",
      },
      {
        title: "CBRE: Industrial Vacancy Drops Below 4% in Tampa and Savannah Corridors",
        href: "#/news/cbre-industrial-vacancy",
        badge: "CBRE",
        category: "Commercial & Industrial Construction",
        timestamp: "1 day ago",
        source: "CBRE Research",
      },
      {
        title: "Palm Beach County Launches $25M Resilience Upgrades for Coastal Facilities",
        href: "#/news/palmbeach-resilience",
        badge: "County",
        category: "Public Sector Projects (Florida)",
        timestamp: "1 day ago",
        source: "Palm Beach Post",
      },
      {
        title: "AGC Reports 7.1% YoY Increase in Nonresidential Backlog Across Southeast",
        href: "#/news/agc-backlog-july2025",
        badge: "AGC",
        category: "Commercial & Industrial Construction",
        timestamp: "2 days ago",
        source: "AGC",
      },
      {
        title: "Steel Prices Stabilize After 3-Month Volatility, ENR Reports",
        href: "#/news/steel-prices-stabilize",
        badge: "Materials",
        category: "Building Materials & Supply Chain",
        timestamp: "2 days ago",
        source: "ENR",
      },
      {
        title: "Florida Construction Employment Hits Record High at 572,000 Workers",
        href: "#/news/florida-construction-employment",
        badge: "BLS",
        category: "Financial Indicators & Lending Trends",
        timestamp: "3 days ago",
        source: "Bureau of Labor Statistics",
      },
      {
        title: "Tampa Bay Area Sees 23% Increase in Multifamily Permits Q2 2025",
        href: "#/news/tampa-multifamily-permits",
        badge: "Local",
        category: "Multifamily & Luxury Residential",
        timestamp: "3 days ago",
        source: "Tampa Bay Business Journal",
      },
      {
        title: "Concrete Suppliers Face Capacity Constraints in South Florida Markets",
        href: "#/news/concrete-supply-constraints",
        badge: "Materials",
        category: "Building Materials & Supply Chain",
        timestamp: "4 days ago",
        source: "Construction Dive",
      },
    ],
    []
  )

  // Real-time data updates
  useEffect(() => {
    if (isRealTime) {
      const interval = setInterval(() => {
        setLastUpdate(new Date())
      }, 30000) // Update every 30 seconds
      return () => clearInterval(interval)
    }
  }, [isRealTime])

  // Auto-scroll headlines with smooth transition
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setIsTransitioning(true)
        setTimeout(() => {
          setCurrentHeadlineIndex((prev) => (prev + 1) % headlines.length)
          setIsTransitioning(false)
        }, 300) // Transition duration
      }, 5000) // Change headline every 5 seconds
      return () => clearInterval(interval)
    }
  }, [isPlaying, headlines.length])

  // Get badge color based on category
  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Local":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Materials":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "FOMC":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "Municipal":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Yardi":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
      case "CBRE":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
      case "County":
        return "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200"
      case "AGC":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "BLS":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  // Get category icon
  const getCategoryIcon = (category: string) => {
    if (category.includes("Multifamily")) return <Home className="h-4 w-4" />
    if (category.includes("Commercial")) return <Building2 className="h-4 w-4" />
    if (category.includes("Public Sector")) return <Shield className="h-4 w-4" />
    if (category.includes("Materials")) return <Package className="h-4 w-4" />
    if (category.includes("Financial")) return <DollarSign className="h-4 w-4" />
    return <Newspaper className="h-4 w-4" />
  }

  return (
    <Card
      className={`h-full bg-gradient-to-br from-[#FA4616]/5 to-[#FA4616]/10 dark:from-[#FA4616]/20 dark:to-[#FA4616]/30 border-[#FA4616]/20 dark:border-[#FA4616]/40 ${className}`}
    >
      <CardHeader className={compactScale.paddingCard}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className={`${compactScale.textTitle} font-semibold text-[#FA4616] dark:text-[#FF8A67]`}>
              Market Intelligence Headlines
            </CardTitle>
            <p className={`${compactScale.textMedium} text-[#FA4616]/70 dark:text-[#FF8A67]/80`}>
              Curated News & Trends
            </p>
            <div className={`flex items-center ${compactScale.gap} ${compactScale.marginTop}`}>
              {isRealTime && (
                <Badge
                  variant="outline"
                  className={`${compactScale.textSmall} bg-green-500/10 text-green-600 dark:bg-green-500/30 dark:text-green-400`}
                >
                  <Clock className={`${compactScale.iconSizeSmall} mr-0.5`} />
                  Live Data
                </Badge>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-transparent">
                <MoreVertical className={`${compactScale.iconSize} scale-150`} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="flex items-center gap-2">
                <Switch id="real-time" checked={isRealTime} onCheckedChange={setIsRealTime} />
                <Label
                  htmlFor="real-time"
                  className={`${compactScale.textSmall} text-[#FA4616]/70 dark:text-[#FF8A67]/80`}
                >
                  Real-time
                </Label>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? (
                  <Pause className={`${compactScale.iconSize} mr-2`} />
                ) : (
                  <Play className={`${compactScale.iconSize} mr-2`} />
                )}
                {isPlaying ? "Pause" : "Play"} Auto-scroll
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RefreshCw className={`${compactScale.iconSize} mr-2`} />
                Refresh Headlines
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className={`${isCompact ? "p-2" : "p-3"} flex flex-col`}>
        {/* Featured Headline Carousel */}
        <div className="relative bg-gradient-to-r from-[#FA4616]/10 to-[#FA4616]/5 dark:from-[#FA4616]/20 dark:to-[#FA4616]/10 p-4 rounded-xl border-2 border-[#FA4616]/30 dark:border-[#FA4616]/50 mb-3 overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FA4616]/5 to-transparent animate-pulse"></div>

          {/* Featured badge */}
          <div className="absolute top-2 right-2">
            <Badge className="bg-[#FA4616] text-white text-xs font-medium px-2 py-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          </div>

          {/* Headline content with smooth transition */}
          <div
            className={`relative transition-all duration-300 ease-in-out ${
              isTransitioning ? "opacity-0 transform translate-y-2" : "opacity-100 transform translate-y-0"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <Badge
                variant="outline"
                className={`text-xs font-medium ${getBadgeColor(headlines[currentHeadlineIndex].badge)}`}
              >
                {headlines[currentHeadlineIndex].badge}
              </Badge>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {headlines[currentHeadlineIndex].timestamp}
              </span>
            </div>

            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3 leading-relaxed">
              {headlines[currentHeadlineIndex].title}
            </h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#FA4616]/20 dark:bg-[#FA4616]/30 rounded-lg">
                  {getCategoryIcon(headlines[currentHeadlineIndex].category)}
                </div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {headlines[currentHeadlineIndex].category}
                </span>
              </div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {headlines[currentHeadlineIndex].source}
              </span>
            </div>
          </div>

          {/* Carousel indicators */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {headlines.slice(0, 5).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentHeadlineIndex ? "bg-[#FA4616] scale-125" : "bg-[#FA4616]/30 dark:bg-[#FA4616]/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Headlines List */}
        <div className="space-y-1">
          <div className="bg-gradient-to-b from-gray-50 to-transparent dark:from-gray-800 dark:to-transparent py-1 mb-1">
            <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
              <Newspaper className="h-3 w-3 text-[#FA4616]" />
              Latest Headlines
            </h4>
          </div>
          {headlines.slice(0, 8).map((headline, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700 hover:border-[#FA4616]/30 dark:hover:border-[#FA4616]/50 hover:shadow-sm transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Badge variant="outline" className={`text-xs flex-shrink-0 ${getBadgeColor(headline.badge)}`}>
                    {headline.badge}
                  </Badge>
                  <h4 className="text-xs font-medium text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-[#FA4616] dark:group-hover:text-[#FF8A67] transition-colors flex-1 min-w-0">
                    {headline.title}
                  </h4>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <div className="p-0.5 bg-gray-100 dark:bg-gray-700 rounded">{getCategoryIcon(headline.category)}</div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{headline.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Category Summary */}
        <div className="mt-3 bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#FA4616]/20 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#FA4616]" />
            News Categories
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {Array.from(new Set(headlines.map((h) => h.category)))
              .slice(0, 6)
              .map((category, index) => (
                <div key={index} className="flex items-center gap-1">
                  {getCategoryIcon(category)}
                  <span className="text-xs text-gray-600 dark:text-gray-400 truncate">{category}</span>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
