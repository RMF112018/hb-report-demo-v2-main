"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  MapPin,
  Building2,
  Heart,
  School,
  Home,
  Factory,
  Eye,
  DollarSign,
  Calendar,
  Users,
  TrendingUp,
  Filter,
} from "lucide-react"

interface BDOpportunity {
  id: string
  location: string
  value: number
  stage: string
  market: string
  clientName: string
  bdRep: string
  estimatedAwardDate: string
  probability: number
  coordinates: { x: number; y: number }
}

interface BetaBDOpportunityMapCardProps {
  opportunities?: BDOpportunity[]
  className?: string
}

// Florida map coordinates (simplified grid layout)
const FLORIDA_LOCATIONS = {
  Miami: { x: 85, y: 20 },
  "Fort Lauderdale": { x: 80, y: 25 },
  "West Palm Beach": { x: 75, y: 30 },
  Orlando: { x: 60, y: 45 },
  Tampa: { x: 45, y: 35 },
  "St. Petersburg": { x: 42, y: 32 },
  Jacksonville: { x: 25, y: 50 },
  Gainesville: { x: 35, y: 55 },
  Tallahassee: { x: 20, y: 60 },
  Pensacola: { x: 15, y: 70 },
  "Fort Myers": { x: 50, y: 25 },
  Naples: { x: 55, y: 15 },
  Sarasota: { x: 48, y: 30 },
  "Daytona Beach": { x: 65, y: 40 },
  Melbourne: { x: 70, y: 35 },
  "Port St. Lucie": { x: 75, y: 35 },
  "Boca Raton": { x: 78, y: 28 },
  "Coral Gables": { x: 82, y: 22 },
  Hollywood: { x: 82, y: 24 },
  "Pompano Beach": { x: 80, y: 26 },
}

const MARKET_COLORS = {
  Commercial: "bg-blue-500",
  Healthcare: "bg-green-500",
  Education: "bg-purple-500",
  Residential: "bg-orange-500",
  Industrial: "bg-red-500",
  Government: "bg-indigo-500",
}

const MARKET_ICONS = {
  Commercial: Building2,
  Healthcare: Heart,
  Education: School,
  Residential: Home,
  Industrial: Factory,
  Government: Building2,
}

const STAGE_COLORS = {
  Identified: "border-gray-400",
  Qualified: "border-yellow-400",
  Proposal: "border-blue-400",
  Interview: "border-purple-400",
  Award: "border-green-400",
  Prequal: "border-orange-400",
}

