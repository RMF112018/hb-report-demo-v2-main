"use client"

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, DollarSign, Building, Users, Target } from "lucide-react"
import { StrategicOpportunityDetailsDrawer } from "./StrategicOpportunityDetailsDrawer"
import type { StrategicOpportunity } from "./StrategicOpportunityGrid"
import {
  LeafletMapContainer,
  LeafletTileLayer,
  LeafletMarker,
  LeafletPopup,
  LeafletZoomControl,
} from "@/components/ui/leaflet-map-wrapper"

/**
 * Map pursuit data interface
 */
export interface MapPursuit {
  id: string
  projectName: string
  clientOrg: string
  coordinates: [number, number] // [latitude, longitude]
  marketSector: string
  stage: string
  estValue: number
  assignedRep: string
  region: "North" | "Central" | "Space Coast" | "Southeast" | "Southwest"
  city: string
}

/**
 * StrategicOpportunityMapView component props
 */
export interface StrategicOpportunityMapViewProps {
  pursuits?: MapPursuit[]
  loading?: boolean
  error?: string
}

/**
 * Florida map coordinates and regions
 */
const FLORIDA_REGIONS = {
  North: {
    cities: ["Jacksonville", "Tallahassee", "Gainesville", "Pensacola"],
    bounds: { north: 31.0, south: 28.5, east: -80.5, west: -87.5 },
  },
  Central: {
    cities: ["Orlando", "Tampa", "St. Petersburg", "Lakeland", "Sarasota"],
    bounds: { north: 28.5, south: 26.5, east: -80.5, west: -83.0 },
  },
  South: {
    cities: ["Miami", "Fort Lauderdale", "West Palm Beach", "Naples", "Key West"],
    bounds: { north: 26.5, south: 24.5, east: -80.0, west: -82.0 },
  },
}

/**
 * Stage color mapping
 */
const getStageColor = (stage: string) => {
  switch (stage.toLowerCase()) {
    case "identified":
      return "fill-gray-400"
    case "prequal":
      return "fill-blue-500"
    case "proposal":
      return "fill-yellow-500"
    case "interview":
      return "fill-orange-500"
    case "awarded":
      return "fill-green-500"
    case "lost":
      return "fill-red-500"
    default:
      return "fill-gray-400"
  }
}

/**
 * Stage color for badges
 */
const getStageBadgeColor = (stage: string) => {
  switch (stage.toLowerCase()) {
    case "identified":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    case "prequal":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    case "proposal":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    case "interview":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
    case "awarded":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "lost":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }
}

/**
 * Get marker color for pursuit stage
 */
const getMarkerColor = (stage: string) => {
  switch (stage.toLowerCase()) {
    case "identified":
      return "#9CA3AF" // gray
    case "prequal":
      return "#3B82F6" // blue
    case "proposal":
      return "#EAB308" // yellow
    case "interview":
      return "#F97316" // orange
    case "awarded":
      return "#22C55E" // green
    case "lost":
      return "#EF4444" // red
    default:
      return "#9CA3AF" // gray
  }
}

/**
 * Create custom marker icon for pursuit stage
 */
const createCustomMarkerIcon = (stage: string) => {
  const color = getMarkerColor(stage)

  // Only create icon on client side
  if (typeof window !== "undefined") {
    const L = require("leaflet")
    return L.divIcon({
      html: `
        <div style="
          width: 20px;
          height: 20px;
          background-color: ${color};
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          cursor: pointer;
        ">
          <div style="
            width: 8px;
            height: 8px;
            background-color: white;
            border-radius: 50%;
          "></div>
        </div>
      `,
      className: "custom-marker",
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    })
  }

  // Fallback for SSR
  return undefined
}

/**
 * StrategicOpportunityMapView Component
 * Displays a geographic map of Florida with interactive pursuit pins
 */
