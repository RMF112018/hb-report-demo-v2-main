"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  MapPin, 
  Target, 
  BarChart3,
  Users,
  Award,
  AlertTriangle,
  Zap,
  Brain
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";

// Import the market intel data
import marketIntelData from "@/data/mock/intel/marketIntel.json";

interface MarketIntelligenceProps {
  card?: { id: string; type: string; title: string };
  config?: any;
  span?: { cols: number; rows: number };
  isCompact?: boolean;
}

const COLORS = {
  residential: "#06b6d4",
  commercial: "hsl(var(--chart-5))",
  construction: "hsl(var(--chart-1))",
  luxury: "hsl(var(--chart-3))",
  up: "hsl(var(--chart-1))",
  down: "hsl(var(--chart-4))",
  stable: "#6b7280",
  new: "hsl(var(--chart-2))"
};

const MARKET_COLORS = ["hsl(var(--chart-2))", "hsl(var(--chart-5))", "hsl(var(--chart-1))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "#06b6d4"];

export function MarketIntelligence({ card, config = {}, span, isCompact = false }: MarketIntelligenceProps) {
  const [showDrillDown, setShowDrillDown] = useState(false);

  // Listen for drill down events from DashboardCardWrapper
  useEffect(() => {
    if (!card) return;
    
    const handleDrillDownEvent = (event: CustomEvent) => {
      if (event.detail.cardId === card.id || event.detail.cardType === 'market-intelligence') {
        const shouldShow = event.detail.action === 'show'
        setShowDrillDown(shouldShow)
        
        // Notify wrapper of state change
        const stateEvent = new CustomEvent('cardDrillDownStateChange', {
          detail: {
            cardId: card.id,
            cardType: 'market-intelligence',
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
  }, [card]);

  // Function to handle closing the drill down overlay
  const handleCloseDrillDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDrillDown(false)
    
    if (!card) return;
    
    // Notify wrapper that drill down is closed
    const stateEvent = new CustomEvent('cardDrillDownStateChange', {
      detail: {
        cardId: card.id,
        cardType: 'market-intelligence',
        isActive: false
      }
    })
    window.dispatchEvent(stateEvent)
  }
  
  const analytics = useMemo(() => {
    // Aggregate market data by type and location
    const marketsByType = marketIntelData.reduce((acc, market) => {
      const type = market.title.includes('Luxury') ? 'Luxury Residential' :
                   market.title.includes('Residential') ? 'Residential' :
                   market.title.includes('Commercial') ? 'Commercial' : 'Construction';
      
      if (!acc[type]) {
        acc[type] = { markets: [], totalGrowth: 0, totalShare: 0, avgBidSuccess: 0 };
      }
      acc[type].markets.push(market);
      acc[type].totalGrowth += market.config.marketGrowth;
      acc[type].totalShare += market.config.marketShare;
      acc[type].avgBidSuccess += market.config.avgBidSuccess;
      return acc;
    }, {} as Record<string, any>);

    // Calculate averages and create chart data
    const marketTypeData = Object.entries(marketsByType).map(([type, data]: [string, any]) => ({
      name: type,
      growth: (data.totalGrowth / data.markets.length).toFixed(1),
      marketShare: (data.totalShare / data.markets.length).toFixed(1),
      bidSuccess: (data.avgBidSuccess / data.markets.length).toFixed(0),
      count: data.markets.length,
      fill: type.includes('Luxury') ? COLORS.luxury :
            type.includes('Residential') ? COLORS.residential :
            type.includes('Commercial') ? COLORS.commercial : COLORS.construction
    }));

    // Growth vs Market Share scatter plot
    const growthShareData = marketIntelData.map(market => ({
      name: market.title.split(' ').slice(0, 2).join(' '),
      growth: market.config.marketGrowth,
      share: market.config.marketShare,
      bidSuccess: market.config.avgBidSuccess,
      competitors: market.config.competitorCount
    }));

    // Trend analysis
    const allTrends = marketIntelData.flatMap(market => market.config.trends);
    const trendsByCategory = allTrends.reduce((acc, trend) => {
      if (!acc[trend.category]) {
        acc[trend.category] = { up: 0, down: 0, stable: 0, new: 0, total: 0 };
      }
      acc[trend.category][trend.trend]++;
      acc[trend.category].total++;
      return acc;
    }, {} as Record<string, any>);

    const topTrends = Object.entries(trendsByCategory)
      .sort(([,a], [,b]) => b.total - a.total)
      .slice(0, 5)
      .map(([category, data]: [string, any]) => ({
        category,
        upward: data.up || 0,
        downward: data.down || 0,
        stable: data.stable || 0,
        new: data.new || 0,
        total: data.total,
        sentiment: data.up > data.down ? 'positive' : data.down > data.up ? 'negative' : 'neutral'
      }));

    // Hot markets analysis
    const allHotMarkets = marketIntelData.flatMap(market => 
      market.config.hotMarkets.map(hot => ({
        ...hot,
        marketTitle: market.title,
        type: market.title.includes('Luxury') ? 'Luxury' :
              market.title.includes('Residential') ? 'Residential' :
              market.title.includes('Commercial') ? 'Commercial' : 'Construction'
      }))
    );

    const hotMarketsByLocation = allHotMarkets.reduce((acc, market) => {
      const city = market.location.split(' ')[0];
      if (!acc[city]) {
        acc[city] = { markets: [], avgGrowth: 0, opportunities: new Set() };
      }
      acc[city].markets.push(market);
      acc[city].opportunities.add(market.opportunity);
      return acc;
    }, {} as Record<string, any>);

    const topLocations = Object.entries(hotMarketsByLocation)
      .map(([city, data]: [string, any]) => ({
        city,
        marketCount: data.markets.length,
        avgGrowth: (data.markets.reduce((sum: number, m: any) => sum + m.growth, 0) / data.markets.length).toFixed(1),
        opportunities: Array.from(data.opportunities).length,
        topOpportunity: Array.from(data.opportunities)[0]
      }))
      .sort((a, b) => parseFloat(b.avgGrowth) - parseFloat(a.avgGrowth))
      .slice(0, 6);

    // Overall metrics
    const avgMarketGrowth = marketIntelData.reduce((sum, m) => sum + m.config.marketGrowth, 0) / marketIntelData.length;
    const avgMarketShare = marketIntelData.reduce((sum, m) => sum + m.config.marketShare, 0) / marketIntelData.length;
    const avgBidSuccess = marketIntelData.reduce((sum, m) => sum + m.config.avgBidSuccess, 0) / marketIntelData.length;
    const totalCompetitors = marketIntelData.reduce((sum, m) => sum + m.config.competitorCount, 0);

    return {
      marketTypeData,
      growthShareData,
      topTrends,
      topLocations,
      avgMarketGrowth,
      avgMarketShare,
      avgBidSuccess,
      totalCompetitors,
      totalMarkets: marketIntelData.length
    };
  }, []);

  const getTrendIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'negative': return <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />;
      default: return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'bg-green-100 text-green-800';
      case 'down': return 'bg-red-100 text-red-800';
      case 'stable': return 'bg-muted text-foreground';
      case 'new': return 'bg-blue-100 text-blue-800';
      default: return 'bg-muted text-foreground';
    }
  };

  return (
    <div 
      className="relative h-full"
      data-tour="market-intelligence-card"
    >
      <div className="h-full flex flex-col bg-transparent overflow-hidden">
        <div className="flex-1 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 overflow-y-auto">
          <div className="space-y-6">
            {/* Key Metrics Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-2 lg:gap-1 sm:gap-1.5 lg:gap-2">
              <div className="bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Avg Market Growth</p>
                    <p className="text-lg sm:text-xl lg:text-lg sm:text-xl lg:text-2xl font-medium text-blue-900 dark:text-blue-300">{analytics.avgMarketGrowth.toFixed(1)}%</p>
                  </div>
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              
              <div className="bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-400">Market Share</p>
                    <p className="text-lg sm:text-xl lg:text-lg sm:text-xl lg:text-2xl font-medium text-purple-900 dark:text-purple-300">{analytics.avgMarketShare.toFixed(1)}%</p>
                  </div>
                  <Target className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              
              <div className="bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">Bid Success Rate</p>
                    <p className="text-lg sm:text-xl lg:text-lg sm:text-xl lg:text-2xl font-medium text-green-900 dark:text-green-300">{analytics.avgBidSuccess.toFixed(0)}%</p>
                  </div>
                  <Award className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              
              <div className="bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-700 dark:text-orange-400">Active Markets</p>
                    <p className="text-lg sm:text-xl lg:text-lg sm:text-xl lg:text-2xl font-medium text-orange-900 dark:text-orange-300">{analytics.totalMarkets}</p>
                  </div>
                  <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-1 sm:gap-1.5 lg:gap-2 lg:gap-1.5 sm:gap-2 lg:gap-1 sm:gap-1.5 lg:gap-2">
              {/* Market Type Performance */}
              <div className="bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                <h3 className="text-sm sm:text-base lg:text-lg font-medium mb-1.5 sm:mb-2 lg:mb-1 sm:mb-1.5 lg:mb-2 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Market Performance by Type
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.marketTypeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="growth" name="Growth %" fill="hsl(var(--chart-2))" opacity={0.8} />
                      <Bar dataKey="marketShare" name="Market Share %" fill="hsl(var(--chart-5))" opacity={0.6} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Growth vs Market Share Scatter */}
              <div className="bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                <h3 className="text-sm sm:text-base lg:text-lg font-medium mb-1.5 sm:mb-2 lg:mb-1 sm:mb-1.5 lg:mb-2 flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  Growth vs Market Position
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart data={analytics.growthShareData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="growth" name="Growth %" />
                      <YAxis dataKey="share" name="Market Share %" />
                      <Tooltip formatter={(value, name) => [value, name === 'growth' ? 'Growth %' : 'Market Share %']} />
                      <Scatter dataKey="share" fill="hsl(var(--chart-5))" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Trends Analysis */}
            <div className="bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
              <h3 className="text-sm sm:text-base lg:text-lg font-medium mb-1.5 sm:mb-2 lg:mb-1 sm:mb-1.5 lg:mb-2 flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                Market Trends Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1.5 sm:gap-2 lg:gap-1 sm:gap-1.5 lg:gap-2">
                {analytics.topTrends.map((trend, index) => (
                  <div key={index} className="bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                    <div className="flex items-center justify-between mb-1 sm:mb-1.5 lg:mb-2">
                      <h4 className="font-medium text-foreground">{trend.category}</h4>
                      {getTrendIcon(trend.sentiment)}
                    </div>
                    <div className="space-y-2">
                      {trend.upward > 0 && (
                        <div className="flex items-center justify-between">
                          <Badge className={getTrendColor('up')}>Upward</Badge>
                          <span className="text-sm font-semibold">{trend.upward}</span>
                        </div>
                      )}
                      {trend.downward > 0 && (
                        <div className="flex items-center justify-between">
                          <Badge className={getTrendColor('down')}>Downward</Badge>
                          <span className="text-sm font-semibold">{trend.downward}</span>
                        </div>
                      )}
                      {trend.stable > 0 && (
                        <div className="flex items-center justify-between">
                          <Badge className={getTrendColor('stable')}>Stable</Badge>
                          <span className="text-sm font-semibold">{trend.stable}</span>
                        </div>
                      )}
                      {trend.new > 0 && (
                        <div className="flex items-center justify-between">
                          <Badge className={getTrendColor('new')}>New</Badge>
                          <span className="text-sm font-semibold">{trend.new}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hot Markets */}
            <div className="bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
              <h3 className="text-sm sm:text-base lg:text-lg font-medium mb-1.5 sm:mb-2 lg:mb-1 sm:mb-1.5 lg:mb-2 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-red-600 dark:text-red-400" />
                High-Growth Markets
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1.5 sm:gap-2 lg:gap-1 sm:gap-1.5 lg:gap-2">
                {analytics.topLocations.map((location, index) => (
                  <div key={index} className="bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-foreground">{location.city}</h4>
                      <Badge variant="outline" className="text-xs">
                        {location.avgGrowth}% Growth
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Markets:</span>
                        <span className="font-medium">{location.marketCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Opportunities:</span>
                        <span className="font-medium">{location.opportunities}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        Top: {location.topOpportunity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Intelligence Summary */}
            <div className="bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
              <div className="flex items-center justify-between mb-1.5 sm:mb-2 lg:mb-1 sm:mb-1.5 lg:mb-2">
                <h3 className="text-sm sm:text-base lg:text-lg font-medium flex items-center gap-2">
                  <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  Competitive Landscape
                </h3>
                <Badge variant="outline" className="text-sm">
                  {analytics.totalCompetitors} Total Competitors
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 sm:gap-2 lg:gap-1 sm:gap-1.5 lg:gap-2">
                <div className="text-center p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                  <p className="text-lg sm:text-xl lg:text-lg sm:text-xl lg:text-2xl font-medium text-blue-900 dark:text-blue-300">{analytics.avgMarketGrowth.toFixed(1)}%</p>
                  <p className="text-sm text-blue-700 dark:text-blue-400">Average Market Growth</p>
                </div>
                <div className="text-center p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                  <p className="text-lg sm:text-xl lg:text-lg sm:text-xl lg:text-2xl font-medium text-purple-900 dark:text-purple-300">{analytics.avgMarketShare.toFixed(1)}%</p>
                  <p className="text-sm text-purple-700 dark:text-purple-400">Average Market Share</p>
                </div>
                <div className="text-center p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                  <p className="text-lg sm:text-xl lg:text-lg sm:text-xl lg:text-2xl font-medium text-green-900 dark:text-green-300">{analytics.avgBidSuccess.toFixed(0)}%</p>
                  <p className="text-sm text-green-700 dark:text-green-400">Average Bid Success</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Drill-Down Overlay */}
      {showDrillDown && (
        <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-sm rounded-lg p-2 sm:p-1.5 sm:p-2 lg:p-2.5 lg:p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 text-white transition-all duration-300 ease-in-out overflow-y-auto z-50">
          <div className="h-full">
            <h3 className="text-base sm:text-lg lg:text-base sm:text-lg lg:text-xl font-medium mb-1.5 sm:mb-2 lg:mb-1 sm:mb-1.5 lg:mb-2 text-center">Market Intelligence Deep Dive</h3>
            
            <div className="grid grid-cols-2 gap-2 sm:gap-1 sm:gap-1.5 lg:gap-2 lg:gap-1.5 sm:gap-2 lg:gap-1 sm:gap-1.5 lg:gap-2 h-[calc(100%-60px)]">
              {/* Market Insights */}
              <div className="space-y-4">
                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    Strategic Market Position
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Market Leadership Score:</span>
                      <span className="font-medium text-green-400">8.7/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Brand Recognition:</span>
                      <span className="font-medium text-green-400">94%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Customer Retention:</span>
                      <span className="font-medium text-yellow-400">87%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Market Penetration:</span>
                      <span className="font-medium">{analytics.avgMarketShare.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Growth Opportunities
                  </h4>
                  <div className="space-y-3 text-sm">
                    {analytics.topLocations.slice(0, 3).map((location, index) => (
                      <div key={index} className="border-b border-white/20 dark:border-black/20 pb-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{location.city}</span>
                          <span className="text-green-400">{location.avgGrowth}% growth</span>
                        </div>
                        <div className="text-xs text-green-200">
                          {location.marketCount} markets • {location.opportunities} opportunities
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Competitive Analysis */}
              <div className="space-y-4">
                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Competitive Intelligence
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Active Competitors:</span>
                      <span className="font-medium">{analytics.totalCompetitors}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Win Rate vs Competition:</span>
                      <span className="font-medium text-green-400">{analytics.avgBidSuccess.toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price Competitiveness:</span>
                      <span className="font-medium text-yellow-400">Above Average</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quality Rating:</span>
                      <span className="font-medium text-green-400">Superior</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Market Trend Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    {analytics.topTrends.slice(0, 4).map((trend, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span>{trend.category}:</span>
                        <div className="flex items-center space-x-1">
                          <span className={`font-medium ${
                            trend.sentiment === 'positive' ? 'text-green-400' :
                            trend.sentiment === 'negative' ? 'text-red-400' : 'text-gray-300'
                          }`}>
                            {trend.sentiment === 'positive' ? 'Growing' :
                             trend.sentiment === 'negative' ? 'Declining' : 'Stable'}
                          </span>
                          <span className="text-xs text-green-200">({trend.total})</span>
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-2 border-t border-white/20 dark:border-black/20">
                      <p className="text-xs text-green-200">
                        Strong market position with {analytics.avgMarketGrowth.toFixed(1)}% average growth.
                        Focus on emerging opportunities in high-growth regions.
                      </p>
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
  );
}

export default MarketIntelligence; 