"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Users, Star, MapPin, Clock, TrendingUp, Building2, ChevronRight, Activity, X } from "lucide-react"
import type { DashboardCard } from "@/types/dashboard"
import { useState, useEffect } from "react"

interface BDOpportunitiesCardProps {
  card: DashboardCard
  config?: any
  span?: any
  isCompact?: boolean
  userRole?: string
}

interface BDEvent {
  id: string
  name: string
  date: string
  location: string
  type: 'Golf' | 'Networking' | 'Dinner' | 'Polo' | 'Conference' | 'Awards'
  totalSeats: number
  availableSeats: number
  priority: 'High' | 'Medium' | 'Low'
  potentialValue: number
  attendees: string[]
  description: string
}

export function BDOpportunitiesCard({ card, config, span, isCompact, userRole }: BDOpportunitiesCardProps) {
  const [showDrillDown, setShowDrillDown] = useState(false)

  // Listen for drill down events from DashboardCardWrapper
  useEffect(() => {
    const handleDrillDownEvent = (event: CustomEvent) => {
      if (event.detail.cardId === card.id || event.detail.cardType === 'bd-opportunities') {
        const shouldShow = event.detail.action === 'show'
        setShowDrillDown(shouldShow)
        
        // Notify wrapper of state change
        const stateEvent = new CustomEvent('cardDrillDownStateChange', {
          detail: {
            cardId: card.id,
            cardType: 'bd-opportunities',
            isActive: shouldShow
          }
        })
        window.dispatchEvent(stateEvent)
      }
    };

    window.addEventListener('cardDrillDown', handleDrillDownEvent as EventListener);
    
    return () => {
      window.removeEventListener('cardDrillDown', handleDrillDownEvent as EventListener);
    };
  }, [card.id]);

  // Function to handle closing the drill down overlay
  const handleCloseDrillDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDrillDown(false)
    
    // Notify wrapper that drill down is closed
    const stateEvent = new CustomEvent('cardDrillDownStateChange', {
      detail: {
        cardId: card.id,
        cardType: 'bd-opportunities',
        isActive: false
      }
    })
    window.dispatchEvent(stateEvent)
  }

  const getRoleBasedData = () => {
    const role = userRole || 'project-executive'
    
    const baseEvents: BDEvent[] = [
      {
        id: 'bd-1',
        name: 'Miami Beach Golf Classic',
        date: '2025-01-15',
        location: 'Doral Golf Resort & Spa',
        type: 'Golf',
        totalSeats: 4,
        availableSeats: 2,
        priority: 'High',
        potentialValue: 3200000,
        attendees: ['Carlos Rodriguez', 'Maria Fernandez'],
        description: 'Premier golf event with South Florida developers and luxury residential contractors'
      },
      {
        id: 'bd-2',
        name: 'ABC Florida Chapter Gala',
        date: '2025-01-22',
        location: 'The Breakers Palm Beach',
        type: 'Dinner',
        totalSeats: 8,
        availableSeats: 3,
        priority: 'High',
        potentialValue: 6500000,
        attendees: ['Isabella Martinez', 'Roberto Silva', 'Ana Gutierrez', 'Diego Morales', 'Sofia Delgado'],
        description: 'Annual gala dinner with Florida construction leaders and luxury hospitality developers'
      },
      {
        id: 'bd-3',
        name: 'Wellington Polo Championships',
        date: '2025-01-28',
        location: 'International Polo Club Palm Beach',
        type: 'Polo',
        totalSeats: 6,
        availableSeats: 1,
        priority: 'Medium',
        potentialValue: 4800000,
        attendees: ['Eduardo Herrera', 'Valentina Castro', 'Miguel Santos', 'Lucia Vega', 'Fernando Ramirez'],
        description: 'Exclusive polo event with high-net-worth clients and luxury estate developers'
      },
      {
        id: 'bd-4',
        name: 'Florida Construction Excellence Awards',
        date: '2025-02-05',
        location: 'Greater Fort Lauderdale Convention Center',
        type: 'Awards',
        totalSeats: 10,
        availableSeats: 4,
        priority: 'High',
        potentialValue: 9500000,
        attendees: ['Carmen Jimenez', 'Ricardo Torres', 'Alejandra Moreno', 'Javier Mendez', 'Catalina Ruiz', 'Andres Vargas'],
        description: 'Annual awards ceremony recognizing excellence in Florida construction and development'
      },
      {
        id: 'bd-5',
        name: 'Brickell Business Network Mixer',
        date: '2025-02-12',
        location: 'Four Seasons Hotel Miami',
        type: 'Networking',
        totalSeats: 5,
        availableSeats: 2,
        priority: 'Medium',
        potentialValue: 2800000,
        attendees: ['Gabriela Pacheco', 'Santiago Navarro', 'Daniela Cruz'],
        description: 'Monthly networking event for Miami commercial construction professionals'
      },
      {
        id: 'bd-6',
        name: 'Southeast Florida Real Estate Summit',
        date: '2025-02-18',
        location: 'Fontainebleau Miami Beach',
        type: 'Conference',
        totalSeats: 12,
        availableSeats: 5,
        priority: 'High',
        potentialValue: 15000000,
        attendees: ['Mateo Guerrero', 'Esperanza Flores', 'Nicolas Cabrera', 'Camila Rios', 'Rafael Medina', 'Valeria Soto', 'Adrian Peña'],
        description: 'Premier real estate conference with Southeast Florida developers, investors, and luxury resort contractors'
      }
    ]

    // Sort events by date
    return baseEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  const events = getRoleBasedData()
  const totalSeats = events.reduce((sum, event) => sum + event.totalSeats, 0)
  const totalAvailable = events.reduce((sum, event) => sum + event.availableSeats, 0)
  const utilizationRate = ((totalSeats - totalAvailable) / totalSeats) * 100
  const totalPotentialValue = events.reduce((sum, event) => sum + event.potentialValue, 0)
  const highPriorityEvents = events.filter(event => event.priority === 'High')

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'Golf': return '⛳'
      case 'Polo': return '🏇'
      case 'Dinner': return '🍽️'
      case 'Networking': return '🤝'
      case 'Conference': return '🏢'
      case 'Awards': return '🏆'
      default: return '📅'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800 dark:border-red-800'
      case 'Medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800 dark:border-yellow-800'
      case 'Low': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800 dark:border-green-800'
      default: return 'bg-muted text-muted-foreground border-border'
    }
  }

  return (
    <div 
      className="relative h-full"
      data-tour="bd-opportunities-card"
    >
      <div className="h-full flex flex-col bg-transparent overflow-hidden">
        {/* BD Stats Header */}
        <div className="flex-shrink-0 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center gap-2 mb-1 sm:mb-1.5 lg:mb-2">
            <Badge className="bg-gray-600 text-white border-gray-600 text-xs">
              <Activity className="h-3 w-3 mr-1" />
              BD Opportunities
            </Badge>
            <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              {formatCurrency(totalPotentialValue)} Pipeline
            </div>
            <div className="flex items-center gap-1 ml-auto">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 dark:border-blue-800 text-xs">
                {totalAvailable} Available
              </Badge>
            </div>
          </div>
          
          {/* Compact Stats */}
          <div className="grid grid-cols-2 gap-1 sm:gap-1.5 lg:gap-2">
            <div className="text-center p-1.5 sm:p-2 lg:p-2.5 bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
              <div className="text-lg sm:text-xl lg:text-lg sm:text-xl lg:text-2xl font-medium text-blue-600 dark:text-blue-400">{events.length}</div>
              <div className="text-xs text-muted-foreground">Upcoming Events</div>
              <div className="text-xs text-blue-600 dark:text-blue-400">{highPriorityEvents.length} high priority</div>
            </div>
            <div className="text-center p-1.5 sm:p-2 lg:p-2.5 bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
              <div className="text-lg sm:text-xl lg:text-lg sm:text-xl lg:text-2xl font-medium text-blue-600 dark:text-blue-400">{utilizationRate.toFixed(0)}%</div>
              <div className="text-xs text-muted-foreground">Seat Utilization</div>
              <div className="text-xs text-blue-600 dark:text-blue-400">{totalAvailable} of {totalSeats} available</div>
            </div>
          </div>
        </div>

        {/* BD Content */}
        <div className="flex-1 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 overflow-y-auto">
          <div className="space-y-3">
            {/* Next 3 Events */}
            <div className="bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 p-1.5 sm:p-2 lg:p-2.5">
              <h4 className="font-semibold mb-2 text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Next 3 Events
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {events.slice(0, 3).map((event) => (
                  <div key={event.id} className="flex justify-between items-center p-2 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getEventIcon(event.type)}</span>
                      <div>
                        <div className="text-sm font-medium text-foreground">{event.name}</div>
                        <div className="text-xs text-muted-foreground">{formatDate(event.date)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {event.availableSeats}/{event.totalSeats}
                      </div>
                      <Badge className={`text-xs ${getPriorityColor(event.priority)}`}>
                        {event.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pipeline Value */}
            <div className="bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 p-1.5 sm:p-2 lg:p-2.5">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Pipeline Value
                </span>
                <div className="text-right">
                  <div className="text-sm sm:text-base lg:text-sm sm:text-base lg:text-lg font-medium text-blue-600 dark:text-blue-400">{formatCurrency(totalPotentialValue)}</div>
                  <div className="text-xs text-muted-foreground">Total opportunity</div>
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center p-2 bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
                <div className="text-sm font-medium text-foreground">{highPriorityEvents.length}</div>
                <div className="text-xs text-muted-foreground">High Priority</div>
              </div>
              <div className="text-center p-2 bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
                <div className="text-sm font-medium text-foreground">{events.filter(e => new Date(e.date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length}</div>
                <div className="text-xs text-muted-foreground">This Week</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Drill-Down Overlay */}
      {showDrillDown && (
        <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-sm rounded-lg p-2 sm:p-1.5 sm:p-2 lg:p-2.5 lg:p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 text-white transition-all duration-300 ease-in-out overflow-y-auto z-50">
          <div className="h-full">
            <h3 className="text-base sm:text-lg lg:text-base sm:text-lg lg:text-xl font-medium mb-1.5 sm:mb-2 lg:mb-1 sm:mb-1.5 lg:mb-2 text-center">BD Opportunities Deep Analysis</h3>
            
            <div className="grid grid-cols-2 gap-2 sm:gap-1 sm:gap-1.5 lg:gap-2 lg:gap-1.5 sm:gap-2 lg:gap-1 sm:gap-1.5 lg:gap-2 h-[calc(100%-60px)]">
              {/* All Events */}
              <div className="space-y-4">
                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <Building2 className="w-4 h-4 mr-2" />
                    All Upcoming Events
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto text-sm">
                    {events.map((event) => (
                      <div key={event.id} className="p-1.5 rounded bg-white/20 dark:bg-black/20 border border-white/20 dark:border-black/20">
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{getEventIcon(event.type)}</span>
                            <div>
                              <div className="text-xs font-medium text-white">{event.name}</div>
                              <div className="text-xs text-blue-200 flex items-center gap-2">
                                <Calendar className="h-2 w-2" />
                                {formatDate(event.date)}
                                <MapPin className="h-2 w-2" />
                                {event.location}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-blue-300">{formatCurrency(event.potentialValue)}</div>
                            <div className="text-xs text-white">{event.availableSeats}/{event.totalSeats} seats</div>
                          </div>
                        </div>
                        
                        <div className="text-xs text-blue-200 mb-1">{event.description}</div>
                        
                        <div className="flex justify-between items-center">
                          <div className="text-xs text-blue-300">
                            {event.totalSeats - event.availableSeats} attending
                          </div>
                          <Progress 
                            value={((event.totalSeats - event.availableSeats) / event.totalSeats) * 100} 
                            className="w-12 h-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Summary Analytics */}
              <div className="space-y-4">
                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Pipeline Analytics
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Pipeline Value:</span>
                      <span className="font-medium text-green-400">{formatCurrency(totalPotentialValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>High Priority Events:</span>
                      <span className="font-medium text-red-400">{highPriorityEvents.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Seat Utilization:</span>
                      <span className="font-medium text-blue-400">{utilizationRate.toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>This Week Events:</span>
                      <span className="font-medium text-yellow-400">{events.filter(e => new Date(e.date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Event Types
                  </h4>
                  <div className="space-y-2 text-sm">
                    {['Golf', 'Dinner', 'Networking', 'Conference', 'Awards', 'Polo'].map(type => {
                      const typeEvents = events.filter(e => e.type === type);
                      if (typeEvents.length === 0) return null;
                      return (
                        <div key={type} className="flex justify-between">
                          <span>{type}:</span>
                          <span className="font-medium text-purple-300">{typeEvents.length} events</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <Star className="w-4 h-4 mr-2" />
                    Key Insights
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="text-blue-200">
                      <p className="font-medium mb-1">Recommendations:</p>
                      <ul className="text-xs space-y-1 list-disc list-inside">
                        <li>Focus on {highPriorityEvents.length} high priority events</li>
                        <li>Current utilization rate: {utilizationRate.toFixed(0)}%</li>
                        <li>Pipeline value: {formatCurrency(totalPotentialValue)}</li>
                        <li>{events.filter(e => new Date(e.date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length} events this week</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Close Button */}
            <div className="absolute bottom-4 right-4">
              <button
                onClick={handleCloseDrillDown}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 