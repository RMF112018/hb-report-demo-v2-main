"use client"

import React from "react"
import BetaBDUnanetAnalyticsCard from "./BetaBDUnanetAnalyticsCard"

export default function BetaBDUnanetDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Unanet Business Intelligence Hub</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time pursuit analytics with unique horizontal split-screen layout
          </p>
        </div>

        {/* Featured Unanet Analytics Card with unique layout */}
        <BetaBDUnanetAnalyticsCard className="w-full" />

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Unique Features Implemented</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Mock useUnanetData() Hook</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Simulates API delays and returns realistic pursuit, proposal, and win/loss data
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Unique Split-Screen Layout</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Command center style with live data stream on left, analytics on right
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Real-time Visual Indicators</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Animated pulse effects, data stream indicators, and live status updates
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">"Updated via Unanet" Badge</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Timestamp tooltip showing last sync time with connection status
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Interactive Analytics</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Switchable views for pipeline, proposals, and performance metrics
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Dark Theme Compatible</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Fully responsive design with proper dark mode support
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Implementation Notes</h2>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>
              • Hook location:{" "}
              <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">/hooks/use-unanet-data.ts</code>
            </li>
            <li>
              • Card location:{" "}
              <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">
                /components/cards/beta/business-dev/BetaBDUnanetAnalyticsCard.tsx
              </code>
            </li>
            <li>• Auto-refresh every 5 minutes with manual refresh capability</li>
            <li>• Simulated 5% API error rate for testing error handling</li>
            <li>• TypeScript interfaces for all data structures</li>
            <li>• Memory is using HB brand colors (RGB 250, 70, 22) for active buttons</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