export function StrategicOpportunityMapView({
  pursuits = [],
  loading = false,
  error,
}: StrategicOpportunityMapViewProps) {
  const [selectedPursuit, setSelectedPursuit] = useState<MapPursuit | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [selectedSector, setSelectedSector] = useState<string>("all")
  const [selectedRep, setSelectedRep] = useState<string>("all")
  const [hoveredPursuit, setHoveredPursuit] = useState<string | null>(null)
  const mapRef = useRef<any>(null)
  const [mapInstance, setMapInstance] = useState<any>(null)

  // Mock Florida pursuits data
  const mockPursuits: MapPursuit[] = useMemo(
    () => [
      {
        id: "1",
        projectName: "Orlando Luxury Tower",
        clientOrg: "Sunstate Partners",
        coordinates: [28.5383, -81.3792],
        marketSector: "Luxury Residential",
        stage: "Proposal",
        estValue: 64000000,
        assignedRep: "Sarah Johnson",
        region: "Central",
        city: "Orlando",
      },
      {
        id: "2",
        projectName: "Tampa Medical Campus",
        clientOrg: "HealthSouth East",
        coordinates: [27.9506, -82.4572],
        marketSector: "Healthcare",
        stage: "Prequal",
        estValue: 45000000,
        assignedRep: "Mike Chen",
        region: "Central",
        city: "Tampa",
      },
      {
        id: "3",
        projectName: "Miami Beach Resort",
        clientOrg: "Coastal Development",
        coordinates: [25.7617, -80.1918],
        marketSector: "Hospitality",
        stage: "Interview",
        estValue: 85000000,
        assignedRep: "Lisa Rodriguez",
        region: "Southeast",
        city: "Miami",
      },
      {
        id: "4",
        projectName: "Jacksonville Industrial Park",
        clientOrg: "Logistics Solutions Inc",
        coordinates: [30.3322, -81.6557],
        marketSector: "Industrial",
        stage: "Identified",
        estValue: 28000000,
        assignedRep: "David Thompson",
        region: "North",
        city: "Jacksonville",
      },
      {
        id: "5",
        projectName: "Fort Lauderdale Office Complex",
        clientOrg: "Metro Development Corp",
        coordinates: [26.1224, -80.1373],
        marketSector: "Commercial",
        stage: "Awarded",
        estValue: 52000000,
        assignedRep: "Jennifer Lee",
        region: "Southeast",
        city: "Fort Lauderdale",
      },
      {
        id: "6",
        projectName: "Tallahassee Government Center",
        clientOrg: "State of Florida",
        coordinates: [30.4383, -84.2807],
        marketSector: "Government",
        stage: "Lost",
        estValue: 35000000,
        assignedRep: "Robert Wilson",
        region: "North",
        city: "Tallahassee",
      },
      {
        id: "7",
        projectName: "Cape Canaveral Space Center",
        clientOrg: "NASA",
        coordinates: [28.3889, -80.6044],
        marketSector: "Government",
        stage: "Proposal",
        estValue: 75000000,
        assignedRep: "Sarah Johnson",
        region: "Space Coast",
        city: "Cape Canaveral",
      },
      {
        id: "8",
        projectName: "Naples Luxury Resort",
        clientOrg: "Gulf Coast Development",
        coordinates: [26.142, -81.7948],
        marketSector: "Hospitality",
        stage: "Identified",
        estValue: 95000000,
        assignedRep: "Mike Chen",
        region: "Southwest",
        city: "Naples",
      },
    ],
    []
  )

  // Use provided pursuits or mock data
  const displayPursuits = pursuits.length > 0 ? pursuits : mockPursuits

  // Filter pursuits based on selected filters
  const filteredPursuits = useMemo(() => {
    return displayPursuits.filter((pursuit) => {
      const regionMatch = selectedRegion === "all" || pursuit.region === selectedRegion
      const sectorMatch = selectedSector === "all" || pursuit.marketSector === selectedSector
      const repMatch = selectedRep === "all" || pursuit.assignedRep === selectedRep
      return regionMatch && sectorMatch && repMatch
    })
  }, [displayPursuits, selectedRegion, selectedSector, selectedRep])

  // Get unique sectors, regions, and reps for filters
  const sectors = useMemo(() => {
    const uniqueSectors = [...new Set(displayPursuits.map((p) => p.marketSector))]
    return uniqueSectors.sort()
  }, [displayPursuits])

  const regions = ["North", "Central", "Space Coast", "Southeast", "Southwest"]

  const reps = useMemo(() => {
    const uniqueReps = [...new Set(displayPursuits.map((p) => p.assignedRep))]
    return uniqueReps.sort()
  }, [displayPursuits])

  // Handle pursuit click
  const handlePursuitClick = (pursuit: MapPursuit) => {
    setSelectedPursuit(pursuit)
    setIsDrawerOpen(true)
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Convert MapPursuit to StrategicOpportunity for drawer
  const convertToStrategicOpportunity = (pursuit: MapPursuit): StrategicOpportunity => {
    return {
      id: pursuit.id,
      projectName: pursuit.projectName,
      clientOrg: pursuit.clientOrg,
      regionCity: `${pursuit.city}, FL`,
      marketSector: pursuit.marketSector,
      stage: pursuit.stage,
      estimatedValue: pursuit.estValue,
      probabilityPercent: pursuit.stage === "Awarded" ? 100 : pursuit.stage === "Lost" ? 0 : 50,
      forecastCloseDate: "2024-12-31", // Mock date
      assignedRep: pursuit.assignedRep,
      tags: [pursuit.region, pursuit.marketSector],
    }
  }

  // Fit map bounds to filtered pursuits
  const fitMapBounds = useCallback(() => {
    if (!mapInstance || filteredPursuits.length === 0) {
      return
    }

    try {
      // Use the map instance's built-in methods instead of L
      const bounds = mapInstance.getBounds()
      if (bounds) {
        // Fit bounds with smooth animation
        mapInstance.fitBounds(bounds, {
          animate: true,
          duration: 0.5,
          maxZoom: 10, // Prevent excessive zoom
        })
      }
    } catch (error) {
      console.warn("Error fitting map bounds:", error)
    }
  }, [mapInstance, filteredPursuits])

  // Debounced effect to fit bounds when filtered pursuits change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fitMapBounds()
    }, 300) // 300ms debounce

    return () => clearTimeout(timeoutId)
  }, [fitMapBounds])

  // Reset to default view when no pursuits are visible
  const resetToDefaultView = useCallback(() => {
    if (!mapInstance) return

    try {
      mapInstance.setView([27.9944024, -81.7602544], 6, {
        animate: true,
        duration: 0.5,
      })
    } catch (error) {
      console.warn("Error resetting map view:", error)
    }
  }, [mapInstance])

  // Handle map when no pursuits are visible
  useEffect(() => {
    if (filteredPursuits.length === 0) {
      const timeoutId = setTimeout(() => {
        resetToDefaultView()
      }, 300)

      return () => clearTimeout(timeoutId)
    }
  }, [filteredPursuits.length, resetToDefaultView])

  // Cleanup map instance on unmount
  useEffect(() => {
    return () => {
      if (mapInstance) {
        try {
          mapInstance.remove()
        } catch (error) {
          console.warn("Error removing map instance:", error)
        }
      }
    }
  }, [mapInstance])

  // Check if we're on the client side
  const isClient = typeof window !== "undefined"

  // Add custom marker styles
  useEffect(() => {
    if (isClient) {
      const style = document.createElement("style")
      style.textContent = `
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        .custom-marker div {
          transition: all 0.2s ease;
        }
        .custom-marker:hover div {
          transform: scale(1.2);
          box-shadow: 0 4px 8px rgba(0,0,0,0.4);
        }
      `
      document.head.appendChild(style)
      return () => {
        if (document.head.contains(style)) {
          document.head.removeChild(style)
        }
      }
    }
  }, [isClient])

  if (loading) {
    return (
      <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading map...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <CardContent className="p-8">
          <div className="text-center text-red-600 dark:text-red-400">
            <MapPin className="h-8 w-8 mx-auto mb-2" />
            <p>Error loading map: {error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center relative z-20">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Region:</span>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-[1000]">
              <SelectItem value="all">All Regions</SelectItem>
              {regions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Market Sector:</span>
          <Select value={selectedSector} onValueChange={setSelectedSector}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-[1000]">
              <SelectItem value="all">All Sectors</SelectItem>
              {sectors.map((sector) => (
                <SelectItem key={sector} value={sector}>
                  {sector}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">BD Rep:</span>
          <Select value={selectedRep} onValueChange={setSelectedRep}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-[1000]">
              <SelectItem value="all">All Reps</SelectItem>
              {reps.map((rep) => (
                <SelectItem key={rep} value={rep}>
                  {rep}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Badge variant="outline" className="text-xs">
            {filteredPursuits.length} pursuits
          </Badge>
        </div>
      </div>

      {/* Map Container */}
      <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Florida Strategic Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-[600px] bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
            {!isClient ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
                </div>
              </div>
            ) : (
              <div className="relative z-30 w-full h-full">
                <LeafletMapContainer
                  key="strategic-opportunity-map"
                  center={[27.9944024, -81.7602544]} // Florida centroid
                  zoom={6}
                  className="w-full h-full"
                  zoomControl={false}
                  ref={mapRef}
                  whenCreated={(map) => setMapInstance(map)}
                >
                  <LeafletTileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LeafletZoomControl position="bottomright" />

                  {/* Pursuit Markers */}
                  {filteredPursuits.map((pursuit) => {
                    const customIcon = createCustomMarkerIcon(pursuit.stage)
                    return (
                      <LeafletMarker
                        key={pursuit.id}
                        position={[pursuit.coordinates[0], pursuit.coordinates[1]]}
                        icon={customIcon}
                        eventHandlers={{
                          click: () => handlePursuitClick(pursuit),
                        }}
                      >
                        <LeafletPopup>
                          <div className="p-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                              {pursuit.projectName}
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{pursuit.clientOrg}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{pursuit.city}</p>
                            <p className="text-xs font-medium text-gray-900 dark:text-white mt-1">
                              {formatCurrency(pursuit.estValue)}
                            </p>
                            <Badge className={`${getStageBadgeColor(pursuit.stage)} text-xs mt-1`}>
                              {pursuit.stage}
                            </Badge>
                          </div>
                        </LeafletPopup>
                      </LeafletMarker>
                    )
                  })}
                </LeafletMapContainer>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg border border-gray-200 dark:border-gray-700 z-[1000]">
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Stage Legend</div>
                  <div className="space-y-1">
                    {[
                      { stage: "Identified", color: "#9CA3AF" },
                      { stage: "Prequal", color: "#3B82F6" },
                      { stage: "Proposal", color: "#EAB308" },
                      { stage: "Interview", color: "#F97316" },
                      { stage: "Awarded", color: "#22C55E" },
                      { stage: "Lost", color: "#EF4444" },
                    ].map((item) => (
                      <div key={item.stage} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full border border-white shadow-sm"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{item.stage}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Strategic Opportunity Details Drawer */}
      {selectedPursuit && (
        <StrategicOpportunityDetailsDrawer
          opportunity={convertToStrategicOpportunity(selectedPursuit)}
          open={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
        />
      )}
    </div>
  )
}