export function BetaBDOpportunityMapCard({ opportunities = [], className = "" }: BetaBDOpportunityMapCardProps) {
  const [selectedMarket, setSelectedMarket] = useState<string>("all")
  const [selectedStage, setSelectedStage] = useState<string>("all")
  const [hoveredOpportunity, setHoveredOpportunity] = useState<string | null>(null)

  // Mock opportunities data
  const defaultOpportunities: BDOpportunity[] = [
    {
      id: "opp-001",
      location: "Orlando",
      value: 18000000,
      stage: "Proposal",
      market: "Commercial",
      clientName: "Orlando Tech Campus",
      bdRep: "M. Alvarez",
      estimatedAwardDate: "2025-09-15",
      probability: 75,
      coordinates: FLORIDA_LOCATIONS["Orlando"],
    },
    {
      id: "opp-002",
      location: "Miami",
      value: 32000000,
      stage: "Prequal",
      market: "Healthcare",
      clientName: "Miami Health HQ",
      bdRep: "D. Chen",
      estimatedAwardDate: "2025-10-20",
      probability: 60,
      coordinates: FLORIDA_LOCATIONS["Miami"],
    },
    {
      id: "opp-003",
      location: "Tampa",
      value: 25000000,
      stage: "Interview",
      market: "Education",
      clientName: "USF Research Center",
      bdRep: "S. Johnson",
      estimatedAwardDate: "2025-08-30",
      probability: 85,
      coordinates: FLORIDA_LOCATIONS["Tampa"],
    },
    {
      id: "opp-004",
      location: "Jacksonville",
      value: 15000000,
      stage: "Qualified",
      market: "Government",
      clientName: "JAX Port Expansion",
      bdRep: "R. Williams",
      estimatedAwardDate: "2025-11-15",
      probability: 45,
      coordinates: FLORIDA_LOCATIONS["Jacksonville"],
    },
    {
      id: "opp-005",
      location: "Fort Lauderdale",
      value: 22000000,
      stage: "Proposal",
      market: "Residential",
      clientName: "Broward Luxury Towers",
      bdRep: "L. Rodriguez",
      estimatedAwardDate: "2025-09-25",
      probability: 70,
      coordinates: FLORIDA_LOCATIONS["Fort Lauderdale"],
    },
    {
      id: "opp-006",
      location: "Gainesville",
      value: 12000000,
      stage: "Identified",
      market: "Healthcare",
      clientName: "UF Medical Center",
      bdRep: "K. Thompson",
      estimatedAwardDate: "2025-12-10",
      probability: 30,
      coordinates: FLORIDA_LOCATIONS["Gainesville"],
    },
    {
      id: "opp-007",
      location: "Sarasota",
      value: 18000000,
      stage: "Award",
      market: "Commercial",
      clientName: "Sarasota Arts Complex",
      bdRep: "P. Martinez",
      estimatedAwardDate: "2025-07-15",
      probability: 95,
      coordinates: FLORIDA_LOCATIONS["Sarasota"],
    },
    {
      id: "opp-008",
      location: "Daytona Beach",
      value: 9000000,
      stage: "Qualified",
      market: "Industrial",
      clientName: "Daytona Manufacturing",
      bdRep: "T. Anderson",
      estimatedAwardDate: "2025-10-05",
      probability: 55,
      coordinates: FLORIDA_LOCATIONS["Daytona Beach"],
    },
  ]

  const opportunityData = opportunities.length > 0 ? opportunities : defaultOpportunities

  // Filter opportunities based on selected filters
  const filteredOpportunities = useMemo(() => {
    return opportunityData.filter((opp) => {
      const marketMatch = selectedMarket === "all" || opp.market === selectedMarket
      const stageMatch = selectedStage === "all" || opp.stage === selectedStage
      return marketMatch && stageMatch
    })
  }, [opportunityData, selectedMarket, selectedStage])

  // Calculate total value and count
  const totalValue = useMemo(() => {
    return filteredOpportunities.reduce((sum, opp) => sum + opp.value, 0)
  }, [filteredOpportunities])

  const totalCount = filteredOpportunities.length

  // Get unique markets and stages for filters
  const markets = useMemo(() => {
    return Array.from(new Set(opportunityData.map((opp) => opp.market)))
  }, [opportunityData])

  const stages = useMemo(() => {
    return Array.from(new Set(opportunityData.map((opp) => opp.stage)))
  }, [opportunityData])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getPinSize = (value: number) => {
    if (value >= 30000000) return "w-6 h-6"
    if (value >= 20000000) return "w-5 h-5"
    if (value >= 10000000) return "w-4 h-4"
    return "w-3 h-3"
  }

  const handleOpportunityClick = (opportunity: BDOpportunity) => {
    console.log(`View details for ${opportunity.clientName} in ${opportunity.location}`)
    // In a real implementation, this would open a detailed view
  }

  return (
    <Card
      className={`bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 border-blue-200 dark:border-blue-800 ${className}`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <MapPin className="h-5 w-5" />
              Opportunity Map
            </CardTitle>
            <CardDescription className="text-blue-600 dark:text-blue-400">
              Geographic distribution of active BD pursuits
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {totalCount} opportunities
            </Badge>
            <Badge variant="outline" className="text-xs">
              {formatCurrency(totalValue)}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-blue-600" />
            <select
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              className="text-xs border border-blue-200 rounded px-2 py-1 bg-white dark:bg-slate-800 dark:border-blue-700"
            >
              <option value="all">All Markets</option>
              {markets.map((market) => (
                <option key={market} value={market}>
                  {market}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="text-xs border border-blue-200 rounded px-2 py-1 bg-white dark:bg-slate-800 dark:border-blue-700"
            >
              <option value="all">All Stages</option>
              {stages.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Florida Map */}
        <div className="relative bg-white dark:bg-slate-800 rounded-lg border border-blue-200 dark:border-blue-700 p-4">
          <div className="relative w-full h-64 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg overflow-hidden">
            {/* Florida outline (simplified) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-32 bg-blue-100 dark:bg-blue-900 rounded-lg opacity-20"></div>
            </div>

            {/* Opportunity Pins */}
            <TooltipProvider>
              {filteredOpportunities.map((opportunity) => {
                const IconComponent = MARKET_ICONS[opportunity.market as keyof typeof MARKET_ICONS] || Building2
                const marketColor = MARKET_COLORS[opportunity.market as keyof typeof MARKET_COLORS] || "bg-gray-500"
                const stageColor = STAGE_COLORS[opportunity.stage as keyof typeof STAGE_COLORS] || "border-gray-400"
                const pinSize = getPinSize(opportunity.value)

                return (
                  <Tooltip key={opportunity.id}>
                    <TooltipTrigger asChild>
                      <div
                        className={`absolute cursor-pointer transition-all duration-200 hover:scale-110 ${pinSize}`}
                        style={{
                          left: `${opportunity.coordinates.x}%`,
                          top: `${opportunity.coordinates.y}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                        onMouseEnter={() => setHoveredOpportunity(opportunity.id)}
                        onMouseLeave={() => setHoveredOpportunity(null)}
                        onClick={() => handleOpportunityClick(opportunity)}
                      >
                        <div
                          className={`relative ${marketColor} ${stageColor} rounded-full border-2 border-white dark:border-slate-800 shadow-lg flex items-center justify-center text-white`}
                        >
                          <IconComponent className="w-3 h-3" />
                          {hoveredOpportunity === opportunity.id && (
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-700 rounded px-2 py-1 text-xs shadow-lg whitespace-nowrap z-10">
                              {opportunity.clientName}
                            </div>
                          )}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <div className="space-y-1">
                        <div className="font-medium">{opportunity.clientName}</div>
                        <div className="text-xs text-muted-foreground">{opportunity.location}</div>
                        <div className="flex items-center gap-1 text-xs">
                          <DollarSign className="w-3 h-3" />
                          {formatCurrency(opportunity.value)}
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <Users className="w-3 h-3" />
                          {opportunity.bdRep}
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <Calendar className="w-3 h-3" />
                          {opportunity.stage} • {opportunity.probability}%
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </TooltipProvider>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <div className="font-medium mb-2 text-blue-800 dark:text-blue-200">Markets</div>
            <div className="space-y-1">
              {Object.entries(MARKET_COLORS).map(([market, color]) => {
                const IconComponent = MARKET_ICONS[market as keyof typeof MARKET_ICONS] || Building2
                return (
                  <div key={market} className="flex items-center gap-2">
                    <div className={`w-3 h-3 ${color} rounded-full flex items-center justify-center`}>
                      <IconComponent className="w-2 h-2 text-white" />
                    </div>
                    <span className="text-blue-700 dark:text-blue-300">{market}</span>
                  </div>
                )
              })}
            </div>
          </div>
          <div>
            <div className="font-medium mb-2 text-blue-800 dark:text-blue-200">Stages</div>
            <div className="space-y-1">
              {Object.entries(STAGE_COLORS).map(([stage, color]) => (
                <div key={stage} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full border-2 ${color}`}></div>
                  <span className="text-blue-700 dark:text-blue-300">{stage}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 pt-2 border-t border-blue-200 dark:border-blue-700">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{totalCount}</div>
            <div className="text-xs text-blue-600 dark:text-blue-400">Opportunities</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{formatCurrency(totalValue)}</div>
            <div className="text-xs text-green-600 dark:text-green-400">Total Value</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">
              {totalCount > 0
                ? Math.round(filteredOpportunities.reduce((sum, opp) => sum + opp.probability, 0) / totalCount)
                : 0}
              %
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-400">Avg Probability</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
